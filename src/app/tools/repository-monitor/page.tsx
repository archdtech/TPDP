"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  GitBranch, 
  Brain, 
  Shield, 
  TrendingUp, 
  Database, 
  FileText, 
  Upload, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  BarChart3,
  Activity,
  Zap,
  Target,
  Clock,
  Users,
  Settings
} from 'lucide-react';
import UniversalRepositoryMonitor from '@/components/UniversalRepositoryMonitor';

export default function RepositoryMonitorPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      title: 'Multi-Source Monitoring',
      description: 'Monitor repositories from GitHub, GitLab, local filesystems, or document uploads',
      icon: Database,
      color: 'text-blue-600'
    },
    {
      title: 'AI-Powered Analysis',
      description: 'Intelligent analysis using advanced AI to understand repository health and progress',
      icon: Brain,
      color: 'text-purple-600'
    },
    {
      title: 'Real-Time Tracking',
      description: 'Continuous monitoring with real-time updates on activity and changes',
      icon: Activity,
      color: 'text-green-600'
    },
    {
      title: 'Risk Assessment',
      description: 'Automatic identification of risks and opportunities with actionable insights',
      icon: Shield,
      color: 'text-red-600'
    }
  ];

  const useCases = [
    {
      title: 'Portfolio Management',
      description: 'Monitor multiple ventures and repositories across your entire portfolio',
      scenarios: [
        'Track development progress across all ventures',
        'Identify stalled or at-risk projects',
        'Compare activity levels between repositories'
      ]
    },
    {
      title: 'Due Diligence',
      description: 'Comprehensive analysis for investment decisions and partnership evaluations',
      scenarios: [
        'Assess technical health of target companies',
        'Evaluate development team activity and quality',
        'Identify technical debt and scalability issues'
      ]
    },
    {
      title: 'Team Performance',
      description: 'Monitor and optimize team productivity and development workflows',
      scenarios: [
        'Track commit frequency and code quality metrics',
        'Identify bottlenecks in development processes',
        'Measure team velocity and predictability'
      ]
    }
  ];

  const integrations = [
    {
      name: 'GitHub',
      description: 'Full integration with GitHub repositories and organizations',
      status: 'active',
      icon: GitBranch
    },
    {
      name: 'GitLab',
      description: 'Support for GitLab self-hosted and cloud instances',
      status: 'active',
      icon: GitBranch
    },
    {
      name: 'Local Repositories',
      description: 'Monitor local Git repositories and project directories',
      status: 'active',
      icon: Database
    },
    {
      name: 'Document Analysis',
      description: 'Extract insights from technical documents and specifications',
      status: 'beta',
      icon: FileText
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <GitBranch className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Universal Repository Monitor</h1>
              <p className="text-blue-100 mt-1">
                AI-powered monitoring and analysis for any software repository
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <CheckCircle className="h-3 w-3 mr-1" />
              Active
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Brain className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Shield className="h-3 w-3 mr-1" />
              Enterprise Ready
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
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
                Intelligent Repository Monitoring for Modern Development
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Transform how you track, analyze, and understand software repositories with 
                AI-powered insights that go beyond basic metrics.
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
                      <p className="text-sm text-gray-600">Repositories Monitored</p>
                      <p className="text-2xl font-bold text-blue-600">250+</p>
                    </div>
                    <Database className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">AI Analysis Accuracy</p>
                      <p className="text-2xl font-bold text-green-600">94%</p>
                    </div>
                    <Brain className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Risk Detection Rate</p>
                      <p className="text-2xl font-bold text-orange-600">87%</p>
                    </div>
                    <Shield className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Real-Time Updates</p>
                      <p className="text-2xl font-bold text-purple-600">24/7</p>
                    </div>
                    <Activity className="h-8 w-8 text-purple-600" />
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
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <h4 className="font-medium">Connect Repository</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Add your GitHub, GitLab, or local repository URLs
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    <h4 className="font-medium">Configure Analysis</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Set monitoring preferences and analysis parameters
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold">3</span>
                    </div>
                    <h4 className="font-medium">View Insights</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Access real-time analytics and AI-powered recommendations
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Button size="lg" onClick={() => setActiveTab('monitor')}>
                    <RefreshCw className="h-4 w-4 mr-2" />
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Monitoring</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <GitBranch className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Multi-Platform Support</h4>
                        <p className="text-sm text-gray-600">
                          Monitor repositories across GitHub, GitLab, Bitbucket, and local filesystems
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Activity className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Real-Time Activity Tracking</h4>
                        <p className="text-sm text-gray-600">
                          Live updates on commits, branches, contributors, and development velocity
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <BarChart3 className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Advanced Analytics</h4>
                        <p className="text-sm text-gray-600">
                          Comprehensive metrics including code quality, team performance, and project health
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Features */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Insights</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Brain className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Intelligent Analysis</h4>
                        <p className="text-sm text-gray-600">
                          AI-driven assessment of repository health, progress, and potential issues
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Risk Assessment</h4>
                        <p className="text-sm text-gray-600">
                          Automatic identification of technical debt, security risks, and scalability concerns
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-indigo-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Opportunity Detection</h4>
                        <p className="text-sm text-gray-600">
                          Identification of optimization opportunities and improvement recommendations
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Integration Support */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Capabilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {integrations.map((integration, index) => {
                    const Icon = integration.icon;
                    return (
                      <Card key={index} className="text-center">
                        <CardContent className="p-4">
                          <Icon className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                          <h4 className="font-medium text-sm">{integration.name}</h4>
                          <p className="text-xs text-gray-600 mt-1">{integration.description}</p>
                          <Badge 
                            variant={integration.status === 'active' ? 'default' : 'secondary'}
                            className="mt-2 text-xs"
                          >
                            {integration.status}
                          </Badge>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Use Cases Tab */}
        {activeTab === 'use-cases' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Practical Applications</h2>
              
              <div className="space-y-8">
                {useCases.map((useCase, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-xl">{useCase.title}</CardTitle>
                      <CardDescription className="text-base">{useCase.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">Common Scenarios:</h4>
                        <ul className="space-y-2">
                          {useCase.scenarios.map((scenario, scenarioIndex) => (
                            <li key={scenarioIndex} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{scenario}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Success Metrics */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Success Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">40%</div>
                      <p className="text-sm text-gray-600">Faster risk detection</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">60%</div>
                      <p className="text-sm text-gray-600">Improved team productivity</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Repository Monitor</h2>
              
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  The Universal Repository Monitor supports multiple input methods including URLs, 
                  local paths, document uploads, and manual data entry. Start monitoring your repositories below.
                </AlertDescription>
              </Alert>

              <UniversalRepositoryMonitor />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}