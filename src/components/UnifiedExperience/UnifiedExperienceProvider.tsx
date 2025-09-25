"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Target, 
  Users, 
  Shield, 
  Zap,
  BarChart3,
  Settings,
  Globe,
  Database,
  Brain,
  ArrowRight,
  X,
  Info,
  Lightbulb,
  TrendingUp,
  Award,
  Clock,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface UserJourney {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  steps: JourneyStep[];
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  estimatedTime: number;
  completedSteps: string[];
  currentStep?: string;
}

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  type: 'action' | 'learning' | 'configuration' | 'assessment';
  required: boolean;
  component?: string;
  data?: any;
  dependencies?: string[];
}

interface ConnectedFeature {
  id: string;
  name: string;
  description: string;
  category: 'assessment' | 'compliance' | 'vendor' | 'analytics' | 'tools';
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  progress: number;
  prerequisites?: string[];
  benefits: string[];
  icon: ReactNode;
  color: string;
}

interface UserProgress {
  userId: string;
  overallProgress: number;
  completedFeatures: string[];
  activeJourneys: string[];
  unlockedFeatures: string[];
  achievements: Achievement[];
  lastActivity: string;
  sessionCount: number;
  timeSpent: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  unlockedAt: string;
  category: 'milestone' | 'skill' | 'exploration' | 'efficiency';
}

interface UnifiedExperienceContextType {
  userProgress: UserProgress | null;
  journeys: UserJourney[];
  features: ConnectedFeature[];
  currentJourney: UserJourney | null;
  startJourney: (journeyId: string) => void;
  completeStep: (journeyId: string, stepId: string, data?: any) => void;
  unlockFeature: (featureId: string) => void;
  updateProgress: (progress: Partial<UserProgress>) => void;
  getRecommendedActions: () => RecommendedAction[];
}

interface RecommendedAction {
  id: string;
  type: 'journey' | 'feature' | 'learning';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
  action: () => void;
}

const UnifiedExperienceContext = createContext<UnifiedExperienceContextType | null>(null);

export const useUnifiedExperience = () => {
  const context = useContext(UnifiedExperienceContext);
  if (!context) {
    throw new Error('useUnifiedExperience must be used within UnifiedExperienceProvider');
  }
  return context;
};

interface UnifiedExperienceProviderProps {
  children: ReactNode;
  userId: string;
}

