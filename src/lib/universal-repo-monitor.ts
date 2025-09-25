// Universal Repository Monitor - TPRM Integration
// Handles monitoring of repositories, documents, and compliance data

export interface UniversalRepositoryInfo {
  id: string;
  name: string;
  url?: string;
  path?: string;
  type: 'github' | 'local' | 'document' | 'manual';
  status: 'active' | 'inactive' | 'error';
  lastUpdated: string;
  metadata: {
    language?: string;
    framework?: string;
    size?: number;
    compliance?: ComplianceInfo;
    risk?: RiskInfo;
  };
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
  value: any;
  source: 'user' | 'system' | 'ai';
  confidence: number;
  timestamp: string;
  notes?: string;
}

export interface ComplianceInfo {
  soc2?: {
    status: 'compliant' | 'non-compliant' | 'partial' | 'unknown';
    score: number;
    findings: string[];
    lastAudit: string;
  };
  iso27001?: {
    status: 'compliant' | 'non-compliant' | 'partial' | 'unknown';
    score: number;
    findings: string[];
    lastAudit: string;
  };
  gdpr?: {
    status: 'compliant' | 'non-compliant' | 'partial' | 'unknown';
    score: number;
    findings: string[];
    lastAudit: string;
  };
  hipaa?: {
    status: 'compliant' | 'non-compliant' | 'partial' | 'unknown';
    score: number;
    findings: string[];
    lastAudit: string;
  };
  pciDss?: {
    status: 'compliant' | 'non-compliant' | 'partial' | 'unknown';
    score: number;
    findings: string[];
    lastAudit: string;
  };
}

export interface RiskInfo {
  overall: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  factors: {
    security: number;
    compliance: number;
    operational: number;
    financial: number;
    reputational: number;
  };
  recommendations: string[];
  lastAssessment: string;
}

export interface MonitoringResult {
  success: boolean;
  data: UniversalRepositoryInfo;
  analysis?: {
    risk: RiskInfo;
    compliance: ComplianceInfo;
    recommendations: string[];
  };
  timestamp: string;
}

class UniversalRepositoryMonitor {
  private instance: UniversalRepositoryMonitor | null = null;

  constructor() {
    // Singleton pattern
    if (UniversalRepositoryMonitor.instance) {
      return UniversalRepositoryMonitor.instance;
    }
    UniversalRepositoryMonitor.instance = this;
  }

