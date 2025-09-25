"use client";

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Trophy, 
  Star, 
  Award, 
  Target, 
  TrendingUp, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  Shield,
  Globe,
  Database,
  Brain,
  BarChart3,
  Users,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Filter,
  Search,
  ChevronRight,
  ChevronLeft,
  ThumbsUp,
  Gift,
  Sparkles,
  Rocket,
  Flag,
  CheckSquare,
  BookOpen,
  Wrench,
  Lightbulb,
  MessageSquare,
  Share2,
  Download,
  ExternalLink,
  X,
  Fire
} from 'lucide-react';

interface UserProgress {
  userId: string;
  overallProgress: number;
  level: number;
  experience: number;
  achievements: Achievement[];
  completedFeatures: string[];
  activeJourneys: string[];
  unlockedFeatures: string[];
  sessionCount: number;
  timeSpent: number;
  lastActivity: string;
  streakDays: number;
  weeklyGoals: WeeklyGoal[];
  skillProgress: SkillProgress[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  category: 'milestone' | 'skill' | 'exploration' | 'efficiency' | 'social';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string;
  progress: number;
  maxProgress: number;
}

interface WeeklyGoal {
  id: string;
  title: string;
  description: string;
  type: 'assessments' | 'vendors' | 'learning' | 'sharing';
  target: number;
  current: number;
  unit: string;
  deadline: string;
  completed: boolean;
  reward: string;
}

interface SkillProgress {
  skill: string;
  level: number;
  experience: number;
  maxExperience: number;
  category: 'technical' | 'business' | 'analytical' | 'strategic';
  description: string;
}

interface FeatureProgress {
  featureId: string;
  featureName: string;
  category: string;
  progress: number;
  unlocked: boolean;
  lastUsed: string;
  usageCount: number;
  masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface ProgressContextType {
  userProgress: UserProgress | null;
  featureProgress: FeatureProgress[];
  updateFeatureUsage: (featureId: string, usageData?: any) => void;
  completeAchievement: (achievementId: string) => void;
  updateWeeklyGoal: (goalId: string, progress: number) => void;
  addExperience: (amount: number, skill?: string) => void;
  getSkillLevel: (skill: string) => number;
  getFeatureMastery: (featureId: string) => string;
  getProgressInsights: () => ProgressInsight[];
  exportProgress: () => string;
}

interface ProgressInsight {
  type: 'achievement' | 'milestone' | 'recommendation' | 'warning';
  title: string;
  description: string;
  action?: () => void;
  priority: 'low' | 'medium' | 'high';
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
};

interface ProgressProviderProps {
  children: ReactNode;
  userId: string;
}

export function ProgressProvider({ children, userId }: ProgressProviderProps) {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [featureProgress, setFeatureProgress] = useState<FeatureProgress[]>([]);
  const [showProgress, setShowProgress] = useState(false);

  // Initialize user progress
  useEffect(() => {
    const initializeProgress = () => {
      const progress: UserProgress = {
        userId,
        overallProgress: 0,
        level: 1,
        experience: 0,
        achievements: [
          {
            id: 'welcome',
            title: 'Welcome Aboard',
            description: 'Joined Project Sentinel',
            icon: <Gift className="h-5 w-5" />,
            category: 'milestone',
            rarity: 'common',
            unlockedAt: new Date().toISOString(),
            progress: 1,
            maxProgress: 1
          }
        ],
        completedFeatures: [],
        activeJourneys: [],
        unlockedFeatures: ['fast_check'],
        sessionCount: 1,
        timeSpent: 0,
        lastActivity: new Date().toISOString(),
        streakDays: 1,
        weeklyGoals: [
          {
            id: 'weekly_assessments',
            title: 'Complete Assessments',
            description: 'Complete 5 vendor assessments this week',
            type: 'assessments',
            target: 5,
            current: 0,
            unit: 'assessments',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            completed: false,
            reward: 'Risk Analyst Badge'
          },
          {
            id: 'weekly_learning',
            title: 'Learning Journey',
            description: 'Complete 2 learning modules this week',
            type: 'learning',
            target: 2,
            current: 0,
            unit: 'modules',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            completed: false,
            reward: 'Knowledge Seeker Badge'
          }
        ],
        skillProgress: [
          {
            skill: 'Risk Assessment',
            level: 1,
            experience: 0,
            maxExperience: 100,
            category: 'analytical',
            description: 'Ability to assess vendor risk effectively'
          },
          {
            skill: 'Compliance Management',
            level: 1,
            experience: 0,
            maxExperience: 100,
            category: 'business',
            description: 'Understanding and managing compliance requirements'
          },
          {
            skill: 'Technical Analysis',
            level: 1,
            experience: 0,
            maxExperience: 100,
            category: 'technical',
            description: 'Technical skills for security and compliance analysis'
          },
          {
            skill: 'Strategic Planning',
            level: 1,
            experience: 0,
            maxExperience: 100,
            category: 'strategic',
            description: 'Strategic approach to TPRM program management'
          }
        ]
      };

      const features: FeatureProgress[] = [
        {
          featureId: 'fast_check',
          featureName: 'Fast Check',
          category: 'Assessment',
          progress: 0,
          unlocked: true,
          lastUsed: '',
          usageCount: 0,
          masteryLevel: 'beginner'
        },
        {
          featureId: 'vendor_passport',
          featureName: 'Vendor Passport',
          category: 'Vendor Management',
          progress: 0,
          unlocked: false,
          lastUsed: '',
          usageCount: 0,
          masteryLevel: 'beginner'
        },
        {
          featureId: 'risk_dashboard',
          featureName: 'Risk Analytics',
          category: 'Analytics',
          progress: 0,
          unlocked: false,
          lastUsed: '',
          usageCount: 0,
          masteryLevel: 'beginner'
        },
        {
          featureId: 'compliance_hub',
          featureName: 'Compliance Hub',
          category: 'Compliance',
          progress: 0,
          unlocked: false,
          lastUsed: '',
          usageCount: 0,
          masteryLevel: 'beginner'
        },
        {
          featureId: 'repository_monitor',
          featureName: 'Repository Monitor',
          category: 'Tools',
          progress: 0,
          unlocked: false,
          lastUsed: '',
          usageCount: 0,
          masteryLevel: 'beginner'
        }
      ];

      setUserProgress(progress);
      setFeatureProgress(features);
    };

    initializeProgress();
  }, [userId]);

  const updateFeatureUsage = useCallback((featureId: string, usageData?: any) => {
    if (!userProgress) return;

    setFeatureProgress(prev => 
      prev.map(feature => {
        if (feature.featureId === featureId) {
          const newUsageCount = feature.usageCount + 1;
          const newProgress = Math.min(100, feature.progress + 10);
          
          // Determine mastery level based on usage and progress
          let masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert' = 'beginner';
          if (newUsageCount >= 50 && newProgress >= 75) masteryLevel = 'expert';
          else if (newUsageCount >= 25 && newProgress >= 50) masteryLevel = 'advanced';
          else if (newUsageCount >= 10 && newProgress >= 25) masteryLevel = 'intermediate';

          return {
            ...feature,
            progress: newProgress,
            usageCount: newUsageCount,
            lastUsed: new Date().toISOString(),
            masteryLevel
          };
        }
        return feature;
      })
    );

    // Add experience for feature usage
    addExperience(10);

    // Check for usage-based achievements
    const feature = featureProgress.find(f => f.featureId === featureId);
    if (feature && feature.usageCount + 1 === 10) {
      completeAchievement(`first_${featureId}_usage`);
    }
  }, [userProgress, featureProgress, addExperience, completeAchievement]);

  const completeAchievement = useCallback((achievementId: string) => {
    if (!userProgress) return;

    const achievements: Record<string, Achievement> = {
      first_fast_check_usage: {
        id: 'first_fast_check_usage',
        title: 'Fast Check User',
        description: 'Used Fast Check for the first time',
        icon: <Zap className="h-5 w-5" />,
        category: 'skill',
        rarity: 'common',
        unlockedAt: new Date().toISOString(),
        progress: 1,
        maxProgress: 1
      },
      first_vendor_passport_usage: {
        id: 'first_vendor_passport_usage',
        title: 'Passport Creator',
        description: 'Created your first vendor passport',
        icon: <Globe className="h-5 w-5" />,
        category: 'skill',
        rarity: 'common',
        unlockedAt: new Date().toISOString(),
        progress: 1,
        maxProgress: 1
      },
      weekly_assessments_complete: {
        id: 'weekly_assessments_complete',
        title: 'Assessment Master',
        description: 'Completed weekly assessment goal',
        icon: <Target className="h-5 w-5" />,
        category: 'milestone',
        rarity: 'rare',
        unlockedAt: new Date().toISOString(),
        progress: 1,
        maxProgress: 1
      },
      skill_level_5: {
        id: 'skill_level_5',
        title: 'Rising Expert',
        description: 'Reached level 5 in any skill',
        icon: <TrendingUp className="h-5 w-5" />,
        category: 'milestone',
        rarity: 'rare',
        unlockedAt: new Date().toISOString(),
        progress: 1,
        maxProgress: 1
      },
      feature_master: {
        id: 'feature_master',
        title: 'Feature Master',
        description: 'Achieved expert level in any feature',
        icon: <Award className="h-5 w-5" />,
        category: 'skill',
        rarity: 'epic',
        unlockedAt: new Date().toISOString(),
        progress: 1,
        maxProgress: 1
      }
    };

    const achievement = achievements[achievementId];
    if (achievement && !userProgress.achievements.some(a => a.id === achievementId)) {
      setUserProgress(prev => ({
        ...prev!,
        achievements: [...prev!.achievements, achievement],
        experience: prev!.experience + 50
      }));
    }
  }, [userProgress]);

  const updateWeeklyGoal = useCallback((goalId: string, progress: number) => {
    if (!userProgress) return;

    setUserProgress(prev => ({
      ...prev!,
      weeklyGoals: prev!.weeklyGoals.map(goal => {
        if (goal.id === goalId) {
          const newCurrent = Math.min(goal.target, goal.current + progress);
          const completed = newCurrent >= goal.target;
          
          if (completed && !goal.completed) {
            completeAchievement('weekly_assessments_complete');
          }
          
          return {
            ...goal,
            current: newCurrent,
            completed
          };
        }
        return goal;
      })
    }));
  }, [userProgress, completeAchievement]);

  const addExperience = useCallback((amount: number, skill?: string) => {
    if (!userProgress) return;

    setUserProgress(prev => {
      const newExperience = prev!.experience + amount;
      const newLevel = Math.floor(newExperience / 100) + 1;

      let updatedSkillProgress = prev!.skillProgress;
      
      if (skill) {
        updatedSkillProgress = prev!.skillProgress.map(skillProgress => {
          if (skillProgress.skill === skill) {
            const newSkillExperience = skillProgress.experience + amount;
            const newSkillLevel = Math.floor(newSkillExperience / skillProgress.maxExperience) + 1;
            
            if (newSkillLevel > skillProgress.level) {
              completeAchievement(`skill_level_${newSkillLevel}`);
            }
            
            return {
              ...skillProgress,
              experience: newSkillExperience,
              level: newSkillLevel
            };
          }
          return skillProgress;
        });
      }

      // Calculate overall progress
      const totalFeatures = featureProgress.length;
      const unlockedFeatures = featureProgress.filter(f => f.unlocked).length;
      const completedGoals = prev!.weeklyGoals.filter(g => g.completed).length;
      const totalGoals = prev!.weeklyGoals.length;
      
      const overallProgress = Math.round(
        ((unlockedFeatures / totalFeatures) * 0.4 +
         (completedGoals / totalGoals) * 0.3 +
         (newLevel / 10) * 0.3) * 100
      );

      return {
        ...prev!,
        experience: newExperience,
        level: newLevel,
        overallProgress,
        skillProgress: updatedSkillProgress,
        lastActivity: new Date().toISOString()
      };
    });
  }, [userProgress, featureProgress, completeAchievement]);

  const getSkillLevel = useCallback((skill: string) => {
    if (!userProgress) return 1;
    const skillProgress = userProgress.skillProgress.find(s => s.skill === skill);
    return skillProgress?.level || 1;
  }, [userProgress]);

  const getFeatureMastery = useCallback((featureId: string) => {
    const feature = featureProgress.find(f => f.featureId === featureId);
    return feature?.masteryLevel || 'beginner';
  }, [featureProgress]);

  const getProgressInsights = useCallback((): ProgressInsight[] => {
    if (!userProgress) return [];

    const insights: ProgressInsight[] = [];

    // Achievement insights
    const recentAchievements = userProgress.achievements.filter(a => 
      new Date(a.unlockedAt).getTime() > Date.now() - 24 * 60 * 60 * 1000
    );
    
    if (recentAchievements.length > 0) {
      insights.push({
        type: 'achievement',
        title: 'New Achievement Unlocked!',
        description: `You've earned "${recentAchievements[0].title}"`,
        priority: 'high'
      });
    }

    // Level up insights
    if (userProgress.experience >= userProgress.level * 100 - 10) {
      insights.push({
        type: 'milestone',
        title: 'Level Up Soon!',
        description: `You're close to reaching level ${userProgress.level + 1}`,
        priority: 'medium'
      });
    }

    // Goal completion insights
    const activeGoals = userProgress.weeklyGoals.filter(g => !g.completed);
    const nearCompletionGoals = activeGoals.filter(g => g.current >= g.target * 0.8);
    
    if (nearCompletionGoals.length > 0) {
      insights.push({
        type: 'recommendation',
        title: 'Almost There!',
        description: `You're close to completing "${nearCompletionGoals[0].title}"`,
        priority: 'medium',
        action: () => {}
      });
    }

    // Feature usage insights
    const underusedFeatures = featureProgress.filter(f => f.unlocked && f.usageCount < 5);
    if (underusedFeatures.length > 0) {
      insights.push({
        type: 'recommendation',
        title: 'Try New Features',
        description: `You haven't used ${underusedFeatures[0].featureName} much lately`,
        priority: 'low',
        action: () => {}
      });
    }

    // Streak insights
    if (userProgress.streakDays >= 7) {
      insights.push({
        type: 'achievement',
        title: 'Week Streak!',
        description: `You've been active for ${userProgress.streakDays} days in a row`,
        priority: 'high'
      });
    }

    return insights;
  }, [userProgress, featureProgress]);

  const exportProgress = useCallback(() => {
    if (!userProgress) return '';

    const exportData = {
      userProgress,
      featureProgress,
      exportDate: new Date().toISOString(),
      summary: {
        totalAchievements: userProgress.achievements.length,
        totalFeatures: featureProgress.length,
        unlockedFeatures: featureProgress.filter(f => f.unlocked).length,
        averageSkillLevel: Math.round(
          userProgress.skillProgress.reduce((sum, skill) => sum + skill.level, 0) / userProgress.skillProgress.length
        )
      }
    };

    return JSON.stringify(exportData, null, 2);
  }, [userProgress, featureProgress]);

  const contextValue: ProgressContextType = {
    userProgress,
    featureProgress,
    updateFeatureUsage,
    completeAchievement,
    updateWeeklyGoal,
    addExperience,
    getSkillLevel,
    getFeatureMastery,
    getProgressInsights,
    exportProgress
  };

  return (
    <ProgressContext.Provider value={contextValue}>
      {children}
      
      {/* Progress Summary Button */}
      <div className="fixed bottom-4 right-20 z-50">
        <Button
          onClick={() => setShowProgress(!showProgress)}
          size="lg"
          className="rounded-full w-14 h-14 p-0 shadow-lg"
        >
          <Trophy className="h-6 w-6" />
        </Button>
      </div>

      {/* Progress Panel */}
      {showProgress && userProgress && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <ProgressPanel 
              userProgress={userProgress}
              featureProgress={featureProgress}
              insights={getProgressInsights()}
              onClose={() => setShowProgress(false)}
              onExport={exportProgress}
            />
          </div>
        </div>
      )}
    </ProgressContext.Provider>
  );
}

// Progress Panel Component
interface ProgressPanelProps {
  userProgress: UserProgress;
  featureProgress: FeatureProgress[];
  insights: ProgressInsight[];
  onClose: () => void;
  onExport: () => string;
}

function ProgressPanel({ userProgress, featureProgress, insights, onClose, onExport }: ProgressPanelProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMasteryColor = (mastery: string) => {
    switch (mastery) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-blue-600 bg-blue-100';
      case 'advanced': return 'text-purple-600 bg-purple-100';
      case 'expert': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Your Progress</h2>
              <p className="text-gray-600">Track your journey and achievements</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => {
              const data = onExport();
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `progress-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
            }}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Level Progress */}
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{userProgress.level}</span>
                </div>
                <CardTitle>Current Level</CardTitle>
                <CardDescription>Keep going to level up!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Experience</span>
                    <span>{userProgress.experience}/{userProgress.level * 100}</span>
                  </div>
                  <Progress value={(userProgress.experience % 100)} />
                </div>
              </CardContent>
            </Card>

            {/* Overall Progress */}
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Overall Progress</CardTitle>
                <CardDescription>Your platform mastery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {userProgress.overallProgress}%
                  </div>
                  <Progress value={userProgress.overallProgress} />
                </div>
              </CardContent>
            </Card>

            {/* Activity Streak */}
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{userProgress.streakDays}</span>
                </div>
                <CardTitle>Day Streak</CardTitle>
                <CardDescription>Keep the momentum!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-orange-600">
                    {Array.from({ length: Math.min(userProgress.streakDays, 7) }).map((_, i) => (
                      <Fire key={i} className="h-4 w-4" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights */}
          {insights.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.map((insight, index) => (
                  <Alert key={index} className={insight.type === 'achievement' ? 'border-green-200 bg-green-50' : ''}>
                    {insight.type === 'achievement' && <Trophy className="h-4 w-4" />}
                    {insight.type === 'milestone' && <Target className="h-4 w-4" />}
                    {insight.type === 'recommendation' && <Lightbulb className="h-4 w-4" />}
                    {insight.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
                    <AlertDescription>
                      <div className="font-medium">{insight.title}</div>
                      <div className="text-sm">{insight.description}</div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Last session</span>
                    <span>{new Date(userProgress.lastActivity).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Total sessions</span>
                    <span>{userProgress.sessionCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Time spent</span>
                    <span>{Math.round(userProgress.timeSpent / 60)} minutes</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Achievements earned</span>
                    <span>{userProgress.achievements.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userProgress.achievements.map((achievement) => (
              <Card key={achievement.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${getRarityColor(achievement.rarity)}`}>
                    {achievement.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                  <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                    {achievement.rarity}
                  </Badge>
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="skills" className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userProgress.skillProgress.map((skill) => (
              <Card key={skill.skill}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{skill.skill}</CardTitle>
                    <Badge variant="outline">Level {skill.level}</Badge>
                  </div>
                  <CardDescription>{skill.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress to Level {skill.level + 1}</span>
                        <span>{skill.experience}/{skill.maxExperience} XP</span>
                      </div>
                      <Progress value={(skill.experience / skill.maxExperience) * 100} />
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Category</span>
                      <Badge variant="secondary">{skill.category}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features" className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureProgress.map((feature) => (
              <Card key={feature.featureId} className={!feature.unlocked ? 'opacity-50' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{feature.featureName}</h3>
                    {feature.unlocked ? (
                      <Badge variant="default">Unlocked</Badge>
                    ) : (
                      <Badge variant="secondary">Locked</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Mastery</span>
                        <span>{feature.progress}%</span>
                      </div>
                      <Progress value={feature.progress} />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Usage</span>
                      <span>{feature.usageCount} times</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mastery Level</span>
                      <Badge variant="outline" className={getMasteryColor(feature.masteryLevel)}>
                        {feature.masteryLevel}
                      </Badge>
                    </div>
                    
                    {feature.lastUsed && (
                      <div className="text-xs text-gray-500">
                        Last used: {new Date(feature.lastUsed).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Weekly Goals</h3>
            {userProgress.weeklyGoals.map((goal) => (
              <Card key={goal.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold">{goal.title}</h4>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                    {goal.completed ? (
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    ) : (
                      <Badge variant="outline">In Progress</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{goal.current}/{goal.target} {goal.unit}</span>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Deadline</span>
                      <span>{new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Reward</span>
                      <Badge variant="secondary">{goal.reward}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Hook for tracking feature usage
export function useFeatureTracker(featureId: string) {
  const { updateFeatureUsage } = useProgress();

  const trackUsage = useCallback((usageData?: any) => {
    updateFeatureUsage(featureId, usageData);
  }, [featureId, updateFeatureUsage]);

  return { trackUsage };
}

// Progress Summary Component
export function ProgressSummary() {
  const { userProgress } = useProgress();

  if (!userProgress) return null;

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-1">
        <Trophy className="h-4 w-4 text-yellow-600" />
        <span>Level {userProgress.level}</span>
      </div>
      <div className="flex items-center gap-1">
        <Target className="h-4 w-4 text-green-600" />
        <span>{userProgress.overallProgress}%</span>
      </div>
      <div className="flex items-center gap-1">
        <Award className="h-4 w-4 text-purple-600" />
        <span>{userProgress.achievements.length}</span>
      </div>
    </div>
  );
}