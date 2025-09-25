"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart3, 
  Users, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Building2,
  Globe,
  Zap,
  Activity,
  DollarSign,
  TrendingDown,
  ThumbsUp,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  Download,
  Filter,
  Search,
  Eye,
  FileText,
  Target,
  Database,
  Settings,
  MoreHorizontal,
  Sparkles,
  Lightbulb,
  Award,
  Play,
  ArrowRight,
  Plus,
  Bell,
  User,
  ChevronRight,
  Grid3X3,
  List,
  Layout
} from 'lucide-react';
import { useUnifiedExperience } from './UnifiedExperienceProvider';
import Link from 'next/link';

interface DashboardWidget {
  id: string;
  title: string;
  description: string;
  type: 'metric' | 'chart' | 'activity' | 'quick_action' | 'progress';
  size: 'small' | 'medium' | 'large';
  category: 'overview' | 'risk' | 'compliance' | 'vendor' | 'tools';
  data: any;
  refreshable?: boolean;
  configurable?: boolean;
}

interface UnifiedDashboardProps {
  userId: string;
  userRole?: string;
}

export function UnifiedDashboard({ userId, userRole = 'risk_analyst' }: UnifiedDashboardProps) {
  const { userProgress, journeys, features, currentJourney, startJourney, completeStep, getRecommendedActions } = useUnifiedExperience();
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalVendors: 0,
    activeAssessments: 0,
    completedAssessments: 0,
    highRiskVendors: 0,
    compliantVendors: 0,
    averageProcessingTime: 0,
    passportUtilization: 0,
    riskScore: 0,
    complianceRate: 0
  });

  const recommendedActions = getRecommendedActions();

  // Initialize dashboard widgets
  useEffect(() => {
    const initializeWidgets = () => {
      const baseWidgets: DashboardWidget[] = [
        {
          id: 'portfolio_health',
          title: 'Portfolio Health',
          description: 'Overall risk portfolio health score',
          type: 'metric',
          size: 'medium',
          category: 'overview',
          data: { value: 72, trend: 'up', change: 5 },
          refreshable: true
        },
        {
          id: 'recent_activity',
          title: 'Recent Activity',
          description: 'Latest actions and updates',
          type: 'activity',
          size: 'large',
          category: 'overview',
          data: [],
          refreshable: true
        },
        {
          id: 'quick_actions',
          title: 'Quick Actions',
          description: 'Common tasks and tools',
          type: 'quick_action',
          size: 'medium',
          category: 'overview',
          data: []
        },
        {
          id: 'journey_progress',
          title: 'Your Journey',
          description: 'Current learning journey progress',
          type: 'progress',
          size: 'medium',
          category: 'overview',
          data: { progress: 0, currentStep: '' }
        },
        {
          id: 'risk_trends',
          title: 'Risk Trends',
          description: 'Risk score trends over time',
          type: 'chart',
          size: 'large',
          category: 'risk',
          data: [],
          refreshable: true
        },
        {
          id: 'compliance_status',
          title: 'Compliance Status',
          description: 'Multi-framework compliance tracking',
          type: 'metric',
          size: 'medium',
          category: 'compliance',
          data: { frameworks: [], overallRate: 0 },
          refreshable: true
        },
        {
          id: 'vendor_performance',
          title: 'Vendor Performance',
          description: 'Top performing vendors',
          type: 'chart',
          size: 'medium',
          category: 'vendor',
          data: [],
          refreshable: true
        },
        {
          id: 'feature_discovery',
          title: 'Discover Features',
          description: 'New and recommended features',
          type: 'quick_action',
          size: 'medium',
          category: 'tools',
          data: []
        }
      ];

      setWidgets(baseWidgets);
    };

    initializeWidgets();
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulate API calls
      setTimeout(() => {
        setDashboardStats({
          totalVendors: 156,
          activeAssessments: 23,
          completedAssessments: 89,
          highRiskVendors: 12,
          compliantVendors: 134,
          averageProcessingTime: 95,
          passportUtilization: 68,
          riskScore: 72,
          complianceRate: 86
        });

        setRecentActivity([
          {
            id: '1',
            type: 'assessment',
            title: 'Fast Check Completed',
            description: 'CloudTech Solutions risk assessment completed',
            timestamp: '2 minutes ago',
            status: 'completed',
            user: 'Sarah Chen'
          },
          {
            id: '2',
            type: 'compliance',
            title: 'SOC2 Report Updated',
            description: 'DataSecure Inc. SOC2 Type II report processed',
            timestamp: '15 minutes ago',
            status: 'completed',
            user: 'Mike Johnson'
          },
          {
            id: '3',
            type: 'vendor',
            title: 'New Vendor Onboarded',
            description: 'TechCorp Global added to vendor portfolio',
            timestamp: '1 hour ago',
            status: 'completed',
            user: 'Emily Davis'
          },
          {
            id: '4',
            type: 'risk',
            title: 'High Risk Alert',
            description: 'Vendor XYZ showing elevated risk indicators',
            timestamp: '2 hours ago',
            status: 'in_progress',
            user: 'Alex Rodriguez'
          }
        ]);

        // Update widget data
        setWidgets(prev => prev.map(widget => {
          switch (widget.id) {
            case 'portfolio_health':
              return { ...widget, data: { value: dashboardStats.riskScore, trend: 'up', change: 5 } };
            case 'recent_activity':
              return { ...widget, data: recentActivity };
            case 'journey_progress':
              return { 
                ...widget, 
                data: { 
                  progress: userProgress?.overallProgress || 0, 
                  currentStep: currentJourney?.currentStep || '' 
                } 
              };
            default:
              return widget;
          }
        }));
      }, 1000);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

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

  const riskLevel = getRiskLevel(dashboardStats.riskScore);

  const filteredWidgets = selectedCategory === 'all' 
    ? widgets 
    : widgets.filter(widget => widget.category === selectedCategory);

  const renderWidget = (widget: DashboardWidget) => {
    switch (widget.type) {
      case 'metric':
        return renderMetricWidget(widget);
      case 'activity':
        return renderActivityWidget(widget);
      case 'quick_action':
        return renderQuickActionWidget(widget);
      case 'progress':
        return renderProgressWidget(widget);
      case 'chart':
        return renderChartWidget(widget);
      default:
        return null;
    }
  };

  const renderMetricWidget = (widget: DashboardWidget) => {
    const data = widget.data;
    
    if (widget.id === 'portfolio_health') {
      return (
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Health</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.value}/100</div>
            <p className={`text-xs ${riskLevel.color}`}>
              {riskLevel.level} Risk
            </p>
            <Progress value={data.value} className="mt-2" />
            {widget.refreshable && (
              <Button variant="ghost" size="sm" className="mt-2">
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
            )}
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">{widget.title}</CardTitle>
          <CardDescription>{widget.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.value || 'N/A'}</div>
        </CardContent>
      </Card>
    );
  };

  const renderActivityWidget = (widget: DashboardWidget) => {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{widget.title}</CardTitle>
              <CardDescription>{widget.description}</CardDescription>
            </div>
            {widget.refreshable && (
              <Button variant="ghost" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {widget.data.map((activity: any) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border">
                <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{activity.title}</h4>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`}></div>
                  </div>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp} • {activity.user}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderQuickActionWidget = (widget: DashboardWidget) => {
    if (widget.id === 'quick_actions') {
      return (
        <Card className="h-full">
          <CardHeader>
            <CardTitle>{widget.title}</CardTitle>
            <CardDescription>{widget.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/tools/fast-check">
              <Button className="w-full justify-start" variant="outline">
                <Zap className="h-4 w-4 mr-2" />
                Fast Check
              </Button>
            </Link>
            <Link href="/tools/vendor-passport">
              <Button className="w-full justify-start" variant="outline">
                <Globe className="h-4 w-4 mr-2" />
                Create Vendor Passport
              </Button>
            </Link>
            <Link href="/dashboards/risk">
              <Button className="w-full justify-start" variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Risk Analysis
              </Button>
            </Link>
            <Link href="/dashboards/compliance">
              <Button className="w-full justify-start" variant="outline">
                <CheckCircle className="h-4 w-4 mr-2" />
                Compliance Status
              </Button>
            </Link>
          </CardContent>
        </Card>
      );
    }

    if (widget.id === 'feature_discovery') {
      const availableFeatures = features.filter(f => f.status === 'available');
      
      return (
        <Card className="h-full">
          <CardHeader>
            <CardTitle>{widget.title}</CardTitle>
            <CardDescription>{widget.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableFeatures.slice(0, 3).map((feature) => (
              <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{feature.name}</h4>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  const renderProgressWidget = (widget: DashboardWidget) => {
    const data = widget.data;
    
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {widget.title}
          </CardTitle>
          <CardDescription>{widget.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{data.progress}%</span>
              </div>
              <Progress value={data.progress} />
            </div>
            
            {currentJourney && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Current Journey</h4>
                <div className="flex items-center gap-2">
                  {currentJourney.icon}
                  <span className="text-sm font-medium">{currentJourney.title}</span>
                </div>
                <p className="text-xs text-gray-600">
                  {currentJourney.steps.find(s => s.id === currentJourney.currentStep)?.title}
                </p>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => currentJourney.status === 'not_started' ? startJourney(currentJourney.id) : {}}
                >
                  {currentJourney.status === 'not_started' ? 'Start Journey' : 'Continue'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderChartWidget = (widget: DashboardWidget) => {
    // Placeholder for chart widgets - in real implementation, use Recharts or similar
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{widget.title}</CardTitle>
              <CardDescription>{widget.description}</CardDescription>
            </div>
            {widget.refreshable && (
              <Button variant="ghost" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Chart visualization</p>
              <p className="text-xs text-gray-500">Interactive charts coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const categories = [
    { id: 'all', name: 'All', icon: <Grid3X3 className="h-4 w-4" /> },
    { id: 'overview', name: 'Overview', icon: <Layout className="h-4 w-4" /> },
    { id: 'risk', name: 'Risk', icon: <AlertTriangle className="h-4 w-4" /> },
    { id: 'compliance', name: 'Compliance', icon: <Shield className="h-4 w-4" /> },
    { id: 'vendor', name: 'Vendor', icon: <Building2 className="h-4 w-4" /> },
    { id: 'tools', name: 'Tools', icon: <Settings className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Unified Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Your connected TPRM experience with personalized insights
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={activeView === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveView('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={activeView === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveView('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh All
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Actions */}
      {recommendedActions.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong>Recommended Actions:</strong> {recommendedActions[0].description}
                </div>
                <Button size="sm" onClick={recommendedActions[0].action}>
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              {category.icon}
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        {activeView === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWidgets.map((widget) => (
              <div 
                key={widget.id} 
                className={`
                  ${widget.size === 'small' ? 'md:col-span-1' : ''}
                  ${widget.size === 'medium' ? 'md:col-span-1 lg:col-span-2' : ''}
                  ${widget.size === 'large' ? 'md:col-span-2 lg:col-span-3' : ''}
                `}
              >
                {renderWidget(widget)}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredWidgets.map((widget) => (
              <div key={widget.id}>
                {renderWidget(widget)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Key Metrics Summary */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
            <CardDescription>Important performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{dashboardStats.totalVendors}</div>
                <div className="text-sm text-gray-600">Total Vendors</div>
                <div className="text-xs text-green-600">+12% from last month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{dashboardStats.complianceRate}%</div>
                <div className="text-sm text-gray-600">Compliance Rate</div>
                <div className="text-xs text-green-600">+5% improvement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{dashboardStats.activeAssessments}</div>
                <div className="text-sm text-gray-600">Active Assessments</div>
                <div className="text-xs text-gray-600">In progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{dashboardStats.averageProcessingTime}s</div>
                <div className="text-sm text-gray-600">Avg Processing Time</div>
                <div className="text-xs text-green-600">-15% improvement</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}