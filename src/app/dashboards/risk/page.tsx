"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  BarChart3,
  PieChart,
  Activity,
  Target,
  Filter,
  Download,
  RefreshCw,
  Eye,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Building2,
  FileText,
  Database,
  Settings,
  Zap,
  Globe,
  Star,
  ThumbsUp
} from 'lucide-react';
import Link from 'next/link';

interface RiskMetrics {
  overallRiskScore: number;
  highRiskVendors: number;
  mediumRiskVendors: number;
  lowRiskVendors: number;
  criticalVendors: number;
  riskTrend: 'improving' | 'stable' | 'declining';
  averageAssessmentTime: number;
  riskDistribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

interface VendorRisk {
  id: string;
  name: string;
  category: string;
  riskScore: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  lastAssessment: string;
  nextAssessment: string;
  issues: number;
  trends: 'up' | 'down' | 'stable';
}

interface RiskCategory {
  name: string;
  score: number;
  vendors: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface RiskAlert {
  id: string;
  vendor: string;
  type: 'critical' | 'high' | 'medium';
  message: string;
  timestamp: string;
  severity: 'urgent' | 'high' | 'medium';
}

export default function RiskDashboard() {
  const [metrics, setMetrics] = useState<RiskMetrics>({
    overallRiskScore: 0,
    highRiskVendors: 0,
    mediumRiskVendors: 0,
    lowRiskVendors: 0,
    criticalVendors: 0,
    riskTrend: 'stable',
    averageAssessmentTime: 0,
    riskDistribution: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    }
  });

  const [vendorRisks, setVendorRisks] = useState<VendorRisk[]>([]);
  const [riskCategories, setRiskCategories] = useState<RiskCategory[]>([]);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setMetrics({
        overallRiskScore: 72,
        highRiskVendors: 12,
        mediumRiskVendors: 34,
        lowRiskVendors: 98,
        criticalVendors: 4,
        riskTrend: 'improving',
        averageAssessmentTime: 95,
        riskDistribution: {
          critical: 4,
          high: 12,
          medium: 34,
          low: 98
        }
      });

      setVendorRisks([
        {
          id: '1',
          name: 'CloudTech Solutions',
          category: 'Cloud Services',
          riskScore: 85,
          riskLevel: 'high',
          lastAssessment: '2024-01-15',
          nextAssessment: '2024-04-15',
          issues: 3,
          trends: 'up'
        },
        {
          id: '2',
          name: 'DataSecure Inc.',
          category: 'Security',
          riskScore: 92,
          riskLevel: 'critical',
          lastAssessment: '2024-01-10',
          nextAssessment: '2024-02-10',
          issues: 5,
          trends: 'up'
        },
        {
          id: '3',
          name: 'TechCorp Global',
          category: 'Infrastructure',
          riskScore: 68,
          riskLevel: 'medium',
          lastAssessment: '2024-01-20',
          nextAssessment: '2024-04-20',
          issues: 1,
          trends: 'stable'
        },
        {
          id: '4',
          name: 'SecureNet Systems',
          category: 'Networking',
          riskScore: 45,
          riskLevel: 'low',
          lastAssessment: '2024-01-18',
          nextAssessment: '2024-07-18',
          issues: 0,
          trends: 'down'
        }
      ]);

      setRiskCategories([
        {
          name: 'Data Security',
          score: 78,
          vendors: 45,
          trend: 'improving',
          description: 'Encryption, access controls, data protection'
        },
        {
          name: 'Compliance',
          score: 82,
          vendors: 38,
          trend: 'stable',
          description: 'Regulatory compliance, certifications, audits'
        },
        {
          name: 'Operational',
          score: 65,
          vendors: 52,
          trend: 'declining',
          description: 'Service continuity, performance, reliability'
        },
        {
          name: 'Financial',
          score: 88,
          vendors: 21,
          trend: 'improving',
          description: 'Financial stability, payment history, credit'
        }
      ]);

