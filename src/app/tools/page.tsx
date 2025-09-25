"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  GitBranch, 
  Users, 
  ExternalLink, 
  Settings, 
  BarChart3,
  Database,
  Shield,
  Zap,
  Target,
  TrendingUp,
  FileText,
  Code,
  Rocket,
  Star
} from 'lucide-react';
import Link from 'next/link';

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const tools = [
    {
      id: 'repository-monitor',
      title: 'Universal Repository Monitor',
      description: 'AI-powered monitoring for any repository - public, private, local, or document-based',
      category: 'development',
      icon: GitBranch,
      color: 'bg-blue-500',
      href: '/tools/repository-monitor',
      features: [
        'Multi-source monitoring (Git, local, documents)',
        'AI-enhanced analysis',
        'Real-time activity tracking',
        'Risk assessment & opportunity identification'
      ],
      status: 'active',
      isPremium: false
    },
    {
      id: 'investor-sharing',
      title: 'Investor Sharing Platform',
      description: 'Secure, professional portfolio sharing with password protection and analytics',
      category: 'business',
      icon: Users,
      color: 'bg-green-500',
      href: '/tools/investor-sharing',
      features: [
        'Multiple presentation templates',
        'Password-protected access',
        'Detailed analytics & tracking',
        'Customizable branding & messaging'
      ],
      status: 'active',
      isPremium: false
    },
    {
      id: 'github-integration',
      title: 'GitHub Integration Suite',
      description: 'Comprehensive GitHub repository management with advanced insights',
      category: 'development',
      icon: Code,
      color: 'bg-purple-500',
      href: '/tools/github-integration',
      features: [
        'Repository activity monitoring',
        'Contributor analysis',
        'Code quality metrics',
        'Release & issue tracking'
      ],
      status: 'active',
      isPremium: false
    },
    {
      id: 'bmad-method',
      title: 'BMAD-METHOD Integration',
      description: 'Advanced AI agent framework for systematic software development',
      category: 'ai-framework',
      icon: Brain,
      color: 'bg-orange-500',
      href: '/tools/bmad-method',
      features: [
        'Agentic planning & development',
        'Multi-agent collaboration',
        'Context-engineered workflows',
        'Domain-specific expansion packs'
      ],
      status: 'new',
      isPremium: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Tools', count: tools.length },
    { id: 'development', name: 'Development', count: tools.filter(t => t.category === 'development').length },
    { id: 'business', name: 'Business', count: tools.filter(t => t.category === 'business').length },
    { id: 'ai-framework', name: 'AI Framework', count: tools.filter(t => t.category === 'ai-framework').length }
  ];

  const filteredTools = activeCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === activeCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'beta': return 'bg-yellow-100 text-yellow-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Advanced Tools</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Powerful tools and integrations to enhance your venture studio operations, 
              development workflows, and investor relations.
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className="flex items-center gap-2"
            >
              {category.name}
              <Badge variant="secondary" className="text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card key={tool.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${tool.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl flex items-center gap-2">
                          {tool.title}
                          {tool.isPremium && (
                            <Star className="h-4 w-4 text-yellow-500" />
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {tool.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(tool.status)}>
                      {tool.status.charAt(0).toUpperCase() + tool.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Features */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Key Features</h4>
                    <ul className="space-y-1">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action */}
                  <Link href={tool.href}>
                    <Button className="w-full" size="lg">
                      <Rocket className="h-4 w-4 mr-2" />
                      Explore Tool
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Settings className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
            <p className="text-gray-600">Try selecting a different category.</p>
          </div>
        )}
      </div>

      {/* Getting Started Section */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Each tool is designed to integrate seamlessly with your venture studio workflow. 
              Start with the tool that best addresses your current needs.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Assess Needs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Identify which tools align with your current challenges and goals.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="text-center">
                  <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Quick Start</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Each tool includes guided setup and configuration for immediate use.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="text-center">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Scale & Integrate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Combine tools and expand usage as your venture studio grows.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}