  async monitorRepository(
    input: string | DocumentUpload | ManualEntry,
    options: {
      forceMethod?: 'github' | 'local' | 'document' | 'manual';
      additionalContext?: string;
    } = {}
  ): Promise<MonitoringResult> {
    try {
      let result: UniversalRepositoryInfo;
      
      if (typeof input === 'string') {
        // URL or local path
        if (input.startsWith('http') || input.startsWith('github.com')) {
          result = await this.monitorGitHubRepository(input, options);
        } else {
          result = await this.monitorLocalRepository(input, options);
        }
      } else if ('filename' in input) {
        // Document upload
        result = await this.monitorDocument(input, options);
      } else {
        // Manual entry
        result = await this.monitorManualEntry(input, options);
      }

      // Perform analysis
      const analysis = await this.performAnalysis(result, options.additionalContext);

      return {
        success: true,
        data: result,
        analysis,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Repository monitoring failed:', error);
      throw new Error(`Failed to monitor repository: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async monitorGitHubRepository(
    url: string,
    options: any
  ): Promise<UniversalRepositoryInfo> {
    // Simulate GitHub repository monitoring
    // In production, this would integrate with GitHub API
    const repoId = this.generateId('github');
    
    return {
      id: repoId,
      name: this.extractRepoName(url),
      url,
      type: 'github',
      status: 'active',
      lastUpdated: new Date().toISOString(),
      metadata: {
        language: 'TypeScript',
        framework: 'Next.js',
        size: Math.floor(Math.random() * 10000) + 1000,
        compliance: this.generateComplianceInfo(),
        risk: this.generateRiskInfo()
      }
    };
  }

  private async monitorLocalRepository(
    path: string,
    options: any
  ): Promise<UniversalRepositoryInfo> {
    // Simulate local repository monitoring
    const repoId = this.generateId('local');
    
    return {
      id: repoId,
      name: this.extractPathName(path),
      path,
      type: 'local',
      status: 'active',
      lastUpdated: new Date().toISOString(),
      metadata: {
        language: 'TypeScript',
        framework: 'Next.js',
        size: Math.floor(Math.random() * 5000) + 500,
        compliance: this.generateComplianceInfo(),
        risk: this.generateRiskInfo()
      }
    };
  }

  private async monitorDocument(
    document: DocumentUpload,
    options: any
  ): Promise<UniversalRepositoryInfo> {
    // Simulate document monitoring
    const docId = this.generateId('document');
    
    return {
      id: docId,
      name: document.filename,
      type: 'document',
      status: 'active',
      lastUpdated: new Date().toISOString(),
      metadata: {
        size: document.metadata.size,
        compliance: this.analyzeDocumentCompliance(document),
        risk: this.analyzeDocumentRisk(document)
      }
    };
  }

  private async monitorManualEntry(
    entry: ManualEntry,
    options: any
  ): Promise<UniversalRepositoryInfo> {
    // Simulate manual entry processing
    const entryId = this.generateId('manual');
    
    return {
      id: entryId,
      name: `Manual Entry - ${entry.field}`,
      type: 'manual',
      status: 'active',
      lastUpdated: new Date().toISOString(),
      metadata: {
        compliance: this.generateComplianceInfo(),
        risk: this.generateRiskInfo()
      }
    };
  }

  private async performAnalysis(
    data: UniversalRepositoryInfo,
    context?: string
  ): Promise<{
    risk: RiskInfo;
    compliance: ComplianceInfo;
    recommendations: string[];
  }> {
    // Simulate AI-powered analysis
    // In production, this would integrate with Z-AI Web Dev SDK
    
    const risk = data.metadata.risk || this.generateRiskInfo();
    const compliance = data.metadata.compliance || this.generateComplianceInfo();
    
    const recommendations = this.generateRecommendations(risk, compliance, context);

    return {
      risk,
      compliance,
      recommendations
    };
  }

  // Helper methods
  private generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private extractRepoName(url: string): string {
    try {
      const urlObj = new URL(url.startsWith('github.com') ? `https://${url}` : url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      return pathParts.length >= 2 ? `${pathParts[pathParts.length - 2]}/${pathParts[pathParts.length - 1]}` : url;
    } catch {
      return url;
    }
  }

  private extractPathName(path: string): string {
    const parts = path.split('/').filter(Boolean);
    return parts[parts.length - 1] || path;
  }

  private generateComplianceInfo(): ComplianceInfo {
    const statuses = ['compliant', 'non-compliant', 'partial', 'unknown'] as const;
    
    return {
      soc2: {
        status: statuses[Math.floor(Math.random() * statuses.length)],
        score: Math.floor(Math.random() * 100),
        findings: this.generateFindings(),
        lastAudit: this.generateRandomDate()
      },
      iso27001: {
        status: statuses[Math.floor(Math.random() * statuses.length)],
        score: Math.floor(Math.random() * 100),
        findings: this.generateFindings(),
        lastAudit: this.generateRandomDate()
      },
      gdpr: {
        status: statuses[Math.floor(Math.random() * statuses.length)],
        score: Math.floor(Math.random() * 100),
        findings: this.generateFindings(),
        lastAudit: this.generateRandomDate()
      },
      hipaa: {
        status: statuses[Math.floor(Math.random() * statuses.length)],
        score: Math.floor(Math.random() * 100),
        findings: this.generateFindings(),
        lastAudit: this.generateRandomDate()
      },
      pciDss: {
        status: statuses[Math.floor(Math.random() * statuses.length)],
        score: Math.floor(Math.random() * 100),
        findings: this.generateFindings(),
        lastAudit: this.generateRandomDate()
      }
    };
  }

  private generateRiskInfo(): RiskInfo {
    const levels = ['low', 'medium', 'high', 'critical'] as const;
    const overallLevel = levels[Math.floor(Math.random() * levels.length)];
    
    return {
      overall: overallLevel,
      score: Math.floor(Math.random() * 100),
      factors: {
        security: Math.floor(Math.random() * 100),
        compliance: Math.floor(Math.random() * 100),
        operational: Math.floor(Math.random() * 100),
        financial: Math.floor(Math.random() * 100),
        reputational: Math.floor(Math.random() * 100)
      },
      recommendations: this.generateRiskRecommendations(),
      lastAssessment: new Date().toISOString()
    };
  }

  private analyzeDocumentCompliance(document: DocumentUpload): ComplianceInfo {
    // Simulate document compliance analysis
    // In production, this would use AI to analyze document content
    return this.generateComplianceInfo();
  }

  private analyzeDocumentRisk(document: DocumentUpload): RiskInfo {
    // Simulate document risk analysis
    // In production, this would use AI to assess document risk
    return this.generateRiskInfo();
  }

  private generateFindings(): string[] {
    const findings = [
      'Access control policies need updating',
      'Encryption standards not fully implemented',
      'Audit trails incomplete',
      'Data retention policy undefined',
      'Incident response plan outdated',
      'Third-party risk assessment required',
      'Security awareness training needed',
      'Backup procedures not documented'
    ];
    
    const count = Math.floor(Math.random() * 3) + 1;
    const selected: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const finding = findings[Math.floor(Math.random() * findings.length)];
      if (!selected.includes(finding)) {
        selected.push(finding);
      }
    }
    
    return selected;
  }

  private generateRiskRecommendations(): string[] {
    const recommendations = [
      'Implement multi-factor authentication',
      'Conduct regular security assessments',
      'Update incident response plan',
      'Enhance data encryption',
      'Improve access controls',
      'Establish security monitoring',
      'Develop business continuity plan',
      'Conduct vendor risk assessments'
    ];
    
    const count = Math.floor(Math.random() * 4) + 2;
    const selected: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const rec = recommendations[Math.floor(Math.random() * recommendations.length)];
      if (!selected.includes(rec)) {
        selected.push(rec);
      }
    }
    
    return selected;
  }