      setRiskAlerts([
        {
          id: '1',
          vendor: 'DataSecure Inc.',
          type: 'critical',
          message: 'SOC2 Type II certification expired',
          timestamp: '2 hours ago',
          severity: 'urgent'
        },
        {
          id: '2',
          vendor: 'CloudTech Solutions',
          type: 'high',
          message: 'Unusual login activity detected',
          timestamp: '4 hours ago',
          severity: 'high'
        },
        {
          id: '3',
          vendor: 'TechCorp Global',
          type: 'medium',
          message: 'Service performance degradation',
          timestamp: '6 hours ago',
          severity: 'medium'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="h-3 w-3 text-red-600" />;
      case 'down': return <ArrowDownRight className="h-3 w-3 text-green-600" />;
      default: return <Minus className="h-3 w-3 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading Risk Analytics...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Risk Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Comprehensive risk analysis, scoring, and trend monitoring
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

      {/* Risk Overview */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Risk Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.overallRiskScore}/100</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Improving
              </p>
              <Progress value={metrics.overallRiskScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{metrics.criticalVendors}</div>
              <p className="text-xs text-muted-foreground">
                Require immediate attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk</CardTitle>
              <Shield className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{metrics.highRiskVendors}</div>
              <p className="text-xs text-muted-foreground">
                Need monitoring
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Assessment Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.averageAssessmentTime}s</div>
              <p className="text-xs text-muted-foreground">
                Target: ≤120s
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <Tabs defaultValue="vendors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="vendors">Vendor Risks</TabsTrigger>
            <TabsTrigger value="categories">Risk Categories</TabsTrigger>
            <TabsTrigger value="alerts">Risk Alerts</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="vendors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Risk Assessment</CardTitle>
                <CardDescription>
                  Risk scores and assessment status for all vendors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendorRisks.map((vendor) => (
                    <div key={vendor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${getRiskColor(vendor.riskLevel)}`}>
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">{vendor.name}</h4>
                          <p className="text-sm text-gray-600">{vendor.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="font-medium">{vendor.riskScore}/100</div>
                          <div className="text-xs text-gray-500">{vendor.riskLevel}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">{vendor.issues} issues</div>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(vendor.trends)}
                            <span className="text-xs text-gray-500">{vendor.trends}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">Next: {vendor.nextAssessment}</div>
                          <div className="text-xs text-gray-500">Last: {vendor.lastAssessment}</div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {riskCategories.map((category) => (
                <Card key={category.name}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(category.trend)}
                        <span className="text-sm text-gray-500">{category.trend}</span>
                      </div>
                    </div>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Risk Score</span>
                        <span className="font-medium">{category.score}/100</span>
                      </div>
                      <Progress value={category.score} />
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>{category.vendors} vendors</span>
                        <span>Category average</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Alerts</CardTitle>
                <CardDescription>
                  Critical and high-priority risk notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)}`}></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{alert.vendor}</h4>
                          <Badge variant={alert.type === 'critical' ? 'destructive' : 'outline'}>
                            {alert.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{alert.message}</p>
                        <p className="text-xs text-gray-500">{alert.timestamp}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Trends</CardTitle>
                <CardDescription>
                  Historical risk data and trend analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">15%</div>
                      <div className="text-sm text-gray-600">Risk Reduction</div>
                      <div className="text-xs text-gray-500">Last 30 days</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">89%</div>
                      <div className="text-sm text-gray-600">Assessment Coverage</div>
                      <div className="text-xs text-gray-500">Vendors assessed</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">94%</div>
                      <div className="text-sm text-gray-600">First Pass Rate</div>
                      <div className="text-xs text-gray-500">Assessment accuracy</div>
                    </div>
                  </div>
                  
                  <div className="text-center text-gray-500">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                    <p>Interactive risk trend charts would be displayed here</p>
                    <p className="text-sm">Showing risk score trends over time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}