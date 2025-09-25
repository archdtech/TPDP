"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { 
  HelpCircle, 
  BookOpen, 
  Lightbulb, 
  Video, 
  FileText, 
  MessageSquare, 
  Search,
  X,
  ChevronRight,
  ArrowLeft,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  ThumbsUp,
  ThumbsDown,
  Share,
  Bookmark,
  BookmarkCheck,
  Filter,
  Tag,
  User,
  Target,
  Shield,
  Zap,
  Globe,
  Database,
  Brain,
  BarChart3,
  Users
} from 'lucide-react';

interface HelpTopic {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'getting-started' | 'features' | 'troubleshooting' | 'best-practices' | 'api';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number;
  tags: string[];
  relatedTopics: string[];
  steps?: HelpStep[];
  videoUrl?: string;
  codeExample?: string;
  faqs?: FAQ[];
}

interface HelpStep {
  id: string;
  title: string;
  description: string;
  code?: string;
  image?: string;
  tips?: string[];
}

interface FAQ {
  question: string;
  answer: string;
  helpful: number;
}

interface UserSession {
  userId: string;
  currentTopic?: string;
  searchHistory: string[];
  bookmarks: string[];
  completedTopics: string[];
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    autoPlayVideos: boolean;
    showTooltips: boolean;
  };
}

interface HelpContextType {
  isOpen: boolean;
  currentTopic: HelpTopic | null;
  searchQuery: string;
  searchResults: HelpTopic[];
  bookmarks: string[];
  completedTopics: string[];
  openHelp: () => void;
  closeHelp: () => void;
  searchHelp: (query: string) => void;
  selectTopic: (topicId: string) => void;
  toggleBookmark: (topicId: string) => void;
  markTopicComplete: (topicId: string) => void;
  getTopicProgress: (topicId: string) => number;
  getRecommendedTopics: () => HelpTopic[];
  getContextualHelp: (context: string) => HelpTopic[];
}

const HelpContext = createContext<HelpContextType | null>(null);

export const useHelp = () => {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error('useHelp must be used within HelpProvider');
  }
  return context;
};

interface HelpProviderProps {
  children: ReactNode;
  userId: string;
}

