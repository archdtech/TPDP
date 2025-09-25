"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Download,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Shield,
  TrendingDown,
  Eye,
  Filter
} from 'lucide-react';

// Import the mobile styles
import './mobile-styles.css';

interface Venture {
  id: string;
  name: string;
  description: string;
  category: string;
  stage: string;
  maturity: number;
  priority: string;
  status: string;
  problemWorld?: string;
  newWorld?: string;
  valueUnlock?: string;
  originStory?: string;
  deepCapability?: string;
  unfairAdvantage?: string;
  unlockFactor?: string;
  inevitability?: string;
  urgencyTrigger?: string;
  marketSize?: string;
  fundingNeed?: string;
  timeline?: string;
  repository?: string;
  language?: string;
  createdAt: string;
  lastUpdated: string;
}

interface Analytics {
  portfolioHealth: {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  };
  maturityAnalysis: {
    averageMaturity: number;
    maturityDistribution: { [key: string]: number };
    maturityTrend: 'improving' | 'stable' | 'declining';
  };
  riskAssessment: {
    overallRisk: 'low' | 'medium' | 'high';
    riskFactors: {
      concentration: number;
      execution: number;
      market: number;
      funding: number;
    };
    recommendations: string[];
  };
  performanceMetrics: {
    totalVentures: number;
    activeVentures: number;
    highPriorityVentures: number;
    mvpReadyVentures: number;
    averageMaturity: number;
    portfolioScore: number;
  };
  strategicInsights: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

export default function MobileOptimizedDashboard() {
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingVenture, setEditingVenture] = useState<Venture | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [venturesResponse, analyticsResponse] = await Promise.all([
        fetch('/api/ventures'),
        fetch('/api/analytics')
      ]);
      
