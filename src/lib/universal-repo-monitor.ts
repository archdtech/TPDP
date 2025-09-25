import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import ZAI from 'z-ai-web-dev-sdk';

const execAsync = promisify(exec);

export interface UniversalDataSource {
  type: 'git' | 'local' | 'document' | 'manual' | 'api' | 'ai';
  source: string;
  confidence: number; // 0-1 confidence in data quality
  metadata: Record<string, any>;
}

export interface UniversalRepositoryInfo {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'stalled' | 'archived' | 'planning' | 'unknown';
  activity: 'high' | 'medium' | 'low' | 'none';
  lastActivity: string;
  estimatedProgress: number; // 0-100
  technologies: string[];
  teamSize?: number;
  contributors: string[];
  recentChanges: string[];
  riskFactors: string[];
  opportunities: string[];
  dataSources: UniversalDataSource[];
  confidence: number; // Overall confidence in the data
  lastUpdated: string;
}

export interface DocumentUpload {
  id: string;
  filename: string;
  type: 'pdf' | 'doc' | 'docx' | 'txt' | 'md' | 'ppt' | 'xls' | 'xlsx';
  content: string; // Extracted text content
  metadata: {
    size: number;
    created: string;
    modified: string;
    author?: string;
    title?: string;
  };
}

export interface ManualEntry {
  id: string;
  repositoryId: string;
  field: string;
  value: any;
  source: 'user' | 'manager' | 'developer';
  confidence: number;
  timestamp: string;
  notes?: string;
}

class UniversalRepositoryMonitor {
  private ai: any = null;
  private documentCache = new Map<string, DocumentUpload>();
  private manualEntries = new Map<string, ManualEntry[]>();

  constructor() {
    this.initializeAI();
  }

  private async initializeAI() {
    try {
      this.ai = await ZAI.create();
    } catch (error) {
      console.log('AI initialization failed, continuing without AI capabilities:', error);
    }
  }

  /**
   * Universal repository monitoring - tries all available methods
   */
  async monitorRepository(
    repositoryInput: string | DocumentUpload | ManualEntry,
    options: {
      forceMethod?: 'git' | 'document' | 'manual' | 'ai';
      additionalContext?: string;
      userProvidedData?: Record<string, any>;
    } = {}
  ): Promise<UniversalRepositoryInfo> {
    const monitoringId = this.generateMonitoringId(repositoryInput);

    try {
      // Determine input type and choose appropriate monitoring strategy
      const strategies = this.getMonitoringStrategies(repositoryInput, options);
      
      let bestResult: UniversalRepositoryInfo | null = null;
      let bestConfidence = 0;
      const results: Array<{ result: UniversalRepositoryInfo; strategy: string; confidence: number }> = [];

      // Execute all strategies and pick the best result
      for (const strategy of strategies) {
        try {
          const result = await strategy();
          if (result.confidence > bestConfidence) {
            bestConfidence = result.confidence;
            bestResult = result;
          }
          results.push({ result, strategy: strategy.name, confidence: result.confidence });
        } catch (error) {
          console.log(`Strategy ${strategy.name} failed:`, error);
        }
      }

      if (!bestResult) {
        // Fallback to minimal info
        bestResult = await this.createMinimalRepositoryInfo(repositoryInput);
      }

      // Enhance with AI if available
      if (this.ai && bestResult.confidence < 0.8) {
        try {
          const enhancedResult = await this.enhanceWithAI(bestResult, options.additionalContext);
          if (enhancedResult.confidence > bestResult.confidence) {
            bestResult = enhancedResult;
          }
        } catch (error) {
          console.log('AI enhancement failed:', error);
        }
      }

      return bestResult;
    } catch (error) {
      console.error('Universal monitoring failed:', error);
      return await this.createMinimalRepositoryInfo(repositoryInput);
    }
  }

  /**
   * Process document upload for repository analysis
   */
  async processDocumentUpload(document: DocumentUpload): Promise<UniversalRepositoryInfo> {
    // Cache the document
    this.documentCache.set(document.id, document);

    // Extract information using multiple methods
    const [basicInfo, aiInfo, patternInfo] = await Promise.all([
      this.extractBasicDocumentInfo(document),
      this.extractAIDocumentInfo(document),
      this.extractPatternDocumentInfo(document)
    ]);

    // Merge and enhance the information
    const mergedInfo = this.mergeRepositoryInfo([basicInfo, aiInfo, patternInfo]);
    
    return mergedInfo;
  }

  /**
   * Add manual entry for repository
   */
  async addManualEntry(entry: ManualEntry): Promise<UniversalRepositoryInfo> {
    if (!this.manualEntries.has(entry.repositoryId)) {
      this.manualEntries.set(entry.repositoryId, []);
    }
    this.manualEntries.get(entry.repositoryId)!.push(entry);

    // Rebuild repository info with new manual data
    return await this.buildRepositoryFromManualEntries(entry.repositoryId);
  }

