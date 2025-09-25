"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Shield, 
  Eye, 
  Download, 
  BarChart3, 
  FileText, 
  Lock,
  CheckCircle,
  AlertTriangle,
  Info,
  TrendingUp,
  Clock,
  ExternalLink,
  Mail,
  Phone,
  Building2,
  Star,
  Zap,
  Target,
  Database,
  Activity
} from 'lucide-react';
import InvestorManagementDashboard from '@/components/InvestorManagementDashboard';

export default function InvestorSharingPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      title: 'Secure Access Control',
      description: 'Password-protected access with customizable security settings',
      icon: Shield,
      color: 'text-blue-600'
    },
    {
      title: 'Multiple Presentation Templates',
      description: 'Professional templates tailored for different investor types',
      icon: FileText,
      color: 'text-green-600'
    },
    {
      title: 'Detailed Analytics',
      description: 'Comprehensive tracking of views, engagement, and access patterns',
      icon: BarChart3,
      color: 'text-purple-600'
    },
    {
      title: 'Custom Branding',
      description: 'White-label solutions with your company branding and messaging',
      icon: Building2,
      color: 'text-orange-600'
    }
  ];

  const templates = [
    {
      name: 'Professional',
      description: 'Clean, corporate presentation for traditional investors',
      bestFor: 'Institutional investors, VCs, corporate partners',
      features: [
        'Executive summary focus',
        'Financial metrics emphasis',
        'Risk assessment highlights',
        'Professional branding'
      ]
    },
    {
      name: 'Detailed',
      description: 'Comprehensive view with full technical and business details',
      bestFor: 'Technical investors, strategic partners, due diligence',
      features: [
        'Complete venture details',
        'Technical specifications',
        'Market analysis depth',
        'Team expertise showcase'
      ]
    },
    {
      name: 'Executive',
      description: 'High-level overview for busy executives and decision-makers',
      bestFor: 'C-level executives, board members, time-sensitive investors',
      features: [
        'Key metrics dashboard',
        'Strategic highlights',
        'ROI focus',
        'Quick scan format'
      ]
    },
    {
      name: 'Technical',
      description: 'Deep technical analysis for technically-savvy investors',
      bestFor: 'Technical investors, CTOs, engineering-focused VCs',
      features: [
        'Architecture details',
        'Technology stack analysis',
        'Development roadmap',
        'Technical risk assessment'
      ]
    }
  ];

  const securityFeatures = [
    {
      title: 'Password Protection',
      description: 'Custom passwords for each share with configurable complexity requirements',
      icon: Lock,
      level: 'Essential'
    },
    {
      title: 'Access Expiration',
      description: 'Set automatic expiration dates for time-limited access',
      icon: Clock,
      level: 'Enhanced'
    },
    {
      title: 'View Limitations',
      description: 'Restrict number of views or access duration',
      icon: Eye,
      level: 'Advanced'
    },
    {
      title: 'IP Restrictions',
      description: 'Limit access to specific IP ranges or geographic locations',
      icon: Shield,
      level: 'Enterprise'
    }
  ];

  const analyticsMetrics = [
    {
      metric: 'View Count',
      description: 'Total number of times your presentation has been viewed',
      importance: 'High',
      icon: Eye
    },
    {
      metric: 'Engagement Duration',
      description: 'Average time spent viewing each venture',
      importance: 'High',
      icon: Clock
    },
    {
      metric: 'Access Patterns',
      description: 'When and how often investors access your portfolio',
      importance: 'Medium',
      icon: Activity
    },
    {
      metric: 'Device Information',
      description: 'Types of devices used to access presentations',
      importance: 'Medium',
      icon: Database
    },
    {
      metric: 'Geographic Data',
      description: 'Locations from which presentations are accessed',
      importance: 'Low',
      icon: Target
    },
    {
      metric: 'Download Activity',
      description: 'Tracking of report downloads and offline access',
      importance: 'Low',
      icon: Download
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Investor Sharing Platform</h1>
              <p className="text-green-100 mt-1">
                Secure, professional portfolio sharing with comprehensive analytics
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <CheckCircle className="h-3 w-3 mr-1" />
              Enterprise Grade
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Shield className="h-3 w-3 mr-1" />
              Bank-Level Security
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <BarChart3 className="h-3 w-3 mr-1" />
              Real-Time Analytics
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
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="manage">Manage</TabsTrigger>
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
                Professional Investor Relations Made Simple
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Create secure, branded presentations for investors with detailed analytics 
                and complete control over your portfolio narrative.
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
                      <p className="text-sm text-gray-600">Active Shares</p>
                      <p className="text-2xl font-bold text-green-600">150+</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Views</p>
                      <p className="text-2xl font-bold text-blue-600">2.5K</p>
                    </div>
                    <Eye className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg. Engagement</p>
                      <p className="text-2xl font-bold text-purple-600">8.5min</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Security Score</p>
                      <p className="text-2xl font-bold text-orange-600">A+</p>
                    </div>
                    <Shield className="h-8 w-8 text-orange-600" />
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
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 font-bold">1</span>
                    </div>
                    <h4 className="font-medium">Select Ventures</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Choose which ventures to include in your presentation
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold">2</span>
                    </div>
                    <h4 className="font-medium">Customize Template</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Configure branding, messaging, and presentation style
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold">3</span>
                    </div>
                    <h4 className="font-medium">Share Securely</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Generate secure links and track investor engagement
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Button size="lg" onClick={() => setActiveTab('manage')}>
                    <Users className="h-4 w-4 mr-2" />
                    Create Your First Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Presentation Templates</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {templates.map((template, index) => (
                  <Card key={index} className="h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{template.name}</CardTitle>
                          <CardDescription className="mt-2">{template.description}</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Template {index + 1}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Best For:</h4>
                        <p className="text-sm text-gray-600">{template.bestFor}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
                        <ul className="space-y-1">
                          {template.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button variant="outline" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Preview Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Security & Access Control</h2>
              
              <Alert className="mb-6">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Our investor sharing platform employs bank-level security measures to protect 
                  your sensitive portfolio information and ensure controlled access.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {securityFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Icon className="h-6 w-6 text-blue-600" />
                          <div>
                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                            <Badge variant="secondary" className="mt-1">
                              {feature.level}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Security Compliance */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Compliance & Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-medium">SOC 2 Type II</h4>
                      <p className="text-sm text-gray-600 mt-1">Annual security audits</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Lock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-medium">GDPR Compliant</h4>
                      <p className="text-sm text-gray-600 mt-1">Data protection standards</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-medium">ISO 27001</h4>
                      <p className="text-sm text-gray-600 mt-1">Information security management</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Comprehensive Analytics</h2>
              
              <Alert className="mb-6">
                <BarChart3 className="h-4 w-4" />
                <AlertDescription>
                  Track every aspect of investor engagement with detailed analytics that help 
                  you understand interest levels and optimize your presentations.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analyticsMetrics.map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Icon className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm">{metric.metric}</h4>
                              <Badge 
                                variant={metric.importance === 'High' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {metric.importance}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">{metric.description}</p>
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
                  <CardTitle>Analytics Dashboard Preview</CardTitle>
                  <CardDescription>
                    Real-time insights into investor engagement and presentation performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Interactive analytics dashboard</p>
                    <p className="text-sm text-gray-500 mt-1">
                      View detailed metrics, engagement patterns, and investor behavior
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Manage Tab */}
        {activeTab === 'manage' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Investor Sharing Management</h2>
              
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Create and manage secure investor shares with full control over presentation 
                  templates, access settings, and branding options.
                </AlertDescription>
              </Alert>

              <InvestorManagementDashboard ventures={[]} onRefresh={() => {}} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}