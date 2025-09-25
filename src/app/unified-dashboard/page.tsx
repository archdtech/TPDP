"use client";

import { useState, useEffect } from 'react';
import { UnifiedExperienceProvider } from '@/components/UnifiedExperience/UnifiedExperienceProvider';
import { DataSyncProvider } from '@/components/UnifiedExperience/DataSyncManager';
import { HelpProvider } from '@/components/UnifiedExperience/ContextualHelp';
import { ProgressProvider } from '@/components/UnifiedExperience/ProgressTracker';
import { OnboardingFlow } from '@/components/UnifiedExperience/OnboardingFlow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
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
  Play,
  CheckCircle,
  Clock,
  Award,
  Lightbulb,
  TrendingUp,
  Activity,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Download,
  Upload,
  FileText,
  Eye,
  Edit,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  BookmarkCheck,
  Bell,
  User,
  ChevronDown,
  ChevronRight,
  Menu,
  Grid,
  List,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building2,
  Star,
  Flag,
  CheckSquare,
  BookOpen,
  Wrench,
  Rocket,
  Gift,
  Trophy,
  Fire,
  Wifi,
  WifiOff,
  HelpCircle,
  LogOut,
  Home,
  FolderOpen,
  Monitor,
  Smartphone,
  Tablet,
  Cpu,
  HardDrive,
  Cloud,
  Server,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  UserCheck,
  UserX,
  Users2,
  UserPlus,
  UserMinus,
  UserCog,
  UsersRound,
  UserRound,
  UserRoundCheck,
  UserRoundX,
  UserRoundPlus,
  UserRoundMinus,
  UserRoundCog,
  UserRoundSearch,
  UserRoundPen
} from 'lucide-react';
import Link from 'next/link';

interface UnifiedDashboardPageProps {
  userId: string;
  userRole?: string;
}