export function UnifiedExperienceProvider({ children, userId }: UnifiedExperienceProviderProps) {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [currentJourney, setCurrentJourney] = useState<UserJourney | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Define the user journeys
  const journeys: UserJourney[] = [
    {
      id: 'getting_started',
      title: 'Getting Started',
      description: 'Learn the basics and set up your account',
      icon: <Sparkles className="h-5 w-5" />,
      progress: 0,
      status: 'not_started',
      estimatedTime: 10,
      completedSteps: [],
      steps: [
        {
          id: 'welcome',
          title: 'Welcome to Project Sentinel',
          description: 'Discover the power of AI-powered TPRM',
          type: 'learning',
          required: true
        },
        {
          id: 'role_setup',
          title: 'Set Up Your Role',
          description: 'Configure your role and permissions',
          type: 'configuration',
          required: true
        },
        {
          id: 'organization_setup',
          title: 'Configure Organization',
          description: 'Set up your organization details',
          type: 'configuration',
          required: true
        },
        {
          id: 'preferences',
          title: 'Customize Experience',
          description: 'Set your preferences and notifications',
          type: 'configuration',
          required: false
        }
      ]
    },
    {
      id: 'first_assessment',
      title: 'First Risk Assessment',
      description: 'Complete your first vendor risk assessment',
      icon: <Target className="h-5 w-5" />,
      progress: 0,
      status: 'not_started',
      estimatedTime: 15,
      completedSteps: [],
      steps: [
        {
          id: 'learn_fast_check',
          title: 'Learn Fast Check',
          description: 'Understand how Fast Check works',
          type: 'learning',
          required: true
        },
        {
          id: 'upload_document',
          title: 'Upload Document',
          description: 'Upload your first compliance document',
          type: 'action',
          required: true
        },
        {
          id: 'review_analysis',
          title: 'Review AI Analysis',
          description: 'Examine the AI-generated risk assessment',
          type: 'assessment',
          required: true
        },
        {
          id: 'make_decision',
          title: 'Make Decision',
          description: 'Make your first vendor decision',
          type: 'action',
          required: true
        }
      ]
    },
    {
      id: 'vendor_passport',
      title: 'Vendor Passport Mastery',
      description: 'Create and manage vendor passports',
      icon: <Globe className="h-5 w-5" />,
      progress: 0,
      status: 'not_started',
      estimatedTime: 20,
      completedSteps: [],
      steps: [
        {
          id: 'understand_passports',
          title: 'Understand Vendor Passports',
          description: 'Learn about vendor passport benefits',
          type: 'learning',
          required: true
        },
        {
          id: 'create_passport',
          title: 'Create First Passport',
          description: 'Create your first vendor passport',
          type: 'action',
          required: true
        },
        {
          id: 'share_passport',
          title: 'Share Passport',
          description: 'Learn how to share passports securely',
          type: 'action',
          required: true
        },
        {
          id: 'manage_passports',
          title: 'Manage Multiple Passports',
          description: 'Organize and manage multiple passports',
          type: 'configuration',
          required: false
        }
      ]
    },
    {
      id: 'advanced_features',
      title: 'Advanced Features',
      description: 'Explore advanced analytics and tools',
      icon: <Brain className="h-5 w-5" />,
      progress: 0,
      status: 'not_started',
      estimatedTime: 30,
      completedSteps: [],
      steps: [
        {
          id: 'dashboard_navigation',
          title: 'Master Dashboards',
          description: 'Learn to navigate all dashboards',
          type: 'learning',
          required: true
        },
        {
          id: 'risk_analytics',
          title: 'Risk Analytics',
          description: 'Use advanced risk analytics tools',
          type: 'assessment',
          required: true
        },
        {
          id: 'compliance_tracking',
          title: 'Compliance Tracking',
          description: 'Track compliance across frameworks',
          type: 'configuration',
          required: true
        },
        {
          id: 'integration_setup',
          title: 'Set Up Integrations',
          description: 'Configure external integrations',
          type: 'configuration',
          required: false
        }
      ]
    }
  ];

  // Define connected features
  const features: ConnectedFeature[] = [
    {
      id: 'fast_check',
      name: 'Fast Check',
      description: '2-minute risk assessments',
      category: 'assessment',
      status: 'available',
      progress: 0,
      icon: <Zap className="h-5 w-5" />,
      color: 'text-blue-600',
      benefits: ['Reduce assessment time by 95%', 'AI-powered analysis', 'Immediate results']
    },
    {
      id: 'vendor_passport',
      name: 'Vendor Passport',
      description: 'Secure vendor profiles',
      category: 'vendor',
      status: 'locked',
      progress: 0,
      prerequisites: ['getting_started'],
      icon: <Globe className="h-5 w-5" />,
      color: 'text-green-600',
      benefits: ['Reusable compliance data', 'Secure sharing', 'Network effects']
    },
    {
      id: 'risk_dashboard',
      name: 'Risk Analytics',
      description: 'Advanced risk analysis',
      category: 'analytics',
      status: 'locked',
      progress: 0,
      prerequisites: ['fast_check'],
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'text-purple-600',
      benefits: ['Real-time risk monitoring', 'Trend analysis', 'Predictive insights']
    },
    {
      id: 'compliance_hub',
      name: 'Compliance Hub',
      description: 'Multi-framework tracking',
      category: 'compliance',
      status: 'locked',
      progress: 0,
      prerequisites: ['getting_started'],
      icon: <Shield className="h-5 w-5" />,
      color: 'text-orange-600',
      benefits: ['SOC2, ISO27001, GDPR', 'Automated tracking', 'Audit ready']
    },
    {
      id: 'repository_monitor',
      name: 'Repository Monitor',
      description: 'Development progress tracking',
      category: 'tools',
      status: 'locked',
      progress: 0,
      prerequisites: ['advanced_features'],
      icon: <Database className="h-5 w-5" />,
      color: 'text-indigo-600',
      benefits: ['GitHub integration', 'Progress tracking', 'Developer insights']
    }
  ];

  // Initialize user progress
  useEffect(() => {
    const initializeProgress = () => {
      const progress: UserProgress = {
        userId,
        overallProgress: 0,
        completedFeatures: [],
        activeJourneys: [],
        unlockedFeatures: ['fast_check'],
        achievements: [],
        lastActivity: new Date().toISOString(),
        sessionCount: 1,
        timeSpent: 0
      };
      
      setUserProgress(progress);
    };

    initializeProgress();
  }, [userId]);

  const startJourney = (journeyId: string) => {
    const journey = journeys.find(j => j.id === journeyId);
    if (!journey) return;

    const updatedJourney = {
      ...journey,
      status: 'in_progress' as const,
      currentStep: journey.steps[0].id
    };

    setCurrentJourney(updatedJourney);

    if (userProgress) {
      const updatedProgress = {
        ...userProgress,
        activeJourneys: [...userProgress.activeJourneys, journeyId],
        lastActivity: new Date().toISOString()
      };
      setUserProgress(updatedProgress);
    }
  };

  const completeStep = (journeyId: string, stepId: string, data?: any) => {
    if (!userProgress) return;

    const journey = journeys.find(j => j.id === journeyId);
    if (!journey) return;

    const stepIndex = journey.steps.findIndex(s => s.id === stepId);
    if (stepIndex === -1) return;

    // Mark step as completed
    const completedSteps = [...journey.completedSteps, stepId];
    const progress = Math.round((completedSteps.length / journey.steps.length) * 100);

    // Find next step
    const nextStep = journey.steps.find((s, index) => 
      index > stepIndex && !completedSteps.includes(s.id)
    );

    const updatedJourney = {
      ...journey,
      completedSteps,
      progress,
      currentStep: nextStep?.id,
      status: progress === 100 ? 'completed' : 'in_progress'
    };

    setCurrentJourney(updatedJourney);

    // Update user progress
    const updatedProgress = {
      ...userProgress,
      overallProgress: calculateOverallProgress(journeys, updatedJourney),
      lastActivity: new Date().toISOString()
    };

    // Check for feature unlocks
    const newlyUnlocked = checkFeatureUnlocks(completedSteps, journeyId);
    if (newlyUnlocked.length > 0) {
      updatedProgress.unlockedFeatures = [...updatedProgress.unlockedFeatures, ...newlyUnlocked];
    }

    // Check for achievements
    const newAchievements = checkAchievements(completedSteps, journeyId, progress);
    if (newAchievements.length > 0) {
      updatedProgress.achievements = [...updatedProgress.achievements, ...newAchievements];
    }

    setUserProgress(updatedProgress);

    // Auto-start next journey if current is completed
    if (progress === 100) {
      const nextJourney = journeys.find(j => 
        j.id !== journeyId && 
        !updatedProgress.activeJourneys.includes(j.id) &&
        j.status === 'not_started'
      );
      
      if (nextJourney) {
        setTimeout(() => startJourney(nextJourney.id), 1000);
      }
    }
  };

  const unlockFeature = (featureId: string) => {
    if (!userProgress) return;

    const feature = features.find(f => f.id === featureId);
    if (!feature) return;

    // Check if prerequisites are met
    const prerequisitesMet = !feature.prerequisites || 
      feature.prerequisites.every(prereq => userProgress.unlockedFeatures.includes(prereq));

    if (!prerequisitesMet) return;

    const updatedProgress = {
      ...userProgress,
      unlockedFeatures: [...userProgress.unlockedFeatures, featureId],
      lastActivity: new Date().toISOString()
    };

    setUserProgress(updatedProgress);
  };

  const updateProgress = (progress: Partial<UserProgress>) => {
    if (!userProgress) return;
    setUserProgress({ ...userProgress, ...progress });
  };

  const getRecommendedActions = (): RecommendedAction[] => {
    const actions: RecommendedAction[] = [];

    if (!userProgress) return actions;

    // Recommend starting first journey
    if (userProgress.activeJourneys.length === 0) {
      actions.push({
        id: 'start_getting_started',
        type: 'journey',
        title: 'Start Your Journey',
        description: 'Begin with the getting started journey to learn the basics',
        priority: 'high',
        estimatedTime: 10,
        action: () => startJourney('getting_started')
      });
    }

    // Recommend continuing current journey
    if (currentJourney && currentJourney.status === 'in_progress') {
      actions.push({
        id: 'continue_journey',
        type: 'journey',
        title: `Continue ${currentJourney.title}`,
        description: `Complete your current step: ${currentJourney.steps.find(s => s.id === currentJourney.currentStep)?.title}`,
        priority: 'high',
        estimatedTime: 5,
        action: () => {}
      });
    }

    // Recommend trying Fast Check
    if (userProgress.unlockedFeatures.includes('fast_check') && !userProgress.completedFeatures.includes('fast_check')) {
      actions.push({
        id: 'try_fast_check',
        type: 'feature',
        title: 'Try Fast Check',
        description: 'Experience the power of 2-minute risk assessments',
        priority: 'medium',
        estimatedTime: 5,
        action: () => {}
      });
    }

    return actions;
  };

  const calculateOverallProgress = (allJourneys: UserJourney[], currentJourney: UserJourney): number => {
    const totalSteps = allJourneys.reduce((sum, journey) => sum + journey.steps.length, 0);
    const completedSteps = allJourneys.reduce((sum, journey) => {
      if (journey.id === currentJourney.id) {
        return sum + currentJourney.completedSteps.length;
      }
      return sum + journey.completedSteps.length;
    }, 0);
    
    return Math.round((completedSteps / totalSteps) * 100);
  };

  const checkFeatureUnlocks = (completedSteps: string[], journeyId: string): string[] => {
    const unlocks: string[] = [];

    // Unlock vendor passport after getting started
    if (journeyId === 'getting_started' && completedSteps.includes('organization_setup')) {
      unlocks.push('vendor_passport');
    }

    // Unlock risk dashboard after first fast check
    if (journeyId === 'first_assessment' && completedSteps.includes('make_decision')) {
      unlocks.push('risk_dashboard');
    }

    // Unlock compliance hub after getting started
    if (journeyId === 'getting_started' && completedSteps.includes('role_setup')) {
      unlocks.push('compliance_hub');
    }

    return unlocks;
  };

  const checkAchievements = (completedSteps: string[], journeyId: string, progress: number): Achievement[] => {
    const achievements: Achievement[] = [];

    // First steps achievement
    if (completedSteps.length === 1) {
      achievements.push({
        id: 'first_steps',
        title: 'First Steps',
        description: 'Completed your first journey step',
        icon: <Award className="h-4 w-4" />,
        unlockedAt: new Date().toISOString(),
        category: 'milestone'
      });
    }

    // Journey completion achievement
    if (progress === 100) {
      achievements.push({
        id: `${journeyId}_completed`,
        title: `${journeys.find(j => j.id === journeyId)?.title} Master`,
        description: `Completed the ${journeys.find(j => j.id === journeyId)?.title} journey`,
        icon: <TrendingUp className="h-4 w-4" />,
        unlockedAt: new Date().toISOString(),
        category: 'milestone'
      });
    }

    return achievements;
  };

  const contextValue: UnifiedExperienceContextType = {
    userProgress,
    journeys,
    features,
    currentJourney,
    startJourney,
    completeStep,
    unlockFeature,
    updateProgress,
    getRecommendedActions
  };

  return (
    <UnifiedExperienceContext.Provider value={contextValue}>
      {showOnboarding && userProgress && (
        <UnifiedOnboarding 
          userProgress={userProgress}
          journeys={journeys}
          features={features}
          recommendedActions={getRecommendedActions()}
          onStartJourney={startJourney}
          onClose={() => setShowOnboarding(false)}
        />
      )}
      {children}
    </UnifiedExperienceContext.Provider>
  );
}

