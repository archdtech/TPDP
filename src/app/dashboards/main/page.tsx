"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalVendors: number;
  activeAssessments: number;
  completedAssessments: number;
  highRiskVendors: number;
  compliantVendors: number;
  averageProcessingTime: number;
  passportUtilization: number;
  riskScore: number;
  complianceRate: number;
}

interface RecentActivity {
  id: string;
  type: 'assessment' | 'compliance' | 'vendor' | 'risk';
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'in_progress' | 'pending';
  user: string;
}

interface RiskTrend {
  month: string;
  score: number;
  vendors: number;
}

export default function MainDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
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
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [riskTrends, setRiskTrends] = useState<RiskTrend[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - in real implementation, this would come from API
  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalVendors: 156,
        activeAssessments: 23,
        completedAssessments: 89,
        highRiskVendors: 12,
        compliantVendors: 134,
        averageProcessingTime: 95, // seconds
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

      setRiskTrends([
        { month: 'Jan', score: 78, vendors: 142 },
        { month: 'Feb', score: 75, vendors: 145 },
        { month: 'Mar', score: 73, vendors: 148 },
        { month: 'Apr', score: 71, vendors: 151 },
        { month: 'May', score: 72, vendors: 154 },
        { month: 'Jun', score: 72, vendors: 156 }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

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

  const riskLevel = getRiskLevel(stats.riskScore);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading Main Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Main Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Comprehensive overview of your TPRM activities and metrics
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Health</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.riskScore}/100</div>
              <p className={`text-xs ${riskLevel.color}`}>
                {riskLevel.level} Risk
              </p>
              <Progress value={stats.riskScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVendors}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.complianceRate}%</div>
              <p className="text-xs text-muted-foreground">
                +5% improvement
              </p>
              <Progress value={stats.complianceRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Assessments</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAssessments}</div>
              <p className="text-xs text-muted-foreground">
                In progress
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates and actions across your TPRM ecosystem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
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
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and tools
                </CardDescription>
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

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Key performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Processing Time</span>
                  <span className="font-medium">{stats.averageProcessingTime}s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Passport Usage</span>
                  <span className="font-medium">{stats.passportUtilization}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">High Risk Vendors</span>
                  <span className="font-medium text-red-600">{stats.highRiskVendors}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Completed Assessments</span>
                  <span className="font-medium text-green-600">{stats.completedAssessments}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}