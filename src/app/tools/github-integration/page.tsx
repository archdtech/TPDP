"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Github, 
  GitBranch, 
  Users, 
  Code, 
  FileText, 
  ExternalLink, 
  Star,
  GitPullRequest,
  GitCommit,
  GitMerge,
  Activity,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  Target,
  Database,
  BarChart3,
  Clock,
  Shield,
  Settings
} from 'lucide-react';
import GitHubUpdates from '@/components/GitHubUpdates';

export default function GitHubIntegrationPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      title: 'Repository Monitoring',
      description: 'Real-time tracking of commits, branches, and development activity',
      icon: GitBranch,
      color: 'text-blue-600'
    },
    {
      title: 'Team Analytics',
      description: 'Insights into contributor activity, productivity, and collaboration patterns',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Code Quality Metrics',
      description: 'Analysis of code quality, technical debt, and development standards',
      icon: Code,
      color: 'text-purple-600'
    },
    {
      title: 'Issue & PR Tracking',
      description: 'Comprehensive tracking of issues, pull requests, and project momentum',
      icon: GitPullRequest,
      color: 'text-orange-600'
    }
  ];

  const metrics = [
    {
      name: 'Commit Activity',
      description: 'Track commit frequency, patterns, and contributor engagement',
      icon: GitCommit,
      category: 'Development Activity'
    },
    {
      name: 'Pull Request Metrics',
      description: 'Monitor PR creation, review times, merge rates, and code review quality',
      icon: GitPullRequest,
      category: 'Collaboration'
    },
    {
      name: 'Issue Resolution',
      description: 'Track issue creation, resolution times, and bug fix velocity',
      icon: AlertTriangle,
      category: 'Project Health'
    },
    {
      name: 'Team Performance',
      description: 'Analyze individual and team productivity, contribution patterns',
      icon: Users,
      category: 'Team Analytics'
    },
    {
      name: 'Repository Growth',
      description: 'Monitor codebase growth, file changes, and project evolution',
      icon: TrendingUp,
      category: 'Project Scale'
    },
    {
      name: 'Release Activity',
      description: 'Track release frequency, version tagging, and deployment patterns',
      icon: Star,
      category: 'Delivery'
    }
  ];

  const integrations = [
    {
      name: 'GitHub API',
      description: 'Full integration with GitHub REST and GraphQL APIs',
      status: 'active',
      coverage: 'Complete'
    },
    {
      name: 'GitHub Actions',
      description: 'CI/CD pipeline monitoring and workflow analysis',
      status: 'active',
      coverage: 'Comprehensive'
    },
    {
      name: 'GitHub Packages',
      description: 'Package registry monitoring and dependency tracking',
      status: 'beta',
      coverage: 'Basic'
    },
    {
      name: 'GitHub Pages',
      description: 'Static site deployment and documentation tracking',
      status: 'planned',
      coverage: 'Future'
    }
  ];

  const useCases = [
    {
      title: 'Portfolio Management',
      description: 'Monitor development activity across all ventures in your portfolio',
      benefits: [
        'Identify stalled or inactive projects',
        'Track development velocity and progress',
        'Compare performance across ventures',
        'Early detection of technical issues'
      ],
      icon: Database
    },
    {
      title: 'Due Diligence',
      description: 'Comprehensive technical analysis for investment decisions',
      benefits: [
        'Assess development team activity and quality',
        'Evaluate codebase health and maintainability',
        'Identify technical risks and scalability concerns',
        'Measure development process maturity'
      ],
      icon: Shield
    },
    {
      title: 'Team Optimization',
      description: 'Optimize team performance and development workflows',
      benefits: [
        'Identify bottlenecks in development processes',
        'Measure individual and team productivity',
        'Optimize code review and collaboration patterns',
        'Improve estimation accuracy and predictability'
      ],
      icon: Target
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Github className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">GitHub Integration Suite</h1>
              <p className="text-gray-200 mt-1">
                Comprehensive GitHub repository management with advanced insights and analytics
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <CheckCircle className="h-3 w-3 mr-1" />
              Production Ready
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <BarChart3 className="h-3 w-3 mr-1" />
              Advanced Analytics
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Zap className="h-3 w-3 mr-1" />
              Real-Time Data
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
              <TabsTrigger value="monitor">Monitor</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Advanced GitHub Analytics & Monitoring
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Transform raw GitHub data into actionable insights about development activity, 
                team performance, and project health.
              </p>
            </div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <Icon className={`h-8 w-8 mx-auto ${feature.color}`} />
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Repositories Tracked</p>
                      <p className="text-2xl font-bold text-gray-800">500+</p>
                    </div>
                    <Github className="h-8 w-8 text-gray-800" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">API Calls/Day</p>
                      <p className="text-2xl font-bold text-blue-600">50K</p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Data Freshness</p>
                      <p className="text-2xl font-bold text-green-600">{'< 5min'}</p>
                    </div>
                    <Clock className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Accuracy Rate</p>
                      <p className="text-2xl font-bold text-purple-600">99.2%</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Getting Started */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-gray-600 font-bold">1</span>
                    </div>
                    <h4 className="font-medium">Connect GitHub</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Authorize access to your repositories and organizations
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold">2</span>
                    </div>
                    <h4 className="font-medium">Configure Monitoring</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Select repositories and set up monitoring preferences
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 font-bold">3</span>
                    </div>
                    <h4 className="font-medium">View Insights</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Access real-time analytics and development intelligence
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Button size="lg" onClick={() => setActiveTab('monitor')}>
                    <Github className="h-4 w-4 mr-2" />
                    Start Monitoring
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Comprehensive Feature Set</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Core Features */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Analytics</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <GitCommit className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Commit Analysis</h4>
                        <p className="text-sm text-gray-600">
                          Track commit frequency, size, patterns, and contributor activity over time
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <GitPullRequest className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Pull Request Intelligence</h4>
                        <p className="text-sm text-gray-600">
                          Analyze PR creation, review times, merge rates, and code review quality
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Team Performance</h4>
                        <p className="text-sm text-gray-600">
                          Measure individual and team productivity, collaboration patterns, and efficiency
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advanced Features */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Insights</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Code className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Code Quality Metrics</h4>
                        <p className="text-sm text-gray-600">
                          Assess code quality, technical debt, and adherence to development standards
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Growth & Trends</h4>
                        <p className="text-sm text-gray-600">
                          Monitor repository growth, development velocity, and project momentum
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Risk Assessment</h4>
                        <p className="text-sm text-gray-600">
                          Identify potential risks, bottlenecks, and areas needing attention
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Integration Support */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">GitHub Integration Coverage</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {integrations.map((integration, index) => (
                    <Card key={index} className="text-center">
                      <CardContent className="p-4">
                        <Github className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                        <h4 className="font-medium text-sm">{integration.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{integration.description}</p>
                        <div className="mt-2 space-y-1">
                          <Badge 
                            variant={integration.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {integration.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {integration.coverage}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Metrics & Analytics</h2>
              
              <Alert className="mb-6">
                <BarChart3 className="h-4 w-4" />
                <AlertDescription>
                  Our GitHub integration provides comprehensive metrics across development activity, 
                  team performance, and project health categories.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {metrics.map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Icon className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{metric.name}</h4>
                            <p className="text-xs text-gray-600 mt-1">{metric.description}</p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {metric.category}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Analytics Dashboard Preview */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Analytics Dashboard Features</CardTitle>
                  <CardDescription>
                    Interactive dashboards with real-time GitHub data and customizable views
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Dashboard Capabilities</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Real-time data updates
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Customizable date ranges
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Interactive charts and graphs
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Export to CSV/PDF
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Data Visualization</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Activity heatmaps
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Contributor comparison charts
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Trend analysis graphs
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Performance metrics
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Use Cases Tab */}
        {activeTab === 'use-cases' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Practical Applications</h2>
              
              <div className="space-y-8">
                {useCases.map((useCase, index) => {
                  const Icon = useCase.icon;
                  return (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <Icon className="h-6 w-6 text-blue-600" />
                          {useCase.title}
                        </CardTitle>
                        <CardDescription className="text-base">{useCase.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {useCase.benefits.map((benefit, benefitIndex) => (
                            <div key={benefitIndex} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Success Stories */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Success Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">75%</div>
                      <p className="text-sm text-gray-600">Faster issue identification</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">60%</div>
                      <p className="text-sm text-gray-600">Improved team productivity</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">90%</div>
                      <p className="text-sm text-gray-600">Better decision accuracy</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Monitor Tab */}
        {activeTab === 'monitor' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">GitHub Monitoring Dashboard</h2>
              
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Connect your GitHub repositories to start monitoring development activity, 
                  team performance, and project health in real-time.
                </AlertDescription>
              </Alert>

              <GitHubUpdates />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}