// Unified Onboarding Component
interface UnifiedOnboardingProps {
  userProgress: UserProgress;
  journeys: UserJourney[];
  features: ConnectedFeature[];
  recommendedActions: RecommendedAction[];
  onStartJourney: (journeyId: string) => void;
  onClose: () => void;
}

function UnifiedOnboarding({
  userProgress,
  journeys,
  features,
  recommendedActions,
  onStartJourney,
  onClose
}: UnifiedOnboardingProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Welcome to Project Sentinel</h2>
                <p className="text-gray-600">Your unified TPRM experience starts here</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="journeys">Journeys</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="actions">Next Steps</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Progress</span>
                        <span>{userProgress.overallProgress}%</span>
                      </div>
                      <Progress value={userProgress.overallProgress} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Active Journeys</span>
                        <div className="font-medium">{userProgress.activeJourneys.length}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Unlocked Features</span>
                        <div className="font-medium">{userProgress.unlockedFeatures.length}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Quick Start
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Get started with your first journey to unlock the full potential of Project Sentinel.
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={() => onStartJourney('getting_started')}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Getting Started
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="journeys" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {journeys.map((journey) => (
                <Card key={journey.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {journey.icon}
                        <CardTitle className="text-lg">{journey.title}</CardTitle>
                      </div>
                      <Badge variant={journey.status === 'completed' ? 'default' : 'secondary'}>
                        {journey.status}
                      </Badge>
                    </div>
                    <CardDescription>{journey.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{journey.progress}%</span>
                        </div>
                        <Progress value={journey.progress} />
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{journey.steps.length} steps</span>
                        <span>{journey.estimatedTime} min</span>
                      </div>
                      <Button 
                        className="w-full" 
                        variant={journey.status === 'not_started' ? 'default' : 'outline'}
                        onClick={() => onStartJourney(journey.id)}
                      >
                        {journey.status === 'not_started' ? 'Start Journey' : 
                         journey.status === 'in_progress' ? 'Continue' : 'Review'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="features" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature) => (
                <Card key={feature.id} className={feature.status === 'locked' ? 'opacity-50' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg bg-gray-100 ${feature.color}`}>
                        {feature.icon}
                      </div>
                      <Badge variant={
                        feature.status === 'available' ? 'default' :
                        feature.status === 'locked' ? 'secondary' : 'outline'
                      }>
                        {feature.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.name}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Mastery</span>
                          <span>{feature.progress}%</span>
                        </div>
                        <Progress value={feature.progress} />
                      </div>
                      <div className="text-xs text-gray-600">
                        <div className="font-medium mb-1">Benefits:</div>
                        <ul className="space-y-1">
                          {feature.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="actions" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recommended Next Steps</h3>
              {recommendedActions.map((action) => (
                <Card key={action.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{action.title}</h4>
                        <p className="text-sm text-gray-600">{action.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {action.estimatedTime} min
                          </span>
                          <Badge variant={action.priority === 'high' ? 'destructive' : 'secondary'}>
                            {action.priority}
                          </Badge>
                        </div>
                      </div>
                      <Button onClick={action.action}>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              You can always access this guide from the help menu
            </p>
            <Button onClick={onClose}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}