      if (venturesResponse.ok) {
        const venturesData = await venturesResponse.json();
        setVentures(venturesData);
      }
      
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVenture = async (ventureData: Partial<Venture>) => {
    try {
      const response = await fetch('/api/ventures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventureData)
      });
      
      if (response.ok) {
        await fetchData();
        setShowAddDialog(false);
      }
    } catch (error) {
      console.error('Error creating venture:', error);
    }
  };

  const handleUpdateVenture = async (ventureData: Partial<Venture>) => {
    if (!editingVenture) return;
    
    try {
      const response = await fetch(`/api/ventures/${editingVenture.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventureData)
      });
      
      if (response.ok) {
        await fetchData();
        setShowEditDialog(false);
        setEditingVenture(null);
      }
    } catch (error) {
      console.error('Error updating venture:', error);
    }
  };

  const handleDeleteVenture = async (id: string) => {
    if (!confirm('Are you sure you want to delete this venture?')) return;
    
    try {
      const response = await fetch(`/api/ventures/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error deleting venture:', error);
    }
  };

  const getStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      'idea': 'bg-gray-500',
      'prototype': 'bg-blue-500',
      'mvp': 'bg-green-500',
      'growth': 'bg-purple-500',
      'maturity': 'bg-orange-500'
    };
    return colors[stage] || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'high': 'bg-red-500',
      'medium': 'bg-yellow-500',
      'low': 'bg-green-500'
    };
    return colors[priority] || 'bg-gray-500';
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'active': 'bg-green-500',
      'paused': 'bg-yellow-500',
      'completed': 'bg-blue-500',
      'terminated': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  // Filter ventures based on selected filters
  const filteredVentures = ventures.filter(venture => {
    const categoryMatch = selectedCategory === 'all' || venture.category === selectedCategory;
    const stageMatch = selectedStage === 'all' || venture.stage === selectedStage;
    return categoryMatch && stageMatch;
  });

  // Portfolio metrics
  const totalVentures = ventures.length;
  const activeVentures = ventures.filter(v => v.status === 'active').length;
  const avgMaturity = ventures.length > 0 ? 
    Math.round(ventures.reduce((sum, v) => sum + v.maturity, 0) / ventures.length) : 0;
  const highPriorityVentures = ventures.filter(v => v.priority === 'high').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading Portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Venture Studio</h1>
                <p className="text-xs text-gray-500">Portfolio Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>
              
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="hidden sm:flex">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Add Venture</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] md:max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Venture</DialogTitle>
                    <DialogDescription>
                      Create a new venture in your portfolio
                    </DialogDescription>
                  </DialogHeader>
                  <VentureForm onSubmit={handleCreateVenture} onCancel={() => setShowAddDialog(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <div className="px-4 py-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Quick Actions</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Template
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <PieChart className="h-4 w-4 mr-2" />
                  Reports
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {/* Portfolio Intelligence - Mobile First */}
        {analytics && (
          <div className="px-4 py-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Portfolio Intelligence</h2>
              <p className="text-sm text-gray-600">Real-time insights and recommendations</p>
            </div>
            
            {/* Key Metrics - Mobile Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <div className={`text-2xl font-bold ${
                  analytics.portfolioHealth.grade === 'A' ? 'text-green-600' :
                  analytics.portfolioHealth.grade === 'B' ? 'text-blue-600' :
                  analytics.portfolioHealth.grade === 'C' ? 'text-yellow-600' :
                  analytics.portfolioHealth.grade === 'D' ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {analytics.portfolioHealth.grade}
                </div>
                <div className="text-xs text-gray-500 mt-1">Portfolio Grade</div>
                <div className="text-xs text-gray-400">{analytics.portfolioHealth.status}</div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <div className="text-2xl font-bold text-blue-600">{analytics.portfolioHealth.score}</div>
                <div className="text-xs text-gray-500 mt-1">Health Score</div>
                <Progress value={analytics.portfolioHealth.score} className="mt-2 h-2" />
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <div className={`text-2xl font-bold ${
                  analytics.riskAssessment.overallRisk === 'low' ? 'text-green-600' :
                  analytics.riskAssessment.overallRisk === 'medium' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {analytics.riskAssessment.overallRisk}
                </div>
                <div className="text-xs text-gray-500 mt-1">Risk Level</div>
                <div className="text-xs text-gray-400">Overall</div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <div className="text-2xl font-bold text-green-600">{analytics.maturityAnalysis.averageMaturity}%</div>
                <div className="text-xs text-gray-500 mt-1">Avg Maturity</div>
                <div className="text-xs text-gray-400 capitalize">{analytics.maturityAnalysis.maturityTrend}</div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <div className="text-2xl font-bold text-purple-600">{analytics.performanceMetrics.mvpReadyVentures}</div>
                <div className="text-xs text-gray-500 mt-1">MVP Ready</div>
                <div className="text-xs text-gray-400">ventures</div>
              </div>
            </div>
            
            {/* Strategic Insights - Mobile Stacked */}
            <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
              {/* Strengths & Opportunities */}
              <Card className="h-fit">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Strengths & Opportunities
                  </CardTitle>
                  <CardDescription className="text-sm">
                    What we're doing well and where we can grow
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Core Strengths
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-800">WHAT</Badge>
                    </h5>
                    <ul className="text-sm space-y-2">
                      {analytics.strategicInsights.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2 text-green-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <span className="font-medium">{strength}</span>
                            <div className="text-xs text-green-600 mt-1">
                              <Badge variant="outline" className="text-xs">WHY</Badge> This gives us competitive advantage
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Growth Opportunities
                      <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">WHAT</Badge>
                    </h5>
                    <ul className="text-sm space-y-2">
                      {analytics.strategicInsights.opportunities.map((opportunity, index) => (
                        <li key={index} className="flex items-start gap-2 text-blue-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <span className="font-medium">{opportunity}</span>
                            <div className="text-xs text-blue-600 mt-1">
                              <Badge variant="outline" className="text-xs">WHY</Badge> Market timing favors scaling
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Weaknesses & Threats */}
              <Card className="h-fit">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Weaknesses & Threats
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Areas needing improvement and external risks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Critical Weaknesses
                      <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800">WHAT</Badge>
                    </h5>
                    <ul className="text-sm space-y-2">
                      {analytics.strategicInsights.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start gap-2 text-orange-700">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <span className="font-medium">{weakness}</span>
                            <div className="text-xs text-orange-600 mt-1">
                              <Badge variant="outline" className="text-xs">WHY</Badge> Could delay returns
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      External Threats
                      <Badge variant="outline" className="text-xs bg-red-100 text-red-800">WHAT</Badge>
                    </h5>
                    <ul className="text-sm space-y-2">
                      {analytics.strategicInsights.threats.map((threat, index) => (
                        <li key={index} className="flex items-start gap-2 text-red-700">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <span className="font-medium">{threat}</span>
                            <div className="text-xs text-red-600 mt-1">
                              <Badge variant="outline" className="text-xs">WHY</Badge> Impacts success probability
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Strategic Recommendations - Mobile Optimized */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5" />
                  Strategic Recommendations
                </CardTitle>
                <CardDescription className="text-sm">
                  Time-based action plan to maximize portfolio success
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                    <h5 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Immediate Actions
                      <Badge variant="outline" className="text-xs bg-red-100 text-red-800">30 DAYS</Badge>
                    </h5>
                    <div className="space-y-3">
                      {analytics.recommendations.immediate.map((rec, index) => (
                        <div key={index} className="bg-white p-3 rounded border border-red-200">
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                            <div>
                              <span className="font-medium text-red-800 text-sm">{rec}</span>
                              <div className="text-xs text-red-600 mt-1">
                                <Badge variant="outline" className="text-xs">WHY</Badge> Critical for foundation
                              </div>
                              <div className="text-xs text-red-500 mt-1">
                                <Badge variant="outline" className="text-xs">IMPACT</Badge> High
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                    <h5 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Short-Term Focus
                      <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">90 DAYS</Badge>
                    </h5>
                    <div className="space-y-3">
                      {analytics.recommendations.shortTerm.map((rec, index) => (
                        <div key={index} className="bg-white p-3 rounded border border-yellow-200">
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                            <div>
                              <span className="font-medium text-yellow-800 text-sm">{rec}</span>
                              <div className="text-xs text-yellow-600 mt-1">
                                <Badge variant="outline" className="text-xs">WHY</Badge> Builds momentum
                              </div>
                              <div className="text-xs text-yellow-500 mt-1">
                                <Badge variant="outline" className="text-xs">IMPACT</Badge> Medium
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <h5 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Long-Term Vision
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-800">12 MONTHS</Badge>
                    </h5>
                    <div className="space-y-3">
                      {analytics.recommendations.longTerm.map((rec, index) => (
                        <div key={index} className="bg-white p-3 rounded border border-green-200">
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            <div>
                              <span className="font-medium text-green-800 text-sm">{rec}</span>
                              <div className="text-xs text-green-600 mt-1">
                                <Badge variant="outline" className="text-xs">WHY</Badge> Creates advantage
                              </div>
                              <div className="text-xs text-green-500 mt-1">
                                <Badge variant="outline" className="text-xs">IMPACT</Badge> High
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Portfolio Metrics - Mobile Optimized */}
        <div className="px-4 py-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Portfolio Overview</h2>
            <p className="text-sm text-gray-600">Key metrics and performance indicators</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Ventures</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalVentures}</div>
              </CardContent>
            </Card>
            
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Ventures</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeVentures}</div>
              </CardContent>
            </Card>
            
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Maturity</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgMaturity}%</div>
                <Progress value={avgMaturity} className="mt-2 h-2" />
              </CardContent>
            </Card>
            
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{highPriorityVentures}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Ventures List - Mobile Optimized */}
        <div className="px-4 py-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Venture Portfolio</h2>
            <p className="text-sm text-gray-600">Manage and track your ventures</p>
          </div>
          
          {/* Mobile Filters */}
          <div className="lg:hidden mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button 
                variant={selectedCategory === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="whitespace-nowrap"
              >
                All Categories
              </Button>
              <Button 
                variant={selectedCategory === 'Health & Nutrition' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedCategory('Health & Nutrition')}
                className="whitespace-nowrap"
              >
                Health
              </Button>
              <Button 
                variant={selectedCategory === 'Relationships & Social' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedCategory('Relationships & Social')}
                className="whitespace-nowrap"
              >
                Social
              </Button>
              <Button 
                variant={selectedCategory === 'Vendor & Risk Management' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedCategory('Vendor & Risk Management')}
                className="whitespace-nowrap"
              >
                Risk
              </Button>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 mt-2">
              <Button 
                variant={selectedStage === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedStage('all')}
                className="whitespace-nowrap"
              >
                All Stages
              </Button>
              <Button 
                variant={selectedStage === 'mvp' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedStage('mvp')}
                className="whitespace-nowrap"
              >
                MVP Ready
              </Button>
              <Button 
                variant={selectedStage === 'growth' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedStage('growth')}
                className="whitespace-nowrap"
              >
                Growth
              </Button>
              <Button 
                variant={selectedStage === 'prototype' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedStage('prototype')}
                className="whitespace-nowrap"
              >
                Prototype
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="hidden lg:flex w-full justify-start mb-6">
              <TabsTrigger value="all">All Ventures</TabsTrigger>
              <TabsTrigger value="high">High Priority</TabsTrigger>
              <TabsTrigger value="mvp">MVP Ready</TabsTrigger>
              <TabsTrigger value="growth">Growth Stage</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4">
                {filteredVentures.map((venture) => (
                  <VentureCard 
                    key={venture.id} 
                    venture={venture} 
                    onEdit={(v) => {
                      setEditingVenture(v);
                      setShowEditDialog(true);
                    }}
                    onDelete={() => handleDeleteVenture(venture.id)}
                    getStageColor={getStageColor}
                    getPriorityColor={getPriorityColor}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="high" className="space-y-4">
              <div className="grid gap-4">
                {ventures.filter(v => v.priority === 'high').map((venture) => (
                  <VentureCard 
                    key={venture.id} 
                    venture={venture} 
                    onEdit={(v) => {
                      setEditingVenture(v);
                      setShowEditDialog(true);
                    }}
                    onDelete={() => handleDeleteVenture(venture.id)}
                    getStageColor={getStageColor}
                    getPriorityColor={getPriorityColor}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="mvp" className="space-y-4">
              <div className="grid gap-4">
                {ventures.filter(v => v.stage === 'mvp').map((venture) => (
                  <VentureCard 
                    key={venture.id} 
                    venture={venture} 
                    onEdit={(v) => {
                      setEditingVenture(v);
                      setShowEditDialog(true);
                    }}
                    onDelete={() => handleDeleteVenture(venture.id)}
                    getStageColor={getStageColor}
                    getPriorityColor={getPriorityColor}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="growth" className="space-y-4">
              <div className="grid gap-4">
                {ventures.filter(v => v.stage === 'growth').map((venture) => (
                  <VentureCard 
                    key={venture.id} 
                    venture={venture} 
                    onEdit={(v) => {
                      setEditingVenture(v);
                      setShowEditDialog(true);
                    }}
                    onDelete={() => handleDeleteVenture(venture.id)}
                    getStageColor={getStageColor}
                    getPriorityColor={getPriorityColor}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="grid grid-cols-5 gap-1 p-2">
          <Button variant="ghost" size="sm" className="flex flex-col items-center py-2 h-auto">
            <BarChart3 className="h-5 w-5 mb-1" />
            <span className="text-xs">Overview</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center py-2 h-auto">
            <Eye className="h-5 w-5 mb-1" />
            <span className="text-xs">Analytics</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center py-2 h-auto">
            <Target className="h-5 w-5 mb-1" />
            <span className="text-xs">Ventures</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center py-2 h-auto">
            <Activity className="h-5 w-5 mb-1" />
            <span className="text-xs">Reports</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center py-2 h-auto">
            <Zap className="h-5 w-5 mb-1" />
            <span className="text-xs">Actions</span>
          </Button>
        </div>
      </nav>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-[95vw] md:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Venture</DialogTitle>
            <DialogDescription>
              Update venture information and strategy
            </DialogDescription>
          </DialogHeader>
          {editingVenture && (
            <VentureForm 
              venture={editingVenture} 
              onSubmit={handleUpdateVenture} 
              onCancel={() => {
                setShowEditDialog(false);
                setEditingVenture(null);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// VentureCard Component - Mobile Optimized
interface VentureCardProps {
  venture: Venture;
  onEdit: (venture: Venture) => void;
  onDelete: () => void;
  getStageColor: (stage: string) => string;
  getPriorityColor: (priority: string) => string;
  getStatusColor: (status: string) => string;
}

function VentureCard({ venture, onEdit, onDelete, getStageColor, getPriorityColor, getStatusColor }: VentureCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-lg flex flex-col sm:flex-row sm:items-center sm:gap-2 gap-2">
              {venture.name}
              <div className="flex flex-wrap gap-1">
                <Badge className={`text-white ${getStageColor(venture.stage)}`}>
                  {venture.stage}
                </Badge>
                <Badge className={`text-white ${getPriorityColor(venture.priority)}`}>
                  {venture.priority}
                </Badge>
                <Badge className={`text-white ${getStatusColor(venture.status)}`}>
                  {venture.status}
                </Badge>
              </div>
            </CardTitle>
            <CardDescription className="text-sm mt-1">{venture.description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(venture)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Maturity</span>
              <span>{venture.maturity}%</span>
            </div>
            <Progress value={venture.maturity} />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            {venture.marketSize && (
              <div>
                <span className="font-medium">Market Size:</span>
                <p className="text-gray-600">{venture.marketSize}</p>
              </div>
            )}
            {venture.fundingNeed && (
              <div>
                <span className="font-medium">Funding Need:</span>
                <p className="text-gray-600">{venture.fundingNeed}</p>
              </div>
            )}
            {venture.timeline && (
              <div>
                <span className="font-medium">Timeline:</span>
                <p className="text-gray-600">{venture.timeline}</p>
              </div>
            )}
          </div>
          
          {/* Expandable Details */}
          {venture.problemWorld && venture.newWorld && (
            <div className="border-t pt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-2 mb-3"
              >
                {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                {expanded ? 'Hide Details' : 'Show Details'}
              </Button>
              
              {expanded && (
                <div className="space-y-3 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-1">The Billion-Dollar Vision</h5>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-blue-700">Problem:</span>
                        <p className="text-blue-600">{venture.problemWorld}</p>
                      </div>
                      <div>
                        <span className="font-medium text-blue-700">Solution:</span>
                        <p className="text-blue-600">{venture.newWorld}</p>
                      </div>
                      {venture.valueUnlock && (
                        <div>
                          <span className="font-medium text-blue-700">Value:</span>
                          <p className="text-blue-600">{venture.valueUnlock}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// VentureForm Component - Mobile Optimized
interface VentureFormProps {
  venture?: Venture;
  onSubmit: (data: Partial<Venture>) => void;
  onCancel: () => void;
}

function VentureForm({ venture, onSubmit, onCancel }: VentureFormProps) {
  const [formData, setFormData] = useState<Partial<Venture>>(venture || {
    name: '',
    description: '',
    category: '',
    stage: 'idea',
    maturity: 10,
    priority: 'medium',
    status: 'active',
    problemWorld: '',
    newWorld: '',
    valueUnlock: '',
    originStory: '',
    deepCapability: '',
    unfairAdvantage: '',
    unlockFactor: '',
    inevitability: '',
    urgencyTrigger: '',
    marketSize: '',
    fundingNeed: '',
    timeline: '',
    repository: '',
    language: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5" />
          Basic Information
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className="mt-1"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            className="mt-1"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="stage">Stage</Label>
            <Select value={formData.stage} onValueChange={(value) => setFormData({ ...formData, stage: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="idea">Idea</SelectItem>
                <SelectItem value="prototype">Prototype</SelectItem>
                <SelectItem value="mvp">MVP</SelectItem>
                <SelectItem value="growth">Growth</SelectItem>
                <SelectItem value="maturity">Maturity</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="maturity">Maturity ({formData.maturity}%)</Label>
          <Input
            id="maturity"
            type="range"
            min="0"
            max="100"
            value={formData.maturity}
            onChange={(e) => setFormData({ ...formData, maturity: parseInt(e.target.value) })}
            className="mt-1"
          />
        </div>
      </div>
      
      {/* The Billion-Dollar Vision */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold flex items-center gap-2">
          <Brain className="h-5 w-5" />
          The Billion-Dollar Vision
        </h4>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="problemWorld">Problem World</Label>
            <Textarea
              id="problemWorld"
              value={formData.problemWorld}
              onChange={(e) => setFormData({ ...formData, problemWorld: e.target.value })}
              placeholder="What specific problem are you solving?"
              className="mt-1"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="newWorld">New World</Label>
            <Textarea
              id="newWorld"
              value={formData.newWorld}
              onChange={(e) => setFormData({ ...formData, newWorld: e.target.value })}
              placeholder="What does the world look like with your solution?"
              className="mt-1"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="valueUnlock">Value Unlock</Label>
            <Textarea
              id="valueUnlock"
              value={formData.valueUnlock}
              onChange={(e) => setFormData({ ...formData, valueUnlock: e.target.value })}
              placeholder="What massive value does this unlock?"
              className="mt-1"
              rows={2}
            />
          </div>
        </div>
      </div>
      
      {/* Why You */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Why You
        </h4>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="originStory">Origin Story</Label>
            <Textarea
              id="originStory"
              value={formData.originStory}
              onChange={(e) => setFormData({ ...formData, originStory: e.target.value })}
              placeholder="What sparked this insight?"
              className="mt-1"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="deepCapability">Deep Capability</Label>
            <Textarea
              id="deepCapability"
              value={formData.deepCapability}
              onChange={(e) => setFormData({ ...formData, deepCapability: e.target.value })}
              placeholder="What's your technical/expertise edge?"
              className="mt-1"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="unfairAdvantage">Unfair Advantage</Label>
            <Textarea
              id="unfairAdvantage"
              value={formData.unfairAdvantage}
              onChange={(e) => setFormData({ ...formData, unfairAdvantage: e.target.value })}
              placeholder="What moat do you have?"
              className="mt-1"
              rows={2}
            />
          </div>
        </div>
      </div>
      
      {/* Why Now */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Why Now
        </h4>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="unlockFactor">Unlock Factor</Label>
            <Textarea
              id="unlockFactor"
              value={formData.unlockFactor}
              onChange={(e) => setFormData({ ...formData, unlockFactor: e.target.value })}
              placeholder="What tech/regulatory/market breakthrough?"
              className="mt-1"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="inevitability">Inevitability Signal</Label>
            <Textarea
              id="inevitability"
              value={formData.inevitability}
              onChange={(e) => setFormData({ ...formData, inevitability: e.target.value })}
              placeholder="Why is this inevitable now?"
              className="mt-1"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="urgencyTrigger">Urgency Trigger</Label>
            <Textarea
              id="urgencyTrigger"
              value={formData.urgencyTrigger}
              onChange={(e) => setFormData({ ...formData, urgencyTrigger: e.target.value })}
              placeholder="Why can't this wait?"
              className="mt-1"
              rows={2}
            />
          </div>
        </div>
      </div>
      
      {/* Business Metrics */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Business Metrics
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="marketSize">Market Size</Label>
            <Input
              id="marketSize"
              value={formData.marketSize}
              onChange={(e) => setFormData({ ...formData, marketSize: e.target.value })}
              placeholder="e.g., $100B"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="fundingNeed">Funding Need</Label>
            <Input
              id="fundingNeed"
              value={formData.fundingNeed}
              onChange={(e) => setFormData({ ...formData, fundingNeed: e.target.value })}
              placeholder="e.g., $500K"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="timeline">Timeline</Label>
            <Input
              id="timeline"
              value={formData.timeline}
              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              placeholder="e.g., 6 months"
              className="mt-1"
            />
          </div>
        </div>
      </div>
      
      {/* Technical Details */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Technical Details
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="repository">Repository</Label>
            <Input
              id="repository"
              value={formData.repository}
              onChange={(e) => setFormData({ ...formData, repository: e.target.value })}
              placeholder="GitHub URL"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="language">Language</Label>
            <Input
              id="language"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              placeholder="e.g., TypeScript"
              className="mt-1"
            />
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {venture ? 'Update Venture' : 'Create Venture'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}