  /**
   * Get monitoring strategies based on input type
   */
  private getMonitoringStrategies(
    input: string | DocumentUpload | ManualEntry,
    options: any
  ): Array<() => Promise<UniversalRepositoryInfo>> {
    const strategies: Array<() => Promise<UniversalRepositoryInfo>> = [];

    if (typeof input === 'string') {
      // URL or path input
      strategies.push(
        this.createGitStrategy(input),
        this.createLocalStrategy(input),
        this.createAPIStrategy(input),
        this.createDocumentInferenceStrategy(input)
      );
    } else if ('filename' in input) {
      // Document input
      strategies.push(
        this.createDocumentStrategy(input),
        this.createAIDocumentStrategy(input)
      );
    } else if ('field' in input) {
      // Manual entry input
      strategies.push(
        this.createManualStrategy(input)
      );
    }

    // Always add AI strategy as fallback
    strategies.push(this.createAIFallbackStrategy(input, options));

    // Filter strategies based on forceMethod option
    if (options.forceMethod) {
      return strategies.filter(strategy => {
        const methodName = strategy.name.replace('Strategy', '').toLowerCase();
        return methodName === options.forceMethod;
      });
    }

    return strategies;
  }

  /**
   * Git-based monitoring strategy
   */
  private createGitStrategy(repoUrl: string): () => Promise<UniversalRepositoryInfo> {
    return async () => {
      const strategy = async () => {
        try {
          const [remoteInfo, commitInfo, branchInfo, fileActivity] = await Promise.all([
            this.getGitRemoteInfo(repoUrl),
            this.getGitCommitActivity(repoUrl),
            this.getGitBranchInfo(repoUrl),
            this.getGitFileActivity(repoUrl)
          ]);

          return {
            id: this.generateId(repoUrl),
            name: this.extractRepoName(repoUrl),
            status: this.determineGitStatus(remoteInfo, commitInfo),
            activity: this.determineGitActivity(commitInfo, fileActivity),
            lastActivity: commitInfo.latestCommit?.date || new Date().toISOString(),
            estimatedProgress: this.estimateGitProgress(remoteInfo, commitInfo),
            technologies: await this.extractTechnologiesFromGit(repoUrl),
            contributors: commitInfo.contributors || [],
            recentChanges: commitInfo.recentMessages || [],
            dataSources: [{
              type: 'git',
              source: repoUrl,
              confidence: 0.9,
              metadata: { method: 'git-protocol' }
            }],
            confidence: 0.9,
            lastUpdated: new Date().toISOString()
          };
        } catch (error) {
          throw new Error(`Git monitoring failed: ${error}`);
        }
      };
      
      strategy.name = 'gitStrategy';
      return strategy;
    };
  }

  /**
   * Local file system monitoring strategy
   */
  private createLocalStrategy(localPath: string): () => Promise<UniversalRepositoryInfo> {
    return async () => {
      const strategy = async () => {
        try {
          const [fileStats, gitInfo, recentFiles] = await Promise.all([
            this.getLocalFileStats(localPath),
            this.getLocalGitInfo(localPath),
            this.getRecentFileActivity(localPath)
          ]);

          return {
            id: this.generateId(localPath),
            name: path.basename(localPath),
            status: this.determineLocalStatus(fileStats, recentFiles),
            activity: this.determineLocalActivity(fileStats, recentFiles),
            lastActivity: recentFiles.latestActivity || new Date().toISOString(),
            estimatedProgress: this.estimateLocalProgress(fileStats),
            technologies: await this.extractTechnologiesFromLocal(localPath),
            recentChanges: recentFiles.changes || [],
            dataSources: [{
              type: 'local',
              source: localPath,
              confidence: 0.8,
              metadata: { method: 'file-system' }
            }],
            confidence: 0.8,
            lastUpdated: new Date().toISOString()
          };
        } catch (error) {
          throw new Error(`Local monitoring failed: ${error}`);
        }
      };
      
      strategy.name = 'localStrategy';
      return strategy;
    };
  }

  /**
   * Document-based monitoring strategy
   */
  private createDocumentStrategy(document: DocumentUpload): () => Promise<UniversalRepositoryInfo> {
    return async () => {
      const strategy = async () => {
        const [basicInfo, timelineInfo, techInfo] = await Promise.all([
          this.extractBasicDocumentInfo(document),
          this.extractTimelineFromDocument(document),
          this.extractTechFromDocument(document)
        ]);

        return {
          id: document.id,
          name: document.metadata.title || document.filename,
          description: this.extractDescriptionFromDocument(document),
          status: this.determineDocumentStatus(basicInfo, timelineInfo),
          activity: this.determineDocumentActivity(timelineInfo),
          lastActivity: timelineInfo.latestActivity || new Date().toISOString(),
          estimatedProgress: this.estimateDocumentProgress(basicInfo),
          technologies: techInfo.technologies || [],
          recentChanges: timelineInfo.recentEvents || [],
          dataSources: [{
            type: 'document',
            source: document.filename,
            confidence: 0.7,
            metadata: { documentType: document.type, size: document.metadata.size }
          }],
          confidence: 0.7,
          lastUpdated: new Date().toISOString()
        };
      };
      
      strategy.name = 'documentStrategy';
      return strategy;
    };
  }