  private generateRecommendations(
    risk: RiskInfo,
    compliance: ComplianceInfo,
    context?: string
  ): string[] {
    const baseRecommendations = [
      'Schedule regular compliance audits',
      'Implement automated security monitoring',
      'Develop vendor risk management program',
      'Create incident response procedures',
      'Establish data governance policies'
    ];
    
    const selected: string[] = [];
    
    // Add risk-based recommendations
    if (risk.overall === 'high' || risk.overall === 'critical') {
      selected.push('Immediate risk mitigation required');
      selected.push('Engage security consultants');
    }
    
    // Add compliance-based recommendations
    const complianceScores = Object.values(compliance).map(c => c.score);
    const avgCompliance = complianceScores.reduce((a, b) => a + b, 0) / complianceScores.length;
    
    if (avgCompliance < 70) {
      selected.push('Compliance improvement plan needed');
    }
    
    // Add base recommendations
    const count = Math.min(3, baseRecommendations.length);
    for (let i = 0; i < count; i++) {
      const rec = baseRecommendations[i];
      if (!selected.includes(rec)) {
        selected.push(rec);
      }
    }
    
    return selected;
  }

  private generateRandomDate(): string {
    const start = new Date(2023, 0, 1);
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString();
  }
}

// Export singleton instance
export const universalMonitor = new UniversalRepositoryMonitor();

// Export types for external use
export type {
  UniversalRepositoryInfo,
  DocumentUpload,
  ManualEntry,
  ComplianceInfo,
  RiskInfo,
  MonitoringResult
};