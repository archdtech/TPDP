// Universal Repository Monitor Module
// Provides monitoring capabilities for development repositories

export interface UniversalRepositoryInfo {
  id: string;
  name: string;
  url: string;
  type: 'github' | 'gitlab' | 'bitbucket' | 'custom';
  status: 'active' | 'inactive' | 'error';
  lastActivity: string;
  commitCount: number;
  contributorCount: number;
  language: string;
  framework?: string;
  description?: string;
}

export interface DocumentUpload {
  id: string;
  filename: string;
  type: 'pdf' | 'doc' | 'docx' | 'txt' | 'md' | 'ppt' | 'xls' | 'xlsx';
  content: string;
  metadata: {
    size: number;
    created: string;
    modified: string;
  };
}

export interface ManualEntry {
  id: string;
  repositoryId: string;
  field: string;
  value: string;
  source: string;
  confidence: number;
  timestamp: string;
  notes?: string;
}

export class UniversalRepositoryMonitor {
  private repositories: UniversalRepositoryInfo[] = [];
  private documents: DocumentUpload[] = [];
  private entries: ManualEntry[] = [];

  async addRepository(repoInfo: Omit<UniversalRepositoryInfo, 'id' | 'status' | 'lastActivity'>): Promise<UniversalRepositoryInfo> {
    const newRepo: UniversalRepositoryInfo = {
      ...repoInfo,
      id: `repo_${Date.now()}`,
      status: 'active',
      lastActivity: new Date().toISOString()
    };

    this.repositories.push(newRepo);
    return newRepo;
  }

  async getRepositories(): Promise<UniversalRepositoryInfo[]> {
    return this.repositories;
  }

  async getRepository(id: string): Promise<UniversalRepositoryInfo | null> {
    return this.repositories.find(repo => repo.id === id) || null;
  }

  async updateRepository(id: string, updates: Partial<UniversalRepositoryInfo>): Promise<UniversalRepositoryInfo | null> {
    const index = this.repositories.findIndex(repo => repo.id === id);
    if (index === -1) return null;

    this.repositories[index] = { ...this.repositories[index], ...updates };
    return this.repositories[index];
  }

  async deleteRepository(id: string): Promise<boolean> {
    const index = this.repositories.findIndex(repo => repo.id === id);
    if (index === -1) return false;

    this.repositories.splice(index, 1);
    return true;
  }

  async uploadDocument(document: Omit<DocumentUpload, 'id'>): Promise<DocumentUpload> {
    const newDoc: DocumentUpload = {
      ...document,
      id: `doc_${Date.now()}`
    };

    this.documents.push(newDoc);
    return newDoc;
  }

  async getDocuments(): Promise<DocumentUpload[]> {
    return this.documents;
  }

  async getDocument(id: string): Promise<DocumentUpload | null> {
    return this.documents.find(doc => doc.id === id) || null;
  }