export function HelpProvider({ children, userId }: HelpProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<HelpTopic | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<HelpTopic[]>([]);
  const [userSession, setUserSession] = useState<UserSession>({
    userId,
    searchHistory: [],
    bookmarks: [],
    completedTopics: [],
    preferences: {
      theme: 'light',
      language: 'en',
      autoPlayVideos: false,
      showTooltips: true
    }
  });

  // Help topics database
  const helpTopics: HelpTopic[] = [
    {
      id: 'getting-started-overview',
      title: 'Getting Started with Project Sentinel',
      description: 'Learn the basics of AI-powered TPRM',
      content: `
# Getting Started with Project Sentinel

Project Sentinel is an AI-powered Third-Party Risk Management (TPRM) platform that transforms vendor risk assessment from weeks to minutes.

## What is TPRM?

Third-Party Risk Management (TPRM) is the process of identifying, assessing, and mitigating risks associated with third-party vendors and suppliers.

## Key Features

- **Fast Check**: 2-minute risk assessments
- **Vendor Passports**: Reusable compliance profiles
- **AI Analysis**: Explainable risk findings
- **Multi-Framework Support**: SOC2, ISO27001, GDPR, HIPAA

## First Steps

1. Complete your profile setup
2. Take the guided tour
3. Try your first Fast Check assessment
4. Explore the dashboards
      `,
      category: 'getting-started',
      difficulty: 'beginner',
      estimatedReadTime: 5,
      tags: ['tprm', 'overview', 'basics'],
      relatedTopics: ['fast-check-intro', 'vendor-passport-intro'],
      steps: [
        {
          id: 'step1',
          title: 'Complete Your Profile',
          description: 'Set up your role and organization details',
          tips: [
            'Choose the role that best describes your responsibilities',
            'Configure your organization\'s compliance requirements',
            'Set up notification preferences'
          ]
        },
        {
          id: 'step2',
          title: 'Take the Guided Tour',
          description: 'Explore the main features and navigation',
          tips: [
            'The tour covers all major features',
            'You can skip sections you already know',
            'Tour takes about 10 minutes'
          ]
        },
        {
          id: 'step3',
          title: 'Try Fast Check',
          description: 'Experience the power of 2-minute assessments',
          tips: [
            'Upload any compliance document',
            'Review the AI-generated analysis',
            'Make your first vendor decision'
          ]
        }
      ]
    },
    {
      id: 'fast-check-intro',
      title: 'Fast Check: 2-Minute Risk Assessments',
      description: 'Learn how to use Fast Check for rapid vendor assessments',
      content: `
# Fast Check: 2-Minute Risk Assessments

Fast Check is Project Sentinel's flagship feature that transforms vendor risk assessment from a weeks-long manual process to a 2-minute automated analysis.

## How It Works

1. **Upload Documents**: Drag and drop compliance documents
2. **AI Analysis**: Our AI analyzes for compliance gaps and risks
3. **Risk Scoring**: Generate comprehensive risk scores
4. **Decision Ready**: Get actionable insights immediately

## Supported Document Types

- SOC 2 Type I & II Reports
- ISO 27001 Certifications
- PCI DSS Compliance Reports
- GDPR Documentation
- HIPAA Compliance
- Custom Questionnaires

## Key Benefits

- **95% faster** than manual assessments
- **Explainable AI** with source citations
- **Consistent scoring** across all vendors
- **Audit-ready** documentation
      `,
      category: 'features',
      difficulty: 'beginner',
      estimatedReadTime: 7,
      tags: ['fast-check', 'assessment', 'ai'],
      relatedTopics: ['getting-started-overview', 'risk-scoring'],
      videoUrl: 'https://example.com/fast-check-demo',
      steps: [
        {
          id: 'upload',
          title: 'Upload Documents',
          description: 'Drag and drop your compliance documents',
          tips: [
            'Supported formats: PDF, DOC, DOCX',
            'Maximum file size: 10MB',
            'Multiple files can be uploaded at once'
          ]
        },
        {
          id: 'analysis',
          title: 'Review AI Analysis',
          description: 'Examine the AI-generated risk assessment',
          tips: [
            'Check the confidence score',
            'Review source citations',
            'Look for missing compliance items'
          ]
        }
      ],
      faqs: [
        {
          question: 'How accurate is Fast Check?',
          answer: 'Fast Check has 89% accuracy compared to manual assessments, with continuous learning improving accuracy over time.',
          helpful: 15
        },
        {
          question: 'Can I use Fast Check for any vendor?',
          answer: 'Yes, Fast Check works with any vendor that has compliance documentation. It\'s especially effective for SaaS, cloud providers, and technology vendors.',
          helpful: 12
        }
      ]
    },
    {
      id: 'vendor-passport-intro',
      title: 'Vendor Passports: Reusable Compliance Profiles',
      description: 'Create and manage secure vendor compliance passports',
      content: `
# Vendor Passports: Reusable Compliance Profiles

Vendor Passports are secure, reusable compliance profiles that eliminate redundant assessments and create network effects across the vendor ecosystem.

## What are Vendor Passports?

Vendor Passports are comprehensive compliance profiles that:
- **Centralize** all compliance documentation
- **Standardize** risk assessment criteria
- **Enable** secure sharing with multiple customers
- **Update** automatically as compliance changes

## Benefits for Vendors

- **Reduce assessment burden** by up to 80%
- **One-time setup** for multiple customers
- **Real-time updates** when compliance changes
- **Professional presentation** of compliance posture

## Benefits for Customers

- **Faster onboarding** of new vendors
- **Consistent assessment** criteria
- **Real-time monitoring** of vendor compliance
- **Network effects** from shared assessments

## Security Features

- **End-to-end encryption** of all data
- **Granular access controls** and permissions
- **Audit trails** for all access and changes
- **Automatic data retention** policies
      `,
      category: 'features',
      difficulty: 'intermediate',
      estimatedReadTime: 8,
      tags: ['vendor-passport', 'compliance', 'sharing'],
      relatedTopics: ['getting-started-overview', 'passport-security'],
      steps: [
        {
          id: 'create',
          title: 'Create a Passport',
          description: 'Set up a new vendor passport',
          tips: [
            'Gather all compliance documents first',
            'Fill out all required fields',
            'Set appropriate sharing permissions'
          ]
        },
        {
          id: 'share',
          title: 'Share Securely',
          description: 'Control how and with whom you share passports',
          tips: [
            'Use password protection for sensitive data',
            'Set expiration dates for shared links',
            'Monitor access through audit logs'
          ]
        }
      ]
    },
    {
      id: 'risk-scoring',
      title: 'Understanding Risk Scoring',
      description: 'Learn how Project Sentinel calculates and interprets risk scores',
      content: `
# Understanding Risk Scoring

Project Sentinel uses a sophisticated AI-powered risk scoring system that provides consistent, explainable risk assessments across all vendors.

## Risk Score Components

### Overall Risk Score (0-100)
The overall risk score is a weighted combination of multiple factors:

- **Security Posture** (35%): Security controls and practices
- **Compliance Coverage** (30%): Framework compliance status
- **Data Protection** (20%): Data handling and privacy practices
- **Business Continuity** (15%): Disaster recovery and uptime

### Risk Levels
- **0-30**: Low Risk - Acceptable for most use cases
- **31-60**: Medium Risk - Acceptable with monitoring
- **61-80**: High Risk - Requires mitigation
- **81-100**: Critical Risk - Not recommended

## AI Analysis Process

1. **Document Processing**: Extract and analyze compliance documents
2. **Gap Analysis**: Identify missing or inadequate controls
3. **Risk Mapping**: Map gaps to potential business impact
4. **Scoring**: Calculate numerical risk scores
5. **Explanation**: Generate human-readable explanations

## Confidence Score

Each assessment includes a confidence score (0-100%) that indicates:
- **Data quality** and completeness
- **Document recency** and relevance
- **AI model** confidence in analysis

## Using Risk Scores

- **Vendor Selection**: Compare vendors objectively
- **Risk Monitoring**: Track changes over time
- **Compliance Reporting**: Demonstrate due diligence
- **Resource Allocation**: Focus on high-risk areas
      `,
      category: 'features',
      difficulty: 'intermediate',
      estimatedReadTime: 10,
      tags: ['risk-scoring', 'ai', 'analytics'],
      relatedTopics: ['fast-check-intro', 'risk-monitoring'],
      faqs: [
        {
          question: 'How often are risk scores updated?',
          answer: 'Risk scores are updated whenever new compliance documents are uploaded or when vendors update their information. Real-time monitoring can be set up for critical vendors.',
          helpful: 8
        }
      ]
    },
    {
      id: 'troubleshooting-common',
      title: 'Common Issues and Solutions',
      description: 'Troubleshoot common problems in Project Sentinel',
      content: `
# Common Issues and Solutions

This guide covers the most common issues users encounter and their solutions.

## Upload Issues

### Problem: Document upload fails
**Solutions:**
- Check file size (max 10MB)
- Ensure file format is supported (PDF, DOC, DOCX)
- Verify file is not corrupted
- Try a different browser

### Problem: Slow upload speed
**Solutions:**
- Check your internet connection
- Try uploading during off-peak hours
- Compress large files before uploading
- Clear browser cache and cookies

## Assessment Issues

### Problem: Analysis takes too long
**Solutions:**
- Large documents take longer to process
- Check system status for outages
- Try uploading smaller documents first
- Contact support if issue persists

### Problem: Low confidence score
**Solutions:**
- Upload more recent documents
- Provide additional compliance evidence
- Ensure documents are complete and legible
- Use the latest assessment templates

## Account Issues

### Problem: Cannot access features
**Solutions:**
- Verify your role and permissions
- Check if your subscription is active
- Clear browser cache and cookies
- Try logging in again

### Problem: Data not syncing
**Solutions:**
- Check internet connection
- Refresh the page
- Clear browser data
- Contact support if issue persists
      `,
      category: 'troubleshooting',
      difficulty: 'beginner',
      estimatedReadTime: 6,
      tags: ['troubleshooting', 'issues', 'support'],
      relatedTopics: ['getting-started-overview', 'contact-support']
    },
    {
      id: 'best-practices-tprm',
      title: 'TPRM Best Practices',
      description: 'Learn industry best practices for third-party risk management',
      content: `
# TPRM Best Practices

Implement these best practices to maximize the effectiveness of your third-party risk management program.

## 1. Risk-Based Approach

### Prioritize Vendors by Risk
- **Critical vendors**: Impact business operations if compromised
- **Important vendors**: Access sensitive data or systems
- **Standard vendors**: Limited access and impact

### Risk Assessment Frequency
- **Critical vendors**: Quarterly assessments
- **Important vendors**: Semi-annual assessments
- **Standard vendors**: Annual assessments

## 2. Comprehensive Due Diligence

### Document Collection
- **SOC 2 Reports**: Type I and II
- **ISO 27001**: Certification and scope
- **Privacy Policies**: Data handling practices
- **Business Continuity**: Disaster recovery plans
- **Insurance**: Cyber liability coverage

### Validation Techniques
- **Document verification**: Ensure authenticity
- **Reference checks**: Contact other customers
- **Site visits**: For critical vendors
- **Technical testing**: Vulnerability assessments

## 3. Continuous Monitoring

### Automated Monitoring
- **Compliance status**: Track certification expirations
- **Security posture**: Monitor for breaches
- **Financial health**: Watch for distress signals
- **Performance metrics**: SLA compliance

### Alert Thresholds
- **High priority**: Immediate notification (24 hours)
- **Medium priority**: Daily notification
- **Low priority**: Weekly summary

## 4. Vendor Management

### Relationship Management
- **Single point of contact**: For each vendor
- **Regular meetings**: Quarterly business reviews
- **Performance tracking**: SLA and KPI monitoring
- **Issue escalation**: Clear escalation paths

### Contract Management
- **Security clauses**: Data protection requirements
- **Audit rights**: Right to audit security practices
- **Termination clauses**: For security breaches
- **Data ownership**: Clear data ownership terms

## 5. Reporting and Documentation

### Stakeholder Reporting
- **Executive summary**: High-level risk overview
- **Detailed findings**: Technical risk analysis
- **Recommendations**: Actionable mitigation steps
- **Trend analysis**: Risk evolution over time

### Audit Preparation
- **Assessment records**: All risk assessments
- **Due diligence**: Vendor evaluation documents
- **Monitoring logs**: Continuous monitoring results
- **Incident reports**: Security incident documentation
      `,
      category: 'best-practices',
      difficulty: 'advanced',
      estimatedReadTime: 12,
      tags: ['best-practices', 'tprm', 'compliance'],
      relatedTopics: ['risk-scoring', 'vendor-management']
    }
  ];

  const openHelp = useCallback(() => setIsOpen(true), []);
  const closeHelp = useCallback(() => {
    setIsOpen(false);
    setCurrentTopic(null);
    setSearchQuery('');
  }, []);

  const searchHelp = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = helpTopics.filter(topic => 
      topic.title.toLowerCase().includes(query.toLowerCase()) ||
      topic.description.toLowerCase().includes(query.toLowerCase()) ||
      topic.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );

    setSearchResults(results);

    // Add to search history
    setUserSession(prev => ({
      ...prev,
      searchHistory: [query, ...prev.searchHistory.filter(q => q !== query)].slice(0, 10)
    }));
  }, []);

  const selectTopic = useCallback((topicId: string) => {
    const topic = helpTopics.find(t => t.id === topicId);
    setCurrentTopic(topic || null);
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  const toggleBookmark = useCallback((topicId: string) => {
    setUserSession(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.includes(topicId)
        ? prev.bookmarks.filter(id => id !== topicId)
        : [...prev.bookmarks, topicId]
    }));
  }, []);

  const markTopicComplete = useCallback((topicId: string) => {
    setUserSession(prev => ({
      ...prev,
      completedTopics: prev.completedTopics.includes(topicId)
        ? prev.completedTopics.filter(id => id !== topicId)
        : [...prev.completedTopics, topicId]
    }));
  }, []);

  const getTopicProgress = useCallback((topicId: string) => {
    // Simple progress calculation based on completion
    return userSession.completedTopics.includes(topicId) ? 100 : 0;
  }, [userSession.completedTopics]);

  const getRecommendedTopics = useCallback((): HelpTopic[] => {
    // Simple recommendation algorithm
    const completed = userSession.completedTopics;
    const bookmarked = userSession.bookmarks;
    
    return helpTopics
      .filter(topic => !completed.includes(topic.id))
      .sort((a, b) => {
        // Prioritize bookmarked topics
        if (bookmarked.includes(a.id) && !bookmarked.includes(b.id)) return -1;
        if (!bookmarked.includes(a.id) && bookmarked.includes(b.id)) return 1;
        
        // Then prioritize beginner topics
        if (a.difficulty === 'beginner' && b.difficulty !== 'beginner') return -1;
        if (a.difficulty !== 'beginner' && b.difficulty === 'beginner') return 1;
        
        return 0;
      })
      .slice(0, 5);
  }, [userSession.completedTopics, userSession.bookmarks]);

  const getContextualHelp = useCallback((context: string): HelpTopic[] => {
    // Return relevant help topics based on context
    const contextMap: Record<string, string[]> = {
      'fast-check': ['fast-check-intro', 'risk-scoring'],
      'vendor-passport': ['vendor-passport-intro', 'passport-security'],
      'dashboard': ['getting-started-overview', 'risk-monitoring'],
      'settings': ['troubleshooting-common', 'account-management'],
      'risk': ['risk-scoring', 'risk-monitoring'],
      'compliance': ['compliance-frameworks', 'audit-preparation']
    };

    const relevantIds = contextMap[context] || [];
    return helpTopics.filter(topic => relevantIds.includes(topic.id));
  }, []);

  const contextValue: HelpContextType = {
    isOpen,
    currentTopic,
    searchQuery,
    searchResults,
    bookmarks: userSession.bookmarks,
    completedTopics: userSession.completedTopics,
    openHelp,
    closeHelp,
    searchHelp,
    selectTopic,
    toggleBookmark,
    markTopicComplete,
    getTopicProgress,
    getRecommendedTopics,
    getContextualHelp
  };

  return (
    <HelpContext.Provider value={contextValue}>
      {children}
      
      {/* Help Button */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={openHelp}
          size="lg"
          className="rounded-full w-14 h-14 p-0 shadow-lg"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* Help Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex">
            {/* Sidebar */}
            <div className="w-80 border-r bg-gray-50 flex flex-col">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Help Center</h2>
                  <Button variant="ghost" size="sm" onClick={closeHelp}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search help..."
                    value={searchQuery}
                    onChange={(e) => searchHelp(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto">
                <Tabs defaultValue="browse" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="browse">Browse</TabsTrigger>
                    <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>

                  <TabsContent value="browse" className="mt-4">
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm text-gray-600 px-4">Categories</h3>
                      {['getting-started', 'features', 'troubleshooting', 'best-practices'].map(category => (
                        <div key={category} className="px-4 py-2">
                          <h4 className="font-medium text-sm capitalize mb-2">
                            {category.replace('-', ' ')}
                          </h4>
                          {helpTopics
                            .filter(topic => topic.category === category)
                            .map(topic => (
                              <div
                                key={topic.id}
                                className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                                onClick={() => selectTopic(topic.id)}
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${
                                    topic.difficulty === 'beginner' ? 'bg-green-500' :
                                    topic.difficulty === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}></div>
                                  <span className="text-sm">{topic.title}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {userSession.bookmarks.includes(topic.id) && (
                                    <BookmarkCheck className="h-3 w-3 text-blue-600" />
                                  )}
                                  <Clock className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">{topic.estimatedReadTime}m</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="bookmarks" className="mt-4">
                    <div className="space-y-2 px-4">
                      {userSession.bookmarks.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-8">
                          No bookmarks yet
                        </p>
                      ) : (
                        helpTopics
                          .filter(topic => userSession.bookmarks.includes(topic.id))
                          .map(topic => (
                            <div
                              key={topic.id}
                              className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                              onClick={() => selectTopic(topic.id)}
                            >
                              <div className="flex items-center gap-2">
                                <BookmarkCheck className="h-4 w-4 text-blue-600" />
                                <span className="text-sm">{topic.title}</span>
                              </div>
                              <Button variant="ghost" size="sm">
                                <ChevronRight className="h-3 w-3" />
                              </Button>
                            </div>
                          ))
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="mt-4">
                    <div className="space-y-2 px-4">
                      {userSession.searchHistory.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-8">
                          No search history yet
                        </p>
                      ) : (
                        userSession.searchHistory.map((query, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                            onClick={() => searchHelp(query)}
                          >
                            <span className="text-sm">{query}</span>
                            <Button variant="ghost" size="sm">
                              <Search className="h-3 w-3" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {currentTopic ? (
                <TopicContent 
                  topic={currentTopic} 
                  onBack={() => setCurrentTopic(null)}
                  isBookmarked={userSession.bookmarks.includes(currentTopic.id)}
                  isCompleted={userSession.completedTopics.includes(currentTopic.id)}
                  onBookmark={() => toggleBookmark(currentTopic.id)}
                  onComplete={() => markTopicComplete(currentTopic.id)}
                  progress={getTopicProgress(currentTopic.id)}
                />
              ) : searchQuery ? (
                <SearchResults 
                  results={searchResults}
                  query={searchQuery}
                  onSelectTopic={selectTopic}
                />
              ) : (
                <HelpHome 
                  recommendedTopics={getRecommendedTopics()}
                  onSelectTopic={selectTopic}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </HelpContext.Provider>
  );
}

// Topic Content Component
interface TopicContentProps {
  topic: HelpTopic;
  onBack: () => void;
  isBookmarked: boolean;
  isCompleted: boolean;
  onBookmark: () => void;
  onComplete: () => void;
  progress: number;
}

function TopicContent({ topic, onBack, isBookmarked, isCompleted, onBookmark, onComplete, progress }: TopicContentProps) {
  const [activeTab, setActiveTab] = useState('content');

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBookmark}>
              {isBookmarked ? <BookmarkCheck className="h-4 w-4 text-blue-600" /> : <Bookmark className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onComplete}>
              {isCompleted ? <CheckCircle className="h-4 w-4 text-green-600" /> : <CheckCircle className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{topic.title}</h1>
            <p className="text-gray-600 mb-4">{topic.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {topic.estimatedReadTime} min read
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                topic.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                topic.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {topic.difficulty}
              </div>
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                {topic.tags.join(', ')}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">Progress</div>
            <div className="w-24">
              <Progress value={progress} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="flex-1 overflow-y-auto p-6">
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: topic.content.replace(/\n/g, '<br>').replace(/#{1,6} /g, '<h3>').replace(/<h3>/g, '<h3 class="text-lg font-semibold mb-2 mt-4">') }} />
          </div>
          
          {topic.relatedTopics.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Related Topics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topic.relatedTopics.map(relatedId => (
                  <Card key={relatedId} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">
                            {helpTopics.find(t => t.id === relatedId)?.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {helpTopics.find(t => t.id === relatedId)?.description}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="steps" className="flex-1 overflow-y-auto p-6">
          {topic.steps ? (
            <div className="space-y-6">
              {topic.steps.map((step, index) => (
                <Card key={step.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                        {index + 1}
                      </div>
                      {step.title}
                    </CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                  {step.tips && (
                    <CardContent>
                      <h4 className="font-medium mb-2">Tips:</h4>
                      <ul className="space-y-1">
                        {step.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-2">
                            <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No step-by-step guide available for this topic.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="video" className="flex-1 overflow-y-auto p-6">
          {topic.videoUrl ? (
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Video Tutorial</h3>
                <p className="text-gray-600 mb-4">Watch this video to learn more about {topic.title}</p>
                <Button>
                  <Play className="h-4 w-4 mr-2" />
                  Play Video
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Video URL: {topic.videoUrl}
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No video available for this topic.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="faq" className="flex-1 overflow-y-auto p-6">
          {topic.faqs ? (
            <div className="space-y-4">
              {topic.faqs.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{faq.answer}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Helpful to {faq.helpful} users</span>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No FAQ available for this topic.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Search Results Component
interface SearchResultsProps {
  results: HelpTopic[];
  query: string;
  onSelectTopic: (topicId: string) => void;
}

function SearchResults({ results, query, onSelectTopic }: SearchResultsProps) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Search Results</h2>
          <span className="text-sm text-gray-600">{results.length} results for "{query}"</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        {results.length === 0 ? (
          <div className="text-center py-8">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No results found for "{query}"</p>
            <p className="text-sm text-gray-500">Try different keywords or browse categories</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map(topic => (
              <Card key={topic.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{topic.title}</h3>
                      <p className="text-gray-600 mb-3">{topic.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {topic.estimatedReadTime} min
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          topic.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                          topic.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {topic.difficulty}
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag className="h-4 w-4" />
                          {topic.tags.join(', ')}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Help Home Component
interface HelpHomeProps {
  recommendedTopics: HelpTopic[];
  onSelectTopic: (topicId: string) => void;
}

function HelpHome({ recommendedTopics, onSelectTopic }: HelpHomeProps) {
  const quickActions = [
    { icon: <Target className="h-6 w-6" />, title: 'Getting Started', description: 'New to Project Sentinel? Start here.', topic: 'getting-started-overview' },
    { icon: <Zap className="h-6 w-6" />, title: 'Fast Check', description: 'Learn about 2-minute assessments', topic: 'fast-check-intro' },
    { icon: <Globe className="h-6 w-6" />, title: 'Vendor Passports', description: 'Create reusable compliance profiles', topic: 'vendor-passport-intro' },
    { icon: <Shield className="h-6 w-6" />, title: 'Risk Scoring', description: 'Understand risk assessment', topic: 'risk-scoring' }
  ];

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold mb-2">How can we help you today?</h1>
        <p className="text-gray-600">Search for help, browse topics, or get started with our quick guides.</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map(action => (
              <Card key={action.title} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelectTopic(action.topic)}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {action.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommended Topics */}
        {recommendedTopics.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Recommended for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedTopics.map(topic => (
                <Card key={topic.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelectTopic(topic.id)}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{topic.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{topic.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{topic.estimatedReadTime} min read</span>
                      <Badge variant="outline">{topic.difficulty}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Popular Topics */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Popular Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {helpTopics.slice(0, 6).map(topic => (
              <Card key={topic.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelectTopic(topic.id)}>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{topic.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{topic.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{topic.estimatedReadTime} min read</span>
                    <Badge variant="outline">{topic.difficulty}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Contextual Help Component
interface ContextualHelpProps {
  context: string;
  children: ReactNode;
}

export function ContextualHelp({ context, children }: ContextualHelpProps) {
  const { getContextualHelp, openHelp } = useHelp();
  const [showHelp, setShowHelp] = useState(false);

  const relevantTopics = getContextualHelp(context);

  return (
    <div className="relative inline-block">
      {children}
      <Button
        variant="ghost"
        size="sm"
        className="ml-2"
        onClick={() => setShowHelp(!showHelp)}
      >
        <HelpCircle className="h-4 w-4" />
      </Button>
      
      {showHelp && relevantTopics.length > 0 && (
        <Card className="absolute z-10 w-80 mt-2 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Related Help</h4>
              <Button variant="ghost" size="sm" onClick={() => setShowHelp(false)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-2">
              {relevantTopics.slice(0, 3).map(topic => (
                <Button
                  key={topic.id}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-2"
                  onClick={() => {
                    openHelp();
                    setShowHelp(false);
                  }}
                >
                  <div>
                    <div className="font-medium text-sm">{topic.title}</div>
                    <div className="text-xs text-gray-600">{topic.description}</div>
                  </div>
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
              onClick={() => {
                openHelp();
                setShowHelp(false);
              }}
            >
              View All Help
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}