export default function UnifiedDashboardPage({ userId, userRole = 'risk_analyst' }: UnifiedDashboardPageProps) {
  const [showJourney, setShowJourney] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dashboard state
  const [dashboardData, setDashboardData] = useState({
    portfolioHealth: 72,
    riskScore: 68,
    complianceRate: 86,
    activeVendors: 156,
    pendingAssessments: 23,
    completedAssessments: 89,
    highRiskVendors: 12,
    passportUtilization: 68,
    recentActivity: [],
    systemStatus: 'healthy',
    lastSync: new Date().toISOString(),
    weeklyProgress: 45,
    achievements: [],
    recommendations: []
  });

  // Mock data initialization
  useEffect(() => {
    // Simulate API calls to load dashboard data
    const loadData = async () => {
      try {
        // In a real implementation, these would be actual API calls
        const mockActivity = [
          {
            id: '1',
            type: 'assessment',
            title: 'Fast Check Completed',
            description: 'CloudTech Solutions risk assessment completed',
            timestamp: '2 minutes ago',
            status: 'completed',
            user: 'Sarah Chen',
            priority: 'high'
          },
          {
            id: '2',
            type: 'compliance',
            title: 'SOC2 Report Updated',
            description: 'DataSecure Inc. SOC2 Type II report processed',
            timestamp: '15 minutes ago',
            status: 'completed',
            user: 'Mike Johnson',
            priority: 'medium'
          },
          {
            id: '3',
            type: 'vendor',
            title: 'New Vendor Onboarded',
            description: 'TechCorp Global added to vendor portfolio',
            timestamp: '1 hour ago',
            status: 'completed',
            user: 'Emily Davis',
            priority: 'low'
          },
          {
            id: '4',
            type: 'risk',
            title: 'High Risk Alert',
            description: 'Vendor XYZ showing elevated risk indicators',
            timestamp: '2 hours ago',
            status: 'in_progress',
            user: 'Alex Rodriguez',
            priority: 'critical'
          }
        ];

        const mockAchievements = [
          {
            id: 'first_assessment',
            title: 'First Assessment',
            description: 'Completed your first vendor assessment',
            icon: <Zap className="h-5 w-5" />,
            unlockedAt: new Date().toISOString(),
            rarity: 'common'
          },
          {
            id: 'week_streak',
            title: 'Week Streak',
            description: 'Used the platform for 7 consecutive days',
            icon: <Fire className="h-5 w-5" />,
            unlockedAt: new Date().toISOString(),
            rarity: 'rare'
          }
        ];

        const mockRecommendations = [
          {
            id: 'complete_assessments',
            title: 'Complete Pending Assessments',
            description: 'You have 23 assessments waiting for review',
            priority: 'high',
            action: () => console.log('Navigate to assessments')
          },
          {
            id: 'update_passports',
            title: 'Update Vendor Passports',
            description: '5 vendor passports need compliance updates',
            priority: 'medium',
            action: () => console.log('Navigate to passports')
          },
          {
            id: 'review_risks',
            title: 'Review High Risk Vendors',
            description: '12 vendors require immediate attention',
            priority: 'high',
            action: () => console.log('Navigate to risk dashboard')
          }
        ];

        setDashboardData(prev => ({
          ...prev,
          recentActivity: mockActivity,
          achievements: mockAchievements,
          recommendations: mockRecommendations
        }));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadData();
  }, []);

  const journeys = [
    {
      id: 'getting_started',
      title: 'Getting Started',
      description: 'Learn the basics and set up your account',
      icon: <Sparkles className="h-6 w-6" />,
      duration: '10 min',
      difficulty: 'Beginner',
      status: 'not_started',
      progress: 0
    },
    {
      id: 'first_assessment',
      title: 'First Risk Assessment',
      description: 'Complete your first vendor risk assessment',
      icon: <Target className="h-6 w-6" />,
      duration: '15 min',
      difficulty: 'Intermediate',
      status: 'locked',
      progress: 0
    },
    {
      id: 'vendor_passport',
      title: 'Vendor Passport Mastery',
      description: 'Create and manage vendor passports',
      icon: <Globe className="h-6 w-6" />,
      duration: '20 min',
      difficulty: 'Intermediate',
      status: 'locked',
      progress: 0
    },
    {
      id: 'advanced_features',
      title: 'Advanced Features',
      description: 'Explore advanced analytics and tools',
      icon: <Brain className="h-6 w-6" />,
      duration: '30 min',
      difficulty: 'Advanced',
      status: 'locked',
      progress: 0
    }
  ];

  const features = [
    {
      id: 'fast_check',
      name: 'Fast Check',
      description: '2-minute risk assessments with AI analysis',
      icon: <Zap className="h-8 w-8 text-blue-600" />,
      status: 'available',
      category: 'Core Tool',
      progress: 75,
      usage: 45
    },
    {
      id: 'risk_analytics',
      name: 'Risk Analytics',
      description: 'Advanced risk analysis and trending',
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      status: 'available',
      category: 'Analytics',
      progress: 60,
      usage: 32
    },
    {
      id: 'compliance_hub',
      name: 'Compliance Hub',
      description: 'Multi-framework compliance tracking',
      icon: <Shield className="h-8 w-8 text-green-600" />,
      status: 'available',
      category: 'Compliance',
      progress: 45,
      usage: 28
    },
    {
      id: 'vendor_management',
      name: 'Vendor Management',
      description: 'Complete vendor lifecycle management',
      icon: <Users className="h-8 w-8 text-orange-600" />,
      status: 'locked',
      category: 'Management',
      progress: 0,
      usage: 0
    },
    {
      id: 'repository_monitor',
      name: 'Repository Monitor',
      description: 'Development progress tracking',
      icon: <Database className="h-8 w-8 text-indigo-600" />,
      status: 'locked',
      category: 'Tools',
      progress: 0,
      usage: 0
    },
    {
      id: 'ai_agent_studio',
      name: 'AI Agent Studio',
      description: 'Build custom AI agents',
      icon: <Brain className="h-8 w-8 text-pink-600" />,
      status: 'locked',
      category: 'Advanced',
      progress: 0,
      usage: 0
    }
  ];

  const quickActions = [
    {
      id: 'new_assessment',
      title: 'New Assessment',
      description: 'Start a new vendor risk assessment',
      icon: <Zap className="h-5 w-5" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => console.log('Start new assessment')
    },
    {
      id: 'add_vendor',
      title: 'Add Vendor',
      description: 'Add a new vendor to your portfolio',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => console.log('Add new vendor')
    },
    {
      id: 'create_passport',
      title: 'Create Passport',
      description: 'Create a new vendor passport',
      icon: <Globe className="h-5 w-5" />,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => console.log('Create passport')
    },
    {
      id: 'run_report',
      title: 'Run Report',
      description: 'Generate compliance reports',
      icon: <FileText className="h-5 w-5" />,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => console.log('Run report')
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assessment': return <Shield className="h-4 w-4" />;
      case 'compliance': return <CheckCircle className="h-4 w-4" />;
      case 'vendor': return <Building2 className="h-4 w-4" />;
      case 'risk': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'assessment': return 'text-blue-600 bg-blue-100';
      case 'compliance': return 'text-green-600 bg-green-100';
      case 'vendor': return 'text-purple-600 bg-purple-100';
      case 'risk': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'Low', color: 'text-green-600' };
    if (score >= 60) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'High', color: 'text-red-600' };
  };

  const riskLevel = getRiskLevel(dashboardData.riskScore);

  if (showJourney) {
    return (
      <UnifiedExperienceProvider userId={userId}>
        <OnboardingFlow 
          journeyId={showJourney}
          onComplete={() => setShowJourney(null)}
          onSkip={() => setShowJourney(null)}
        />
      </UnifiedExperienceProvider>
    );
  }

  return (
    <UnifiedExperienceProvider userId={userId}>
      <DataSyncProvider userId={userId}>
        <HelpProvider userId={userId}>
          <ProgressProvider userId={userId}>
            <div className="min-h-screen bg-gray-50">
              {/* Welcome Modal */}
              {showWelcome && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                            <Sparkles className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold">Welcome to Your Unified Experience</h2>
                            <p className="text-gray-600">Your personalized TPRM journey starts here</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setShowWelcome(false)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Hero Section */}
                      <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold mb-4">Transform Your TPRM Process</h3>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                          Experience the power of AI-powered third-party risk management with our unified, connected platform. 
                          Start your journey to become a TPRM expert.
                        </p>
                      </div>

                      {/* Key Benefits */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="text-center">
                          <CardContent className="p-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Clock className="h-6 w-6 text-blue-600" />
                            </div>
                            <h4 className="font-semibold mb-2">95% Faster</h4>
                            <p className="text-sm text-gray-600">Reduce assessment time from weeks to minutes</p>
                          </CardContent>
                        </Card>
                        
                        <Card className="text-center">
                          <CardContent className="p-6">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Brain className="h-6 w-6 text-green-600" />
                            </div>
                            <h4 className="font-semibold mb-2">AI-Powered</h4>
                            <p className="text-sm text-gray-600">Explainable AI with source-cited findings</p>
                          </CardContent>
                        </Card>
                        
                        <Card className="text-center">
                          <CardContent className="p-6">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <TrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                            <h4 className="font-semibold mb-2">Network Effects</h4>
                            <p className="text-sm text-gray-600">Reusable vendor passports and shared insights</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Learning Journeys */}
                      <div className="mb-8">
                        <h3 className="text-2xl font-bold mb-4">Your Learning Journeys</h3>
                        <p className="text-gray-600 mb-6">Follow guided journeys to master Project Sentinel features and unlock new capabilities.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {journeys.map((journey) => (
                            <Card key={journey.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                      {journey.icon}
                                    </div>
                                    <div>
                                      <CardTitle className="text-lg">{journey.title}</CardTitle>
                                      <CardDescription>{journey.description}</CardDescription>
                                    </div>
                                  </div>
                                  <Badge variant={journey.status === 'not_started' ? 'default' : 'secondary'}>
                                    {journey.status === 'not_started' ? 'Available' : journey.status}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      {journey.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Target className="h-4 w-4" />
                                      {journey.difficulty}
                                    </span>
                                  </div>
                                  <Button 
                                    size="sm"
                                    onClick={() => setShowJourney(journey.id)}
                                    disabled={journey.status === 'locked'}
                                  >
                                    <Play className="h-4 w-4 mr-2" />
                                    Start
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {/* Feature Discovery */}
                      <div className="mb-8">
                        <h3 className="text-2xl font-bold mb-4">Discover Features</h3>
                        <p className="text-gray-600 mb-6">Unlock powerful features as you progress through your journey.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {features.slice(0, 6).map((feature) => (
                            <Card key={feature.id} className={feature.status === 'locked' ? 'opacity-50' : ''}>
                              <CardContent className="p-4 text-center">
                                <div className="mb-3">
                                  {feature.icon}
                                </div>
                                <h4 className="font-semibold mb-2">{feature.name}</h4>
                                <p className="text-xs text-gray-600 mb-3">{feature.description}</p>
                                <Badge variant={feature.status === 'available' ? 'default' : 'secondary'}>
                                  {feature.status}
                                </Badge>
                                <div className="text-xs text-gray-500 mt-2">{feature.category}</div>
                                {feature.progress > 0 && (
                                  <div className="mt-2">
                                    <Progress value={feature.progress} className="h-1" />
                                    <div className="text-xs text-gray-500 mt-1">{feature.progress}% complete</div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {/* Quick Start */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold mb-2">Ready to Get Started?</h3>
                            <p className="text-gray-600">Begin your first journey to unlock the full potential of Project Sentinel.</p>
                          </div>
                          <Button 
                            size="lg"
                            onClick={() => setShowJourney('getting_started')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            <Play className="h-5 w-5 mr-2" />
                            Start Journey
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border-t bg-gray-50">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          You can access this guide anytime from the help menu
                        </p>
                        <Button onClick={() => setShowWelcome(false)}>
                          Go to Dashboard
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Dashboard */}
              <div className="flex flex-col h-screen">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                      <div className="flex items-center">
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded">
                            <Shield className="h-6 w-6 text-white" />
                          </div>
                          <span className="text-xl font-bold text-gray-900">Project Sentinel</span>
                        </div>
                        
                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex ml-10 space-x-8">
                          <Link href="/" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                            Home
                          </Link>
                          <Link href="/unified-dashboard" className="text-blue-600 bg-blue-50 px-3 py-2 rounded-md text-sm font-medium">
                            Unified Dashboard
                          </Link>
                          <Link href="/dashboards" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                            Dashboards
                          </Link>
                          <Link href="/tools" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                            Tools
                          </Link>
                        </nav>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="hidden sm:block">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type="text"
                              placeholder="Search..."
                              className="pl-10 w-64"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Notifications */}
                        <div className="relative">
                          <Button variant="ghost" size="sm" onClick={() => setShowNotifications(!showNotifications)}>
                            <Bell className="h-4 w-4" />
                            {dashboardData.recommendations.length > 0 && (
                              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                {dashboardData.recommendations.length}
                              </span>
                            )}
                          </Button>
                        </div>

                        {/* Help */}
                        <Button variant="ghost" size="sm" onClick={() => setShowHelp(true)}>
                          <HelpCircle className="h-4 w-4" />
                        </Button>

                        {/* User Menu */}
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <span className="hidden sm:block text-sm font-medium">Risk Analyst</span>
                        </div>

                        {/* Mobile menu */}
                        <div className="md:hidden">
                          <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <Menu className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </header>

                {/* Quick Actions Bar */}
                <div className="bg-white border-b">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-12">
                      <div className="flex items-center gap-6 overflow-x-auto">
                        <span className="text-sm font-medium text-gray-700">Quick Actions:</span>
                        <div className="flex items-center gap-4">
                          {quickActions.map((action) => (
                            <Button
                              key={action.id}
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-2 whitespace-nowrap"
                              onClick={action.action}
                            >
                              <action.icon className="h-4 w-4" />
                              {action.title}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                          <Sparkles className="h-4 w-4 text-yellow-500" />
                          <span>Unified Dashboard Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Dashboard Header */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between">
                        <div>
                          <h1 className="text-3xl font-bold text-gray-900">Unified Dashboard</h1>
                          <p className="text-gray-600 mt-2">Your complete TPRM command center</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">View:</span>
                            <Button
                              variant={viewMode === 'grid' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setViewMode('grid')}
                            >
                              <Grid className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={viewMode === 'list' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setViewMode('list')}
                            >
                              <List className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Portfolio Health</p>
                              <p className="text-2xl font-bold text-gray-900">{dashboardData.portfolioHealth}/100</p>
                              <p className={`text-sm ${riskLevel.color}`}>{riskLevel.level} Risk</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                              <BarChart3 className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                          <Progress value={dashboardData.portfolioHealth} className="mt-4" />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                              <p className="text-2xl font-bold text-gray-900">{dashboardData.activeVendors}</p>
                              <p className="text-sm text-green-600">+12 this month</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                              <Users className="h-6 w-6 text-green-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                              <p className="text-2xl font-bold text-gray-900">{dashboardData.complianceRate}%</p>
                              <p className="text-sm text-green-600">+5% improvement</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                              <Shield className="h-6 w-6 text-purple-600" />
                            </div>
                          </div>
                          <Progress value={dashboardData.complianceRate} className="mt-4" />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Pending Actions</p>
                              <p className="text-2xl font-bold text-gray-900">{dashboardData.pendingAssessments}</p>
                              <p className="text-sm text-red-600">Requires attention</p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-full">
                              <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Main Content Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="assessments">Assessments</TabsTrigger>
                        <TabsTrigger value="vendors">Vendors</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-6">
                        {/* Recent Activity */}
                        <Card>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Latest actions and updates across your TPRM ecosystem</CardDescription>
                              </div>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View All
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {dashboardData.recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border">
                                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                                    {getActivityIcon(activity.type)}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-medium">{activity.title}</h4>
                                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(activity.priority)}`}></div>
                                    </div>
                                    <p className="text-sm text-gray-600">{activity.description}</p>
                                    <p className="text-xs text-gray-500">{activity.timestamp} • {activity.user}</p>
                                  </div>
                                  <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`}></div>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Feature Progress */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Feature Progress</CardTitle>
                            <CardDescription>Track your progress and mastery of platform features</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {features.map((feature) => (
                                <div key={feature.id} className="p-4 border rounded-lg">
                                  <div className="flex items-center gap-3 mb-3">
                                    {feature.icon}
                                    <div className="flex-1">
                                      <h4 className="font-medium">{feature.name}</h4>
                                      <p className="text-xs text-gray-600">{feature.category}</p>
                                    </div>
                                    <Badge variant={feature.status === 'available' ? 'default' : 'secondary'}>
                                      {feature.status}
                                    </Badge>
                                  </div>
                                  {feature.progress > 0 && (
                                    <div className="space-y-2">
                                      <div className="flex justify-between text-sm">
                                        <span>Progress</span>
                                        <span>{feature.progress}%</span>
                                      </div>
                                      <Progress value={feature.progress} className="h-2" />
                                      <div className="text-xs text-gray-500">Used {feature.usage} times</div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Recommendations */}
                        {dashboardData.recommendations.length > 0 && (
                          <Card>
                            <CardHeader>
                              <CardTitle>Recommendations</CardTitle>
                              <CardDescription>Suggested actions based on your activity and goals</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {dashboardData.recommendations.map((rec) => (
                                  <div key={rec.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(rec.priority)}`}></div>
                                      <div>
                                        <h4 className="font-medium">{rec.title}</h4>
                                        <p className="text-sm text-gray-600">{rec.description}</p>
                                      </div>
                                    </div>
                                    <Button size="sm" onClick={rec.action}>
                                      <ArrowRight className="h-4 w-4 mr-2" />
                                      Take Action
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </TabsContent>

                      <TabsContent value="assessments" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Assessment Queue */}
                          <Card>
                            <CardHeader>
                              <CardTitle>Assessment Queue</CardTitle>
                              <CardDescription>Vendors waiting for risk assessment</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {[
                                  { name: 'CloudTech Solutions', priority: 'high', status: 'pending', time: '2 days ago' },
                                  { name: 'DataSecure Inc.', priority: 'medium', status: 'in_progress', time: '1 day ago' },
                                  { name: 'TechCorp Global', priority: 'low', status: 'pending', time: '3 days ago' }
                                ].map((vendor, index) => (
                                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(vendor.priority)}`}></div>
                                      <div>
                                        <h4 className="font-medium">{vendor.name}</h4>
                                        <p className="text-xs text-gray-500">{vendor.time}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant={vendor.status === 'in_progress' ? 'default' : 'secondary'}>
                                        {vendor.status}
                                      </Badge>
                                      <Button size="sm" variant="outline">
                                        <Zap className="h-4 w-4 mr-1" />
                                        Assess
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Recent Assessments */}
                          <Card>
                            <CardHeader>
                              <CardTitle>Recent Assessments</CardTitle>
                              <CardDescription>Recently completed risk assessments</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {[
                                  { name: 'SecureNet Systems', score: 85, status: 'completed', date: '2 hours ago' },
                                  { name: 'InfoGuard Ltd', score: 72, status: 'completed', date: '5 hours ago' },
                                  { name: 'CyberShield Inc', score: 91, status: 'completed', date: '1 day ago' }
                                ].map((assessment, index) => (
                                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 bg-green-100 rounded-full">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium">{assessment.name}</h4>
                                        <p className="text-xs text-gray-500">{assessment.date}</p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-medium">{assessment.score}/100</div>
                                      <div className="text-xs text-green-600">Low Risk</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Fast Check Widget */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Fast Check</CardTitle>
                            <CardDescription>Start a new 2-minute risk assessment</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-center py-8">
                              <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                              <h3 className="text-lg font-semibold mb-2">Ready to assess?</h3>
                              <p className="text-gray-600 mb-4">Upload compliance documents and get AI-powered risk analysis in minutes</p>
                              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                                <Upload className="h-5 w-5 mr-2" />
                                Start Fast Check
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="vendors" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Vendor Summary */}
                          <Card className="lg:col-span-1">
                            <CardHeader>
                              <CardTitle>Vendor Summary</CardTitle>
                              <CardDescription>Overview of your vendor portfolio</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Total Vendors</span>
                                <span className="font-medium">{dashboardData.activeVendors}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">High Risk</span>
                                <span className="font-medium text-red-600">{dashboardData.highRiskVendors}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Passport Utilization</span>
                                <span className="font-medium">{dashboardData.passportUtilization}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Compliant</span>
                                <span className="font-medium text-green-600">{Math.round(dashboardData.activeVendors * 0.86)}</span>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Vendor List */}
                          <Card className="lg:col-span-2">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle>Vendor Portfolio</CardTitle>
                                  <CardDescription>Manage your vendor relationships</CardDescription>
                                </div>
                                <Button size="sm">
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Vendor
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {[
                                  { name: 'CloudTech Solutions', risk: 'Low', status: 'Active', passport: true },
                                  { name: 'DataSecure Inc.', risk: 'Medium', status: 'Active', passport: true },
                                  { name: 'TechCorp Global', risk: 'High', status: 'Review', passport: false },
                                  { name: 'SecureNet Systems', risk: 'Low', status: 'Active', passport: true }
                                ].map((vendor, index) => (
                                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <Building2 className="h-5 w-5 text-gray-400" />
                                      <div>
                                        <h4 className="font-medium">{vendor.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                          <Badge variant={vendor.risk === 'Low' ? 'default' : vendor.risk === 'Medium' ? 'secondary' : 'destructive'}>
                                            {vendor.risk} Risk
                                          </Badge>
                                          <Badge variant={vendor.status === 'Active' ? 'default' : 'secondary'}>
                                            {vendor.status}
                                          </Badge>
                                          {vendor.passport && (
                                            <Badge variant="outline">
                                              <Globe className="h-3 w-3 mr-1" />
                                              Passport
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button size="sm" variant="outline">
                                        <Eye className="h-4 w-4 mr-1" />
                                        View
                                      </Button>
                                      <Button size="sm" variant="outline">
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Vendor Passports */}
                        <Card>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle>Vendor Passports</CardTitle>
                                <CardDescription>Manage and share vendor compliance profiles</CardDescription>
                              </div>
                              <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Create Passport
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {[
                                { name: 'CloudTech Solutions', status: 'Active', lastUpdated: '2 days ago', shared: 5 },
                                { name: 'DataSecure Inc.', status: 'Active', lastUpdated: '1 week ago', shared: 3 },
                                { name: 'SecureNet Systems', status: 'Active', lastUpdated: '3 days ago', shared: 8 }
                              ].map((passport, index) => (
                                <Card key={index}>
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                      <Globe className="h-5 w-5 text-green-600" />
                                      <Badge variant="default">{passport.status}</Badge>
                                    </div>
                                    <h4 className="font-medium mb-2">{passport.name}</h4>
                                    <div className="space-y-1 text-xs text-gray-600">
                                      <div>Updated: {passport.lastUpdated}</div>
                                      <div>Shared with {passport.shared} customers</div>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                      <Button size="sm" variant="outline" className="flex-1">
                                        <Eye className="h-3 w-3 mr-1" />
                                        View
                                      </Button>
                                      <Button size="sm" variant="outline" className="flex-1">
                                        <Share2 className="h-3 w-3 mr-1" />
                                        Share
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="analytics" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Risk Trends */}
                          <Card>
                            <CardHeader>
                              <CardTitle>Risk Trends</CardTitle>
                              <CardDescription>Risk score trends over time</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                                <div className="text-center">
                                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                  <p className="text-gray-600">Risk trend chart</p>
                                  <p className="text-sm text-gray-500">Interactive chart showing risk trends</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Compliance Overview */}
                          <Card>
                            <CardHeader>
                              <CardTitle>Compliance Overview</CardTitle>
                              <CardDescription>Multi-framework compliance status</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {[
                                  { framework: 'SOC 2', status: 'Compliant', score: 95 },
                                  { framework: 'ISO 27001', status: 'Compliant', score: 88 },
                                  { framework: 'GDPR', status: 'Non-compliant', score: 72 },
                                  { framework: 'HIPAA', status: 'N/A', score: 0 }
                                ].map((item, index) => (
                                  <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <Shield className="h-4 w-4 text-gray-400" />
                                      <span className="font-medium">{item.framework}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Progress value={item.score} className="w-20" />
                                      <span className="text-sm text-gray-600">{item.score}%</span>
                                      <Badge variant={item.status === 'Compliant' ? 'default' : 'secondary'}>
                                        {item.status}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Performance Metrics */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Performance Metrics</CardTitle>
                            <CardDescription>Key performance indicators for your TPRM program</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">95%</div>
                                <div className="text-sm text-gray-600">Assessment Speed</div>
                                <div className="text-xs text-green-600">+15% improvement</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">89%</div>
                                <div className="text-sm text-gray-600">First Pass Rate</div>
                                <div className="text-xs text-green-600">+8% improvement</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">68%</div>
                                <div className="text-sm text-gray-600">Passport Usage</div>
                                <div className="text-xs text-yellow-600">+12% growth</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">94%</div>
                                <div className="text-sm text-gray-600">Vendor Retention</div>
                                <div className="text-xs text-green-600">+3% improvement</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                      <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <span className="text-sm text-gray-600">
                          Project Sentinel - Unified Dashboard v2.0.0
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Wifi className="h-4 w-4 text-green-600" />
                          <span>Data synchronized</span>
                        </div>
                        <div>•</div>
                        <div>Last sync: {new Date(dashboardData.lastSync).toLocaleTimeString()}</div>
                        <div>•</div>
                        <div>
                          <Button variant="ghost" size="sm" onClick={() => setShowHelp(true)}>
                            Help Center
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </footer>
              </div>
            </div>
          </ProgressProvider>
        </HelpProvider>
      </DataSyncProvider>
    </UnifiedExperienceProvider>
  );
}