  async createEntry(entry: Omit<ManualEntry, 'id' | 'timestamp'>): Promise<ManualEntry> {
    const newEntry: ManualEntry = {
      ...entry,
      id: `entry_${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    this.entries.push(newEntry);
    return newEntry;
  }

  async getEntries(): Promise<ManualEntry[]> {
    return this.entries;
  }

  async getEntry(id: string): Promise<ManualEntry | null> {
    return this.entries.find(entry => entry.id === id) || null;
  }

  async updateEntry(id: string, updates: Partial<ManualEntry>): Promise<ManualEntry | null> {
    const index = this.entries.findIndex(entry => entry.id === id);
    if (index === -1) return null;

    this.entries[index] = { 
      ...this.entries[index], 
      ...updates
    };
    return this.entries[index];
  }

  async deleteEntry(id: string): Promise<boolean> {
    const index = this.entries.findIndex(entry => entry.id === id);
    if (index === -1) return false;

    this.entries.splice(index, 1);
    return true;
  }

  async getDashboardData(): Promise<{
    totalRepositories: number;
    activeRepositories: number;
    totalDocuments: number;
    totalEntries: number;
    recentActivity: any[];
  }> {
    return {
      totalRepositories: this.repositories.length,
      activeRepositories: this.repositories.filter(r => r.status === 'active').length,
      totalDocuments: this.documents.length,
      totalEntries: this.entries.length,
      recentActivity: []
    };
  }

  async monitorRepository(input: string | UniversalRepositoryInfo | DocumentUpload | ManualEntry, options: any = {}): Promise<any> {
    // Handle different input types
    if (typeof input === 'string') {
      // URL or local path
      if (input.startsWith('http://') || input.startsWith('https://')) {
        return await this.monitorRemoteRepository(input, options);
      } else {
        return await this.monitorLocalRepository(input, options);
      }
    } else if ('filename' in input) {
      // Document upload
      return await this.monitorDocument(input, options);
    } else if ('repositoryId' in input) {
      // Manual entry
      return await this.processManualEntry(input, options);
    } else {
      // Repository info object
      return await this.monitorRepositoryInfo(input, options);
    }
  }

  private async monitorRemoteRepository(url: string, options: any): Promise<any> {
    // Simulate monitoring a remote repository
    const repoInfo: UniversalRepositoryInfo = {
      id: `repo_${Date.now()}`,
      name: url.split('/').pop() || 'Unknown',
      url,
      type: this.detectRepositoryType(url),
      status: 'active',
      lastActivity: new Date().toISOString(),
      commitCount: Math.floor(Math.random() * 1000),
      contributorCount: Math.floor(Math.random() * 10),
      language: 'TypeScript',
      framework: 'Next.js',
      description: `Repository monitored at ${new Date().toISOString()}`
    };

    this.repositories.push(repoInfo);

    return {
      repository: repoInfo,
      analysis: {
        health: 'good',
        issues: [],
        recommendations: ['Regular updates recommended'],
        lastChecked: new Date().toISOString()
      },
      metadata: {
        monitoringMethod: options.forceMethod || 'automatic',
        context: options.additionalContext || '',
        processingTime: Math.floor(Math.random() * 2000) + 1000
      }
    };
  }

  private async monitorLocalRepository(path: string, options: any): Promise<any> {
    // Simulate monitoring a local repository
    const repoInfo: UniversalRepositoryInfo = {
      id: `local_${Date.now()}`,
      name: path.split('/').pop() || 'Local Repository',
      url: path,
      type: 'custom',
      status: 'active',
      lastActivity: new Date().toISOString(),
      commitCount: Math.floor(Math.random() * 500),
      contributorCount: 1,
      language: 'TypeScript',
      framework: 'Next.js',
      description: `Local repository at ${path}`
    };

    this.repositories.push(repoInfo);

    return {
      repository: repoInfo,
      analysis: {
        health: 'excellent',
        issues: [],
        recommendations: ['Consider pushing to remote for backup'],
        lastChecked: new Date().toISOString()
      },
      metadata: {
        monitoringMethod: options.forceMethod || 'local',
        context: options.additionalContext || '',
        processingTime: Math.floor(Math.random() * 1000) + 500
      }
    };
  }

  private async monitorDocument(document: DocumentUpload, options: any): Promise<any> {
    // Store the document
    this.documents.push(document);

    // Analyze document content
    const analysis = {
      type: document.type,
      size: document.metadata.size,
      contentLength: document.content.length,
      extractedInfo: {
        technologies: this.extractTechnologies(document.content),
        frameworks: this.extractFrameworks(document.content),
        potentialIssues: this.identifyIssues(document.content)
      },
      confidence: 0.85
    };

    return {
      document,
      analysis,
      metadata: {
        processingMethod: 'document_analysis',
        context: options.additionalContext || '',
        processingTime: Math.floor(Math.random() * 3000) + 1000
      }
    };
  }

  private async processManualEntry(entry: ManualEntry, options: any): Promise<any> {
    // Store the manual entry
    this.entries.push(entry);

    return {
      entry,
      validation: {
        isValid: true,
        confidence: entry.confidence,
        suggestions: []
      },
      metadata: {
        processingMethod: 'manual_entry',
        context: options.additionalContext || '',
        processingTime: 100
      }
    };
  }

  private async monitorRepositoryInfo(repoInfo: UniversalRepositoryInfo, options: any): Promise<any> {
    // Store the repository info
    this.repositories.push(repoInfo);

    return {
      repository: repoInfo,
      analysis: {
        health: 'good',
        issues: [],
        recommendations: ['Regular monitoring recommended'],
        lastChecked: new Date().toISOString()
      },
      metadata: {
        monitoringMethod: 'repository_info',
        context: options.additionalContext || '',
        processingTime: 500
      }
    };
  }

  private detectRepositoryType(url: string): 'github' | 'gitlab' | 'bitbucket' | 'custom' {
    if (url.includes('github.com')) return 'github';
    if (url.includes('gitlab.com')) return 'gitlab';
    if (url.includes('bitbucket.org')) return 'bitbucket';
    return 'custom';
  }

  private extractTechnologies(content: string): string[] {
    const technologies = [];
    const techKeywords = ['javascript', 'typescript', 'python', 'java', 'go', 'rust', 'c++', 'php', 'ruby'];
    
    for (const tech of techKeywords) {
      if (content.toLowerCase().includes(tech)) {
        technologies.push(tech);
      }
    }
    
    return technologies;
  }

  private extractFrameworks(content: string): string[] {
    const frameworks = [];
    const frameworkKeywords = ['react', 'next', 'vue', 'angular', 'express', 'django', 'flask', 'spring'];
    
    for (const framework of frameworkKeywords) {
      if (content.toLowerCase().includes(framework)) {
        frameworks.push(framework);
      }
    }
    
    return frameworks;
  }

  private identifyIssues(content: string): string[] {
    const issues = [];
    const issuePatterns = [
      { pattern: /todo|fixme|hack/i, message: 'Contains TODO/FIXME comments' },
      { pattern: /console\.log|debugger/i, message: 'Contains debug code' },
      { pattern: /password|secret|key/i, message: 'May contain sensitive information' }
    ];
    
    for (const { pattern, message } of issuePatterns) {
      if (pattern.test(content)) {
        issues.push(message);
      }
    }
    
    return issues;
  }
}

// Export singleton instance
export const universalMonitor = new UniversalRepositoryMonitor();