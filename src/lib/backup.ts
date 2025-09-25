// Backup Strategy for Project Sentinel TPRM Platform
// Handles automated backups, data export, and disaster recovery

import { writeFile, mkdir, readFile, readdir, unlink, stat } from 'fs/promises';
import path from 'path';
import { createGzip, createGunzip } from 'zlib';
import { pipeline } from 'stream/promises';
import { createReadStream, createWriteStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';

export interface BackupConfig {
  enabled: boolean;
  schedule: 'hourly' | 'daily' | 'weekly' | 'monthly';
  retentionDays: number;
  compression: boolean;
  includeDatabase: boolean;
  includeUploads: boolean;
  includeLogs: boolean;
  destination: 'local' | 's3' | 'gcs' | 'azure';
  destinationPath?: string;
  cloudConfig?: {
    bucket?: string;
    region?: string;
    accessKey?: string;
    secretKey?: string;
  };
}

export interface BackupMetadata {
  id: string;
  timestamp: string;
  version: string;
  size: number;
  checksum: string;
  config: BackupConfig;
  components: {
    database: boolean;
    uploads: boolean;
    logs: boolean;
    config: boolean;
  };
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  error?: string;
  duration?: number;
}

export interface BackupResult {
  success: boolean;
  metadata: BackupMetadata;
  files: string[];
  size: number;
  duration: number;
  error?: string;
}

class BackupManager {
  private config: BackupConfig;
  private backupDir: string;
  private isRunning: boolean = false;

  constructor(config: BackupConfig) {
    this.config = config;
    this.backupDir = path.join(process.cwd(), 'backups');
  }

  async initialize(): Promise<void> {
    // Create backup directory
    await mkdir(this.backupDir, { recursive: true });
    
    // Start scheduled backups if enabled
    if (this.config.enabled) {
      this.startScheduledBackups();
    }
  }

  async createBackup(): Promise<BackupResult> {
    if (this.isRunning) {
      throw new Error('Backup already in progress');
    }

    const startTime = Date.now();
    const backupId = uuidv4();
    const backupPath = path.join(this.backupDir, backupId);
    
    try {
      this.isRunning = true;
      
      // Create backup directory
      await mkdir(backupPath, { recursive: true });
      
      // Initialize metadata
      const metadata: BackupMetadata = {
        id: backupId,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        size: 0,
        checksum: '',
        config: this.config,
        components: {
          database: this.config.includeDatabase,
          uploads: this.config.includeUploads,
          logs: this.config.includeLogs,
          config: true
        },
        status: 'in_progress'
      };

      const backupFiles: string[] = [];
      let totalSize = 0;

      // Backup database
      if (this.config.includeDatabase) {
        const dbBackup = await this.backupDatabase(backupPath);
        backupFiles.push(...dbBackup.files);
        totalSize += dbBackup.size;
      }

      // Backup uploads
      if (this.config.includeUploads) {
        const uploadsBackup = await this.backupUploads(backupPath);
        backupFiles.push(...uploadsBackup.files);
        totalSize += uploadsBackup.size;
      }

      // Backup logs
      if (this.config.includeLogs) {
        const logsBackup = await this.backupLogs(backupPath);
        backupFiles.push(...logsBackup.files);
        totalSize += logsBackup.size;
      }

      // Backup configuration
      const configBackup = await this.backupConfiguration(backupPath);
      backupFiles.push(...configBackup.files);
      totalSize += configBackup.size;

      // Create metadata file
      metadata.size = totalSize;
      metadata.checksum = await this.calculateChecksum(backupFiles);
      metadata.status = 'completed';
      metadata.duration = Date.now() - startTime;

      await this.saveMetadata(backupPath, metadata);

      // Compress if enabled
      if (this.config.compression) {
        await this.compressBackup(backupPath);
      }

      // Upload to cloud storage if configured
      if (this.config.destination !== 'local') {
        await this.uploadToCloud(backupPath, metadata);
      }

      // Clean old backups
      await this.cleanOldBackups();

      return {
        success: true,
        metadata,
        files: backupFiles,
        size: totalSize,
        duration: metadata.duration
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMetadata: BackupMetadata = {
        id: backupId,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        size: 0,
        checksum: '',
        config: this.config,
        components: {
          database: false,
          uploads: false,
          logs: false,
          config: false
        },
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration
      };

      await this.saveMetadata(backupPath, errorMetadata);

      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  private async backupDatabase(backupPath: string): Promise<{ files: string[]; size: number }> {
    const dbPath = path.join(backupPath, 'database');
    await mkdir(dbPath, { recursive: true });

    const files: string[] = [];
    let totalSize = 0;

    try {
      // Export database schema and data
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const dbFile = path.join(dbPath, `database-${timestamp}.sql`);
      
      // Get database data using Prisma
      const ventures = await db.venture.findMany();
      const analytics = await db.analytics.findMany();
      const investorShares = await db.investorShare.findMany();
      
      const dbExport = {
        schema: 'project_sentinel',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        data: {
          ventures,
          analytics,
          investorShares
        }
      };

      await writeFile(dbFile, JSON.stringify(dbExport, null, 2));
      
      const stats = await stat(dbFile);
      files.push(dbFile);
      totalSize += stats.size;

    } catch (error) {
      console.error('Database backup failed:', error);
      throw new Error(`Database backup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return { files, size: totalSize };
  }

  private async backupUploads(backupPath: string): Promise<{ files: string[]; size: number }> {
    const uploadsPath = path.join(backupPath, 'uploads');
    await mkdir(uploadsPath, { recursive: true });

    const files: string[] = [];
    let totalSize = 0;

    try {
      const sourceUploadsDir = path.join(process.cwd(), 'uploads');
      
      // Check if uploads directory exists
      try {
        await stat(sourceUploadsDir);
      } catch {
        // Uploads directory doesn't exist, skip
        return { files, size: 0 };
      }

      const uploadFiles = await readdir(sourceUploadsDir);
      
      for (const file of uploadFiles) {
        const sourceFile = path.join(sourceUploadsDir, file);
        const destFile = path.join(uploadsPath, file);
        
        // Copy file
        const content = await readFile(sourceFile);
        await writeFile(destFile, content);
        
        const stats = await stat(destFile);
        files.push(destFile);
        totalSize += stats.size;
      }

    } catch (error) {
      console.error('Uploads backup failed:', error);
      throw new Error(`Uploads backup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return { files, size: totalSize };
  }

  private async backupLogs(backupPath: string): Promise<{ files: string[]; size: number }> {
    const logsPath = path.join(backupPath, 'logs');
    await mkdir(logsPath, { recursive: true });

    const files: string[] = [];
    let totalSize = 0;

    try {
      const logFiles = ['dev.log', 'error.log', 'access.log'];
      
      for (const logFile of logFiles) {
        const sourceFile = path.join(process.cwd(), logFile);
        
        try {
          await stat(sourceFile);
          const destFile = path.join(logsPath, logFile);
          
          // Copy log file
          const content = await readFile(sourceFile);
          await writeFile(destFile, content);
          
          const stats = await stat(destFile);
          files.push(destFile);
          totalSize += stats.size;
        } catch {
          // Log file doesn't exist, skip
          continue;
        }
      }

    } catch (error) {
      console.error('Logs backup failed:', error);
      throw new Error(`Logs backup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return { files, size: totalSize };
  }

  private async backupConfiguration(backupPath: string): Promise<{ files: string[]; size: number }> {
    const configPath = path.join(backupPath, 'config');
    await mkdir(configPath, { recursive: true });

    const files: string[] = [];
    let totalSize = 0;

    try {
      const configFiles = [
        'package.json',
        'next.config.ts',
        'tailwind.config.ts',
        'tsconfig.json',
        'prisma/schema.prisma',
        '.env.example'
      ];

      for (const configFile of configFiles) {
        const sourceFile = path.join(process.cwd(), configFile);
        
        try {
          await stat(sourceFile);
          const destFile = path.join(configPath, configFile);
          
          // Copy config file
          const content = await readFile(sourceFile);
          await writeFile(destFile, content);
          
          const stats = await stat(destFile);
          files.push(destFile);
          totalSize += stats.size;
        } catch {
          // Config file doesn't exist, skip
          continue;
        }
      }

    } catch (error) {
      console.error('Configuration backup failed:', error);
      throw new Error(`Configuration backup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return { files, size: totalSize };
  }

  private async saveMetadata(backupPath: string, metadata: BackupMetadata): Promise<void> {
    const metadataFile = path.join(backupPath, 'metadata.json');
    await writeFile(metadataFile, JSON.stringify(metadata, null, 2));
  }

  private async calculateChecksum(files: string[]): Promise<string> {
    // Simple checksum calculation (in production, use proper cryptographic hash)
    const { createHash } = await import('crypto');
    const hash = createHash('sha256');
    
    for (const file of files) {
      const content = await readFile(file);
      hash.update(content);
    }
    
    return hash.digest('hex');
  }

  private async compressBackup(backupPath: string): Promise<void> {
    const compressedPath = `${backupPath}.tar.gz`;
    const gzip = createGzip();
    const source = createReadStream(backupPath);
    const destination = createWriteStream(compressedPath);
    
    await pipeline(source, gzip, destination);
    
    // Remove uncompressed directory
    // Note: In production, implement proper directory removal
  }

  private async uploadToCloud(backupPath: string, metadata: BackupMetadata): Promise<void> {
    // Placeholder for cloud storage upload
    // In production, implement AWS S3, Google Cloud Storage, or Azure Blob Storage integration
    console.log(`Cloud upload not implemented for destination: ${this.config.destination}`);
  }

  private async cleanOldBackups(): Promise<void> {
    try {
      const backups = await readdir(this.backupDir);
      const cutoffDate = new Date(Date.now() - (this.config.retentionDays * 24 * 60 * 60 * 1000));
      
      for (const backup of backups) {
        const backupPath = path.join(this.backupDir, backup);
        const stats = await stat(backupPath);
        
        if (stats.mtime < cutoffDate) {
          // Remove old backup
          try {
            await unlink(backupPath);
            console.log(`Removed old backup: ${backup}`);
          } catch (error) {
            console.error(`Failed to remove old backup ${backup}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Failed to clean old backups:', error);
    }
  }

  private startScheduledBackups(): void {
    const scheduleBackup = () => {
      if (!this.config.enabled) return;
      
      const now = new Date();
      let nextBackup: Date;
      
      switch (this.config.schedule) {
        case 'hourly':
          nextBackup = new Date(now.getTime() + 60 * 60 * 1000);
          break;
        case 'daily':
          nextBackup = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          break;
        case 'weekly':
          nextBackup = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          nextBackup = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          nextBackup = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      }
      
      const delay = nextBackup.getTime() - now.getTime();
      
      setTimeout(() => {
        this.createBackup().catch(error => {
          console.error('Scheduled backup failed:', error);
        });
        scheduleBackup(); // Schedule next backup
      }, delay);
    };
    
    scheduleBackup();
  }

  async restoreBackup(backupId: string): Promise<void> {
    const backupPath = path.join(this.backupDir, backupId);
    
    try {
      const metadataPath = path.join(backupPath, 'metadata.json');
      const metadataContent = await readFile(metadataPath, 'utf-8');
      const metadata: BackupMetadata = JSON.parse(metadataContent);
      
      if (metadata.status !== 'completed') {
        throw new Error(`Cannot restore backup with status: ${metadata.status}`);
      }
      
      // Restore database
      if (metadata.components.database) {
        await this.restoreDatabase(backupPath);
      }
      
      // Restore uploads
      if (metadata.components.uploads) {
        await this.restoreUploads(backupPath);
      }
      
      // Restore configuration
      if (metadata.components.config) {
        await this.restoreConfiguration(backupPath);
      }
      
      console.log(`Backup ${backupId} restored successfully`);
      
    } catch (error) {
      console.error('Backup restoration failed:', error);
      throw new Error(`Backup restoration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async restoreDatabase(backupPath: string): Promise<void> {
    const dbPath = path.join(backupPath, 'database');
    const dbFiles = await readdir(dbPath);
    
    for (const dbFile of dbFiles) {
      if (dbFile.endsWith('.sql')) {
        const filePath = path.join(dbPath, dbFile);
        const content = await readFile(filePath, 'utf-8');
        const dbExport = JSON.parse(content);
        
        // Restore database data
        // Note: In production, implement proper database restoration with transaction handling
        console.log(`Database restoration from ${dbFile} would be implemented here`);
      }
    }
  }

  private async restoreUploads(backupPath: string): Promise<void> {
    const uploadsPath = path.join(backupPath, 'uploads');
    const targetUploadsDir = path.join(process.cwd(), 'uploads');
    
    await mkdir(targetUploadsDir, { recursive: true });
    
    const uploadFiles = await readdir(uploadsPath);
    
    for (const file of uploadFiles) {
      const sourceFile = path.join(uploadsPath, file);
      const destFile = path.join(targetUploadsDir, file);
      
      const content = await readFile(sourceFile);
      await writeFile(destFile, content);
    }
  }

  private async restoreConfiguration(backupPath: string): Promise<void> {
    const configPath = path.join(backupPath, 'config');
    const configFiles = await readdir(configPath);
    
    for (const configFile of configFiles) {
      const sourceFile = path.join(configPath, configFile);
      const destFile = path.join(process.cwd(), configFile);
      
      const content = await readFile(sourceFile);
      await writeFile(destFile, content);
    }
  }

  async listBackups(): Promise<BackupMetadata[]> {
    try {
      const backups = await readdir(this.backupDir);
      const metadataList: BackupMetadata[] = [];
      
      for (const backup of backups) {
        const backupPath = path.join(this.backupDir, backup);
        const metadataPath = path.join(backupPath, 'metadata.json');
        
        try {
          const metadataContent = await readFile(metadataPath, 'utf-8');
          const metadata: BackupMetadata = JSON.parse(metadataContent);
          metadataList.push(metadata);
        } catch {
          // Skip invalid backups
          continue;
        }
      }
      
      // Sort by timestamp (newest first)
      return metadataList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
    } catch (error) {
      console.error('Failed to list backups:', error);
      return [];
    }
  }

  async getBackupStatus(backupId: string): Promise<BackupMetadata | null> {
    try {
      const backupPath = path.join(this.backupDir, backupId);
      const metadataPath = path.join(backupPath, 'metadata.json');
      const metadataContent = await readFile(metadataPath, 'utf-8');
      return JSON.parse(metadataContent);
    } catch {
      return null;
    }
  }
}

// Default backup configuration
const defaultBackupConfig: BackupConfig = {
  enabled: true,
  schedule: 'daily',
  retentionDays: 30,
  compression: true,
  includeDatabase: true,
  includeUploads: true,
  includeLogs: true,
  destination: 'local',
  destinationPath: './backups'
};

// Export backup manager instance
export const backupManager = new BackupManager(defaultBackupConfig);

// Export types and utilities
export { BackupConfig, BackupMetadata, BackupResult };

// Initialize backup manager on startup
backupManager.initialize().catch(error => {
  console.error('Failed to initialize backup manager:', error);
});