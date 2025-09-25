// User Onboarding System for Project Sentinel TPRM Platform
// Handles user registration, role assignment, and guided setup

import { db } from './db';
import { v4 as uuidv4 } from 'uuid';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'form' | 'action' | 'survey';
  required: boolean;
  order: number;
  component?: string;
  validation?: (data: any) => boolean;
  data?: any;
}

export interface OnboardingProgress {
  id: string;
  userId: string;
  currentStep: string;
  completedSteps: string[];
  data: Record<string, any>;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  startedAt: string;
  completedAt?: string;
  estimatedTimeRemaining?: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    riskAlerts: boolean;
    complianceUpdates: boolean;
    vendorUpdates: boolean;
  };
  dashboard: {
    defaultView: string;
    widgets: string[];
    refreshInterval: number;
  };
  export: {
    defaultFormat: 'pdf' | 'csv' | 'excel';
    includeCharts: boolean;
    includeRawData: boolean;
  };
}

export interface OrganizationSetup {
  id: string;
  name: string;
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  country: string;
  complianceFrameworks: string[];
  riskThreshold: 'low' | 'medium' | 'high';
  assessmentFrequency: 'weekly' | 'monthly' | 'quarterly';
  vendorCategories: string[];
  customFields: Record<string, any>;
}

export class UserOnboardingManager {
  private onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Project Sentinel',
      description: 'Get started with AI-powered third-party risk management',
      type: 'info',
      required: true,
      order: 1
    },
    {
      id: 'role_selection',
      title: 'Select Your Role',
      description: 'Choose your primary role to customize your experience',
      type: 'form',
      required: true,
      order: 2,
      data: {
        roles: [
          { id: 'administrator', name: 'Administrator', description: 'Full system access and configuration' },
          { id: 'risk_analyst', name: 'Risk Analyst', description: 'Vendor assessment and risk analysis' },
          { id: 'vendor_manager', name: 'Vendor Manager', description: 'Vendor relationship and passport management' },
          { id: 'compliance_officer', name: 'Compliance Officer', description: 'Compliance monitoring and reporting' },
          { id: 'executive', name: 'Executive', description: 'High-level overview and strategic insights' },
          { id: 'read_only', name: 'Read Only', description: 'View-only access to vendor information' }
        ]
      }
    },
    {
      id: 'organization_setup',
      title: 'Organization Setup',
      description: 'Configure your organization details and compliance requirements',
      type: 'form',
      required: true,
      order: 3,
      data: {
        industries: [
          'Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing',
          'Education', 'Government', 'Consulting', 'Other'
        ],
        companySizes: [
          { id: 'startup', name: 'Startup (1-10 employees)' },
          { id: 'small', name: 'Small Business (11-50 employees)' },
          { id: 'medium', name: 'Medium Business (51-200 employees)' },
          { id: 'large', name: 'Large Business (201-1000 employees)' },
          { id: 'enterprise', name: 'Enterprise (1000+ employees)' }
        ],
        complianceFrameworks: [
          'SOC 2', 'ISO 27001', 'PCI DSS', 'GDPR', 'HIPAA', 'SOX', 'CCPA', 'Other'
        ]
      }
    },
    {
      id: 'preferences',
      title: 'User Preferences',
      description: 'Customize your experience and notification settings',
      type: 'form',
      required: false,
      order: 4
    },
    {
      id: 'tour',
      title: 'Platform Tour',
      description: 'Take a quick tour of the main features and dashboards',
      type: 'action',
      required: false,
      order: 5
    },
    {
      id: 'first_assessment',
      title: 'First Risk Assessment',
      description: 'Try our Fast Check tool with a sample vendor assessment',
      type: 'action',
      required: false,
      order: 6
    },
    {
      id: 'completion',
      title: 'Setup Complete!',
      description: 'You\'re ready to start using Project Sentinel',
      type: 'info',
      required: true,
      order: 7
    }
  ];

  async startOnboarding(userId: string): Promise<OnboardingProgress> {
    const progressId = uuidv4();
    
    const progress: OnboardingProgress = {
      id: progressId,
      userId,
      currentStep: this.onboardingSteps[0].id,
      completedSteps: [],
      data: {},
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      estimatedTimeRemaining: this.calculateEstimatedTime()
    };

    // Save progress to database
    await this.saveOnboardingProgress(progress);
    
    return progress;
  }

  async getOnboardingProgress(userId: string): Promise<OnboardingProgress | null> {
    try {
      // In a real implementation, this would query the database
      // For now, return null to indicate no existing progress
      return null;
    } catch (error) {
      console.error('Failed to get onboarding progress:', error);
      return null;
    }
  }

  async completeStep(
    userId: string,
    stepId: string,
    data: any = {}
  ): Promise<OnboardingProgress> {
    let progress = await this.getOnboardingProgress(userId);
    
    if (!progress) {
      progress = await this.startOnboarding(userId);
    }

    // Validate step completion
    const step = this.onboardingSteps.find(s => s.id === stepId);
    if (!step) {
      throw new Error(`Invalid step ID: ${stepId}`);
    }

    // Validate data if validation function exists
    if (step.validation && !step.validation(data)) {
      throw new Error(`Invalid data for step: ${stepId}`);
    }

    // Update progress
    progress.completedSteps.push(stepId);
    progress.data[stepId] = data;

    // Find next step
    const currentStepIndex = this.onboardingSteps.findIndex(s => s.id === progress.currentStep);
    const nextStep = this.onboardingSteps.find(s => s.order > currentStepIndex && !progress.completedSteps.includes(s.id));
    
    if (nextStep) {
      progress.currentStep = nextStep.id;
    } else {
      // Onboarding completed
      progress.status = 'completed';
      progress.completedAt = new Date().toISOString();
      progress.currentStep = 'completion';
    }

    // Update estimated time remaining
    progress.estimatedTimeRemaining = this.calculateEstimatedTimeRemaining(progress);

    // Save progress
    await this.saveOnboardingProgress(progress);

    // Process step-specific actions
    await this.processStepCompletion(stepId, data, userId);

    return progress;
  }

  async skipStep(userId: string, stepId: string): Promise<OnboardingProgress> {
    let progress = await this.getOnboardingProgress(userId);
    
    if (!progress) {
      progress = await this.startOnboarding(userId);
    }

    const step = this.onboardingSteps.find(s => s.id === stepId);
    if (!step) {
      throw new Error(`Invalid step ID: ${stepId}`);
    }

    if (step.required) {
      throw new Error(`Cannot skip required step: ${stepId}`);
    }

    // Mark as skipped
    progress.completedSteps.push(stepId);
    progress.data[stepId] = { skipped: true };

    // Find next step
    const currentStepIndex = this.onboardingSteps.findIndex(s => s.id === progress.currentStep);
    const nextStep = this.onboardingSteps.find(s => s.order > currentStepIndex && !progress.completedSteps.includes(s.id));
    
    if (nextStep) {
      progress.currentStep = nextStep.id;
    }

    // Save progress
    await this.saveOnboardingProgress(progress);

    return progress;
  }

  async getCurrentStep(userId: string): Promise<OnboardingStep | null> {
    const progress = await this.getOnboardingProgress(userId);
    
    if (!progress) {
      return this.onboardingSteps[0];
    }

    return this.onboardingSteps.find(s => s.id === progress.currentStep) || null;
  }

  async getOnboardingSteps(): Promise<OnboardingStep[]> {
    return this.onboardingSteps;
  }

  async resetOnboarding(userId: string): Promise<void> {
    // In a real implementation, this would delete or reset the onboarding progress
    console.log(`Onboarding reset for user: ${userId}`);
  }

  private async saveOnboardingProgress(progress: OnboardingProgress): Promise<void> {
    // In a real implementation, this would save to the database
    console.log('Saving onboarding progress:', progress);
  }

  private async processStepCompletion(stepId: string, data: any, userId: string): Promise<void> {
    switch (stepId) {
      case 'role_selection':
        await this.processRoleSelection(data, userId);
        break;
      case 'organization_setup':
        await this.processOrganizationSetup(data, userId);
        break;
      case 'preferences':
        await this.processUserPreferences(data, userId);
        break;
      case 'first_assessment':
        await this.processFirstAssessment(data, userId);
        break;
    }
  }

  private async processRoleSelection(data: any, userId: string): Promise<void> {
    // Update user role in the database
    const { role } = data;
    
    try {
      // In a real implementation, this would update the user's role
      console.log(`Updating user ${userId} role to: ${role}`);
      
      // Create user permissions based on role
      const permissions = this.getRolePermissions(role);
      console.log(`Setting permissions for role ${role}:`, permissions);
      
    } catch (error) {
      console.error('Failed to process role selection:', error);
    }
  }

  private async processOrganizationSetup(data: any, userId: string): Promise<void> {
    // Create or update organization setup
    const orgSetup: OrganizationSetup = {
      id: uuidv4(),
      name: data.organizationName,
      industry: data.industry,
      size: data.companySize,
      country: data.country,
      complianceFrameworks: data.complianceFrameworks || [],
      riskThreshold: data.riskThreshold || 'medium',
      assessmentFrequency: data.assessmentFrequency || 'monthly',
      vendorCategories: data.vendorCategories || [],
      customFields: data.customFields || {}
    };

    try {
      // In a real implementation, this would save to the database
      console.log('Saving organization setup:', orgSetup);
      
      // Create default vendor categories if none provided
      if (orgSetup.vendorCategories.length === 0) {
        orgSetup.vendorCategories = [
          'Cloud Services',
          'Software Providers',
          'Hardware Vendors',
          'Consulting Services',
          'Payment Processors',
          'Data Processors',
          'Other'
        ];
      }
      
    } catch (error) {
      console.error('Failed to process organization setup:', error);
    }
  }

  private async processUserPreferences(data: any, userId: string): Promise<void> {
    // Save user preferences
    const preferences: UserPreferences = {
      theme: data.theme || 'auto',
      language: data.language || 'en',
      timezone: data.timezone || 'UTC',
      notifications: {
        email: data.emailNotifications !== false,
        push: data.pushNotifications !== false,
        riskAlerts: data.riskAlerts !== false,
        complianceUpdates: data.complianceUpdates !== false,
        vendorUpdates: data.vendorUpdates !== false
      },
      dashboard: {
        defaultView: data.defaultDashboardView || 'main',
        widgets: data.dashboardWidgets || ['portfolio-health', 'recent-activity', 'risk-alerts'],
        refreshInterval: data.dashboardRefreshInterval || 300000 // 5 minutes
      },
      export: {
        defaultFormat: data.defaultExportFormat || 'pdf',
        includeCharts: data.includeChartsInExport !== false,
        includeRawData: data.includeRawDataInExport || false
      }
    };

    try {
      // In a real implementation, this would save to the database
      console.log('Saving user preferences:', preferences);
      
    } catch (error) {
      console.error('Failed to process user preferences:', error);
    }
  }

  private async processFirstAssessment(data: any, userId: string): Promise<void> {
    // Process the first assessment attempt
    try {
      console.log('Processing first assessment for user:', userId);
      
      // Create a sample assessment record
      const assessment = {
        id: uuidv4(),
        userId,
        type: 'fast_check',
        status: 'completed',
        vendorName: data.vendorName || 'Sample Vendor',
        riskScore: Math.floor(Math.random() * 100),
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      };
      
      console.log('Created sample assessment:', assessment);
      
    } catch (error) {
      console.error('Failed to process first assessment:', error);
    }
  }

  private getRolePermissions(role: string): string[] {
    const rolePermissions: Record<string, string[]> = {
      administrator: [
        'system:configure',
        'users:manage',
        'vendors:manage',
        'assessments:manage',
        'compliance:manage',
        'reports:manage',
        'dashboards:manage'
      ],
      risk_analyst: [
        'vendors:view',
        'assessments:create',
        'assessments:view',
        'assessments:update',
        'reports:view',
        'dashboards:view'
      ],
      vendor_manager: [
        'vendors:manage',
        'vendors:view',
        'passports:manage',
        'assessments:view',
        'reports:view',
        'dashboards:view'
      ],
      compliance_officer: [
        'vendors:view',
        'compliance:manage',
        'compliance:view',
        'assessments:view',
        'reports:view',
        'dashboards:view'
      ],
      executive: [
        'vendors:view',
        'assessments:view',
        'compliance:view',
        'reports:view',
        'dashboards:view',
        'analytics:view'
      ],
      read_only: [
        'vendors:view',
        'assessments:view',
        'compliance:view',
        'reports:view',
        'dashboards:view'
      ]
    };

    return rolePermissions[role] || [];
  }

  private calculateEstimatedTime(): number {
    // Estimate total onboarding time in minutes
    return 15; // 15 minutes average
  }

  private calculateEstimatedTimeRemaining(progress: OnboardingProgress): number {
    const completedSteps = progress.completedSteps.length;
    const totalSteps = this.onboardingSteps.length;
    const totalTime = this.calculateEstimatedTime();
    
    const remainingSteps = totalSteps - completedSteps;
    return Math.round((remainingSteps / totalSteps) * totalTime);
  }

  async getOnboardingSummary(userId: string): Promise<{
    status: string;
    progress: number;
    completedSteps: number;
    totalSteps: number;
    timeRemaining?: number;
  }> {
    const progress = await this.getOnboardingProgress(userId);
    
    if (!progress) {
      return {
        status: 'not_started',
        progress: 0,
        completedSteps: 0,
        totalSteps: this.onboardingSteps.length
      };
    }

    const completedSteps = progress.completedSteps.length;
    const totalSteps = this.onboardingSteps.length;
    const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

    return {
      status: progress.status,
      progress: progressPercentage,
      completedSteps,
      totalSteps,
      timeRemaining: progress.estimatedTimeRemaining
    };
  }
}

// Export onboarding manager instance
export const userOnboardingManager = new UserOnboardingManager();

// Export types and utilities
export {
  OnboardingStep,
  OnboardingProgress,
  UserPreferences,
  OrganizationSetup
};