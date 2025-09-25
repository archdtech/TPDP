"use client";

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Filter,
  Github,
  GitBranch,
  ExternalLink,
  Rocket,
  Star,
  Building2,
  Handshake,
  Lightbulb,
  ArrowRight,
  Play,
  Database,
  FileText,
  Settings,
  Upload,
  Search,
  FileCheck,
  Lock,
  Globe,
  Timer,
  Smartphone,
  LogOut,
  User
} from 'lucide-react';
import Link from 'next/link';

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

export default function ProjectSentinelHomepage() {
  const { data: session, status } = useSession();
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingVenture, setEditingVenture] = useState<Venture | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [isMobile, setIsMobile] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    decisionLatency: 0,
    acceptanceRate: 0,
    evidenceReuse: 0,
    npsScore: 0
  });

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animate statistics on scroll
  useEffect(() => {
    const animateStats = () => {
      const stats = [
        { key: 'decisionLatency', target: 120, duration: 2000 },
        { key: 'acceptanceRate', target: 70, duration: 2500 },
        { key: 'evidenceReuse', target: 30, duration: 3000 },
        { key: 'npsScore', target: 50, duration: 3500 }
      ];

      stats.forEach(({ key, target, duration }) => {
        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const current = Math.floor(progress * target);
          
          setAnimatedStats(prev => ({ ...prev, [key]: current }));
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        animate();
      });
    };

    // Trigger animation when section is in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats();
          observer.disconnect();
        }
      });
    });

    const metricsSection = document.getElementById('success-metrics');
    if (metricsSection) {
      observer.observe(metricsSection);
    }

    return () => observer.disconnect();
  }, []);

  // Set loading to false after a timeout to bypass loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const fetchData = async () => {
    try {
      console.log('Fetching data...');
      const [venturesResponse, analyticsResponse] = await Promise.all([
        fetch('/api/ventures'),
        fetch('/api/analytics')
      ]);
      
      console.log('Ventures response status:', venturesResponse.status);
      console.log('Analytics response status:', analyticsResponse.status);
      
      if (venturesResponse.ok) {
        const venturesData = await venturesResponse.json();
        console.log('Ventures data:', venturesData.length, 'ventures loaded');
        setVentures(venturesData);
      } else {
        console.error('Ventures response not ok:', venturesResponse.status);
      }
      
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        console.log('Analytics data loaded');
        setAnalytics(analyticsData);
      } else {
        console.error('Analytics response not ok:', analyticsResponse.status);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      console.log('Setting loading to false');
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

  // Navigation items
  const navigationItems = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Dashboards', href: '/dashboards', icon: BarChart3 },
    { name: 'Tools', href: '/tools', icon: Settings },
  ];

  const tools = [
    { 
      name: 'Repository Monitor', 
      href: '/tools/repository-monitor', 
      description: 'Universal monitoring for development progress',
      icon: Database,
      color: 'text-blue-600'
    },
    { 
      name: 'Investor Sharing', 
      href: '/tools/investor-sharing', 
      description: 'Secure portfolio presentations',
      icon: Users,
      color: 'text-green-600'
    },
    { 
      name: 'GitHub Integration', 
      href: '/tools/github-integration', 
      description: 'Development activity tracking',
      icon: Github,
      color: 'text-gray-800'
    },
    { 
      name: 'BMAD Method', 
      href: '/tools/bmad-method', 
      description: 'AI agent development framework',
      icon: Brain,
      color: 'text-purple-600'
    },
  ];

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
          <p className="text-lg font-medium">Loading Project Sentinel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-emerald-600" />
                <span className="text-xl font-bold text-gray-900">Project Sentinel</span>
              </div>
              <div className="hidden md:flex ml-10 space-x-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <div className="hidden md:flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 font-medium text-sm">
                          {session.user?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{session.user?.name}</p>
                        <p className="text-xs text-gray-500">{session.user?.role}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => signOut()}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <Button onClick={() => signIn()} size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Project Sentinel */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Shield className="h-8 w-8 animate-pulse" />
              <span className="text-2xl font-bold">PROJECT SENTINEL</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              AI-Powered TPRM
              <span className="block text-emerald-400 animate-gradient">Decision Platform</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-emerald-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Transform vendor risk assessment from weeks to minutes with explainable AI analysis 
              and secure vendor passport ecosystem.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg transform hover:scale-105 transition-all duration-200 shadow-lg"
                onClick={() => console.log('Fast Check clicked')}
              >
                <Timer className="h-5 w-5 mr-2 animate-spin-slow" />
                Try Fast Check
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg transform hover:scale-105 transition-all duration-200"
                onClick={() => console.log('Vendor Passport clicked')}
              >
                <Globe className="h-5 w-5 mr-2" />
                Create Vendor Passport
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-6 justify-center text-sm">
              <div className="flex items-center gap-2 animate-fade-in">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>2-Minute Risk Decisions</span>
              </div>
              <div className="flex items-center gap-2 animate-fade-in" style={{animationDelay: '0.2s'}}>
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>AI-Powered Analysis</span>
              </div>
              <div className="flex items-center gap-2 animate-fade-in" style={{animationDelay: '0.4s'}}>
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Enterprise Grade Security</span>
              </div>
              <div className="flex items-center gap-2 animate-fade-in" style={{animationDelay: '0.6s'}}>
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Explainable Findings</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-teal-400 rounded-full opacity-20 animate-float-reverse"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-cyan-400 rounded-full opacity-20 animate-pulse"></div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 180 80 240 70C300 60 360 60 420 65C480 70 540 80 600 85C660 90 720 90 780 85C840 80 900 70 960 65C1020 60 1080 60 1140 70C1200 80 1260 100 1320 110C1380 120 1440 120 1440 120V120H0V120Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Organizations Choose Project Sentinel
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive TPRM platform designed for the modern enterprise, 
              delivering speed, accuracy, and network effects through AI-powered automation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Fast Check */}
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Timer className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Fast Check</CardTitle>
                <CardDescription className="text-lg">
                  For Risk Buyers
                </CardDescription>
                <CardDescription>
                  Get an explainable risk score and continuity plan in 2 minutes, not 2 months.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Drag-and-drop document upload
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    AI-powered SOC2/ISO analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Source-cited findings
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    One-page decision summary
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Vendor Passport */}
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Vendor Passport</CardTitle>
                <CardDescription className="text-lg">
                  For Vendors/Sellers
                </CardDescription>
                <CardDescription>
                  One link to share your compliance status, with controlled access and automated freshness.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Structured document hub
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Granular visibility controls
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Secure sharing with access requests
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Freemium model available
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tools Showcase Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Tools & Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the comprehensive suite of tools built on the HUVC foundation, 
              now adapted for Project Sentinel's TPRM capabilities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <Link key={index} href={tool.href}>
                <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer h-full group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <tool.icon className={`h-6 w-6 ${tool.color} group-hover:animate-pulse`} />
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{tool.name}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-blue-600 group-hover:text-blue-800 transition-colors">
                      <span>Explore Tool</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/tools">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                View All Tools
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Transformation Overview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              From Venture Studio to TPRM Leader
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leveraging the robust HUVC foundation to create Project Sentinel, 
              addressing the $3.2B TPRM market with AI-powered automation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  AI-Powered Analysis
                </CardTitle>
                <CardDescription>
                  Specialized agents for document processing, risk scoring, and remediation planning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Processing Speed</span>
                    <Badge className="bg-green-100 text-green-800">2 minutes</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Accuracy</span>
                    <Badge className="bg-blue-100 text-blue-800">70%+ First Pass</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Explainability</span>
                    <Badge className="bg-purple-100 text-purple-800">Source Cited</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Enterprise Security
                </CardTitle>
                <CardDescription>
                  Enterprise-grade security with SSO, MFA, RBAC, and comprehensive audit logging
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Authentication</span>
                    <Badge className="bg-green-100 text-green-800">SSO/MFA</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Access Control</span>
                    <Badge className="bg-blue-100 text-blue-800">RBAC</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Encryption</span>
                    <Badge className="bg-purple-100 text-purple-800">AES-256</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Network Effects
                </CardTitle>
                <CardDescription>
                  Creating sustainable advantage through vendor passport ecosystem and evidence reuse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Evidence Reuse</span>
                    <Badge className="bg-green-100 text-green-800">30%+ Target</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Passport Adoption</span>
                    <Badge className="bg-blue-100 text-blue-800">Freemium</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Market Growth</span>
                    <Badge className="bg-purple-100 text-purple-800">12.5% CAGR</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Implementation Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              20-Week Transformation Roadmap
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Phased approach to deliver value quickly while building towards the full vision.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Phase 1 */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-lg">Phase 1</CardTitle>
                <CardDescription>Weeks 1-4</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  <li>• Database transformation</li>
                  <li>• UI/UX rebranding</li>
                  <li>• Analytics adaptation</li>
                  <li>• Core API development</li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Phase 2 */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-lg">Phase 2</CardTitle>
                <CardDescription>Weeks 5-8</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  <li>• Document processing</li>
                  <li>• AI agent framework</li>
                  <li>• Fast Check dashboard</li>
                  <li>• Risk scoring</li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Phase 3 */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="text-lg">Phase 3</CardTitle>
                <CardDescription>Weeks 9-12</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  <li>• Vendor profiles</li>
                  <li>• Secure sharing</li>
                  <li>• Freemium model</li>
                  <li>• Passport analytics</li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Phase 4 */}
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="text-lg">Phase 4</CardTitle>
                <CardDescription>Weeks 13-16</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  <li>• Enhanced security</li>
                  <li>• Monitoring</li>
                  <li>• Advanced analytics</li>
                  <li>• Integration hooks</li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Phase 5 */}
            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="text-lg">Phase 5</CardTitle>
                <CardDescription>Weeks 17-20</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  <li>• Comprehensive testing</li>
                  <li>• Performance optimization</li>
                  <li>• Pilot deployment</li>
                  <li>• Production launch</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section id="success-metrics" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Success Metrics & KPIs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Measurable outcomes that demonstrate the transformation's impact and value.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ≤{animatedStats.decisionLatency}s
                </div>
                <CardTitle className="text-lg">P99 Decision Latency</CardTitle>
                <CardDescription>
                  Risk assessment processing time
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  ≥{animatedStats.acceptanceRate}%
                </div>
                <CardTitle className="text-lg">First-Pass Acceptance</CardTitle>
                <CardDescription>
                  Analyst acceptance rate (Month 2)
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  ≥{animatedStats.evidenceReuse}%
                </div>
                <CardTitle className="text-lg">Evidence Reuse</CardTitle>
                <CardDescription>
                  Vendor passport adoption (Month 3)
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  ≥{animatedStats.npsScore}
                </div>
                <CardTitle className="text-lg">Analyst NPS</CardTitle>
                <CardDescription>
                  User satisfaction score
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-float-reverse"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
            Ready to Transform Your TPRM Process?
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-emerald-100 animate-fade-in" style={{animationDelay: '0.2s'}}>
            Join leading organizations who are revolutionizing vendor risk management with AI-powered automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{animationDelay: '0.4s'}}>
            <Button 
              size="lg" 
              className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-lg transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl"
              onClick={() => console.log('Start Free Trial clicked')}
            >
              <Star className="h-5 w-5 mr-2 animate-pulse" />
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg transform hover:scale-105 transition-all duration-200 backdrop-blur-sm"
              onClick={() => console.log('Schedule Demo clicked')}
            >
              <Play className="h-5 w-5 mr-2" />
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm text-emerald-200 mt-6 animate-fade-in" style={{animationDelay: '0.6s'}}>
            No credit card required • 14-day free trial • Enterprise-grade security
          </p>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-12 opacity-80">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="text-sm">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="text-sm">AES-256 Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">GDPR Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Project Sentinel</h3>
              <p className="text-gray-400 text-sm">
                AI-Powered TPRM Decision Platform for modern enterprises.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Fast Check</a></li>
                <li><a href="#" className="hover:text-white">Vendor Passport</a></li>
                <li><a href="#" className="hover:text-white">Analytics</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API Reference</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 Project Sentinel. All rights reserved.</p>
            <p className="mt-2">Transforming TPRM from weeks to minutes with AI-powered automation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}