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
            
            {/* Simple ventures list for now */}
            <div className="space-y-4">
              {filteredVentures.map((venture) => (
                <Card key={venture.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{venture.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{venture.description}</p>
                      <div className="flex gap-2 mt-2">
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
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditingVenture(venture);
                        setShowEditDialog(true);
                      }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteVenture(venture.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Maturity</span>
                      <span>{venture.maturity}%</span>
                    </div>
                    <Progress value={venture.maturity} className="h-2" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Simple Venture Form component
function VentureForm({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    stage: 'idea',
    priority: 'medium',
    status: 'active',
    maturity: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
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
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="stage">Stage</Label>
          <Select value={formData.stage} onValueChange={(value) => setFormData({ ...formData, stage: value })}>
            <SelectTrigger>
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
            <SelectTrigger>
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
            <SelectTrigger>
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
        />
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit">Create Venture</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}