  /**
   * AI-enhanced monitoring strategy
   */
  private createAIFallbackStrategy(
    input: string | DocumentUpload | ManualEntry,
    context?: string
  ): () => Promise<UniversalRepositoryInfo> {
    return async () => {
      const strategy = async () => {
        if (!this.ai) {
          throw new Error('AI not available');
        }

        try {
          const prompt = this.buildAIPrompt(input, context);
          const response = await this.ai.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: 'You are an expert software development analyst. Extract repository information from the provided input and infer missing data intelligently.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.3
          });

          const aiAnalysis = response.choices[0]?.message?.content || '';
          const parsedInfo = this.parseAIResponse(aiAnalysis);

          return {
            ...parsedInfo,
            dataSources: [{
              type: 'ai',
              source: 'ai-analysis',
              confidence: 0.6,
              metadata: { model: 'z-ai', promptLength: prompt.length }
            }],
            confidence: Math.min(parsedInfo.confidence || 0.6, 0.8)
          };
        } catch (error) {
          throw new Error(`AI analysis failed: ${error}`);
        }
      };
      
      strategy.name = 'aiStrategy';
      return strategy;
    };
  }

  /**
   * Git utility methods
   */
  private async getGitRemoteInfo(repoUrl: string) {
    try {
      // Try to get remote info via git ls-remote
      const result = await execAsync(`git ls-remote ${repoUrl}`);
      return {
        exists: true,
        isAccessible: true,
        headRefs: result.stdout.split('\n').filter(line => line.trim())
      };
    } catch (error) {
      return {
        exists: false,
        isAccessible: false,
        error: error.message
      };
    }
  }

  private async getGitCommitActivity(repoUrl: string) {
    try {
      // This would typically clone or use a local copy
      // For now, return simulated data
      return {
        latestCommit: {
          sha: 'abc123',
          message: 'Initial commit',
          author: 'Developer',
          date: new Date().toISOString()
        },
        contributors: ['Developer'],
        recentMessages: ['Initial commit', 'Setup project structure'],
        commitCount: 5
      };
    } catch (error) {
      return {};
    }
  }

  private async getGitBranchInfo(repoUrl: string) {
    try {
      // Simulated branch info
      return {
        mainBranch: 'main',
        totalBranches: 3,
        activeBranches: ['main', 'develop', 'feature/new-ui']
      };
    } catch (error) {
      return {};
    }
  }

  private async getGitFileActivity(repoUrl: string) {
    try {
      // Simulated file activity
      return {
        recentFiles: ['src/index.js', 'package.json', 'README.md'],
        totalFiles: 45,
        activityLevel: 'medium'
      };
    } catch (error) {
      return {};
    }
  }

  private async getLocalFileStats(localPath: string) {
    try {
      const stats = await fs.stat(localPath);
      const files = await fs.readdir(localPath);
      
      return {
        exists: true,
        isDirectory: stats.isDirectory(),
        size: stats.size,
        fileCount: files.length,
        lastModified: stats.mtime.toISOString(),
        created: stats.birthtime.toISOString()
      };
    } catch (error) {
      return {
        exists: false,
        error: error.message
      };
    }
  }

  private async getLocalGitInfo(localPath: string) {
    try {
      // Check if it's a git repository
      const gitPath = path.join(localPath, '.git');
      const gitExists = await fs.access(gitPath).then(() => true).catch(() => false);
      
      if (gitExists) {
        return {
          isGitRepo: true,
          gitPath,
          branches: ['main', 'master'],
          remotes: ['origin']
        };
      }
      
      return {
        isGitRepo: false
      };
    } catch (error) {
      return {
        isGitRepo: false,
        error: error.message
      };
    }
  }

  private async getRecentFileActivity(localPath: string) {
    try {
      const files = await fs.readdir(localPath);
      const fileStats = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(localPath, file);
          const stats = await fs.stat(filePath);
          return {
            name: file,
            path: filePath,
            size: stats.size,
            modified: stats.mtime.toISOString(),
            isDirectory: stats.isDirectory()
          };
        })
      );
      
      // Sort by modification time
      const sortedFiles = fileStats
        .filter(f => !f.isDirectory)
        .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());
      
      return {
        latestActivity: sortedFiles[0]?.modified || new Date().toISOString(),
        recentFiles: sortedFiles.slice(0, 5).map(f => f.name),
        totalFiles: sortedFiles.length,
        changes: sortedFiles.slice(0, 3).map(f => `Modified ${f.name}`)
      };
    } catch (error) {
      return {
        latestActivity: new Date().toISOString(),
        recentFiles: [],
        totalFiles: 0,
        changes: [],
        error: error.message
      };
    }
  }
  private async extractBasicDocumentInfo(document: DocumentUpload) {
    const content = document.content.toLowerCase();
    
    // Extract basic information
    const nameMatch = document.metadata.title || document.filename;
    const descriptionMatch = content.match(/project\s*(?:description|overview)[:\s]*(.+?)(?:\n\n|\n|$)/i);
    
    return {
      name: nameMatch,
      description: descriptionMatch?.[1]?.trim(),
      wordCount: content.split(/\s+/).length,
      hasCode: /```|function|class|def|import|require/.test(content),
      hasTimeline: /\d{4}|january|february|march|april|may|june|july|august|september|october|november|december/i.test(content)
    };
  }

  private async extractTimelineFromDocument(document: DocumentUpload) {
    const content = document.content;
    
    // Extract dates and timeline information
    const datePattern = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/g;
    const dates = content.match(datePattern) || [];
    
    // Extract timeline-related keywords
    const timelineKeywords = [
      'milestone', 'deadline', 'delivery', 'release', 'launch',
      'phase', 'sprint', 'iteration', 'quarter', 'month'
    ];
    
    const foundKeywords = timelineKeywords.filter(keyword => 
      content.toLowerCase().includes(keyword)
    );
    
    return {
      dates: dates,
      keywords: foundKeywords,
      latestActivity: dates.length > 0 ? this.parseLatestDate(dates) : new Date().toISOString(),
      recentEvents: this.extractEventsFromDocument(content)
    };
  }

  /**
   * AI enhancement methods
   */
  private async enhanceWithAI(
    baseInfo: UniversalRepositoryInfo,
    context?: string
  ): Promise<UniversalRepositoryInfo> {
    if (!this.ai) return baseInfo;

    try {
      const prompt = `
        Analyze this repository information and enhance it with intelligent inferences:
        
        Current Data:
        ${JSON.stringify(baseInfo, null, 2)}
        
        Additional Context: ${context || 'No additional context'}
        
        Please provide:
        1. Enhanced status determination
        2. Activity level assessment
        3. Progress estimation
        4. Risk factors identification
        5. Opportunity identification
        6. Technology stack inference
        
        Respond with JSON format.
      `;

      const response = await this.ai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4
      });

      const aiEnhancement = JSON.parse(response.choices[0]?.message?.content || '{}');
      
      return {
        ...baseInfo,
        ...aiEnhancement,
        confidence: Math.min(baseInfo.confidence + 0.1, 0.9),
        dataSources: [
          ...baseInfo.dataSources,
          {
            type: 'ai',
            source: 'ai-enhancement',
            confidence: 0.8,
            metadata: { enhancementType: 'inference' }
          }
        ]
      };
    } catch (error) {
      console.log('AI enhancement failed:', error);
      return baseInfo;
    }
  }

  /**
   * Utility methods
   */
  private generateMonitoringId(input: any): string {
    if (typeof input === 'string') {
      return `repo-${Buffer.from(input).toString('base64').slice(0, 16)}`;
    } else if ('id' in input) {
      return `doc-${input.id}`;
    }
    return `manual-${Date.now()}`;
  }

  private generateId(input: string): string {
    return `universal-${Buffer.from(input).toString('base64').slice(0, 12)}`;
  }

  private extractRepoName(repoUrl: string): string {
    const match = repoUrl.match(/[\/:]([^\/:]+?)(?:\.git)?$/);
    return match ? match[1] : repoUrl;
  }

  private mergeRepositoryInfo(infos: UniversalRepositoryInfo[]): UniversalRepositoryInfo {
    if (infos.length === 0) {
      throw new Error('No repository info to merge');
    }
    
    if (infos.length === 1) {
      return infos[0];
    }

    // Merge multiple sources, preferring higher confidence data
    const base = infos[0];
    
    return {
      ...base,
      confidence: Math.max(...infos.map(info => info.confidence)),
      dataSources: infos.flatMap(info => info.dataSources),
      technologies: [...new Set(infos.flatMap(info => info.technologies))],
      recentChanges: [...new Set(infos.flatMap(info => info.recentChanges))]
    };
  }

  private async createMinimalRepositoryInfo(input: any): Promise<UniversalRepositoryInfo> {
    const name = typeof input === 'string' ? this.extractRepoName(input) : 
                input.filename || 'Unknown Repository';
                
    return {
      id: this.generateId(name),
      name,
      status: 'unknown',
      activity: 'none',
      lastActivity: new Date().toISOString(),
      estimatedProgress: 0,
      technologies: [],
      contributors: [],
      recentChanges: [],
      riskFactors: ['Limited information available'],
      opportunities: ['Gather more data about repository'],
      dataSources: [{
        type: 'manual',
        source: 'fallback',
        confidence: 0.1,
        metadata: { reason: 'no-data-available' }
      }],
      confidence: 0.1,
      lastUpdated: new Date().toISOString()
    };
  }

  // Additional helper methods would be implemented here...
  private buildAIPrompt(input: any, context?: string): string {
    // Implementation for building AI prompts
    return `Analyze repository data: ${JSON.stringify(input)} with context: ${context}`;
  }

  private parseAIResponse(response: string): any {
    // Implementation for parsing AI responses
    try {
      return JSON.parse(response);
    } catch {
      return {};
    }
  }

  private determineGitStatus(remoteInfo: any, commitInfo: any): 'active' | 'stalled' | 'archived' | 'unknown' {
    // Implementation for determining git status
    return 'active';
  }

  private determineGitActivity(commitInfo: any, fileActivity: any): 'high' | 'medium' | 'low' | 'none' {
    // Implementation for determining git activity
    return 'medium';
  }

  private estimateGitProgress(remoteInfo: any, commitInfo: any): number {
    // Implementation for estimating git progress
    return 50;
  }

  private async extractTechnologiesFromGit(repoUrl: string): Promise<string[]> {
    // Implementation for extracting technologies from git
    return ['JavaScript', 'TypeScript'];
  }

  private determineLocalStatus(fileStats: any, recentFiles: any): 'active' | 'stalled' | 'archived' | 'unknown' {
    // Implementation for determining local status
    return 'active';
  }

  private determineLocalActivity(fileStats: any, recentFiles: any): 'high' | 'medium' | 'low' | 'none' {
    // Implementation for determining local activity
    return 'medium';
  }

  private estimateLocalProgress(fileStats: any): number {
    // Implementation for estimating local progress
    return 50;
  }

  private async extractTechnologiesFromLocal(localPath: string): Promise<string[]> {
    // Implementation for extracting technologies from local files
    return ['JavaScript', 'TypeScript'];
  }

  private determineDocumentStatus(basicInfo: any, timelineInfo: any): 'active' | 'stalled' | 'archived' | 'unknown' {
    // Implementation for determining document status
    return 'active';
  }

  private determineDocumentActivity(timelineInfo: any): 'high' | 'medium' | 'low' | 'none' {
    // Implementation for determining document activity
    return 'medium';
  }

  private estimateDocumentProgress(basicInfo: any): number {
    // Implementation for estimating document progress
    return 50;
  }

  private extractDescriptionFromDocument(document: DocumentUpload): string {
    // Implementation for extracting description from document
    return document.content.slice(0, 200) + '...';
  }

  private parseLatestDate(dates: string[]): string {
    // Implementation for parsing latest date
    return new Date().toISOString();
  }

  private extractEventsFromDocument(content: string): string[] {
    // Implementation for extracting events from document
    return ['Project started', 'Initial development phase'];
  }

  private async extractAIDocumentInfo(document: DocumentUpload): Promise<any> {
    // Implementation for AI document analysis
    return {};
  }

  private async extractPatternDocumentInfo(document: DocumentUpload): Promise<any> {
    // Implementation for pattern-based document analysis
    return {};
  }

  private async buildRepositoryFromManualEntries(repositoryId: string): Promise<UniversalRepositoryInfo> {
    // Implementation for building repository from manual entries
    return await this.createMinimalRepositoryInfo(repositoryId);
  }

  private async getLocalFileStats(localPath: string): Promise<any> {
    // Implementation for getting local file stats
    return {};
  }

  private async getLocalGitInfo(localPath: string): Promise<any> {
    // Implementation for getting local git info
    return {};
  }

  private async getRecentFileActivity(localPath: string): Promise<any> {
    // Implementation for getting recent file activity
    return {};
  }

  private async getGitBranchInfo(repoUrl: string): Promise<any> {
    // Implementation for getting git branch info
    return {};
  }

  private async getGitFileActivity(repoUrl: string): Promise<any> {
    // Implementation for getting git file activity
    return {};
  }

  private async extractTechFromDocument(document: DocumentUpload): Promise<any> {
    // Implementation for extracting tech from document
    return { technologies: ['JavaScript', 'React'] };
  }

  private createAPIStrategy(input: string): () => Promise<UniversalRepositoryInfo> {
    return async () => {
      // Implementation for API strategy
      throw new Error('API strategy not implemented');
    };
  }

  private createDocumentInferenceStrategy(input: string): () => Promise<UniversalRepositoryInfo> {
    return async () => {
      // Implementation for document inference strategy
      throw new Error('Document inference strategy not implemented');
    };
  }

  private createAPIStrategy(input: string): () => Promise<UniversalRepositoryInfo> {
    return async () => {
      const strategy = async () => {
        try {
          // Simulated API-based monitoring
          // In production, this would call external APIs like GitHub, GitLab, etc.
          const repoName = this.extractRepoName(input);
          
          return {
            id: this.generateId(input),
            name: repoName,
            status: 'active',
            activity: 'medium',
            lastActivity: new Date().toISOString(),
            estimatedProgress: 65,
            technologies: ['JavaScript', 'TypeScript', 'React'],
            contributors: ['Developer1', 'Developer2'],
            recentChanges: ['Updated dependencies', 'Fixed bugs'],
            dataSources: [{
              type: 'api',
              source: input,
              confidence: 0.7,
              metadata: { method: 'external-api' }
            }],
            confidence: 0.7,
            lastUpdated: new Date().toISOString()
          };
        } catch (error) {
          throw new Error(`API monitoring failed: ${error}`);
        }
      };
      
      strategy.name = 'apiStrategy';
      return strategy;
    };
  }

  private createDocumentInferenceStrategy(input: string): () => Promise<UniversalRepositoryInfo> {
    return async () => {
      const strategy = async () => {
        try {
          // Simulated document inference from URL/path
          const inferredName = this.extractRepoName(input);
          
          return {
            id: this.generateId(input),
            name: inferredName,
            description: `Inferred repository from ${input}`,
            status: 'unknown',
            activity: 'low',
            lastActivity: new Date().toISOString(),
            estimatedProgress: 25,
            technologies: [],
            contributors: [],
            recentChanges: ['Repository inferred from path'],
            dataSources: [{
              type: 'document',
              source: input,
              confidence: 0.4,
              metadata: { method: 'path-inference' }
            }],
            confidence: 0.4,
            lastUpdated: new Date().toISOString()
          };
        } catch (error) {
          throw new Error(`Document inference failed: ${error}`);
        }
      };
      
      strategy.name = 'documentInferenceStrategy';
      return strategy;
    };
  }

  private createAIDocumentStrategy(input: DocumentUpload): () => Promise<UniversalRepositoryInfo> {
    return async () => {
      const strategy = async () => {
        if (!this.ai) {
          throw new Error('AI not available');
        }

        try {
          const prompt = `Analyze this document content and extract repository information:
          
          Document: ${input.content.substring(0, 1000)}...
          
          Please provide repository analysis including:
          - Project name and description
          - Technologies used
          - Development status
          - Activity level
          - Progress estimation
          
          Respond with JSON format.`;

          const response = await this.ai.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: 'You are an expert software repository analyst. Extract structured information from document content.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.3
          });

          const aiAnalysis = response.choices[0]?.message?.content || '{}';
          const parsedInfo = this.parseAIResponse(aiAnalysis);

          return {
            ...parsedInfo,
            id: input.id,
            name: parsedInfo.name || input.metadata.title || input.filename,
            dataSources: [{
              type: 'ai',
              source: 'document-analysis',
              confidence: 0.6,
              metadata: { documentId: input.id, model: 'z-ai' }
            }],
            confidence: Math.min(parsedInfo.confidence || 0.6, 0.8)
          };
        } catch (error) {
          throw new Error(`AI document analysis failed: ${error}`);
        }
      };
      
      strategy.name = 'aiDocumentStrategy';
      return strategy;
    };
  }

  private createManualStrategy(input: ManualEntry): () => Promise<UniversalRepositoryInfo> {
    return async () => {
      const strategy = async () => {
        try {
          // Build repository info from manual entry
          const baseInfo = {
            id: this.generateId(input.repositoryId),
            name: input.repositoryId,
            status: 'active' as const,
            activity: 'medium' as const,
            lastActivity: input.timestamp,
            estimatedProgress: 50,
            technologies: [],
            contributors: [],
            recentChanges: [`Manual entry: ${input.field} = ${input.value}`],
            dataSources: [{
              type: 'manual',
              source: 'user-entry',
              confidence: input.confidence,
              metadata: { 
                field: input.field, 
                source: input.source,
                entryId: input.id 
              }
            }],
            confidence: input.confidence,
            lastUpdated: new Date().toISOString()
          };

          // Apply the manual entry to the appropriate field
          if (input.field === 'status') {
            baseInfo.status = input.value;
          } else if (input.field === 'activity') {
            baseInfo.activity = input.value;
          } else if (input.field === 'progress') {
            baseInfo.estimatedProgress = Number(input.value) || 50;
          } else if (input.field === 'technologies') {
            baseInfo.technologies = Array.isArray(input.value) ? input.value : [input.value].filter(Boolean);
          } else if (input.field === 'description') {
            baseInfo.description = String(input.value);
          }

          return baseInfo;
        } catch (error) {
          throw new Error(`Manual strategy failed: ${error}`);
        }
      };
      
      strategy.name = 'manualStrategy';
      return strategy;
    };
  }

  // Missing helper methods
  private determineGitStatus(remoteInfo: any, commitInfo: any): 'active' | 'stalled' | 'archived' | 'planning' | 'unknown' {
    if (remoteInfo.exists && commitInfo.latestCommit) {
      const commitDate = new Date(commitInfo.latestCommit.date);
      const daysSinceLastCommit = (Date.now() - commitDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceLastCommit < 7) return 'active';
      if (daysSinceLastCommit < 30) return 'stalled';
      return 'archived';
    }
    return 'unknown';
  }

  private determineGitActivity(commitInfo: any, fileActivity: any): 'high' | 'medium' | 'low' | 'none' {
    if (commitInfo.commitCount > 20) return 'high';
    if (commitInfo.commitCount > 5) return 'medium';
    if (commitInfo.commitCount > 0) return 'low';
    return 'none';
  }

  private estimateGitProgress(remoteInfo: any, commitInfo: any): number {
    // Simple heuristic based on commit count and recency
    if (!commitInfo.commitCount) return 0;
    if (commitInfo.commitCount < 5) return 10;
    if (commitInfo.commitCount < 20) return 40;
    if (commitInfo.commitCount < 50) return 70;
    return 90;
  }

  private async extractTechnologiesFromGit(repoUrl: string): Promise<string[]> {
    // Simulated technology extraction
    return ['JavaScript', 'TypeScript', 'React', 'Node.js'];
  }

  private determineLocalStatus(fileStats: any, recentFiles: any): 'active' | 'stalled' | 'archived' | 'planning' | 'unknown' {
    if (fileStats.fileCount > 10) return 'active';
    if (fileStats.fileCount > 0) return 'stalled';
    return 'planning';
  }

  private determineLocalActivity(fileStats: any, recentFiles: any): 'high' | 'medium' | 'low' | 'none' {
    if (fileStats.fileCount > 50) return 'high';
    if (fileStats.fileCount > 10) return 'medium';
    if (fileStats.fileCount > 0) return 'low';
    return 'none';
  }

  private estimateLocalProgress(fileStats: any): number {
    if (!fileStats.fileCount) return 0;
    if (fileStats.fileCount < 5) return 20;
    if (fileStats.fileCount < 20) return 50;
    if (fileStats.fileCount < 50) return 80;
    return 95;
  }

  private async extractTechnologiesFromLocal(localPath: string): Promise<string[]> {
    // Simulated technology extraction from local files
    return ['JavaScript', 'HTML', 'CSS'];
  }

  private extractTechFromDocument(document: DocumentUpload): Promise<{ technologies: string[] }> {
    const content = document.content.toLowerCase();
    const techKeywords = {
      'javascript': ['javascript', 'js', 'node.js', 'nodejs', 'npm'],
      'typescript': ['typescript', 'ts'],
      'react': ['react', 'jsx', 'tsx'],
      'vue': ['vue', 'vuejs'],
      'angular': ['angular', 'ng'],
      'python': ['python', 'py', 'django', 'flask'],
      'java': ['java', 'spring', 'maven'],
      'c#': ['c#', 'csharp', '.net'],
      'php': ['php', 'laravel', 'symfony'],
      'ruby': ['ruby', 'rails'],
      'go': ['go', 'golang'],
      'rust': ['rust'],
      'sql': ['sql', 'mysql', 'postgresql', 'mongodb'],
      'docker': ['docker', 'container'],
      'kubernetes': ['kubernetes', 'k8s'],
      'aws': ['aws', 'amazon', 'ec2', 's3'],
      'git': ['git', 'github', 'gitlab']
    };

    const foundTechs: string[] = [];
    for (const [tech, keywords] of Object.entries(techKeywords)) {
      if (keywords.some(keyword => content.includes(keyword))) {
        foundTechs.push(tech);
      }
    }

    return Promise.resolve({ technologies: foundTechs });
  }

  private extractDescriptionFromDocument(document: DocumentUpload): string {
    const content = document.content;
    const descriptionMatch = content.match(/(?:description|overview|about|summary)[:\s]*(.+?)(?:\n\n|\n|$)/i);
    return descriptionMatch?.[1]?.trim() || '';
  }

  private determineDocumentStatus(basicInfo: any, timelineInfo: any): 'active' | 'stalled' | 'archived' | 'planning' | 'unknown' {
    if (basicInfo.hasTimeline && timelineInfo.keywords.length > 0) return 'active';
    if (basicInfo.wordCount > 100) return 'stalled';
    return 'planning';
  }

  private determineDocumentActivity(timelineInfo: any): 'high' | 'medium' | 'low' | 'none' {
    if (timelineInfo.keywords.length > 5) return 'high';
    if (timelineInfo.keywords.length > 2) return 'medium';
    if (timelineInfo.keywords.length > 0) return 'low';
    return 'none';
  }

  private estimateDocumentProgress(basicInfo: any): number {
    if (basicInfo.wordCount > 1000) return 60;
    if (basicInfo.wordCount > 500) return 40;
    if (basicInfo.wordCount > 100) return 20;
    return 10;
  }

  private parseLatestDate(dates: string[]): string {
    // Parse dates and return the most recent one
    const parsedDates = dates.map(date => {
      try {
        return new Date(date);
      } catch {
        return new Date(0);
      }
    }).filter(date => date.getTime() > 0);

    if (parsedDates.length === 0) return new Date().toISOString();
    
    const latest = parsedDates.reduce((latest, current) => 
      current.getTime() > latest.getTime() ? current : latest
    );
    
    return latest.toISOString();
  }

  private extractEventsFromDocument(content: string): string[] {
    const eventPatterns = [
      /(?:milestone|deadline|release|launch|delivery)\s*[:\-]?\s*(.+?)(?:\n\n|\n|$)/gi,
      /(?:phase|sprint|iteration)\s*\d+\s*[:\-]?\s*(.+?)(?:\n\n|\n|$)/gi,
      /(?:q[1-4]|quarter)\s*\d{4}\s*[:\-]?\s*(.+?)(?:\n\n|\n|$)/gi
    ];

    const events: string[] = [];
    for (const pattern of eventPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        events.push(...matches.slice(0, 3)); // Limit to 3 events per pattern
      }
    }

    return events.slice(0, 5); // Return top 5 events
  }

  private parseAIResponse(aiResponse: string): any {
    try {
      return JSON.parse(aiResponse);
    } catch {
      // Fallback to basic parsing
      return {
        name: 'AI Analyzed Repository',
        description: 'Repository analyzed by AI',
        status: 'unknown',
        activity: 'medium',
        estimatedProgress: 50,
        technologies: [],
        confidence: 0.5
      };
    }
  }

  private buildAIPrompt(input: any, context?: string): string {
    if (typeof input === 'string') {
      return `Analyze this repository URL or path: ${input}
      
      Additional context: ${context || 'None'}
      
      Please provide a comprehensive analysis including:
      - Repository name and description
      - Current development status
      - Activity level
      - Estimated progress
      - Technologies likely used
      - Risk factors
      - Opportunities
      
      Respond with JSON format.`;
    } else if ('filename' in input) {
      return `Analyze this document for repository information:
      
      Document: ${input.filename}
      Content preview: ${input.content.substring(0, 500)}...
      
      Additional context: ${context || 'None'}
      
      Please extract repository information and provide analysis.
      Respond with JSON format.`;
    } else {
      return `Analyze this manual repository entry:
      
      Field: ${input.field}
      Value: ${input.value}
      Repository: ${input.repositoryId}
      
      Additional context: ${context || 'None'}
      
      Please provide comprehensive repository analysis.
      Respond with JSON format.`;
    }
  }

  private async extractAIDocumentInfo(document: DocumentUpload): Promise<any> {
    if (!this.ai) {
      return {
        name: document.filename,
        description: '',
        technologies: [],
        status: 'unknown'
      };
    }

    try {
      const prompt = `Extract repository information from this document:
      
      ${document.content.substring(0, 800)}...
      
      Please provide:
      - Project name
      - Description
      - Technologies mentioned
      - Development status
      
      Respond with JSON format.`;

      const response = await this.ai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3
      });

      const aiInfo = JSON.parse(response.choices[0]?.message?.content || '{}');
      return aiInfo;
    } catch {
      return {
        name: document.filename,
        description: '',
        technologies: [],
        status: 'unknown'
      };
    }
  }

  private async extractPatternDocumentInfo(document: DocumentUpload): Promise<any> {
    const content = document.content.toLowerCase();
    
    // Pattern-based extraction
    const patterns = {
      name: [/project\s*name[:\s]*(.+?)(?:\n\n|\n|$)/i, /name[:\s]*(.+?)(?:\n\n|\n|$)/i],
      description: [/description[:\s]*(.+?)(?:\n\n|\n|$)/i, /overview[:\s]*(.+?)(?:\n\n|\n|$)/i],
      status: [/status[:\s]*(.+?)(?:\n\n|\n|$)/i, /phase[:\s]*(.+?)(?:\n\n|\n|$)/i],
      technologies: [/tech(?:nology)?(?:ies)?[:\s]*(.+?)(?:\n\n|\n|$)/i, /stack[:\s]*(.+?)(?:\n\n|\n|$)/i]
    };

    const result: any = { name: document.filename };

    for (const [key, patternList] of Object.entries(patterns)) {
      for (const pattern of patternList) {
        const match = content.match(pattern);
        if (match) {
          result[key] = match[1].trim();
          break;
        }
      }
    }

    return result;
  }

  private async buildRepositoryFromManualEntries(repositoryId: string): Promise<UniversalRepositoryInfo> {
    const entries = this.manualEntries.get(repositoryId) || [];
    
    if (entries.length === 0) {
      return await this.createMinimalRepositoryInfo(repositoryId);
    }

    // Aggregate manual entries
    const aggregated: any = {
      id: this.generateId(repositoryId),
      name: repositoryId,
      status: 'unknown',
      activity: 'medium',
      lastActivity: new Date().toISOString(),
      estimatedProgress: 50,
      technologies: [],
      contributors: [],
      recentChanges: [],
      dataSources: [],
      confidence: 0.8,
      lastUpdated: new Date().toISOString()
    };

    // Apply entries in order of confidence
    entries.sort((a, b) => b.confidence - a.confidence);

    for (const entry of entries) {
      if (entry.field === 'status') aggregated.status = entry.value;
      else if (entry.field === 'activity') aggregated.activity = entry.value;
      else if (entry.field === 'progress') aggregated.estimatedProgress = Number(entry.value) || 50;
      else if (entry.field === 'technologies') {
        const techs = Array.isArray(entry.value) ? entry.value : [entry.value].filter(Boolean);
        aggregated.technologies = [...new Set([...aggregated.technologies, ...techs])];
      }
      else if (entry.field === 'description') aggregated.description = String(entry.value);
      else if (entry.field === 'name') aggregated.name = String(entry.value);
      
      aggregated.recentChanges.push(`${entry.field}: ${entry.value}`);
      aggregated.dataSources.push({
        type: 'manual',
        source: 'user-entry',
        confidence: entry.confidence,
        metadata: { 
          field: entry.field, 
          source: entry.source,
          entryId: entry.id 
        }
      });
    }

    return aggregated;
  }
}

export const universalMonitor = new UniversalRepositoryMonitor();
export default UniversalRepositoryMonitor;