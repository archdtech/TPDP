"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Users, 
  Code, 
  FileText, 
  Target, 
  Zap, 
  Shield,
  CheckCircle,
  AlertTriangle,
  Info,
  TrendingUp,
  Clock,
  Database,
  BarChart3,
  Settings,
  Star,
  Rocket,
  GitBranch,
  Lightbulb,
  Puzzle,
  Workflow
} from 'lucide-react';

export default function BMADMethodPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const coreFeatures = [
    {
      title: 'Agentic Planning',
      description: 'Dedicated AI agents collaborate to create detailed, consistent PRDs and architecture documents',
      icon: Brain,
      color: 'text-purple-600',
      details: [
        'Analyst agent for market research',
        'PM agent for requirement gathering',
        'Architect agent for technical design',
        'Human-in-the-loop refinement'
      ]
    },
    {
      title: 'Context-Engineered Development',
      description: 'Scrum Master transforms plans into hyper-detailed development stories with complete context',
      icon: Code,
      color: 'text-blue-600',
      details: [
        'Full context embedded in story files',
        'Implementation details included',
        'Architectural guidance provided',
        'Eliminates context loss'
      ]
    },
    {
      title: 'Multi-Agent Collaboration',
      description: 'Specialized agents work together seamlessly through structured workflows',
      icon: Users,
      color: 'text-green-600',
      details: [
        '7 specialized core agents',
        'Role-based expertise',
        'Structured communication',
        'Quality assurance integration'
      ]
    },
    {
      title: 'Domain Expansion',
      description: 'Extensible framework that works beyond software development',
      icon: Target,
      color: 'text-orange-600',
      details: [
        'Creative writing agents',
        'Game development packs',
        'Business strategy tools',
        'Custom agent creation'
      ]
    }
  ];

  const agents = [
    {
      name: 'BMAD Master',
      role: 'Orchestration',
      description: 'Coordinates all agents and ensures workflow consistency',
      icon: Brain,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      name: 'Analyst',
      role: 'Research & Analysis',
      description: 'Conducts market research, competitive analysis, and requirement gathering',
      icon: BarChart3,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Product Manager',
      role: 'Requirements',
      description: 'Creates detailed PRDs and manages product requirements',
      icon: FileText,
      color: 'bg-green-100 text-green-800'
    },
    {
      name: 'Architect',
      role: 'Technical Design',
      description: 'Designs system architecture and technical specifications',
      icon: GitBranch,
      color: 'bg-orange-100 text-orange-800'
    },
    {
      name: 'Scrum Master',
      role: 'Development Coordination',
      description: 'Creates detailed development stories and manages workflow',
      icon: Workflow,
      color: 'bg-red-100 text-red-800'
    },
    {
      name: 'Developer',
      role: 'Implementation',
      description: 'Writes code based on detailed story specifications',
      icon: Code,
      color: 'bg-indigo-100 text-indigo-800'
    },
    {
      name: 'QA Specialist',
      role: 'Quality Assurance',
      description: 'Ensures quality through testing and validation',
      icon: Shield,
      color: 'bg-yellow-100 text-yellow-800'
    }
  ];

  const expansionPacks = [
    {
      name: 'Game Development',
      description: 'Specialized agents for game development across multiple engines',
      icon: Puzzle,
      packs: [
        'Godot Game Dev',
        'Unity 2D Game Dev',
        'Phaser 2D Game Dev'
      ],
      status: 'active'
    },
    {
      name: 'Creative Writing',
      description: 'Agents for novel writing, screenwriting, and content creation',
      icon: FileText,
      packs: [
        'Novel Writing',
        'Screenplay Development',
        'Content Creation'
      ],
      status: 'active'
    },
    {
      name: 'Infrastructure & DevOps',
      description: 'Agents for infrastructure design and DevOps workflows',
      icon: Database,
      packs: [
        'Infrastructure DevOps'
      ],
      status: 'beta'
    }
  ];

  const workflow = [
    {
      phase: 'Planning Phase',
      description: 'AI agents collaborate with you to create comprehensive specifications',
      steps: [
        'Analyst researches market and requirements',
        'PM creates detailed PRDs',
        'Architect designs technical solutions',
        'Human review and refinement'
      ],
      icon: Brain,
      color: 'text-purple-600'
    },
    {
      phase: 'Development Cycle',
      description: 'Structured development with complete context preservation',
      steps: [
        'Scrum Master creates detailed stories',
        'Developer implements with full context',
        'QA validates and tests',
        'Iterative refinement'
      ],
      icon: Code,
      color: 'text-blue-600'
    },
    {
      phase: 'Quality Assurance',
      description: 'Comprehensive testing and validation throughout the process',
      steps: [
        'Automated testing integration',
        'Code quality assessment',
        'Requirement validation',
        'Documentation verification'
      ],
      icon: Shield,
      color: 'text-green-600'
    }
  ];

  const benefits = [
    {
      title: 'Eliminates Planning Inconsistency',
      description: 'AI agents work together to ensure consistent, comprehensive planning',
      icon: CheckCircle,
      impact: 'High'
    },
    {
      title: 'Prevents Context Loss',
      description: 'Complete context is embedded in every development story',
      icon: Database,
      impact: 'Critical'
    },
    {
      title: 'Accelerates Development',
      description: 'Detailed specifications reduce ambiguity and rework',
      icon: Rocket,
      impact: 'High'
    },
    {
      title: 'Improves Quality',
      description: 'Integrated QA and validation throughout the process',
      icon: Shield,
      impact: 'Medium'
    },
    {
      title: 'Enhances Collaboration',
      description: 'Structured workflows improve team coordination',
      icon: Users,
      impact: 'Medium'
    },
    {
      title: 'Scales with Projects',
      description: 'Framework works for small to large-scale projects',
      icon: TrendingUp,
      impact: 'High'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Brain className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">BMAD-METHOD™ Integration</h1>
              <p className="text-purple-100 mt-1">
                Advanced AI agent framework for systematic software development and beyond
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <CheckCircle className="h-3 w-3 mr-1" />
              Production Ready
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Star className="h-3 w-3 mr-1" />
              Enterprise Grade
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Zap className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="workflow">Workflow</TabsTrigger>
              <TabsTrigger value="expansion">Expansion</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="implement">Implement</TabsTrigger>
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
                Transform Development with AI Agent Framework
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                BMAD-METHOD™ revolutionizes software development through agentic planning and 
                context-engineered development, eliminating the biggest problems in AI-assisted development.
              </p>
            </div>

            {/* Key Innovations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-purple-800">
                    <Brain className="h-6 w-6" />
                    Agentic Planning
                  </CardTitle>
                  <CardDescription className="text-purple-700">
                    Dedicated AI agents collaborate to create detailed, consistent specifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      Analyst agent for market research
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      PM agent for requirement gathering
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      Architect agent for technical design
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      Human-in-the-loop refinement
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-blue-800">
                    <Code className="h-6 w-6" />
                    Context-Engineered Development
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    Scrum Master transforms plans into hyper-detailed development stories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      Full context embedded in story files
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      Implementation details included
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      Architectural guidance provided
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      Eliminates context loss
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Core Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <Icon className={`h-8 w-8 mx-auto ${feature.color}`} />
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                      <div className="space-y-1">
                        {feature.details.slice(0, 2).map((detail, detailIndex) => (
                          <div key={detailIndex} className="text-xs text-gray-500">
                            • {detail}
                          </div>
                        ))}
                      </div>
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
                      <p className="text-sm text-gray-600">Core Agents</p>
                      <p className="text-2xl font-bold text-purple-600">7</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Expansion Packs</p>
                      <p className="text-2xl font-bold text-blue-600">15+</p>
                    </div>
                    <Puzzle className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Domains Supported</p>
                      <p className="text-2xl font-bold text-green-600">10+</p>
                    </div>
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Context Accuracy</p>
                      <p className="text-2xl font-bold text-orange-600">95%</p>
                    </div>
                    <Brain className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Specialized AI Agents</h2>
              
              <Alert className="mb-6">
                <Users className="h-4 w-4" />
                <AlertDescription>
                  BMAD-METHOD™ features 7 specialized AI agents, each with specific expertise and responsibilities.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent, index) => {
                  const Icon = agent.icon;
                  return (
                    <Card key={index} className="h-full">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${agent.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{agent.name}</CardTitle>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {agent.role}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{agent.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Agent Collaboration */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Workflow className="h-5 w-5" />
                    Agent Collaboration Workflow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                        <span>Planning Phase</span>
                      </div>
                      <div className="text-gray-400">→</div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        <span>Development Phase</span>
                      </div>
                      <div className="text-gray-400">→</div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        <span>Quality Assurance</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 border rounded-lg">
                        <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-medium">Planning Team</h4>
                        <p className="text-xs text-gray-600 mt-1">Analyst, PM, Architect</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Code className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-medium">Development Team</h4>
                        <p className="text-xs text-gray-600 mt-1">Scrum Master, Developer</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-medium">Quality Team</h4>
                        <p className="text-xs text-gray-600 mt-1">QA Specialist</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Workflow Tab */}
        {activeTab === 'workflow' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Development Workflow</h2>
              
              <div className="space-y-8">
                {workflow.map((phase, index) => {
                  const Icon = phase.icon;
                  return (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <Icon className={`h-6 w-6 ${phase.color}`} />
                          {phase.phase}
                        </CardTitle>
                        <CardDescription className="text-base">{phase.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {phase.steps.map((step, stepIndex) => (
                            <div key={stepIndex} className="flex items-start gap-3 p-3 border rounded-lg">
                              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-medium text-blue-600">{stepIndex + 1}</span>
                              </div>
                              <span className="text-sm text-gray-700">{step}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Workflow Visualization */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Complete Workflow Overview</CardTitle>
                  <CardDescription>
                    End-to-end process from initial planning to final delivery
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-8">
                    <div className="max-w-4xl mx-auto">
                      <div className="flex items-center justify-between mb-8">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Brain className="h-8 w-8 text-purple-600" />
                          </div>
                          <h4 className="font-medium">Planning</h4>
                          <p className="text-xs text-gray-600">AI agents create specs</p>
                        </div>
                        
                        <div className="text-gray-400">→</div>
                        
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Workflow className="h-8 w-8 text-blue-600" />
                          </div>
                          <h4 className="font-medium">Stories</h4>
                          <p className="text-xs text-gray-600">Detailed development tasks</p>
                        </div>
                        
                        <div className="text-gray-400">→</div>
                        
                        <div className="text-center">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Code className="h-8 w-8 text-green-600" />
                          </div>
                          <h4 className="font-medium">Development</h4>
                          <p className="text-xs text-gray-600">Context-aware implementation</p>
                        </div>
                        
                        <div className="text-gray-400">→</div>
                        
                        <div className="text-center">
                          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Shield className="h-8 w-8 text-orange-600" />
                          </div>
                          <h4 className="font-medium">Quality</h4>
                          <p className="text-xs text-gray-600">Validation & testing</p>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-600">
                          Continuous feedback loop ensures quality and alignment with requirements
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Expansion Tab */}
        {activeTab === 'expansion' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Expansion Packs</h2>
              
              <Alert className="mb-6">
                <Target className="h-4 w-4" />
                <AlertDescription>
                  BMAD-METHOD™ works beyond software development. Explore our expansion packs for different domains.
                </AlertDescription>
              </Alert>

              <div className="space-y-6">
                {expansionPacks.map((pack, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-6 w-6 text-blue-600" />
                          <div>
                            <CardTitle className="text-xl">{pack.name}</CardTitle>
                            <CardDescription className="text-base">{pack.description}</CardDescription>
                          </div>
                        </div>
                        <Badge 
                          variant={pack.status === 'active' ? 'default' : 'secondary'}
                          className={pack.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                        >
                          {pack.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Available Packs:</h4>
                          <div className="flex flex-wrap gap-2">
                            {pack.packs.map((packName, packIndex) => (
                              <Badge key={packIndex} variant="outline" className="text-sm">
                                {packName}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          Each expansion pack includes specialized agents, templates, workflows, and documentation 
                          tailored for the specific domain.
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Custom Agent Creation */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Create Your Own Agents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Agent Creation Process</h4>
                      <ol className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium">1</span>
                          Define agent role and expertise
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium">2</span>
                          Create specialized prompts and templates
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium">3</span>
                          Configure workflows and integrations
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium">4</span>
                          Test and validate agent performance
                        </li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Supported Capabilities</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Custom knowledge bases
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Domain-specific workflows
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Integration with core agents
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Quality assurance integration
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Benefits Tab */}
        {activeTab === 'benefits' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Benefits & Impact</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Icon className="h-6 w-6 text-blue-600" />
                          <div>
                            <CardTitle className="text-lg">{benefit.title}</CardTitle>
                            <Badge 
                              variant={benefit.impact === 'Critical' ? 'destructive' : 'default'}
                              className="mt-1 text-xs"
                            >
                              {benefit.impact} Impact
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Success Metrics */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Measurable Success Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">70%</div>
                      <p className="text-sm text-gray-600">Reduction in planning time</p>
                      <p className="text-xs text-gray-500 mt-1">Comprehensive specifications generated faster</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
                      <p className="text-sm text-gray-600">Decrease in context-related errors</p>
                      <p className="text-xs text-gray-500 mt-1">Complete context preservation</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">3x</div>
                      <p className="text-sm text-gray-600">Development velocity increase</p>
                      <p className="text-xs text-gray-500 mt-1">Clear, detailed implementation guidance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Implement Tab */}
        {activeTab === 'implement' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Implementation Guide</h2>
              
              <Alert className="mb-6">
                <Rocket className="h-4 w-4" />
                <AlertDescription>
                  Get started with BMAD-METHOD™ in your project with our comprehensive implementation guide.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Installation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Quick Installation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">One-Command Install</h4>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <code className="text-sm">npx bmad-method install</code>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Automatically detects and updates existing installations
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Manual Installation</h4>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <code className="text-sm">git clone https://github.com/bmadcode/BMAD-METHOD.git</code>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Clone and build from source
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Getting Started */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      First Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Web UI Setup (2 minutes)</h4>
                      <ol className="space-y-2 text-sm">
                        <li>Get the full stack team file</li>
                        <li>Create AI agent (Gemini/CustomGPT)</li>
                        <li>Upload and configure with instructions</li>
                        <li>Start planning with <code>*help</code></li>
                      </ol>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">IDE Integration</h4>
                      <ol className="space-y-2 text-sm">
                        <li>Switch to IDE after planning phase</li>
                        <li>Use generated story files</li>
                        <li>Follow development workflow</li>
                        <li>Integrate with existing tools</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Configuration */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Configuration Options</CardTitle>
                  <CardDescription>
                    Customize BMAD-METHOD™ for your specific needs and workflow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Core Configuration</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Agent selection and customization
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Workflow template configuration
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Integration with existing tools
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Quality gate settings
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Advanced Options</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Custom agent creation
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Expansion pack management
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          API and webhook integration
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Enterprise features
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}