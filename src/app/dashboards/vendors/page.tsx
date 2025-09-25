"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Users, 
  Globe, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
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
  Plus,
  Star,
  ThumbsUp,
  FileText,
  Database,
  Settings,
  Zap,
  Shield,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  TrendingDown,
  UserCheck,
  Upload,
  Share2,
  Edit,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

interface VendorMetrics {
  totalVendors: number;
  activeVendors: number;
  inactiveVendors: number;
  passportUtilization: number;
  avgRiskScore: number;
  highRiskVendors: number;
  newVendorsThisMonth: number;
  vendorRetention: number;
}

interface Vendor {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'inactive' | 'pending' | 'terminated';
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  hasPassport: boolean;
  passportScore?: number;
  lastAssessment: string;
  nextAssessment: string;
  contractValue: number;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  documents: number;
  compliance: number;
  performance: number;
}

interface VendorCategory {
  name: string;
  count: number;
  avgRiskScore: number;
  passportUtilization: number;
  totalValue: number;
}

interface VendorActivity {
  id: string;
  vendor: string;
  type: 'assessment' | 'passport_update' | 'document_upload' | 'compliance_update';
  description: string;
  timestamp: string;
  user: string;
}

export default function VendorDashboard() {
  const [metrics, setMetrics] = useState<VendorMetrics>({
    totalVendors: 0,
    activeVendors: 0,
    inactiveVendors: 0,
    passportUtilization: 0,
    avgRiskScore: 0,
    highRiskVendors: 0,
    newVendorsThisMonth: 0,
    vendorRetention: 0
  });

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [categories, setCategories] = useState<VendorCategory[]>([]);
  const [activities, setActivities] = useState<VendorActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setMetrics({
        totalVendors: 156,
        activeVendors: 142,
        inactiveVendors: 14,
        passportUtilization: 68,
        avgRiskScore: 72,
        highRiskVendors: 12,
        newVendorsThisMonth: 8,
        vendorRetention: 94
      });

      setVendors([
        {
          id: '1',
          name: 'CloudTech Solutions',
          category: 'Cloud Services',
          status: 'active',
          riskScore: 85,
          riskLevel: 'high',
          hasPassport: true,
          passportScore: 78,
          lastAssessment: '2024-01-15',
          nextAssessment: '2024-04-15',
          contractValue: 250000,
          contactPerson: 'Sarah Johnson',
          email: 'sarah.johnson@cloudtech.com',
          phone: '+1-555-0123',
          location: 'San Francisco, CA',
          documents: 12,
          compliance: 92,
          performance: 88
        },
        {
          id: '2',
          name: 'DataSecure Inc.',
          category: 'Security',
          status: 'active',
          riskScore: 92,
          riskLevel: 'critical',
          hasPassport: true,
          passportScore: 85,
          lastAssessment: '2024-01-10',
          nextAssessment: '2024-02-10',
          contractValue: 180000,
          contactPerson: 'Mike Chen',
          email: 'mike.chen@datasecure.com',
          phone: '+1-555-0124',
          location: 'New York, NY',
          documents: 8,
          compliance: 78,
          performance: 82
        },
        {
          id: '3',
          name: 'TechCorp Global',
          category: 'Infrastructure',
          status: 'active',
          riskScore: 68,
          riskLevel: 'medium',
          hasPassport: false,
          lastAssessment: '2024-01-20',
          nextAssessment: '2024-04-20',
          contractValue: 320000,
          contactPerson: 'Emily Davis',
          email: 'emily.davis@techcorp.com',
          phone: '+1-555-0125',
          location: 'Austin, TX',
          documents: 15,
          compliance: 65,
          performance: 90
        },
        {
          id: '4',
          name: 'SecureNet Systems',
          category: 'Networking',
          status: 'active',
          riskScore: 45,
          riskLevel: 'low',
          hasPassport: true,
          passportScore: 92,
          lastAssessment: '2024-01-18',
          nextAssessment: '2024-07-18',
          contractValue: 150000,
          contactPerson: 'Alex Rodriguez',
          email: 'alex.rodriguez@securenet.com',
          phone: '+1-555-0126',
          location: 'Seattle, WA',
          documents: 6,
          compliance: 95,
          performance: 94
        }
      ]);

      setCategories([
        {
          name: 'Cloud Services',
          count: 45,
          avgRiskScore: 72,
          passportUtilization: 75,
          totalValue: 2800000
        },
        {
          name: 'Security',
          count: 38,
          avgRiskScore: 68,
          passportUtilization: 82,
          totalValue: 2100000
        },
        {
          name: 'Infrastructure',
          count: 32,
          avgRiskScore: 75,
          passportUtilization: 65,
          totalValue: 3500000
        },
        {
          name: 'Networking',
          count: 21,
          avgRiskScore: 58,
          passportUtilization: 70,
          totalValue: 1200000
        },
        {
          name: 'Consulting',
          count: 20,
          avgRiskScore: 45,
          passportUtilization: 55,
          totalValue: 800000
        }
      ]);

      setActivities([
        {
          id: '1',
          vendor: 'CloudTech Solutions',
          type: 'passport_update',
          description: 'Vendor passport updated with new SOC2 report',
          timestamp: '2 hours ago',
          user: 'Sarah Johnson'
        },
        {
          id: '2',
          vendor: 'DataSecure Inc.',
          type: 'assessment',
          description: 'Risk assessment completed - High risk identified',
          timestamp: '4 hours ago',
          user: 'Mike Chen'
        },
        {
          id: '3',
          vendor: 'TechCorp Global',
          type: 'document_upload',
          description: 'ISO 27001 certificate uploaded',
          timestamp: '6 hours ago',
          user: 'Emily Davis'
        },
        {
          id: '4',
          vendor: 'SecureNet Systems',
          type: 'compliance_update',
          description: 'Compliance status updated to 95%',
          timestamp: '1 day ago',
          user: 'Alex Rodriguez'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'terminated': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assessment': return <Shield className="h-4 w-4" />;
      case 'passport_update': return <Globe className="h-4 w-4" />;
      case 'document_upload': return <Upload className="h-4 w-4" />;
      case 'compliance_update': return <CheckCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading Vendor Dashboard...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Vendor Management Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Vendor portfolio management and performance tracking
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Link href="/tools/vendor-passport">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vendor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Overview */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalVendors}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.activeVendors} active, {metrics.inactiveVendors} inactive
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Passport Utilization</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.passportUtilization}%</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +8% from last month
              </p>
              <Progress value={metrics.passportUtilization} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Risk Score</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.avgRiskScore}/100</div>
              <p className="text-xs text-muted-foreground">
                {metrics.highRiskVendors} high risk vendors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Vendors</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.newVendorsThisMonth}</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <Tabs defaultValue="vendors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="vendors">Vendor List</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="vendors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Portfolio</CardTitle>
                <CardDescription>
                  Complete list of all vendors with their status and risk profiles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendors.map((vendor) => (
                    <div key={vendor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${getStatusColor(vendor.status)}`}>
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{vendor.name}</h4>
                            {vendor.hasPassport && (
                              <Badge variant="outline" className="text-blue-600 bg-blue-100">
                                <Globe className="h-3 w-3 mr-1" />
                                Passport
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{vendor.category}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {vendor.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {vendor.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {vendor.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="font-medium">{vendor.riskScore}/100</div>
                          <Badge variant="outline" className={getRiskColor(vendor.riskLevel)}>
                            {vendor.riskLevel}
                          </Badge>
                        </div>
                        {vendor.hasPassport && (
                          <div className="text-right">
                            <div className="font-medium">{vendor.passportScore}%</div>
                            <div className="text-xs text-gray-500">Passport Score</div>
                          </div>
                        )}
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(vendor.contractValue)}</div>
                          <div className="text-xs text-gray-500">Contract Value</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">Next: {vendor.nextAssessment}</div>
                          <div className="text-xs text-gray-500">{vendor.documents} docs</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card key={category.name}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription>
                      Vendor category overview and metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Vendors</span>
                        <span className="font-medium">{category.count}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Avg Risk Score</span>
                        <span className="font-medium">{category.avgRiskScore}/100</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Passport Usage</span>
                        <span className="font-medium">{category.passportUtilization}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Value</span>
                        <span className="font-medium">{formatCurrency(category.totalValue)}</span>
                      </div>
                      <Progress value={category.passportUtilization} className="mt-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Vendor Activity</CardTitle>
                <CardDescription>
                  Latest updates and actions across your vendor portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{activity.vendor}</h4>
                          <Badge variant="outline">{activity.type.replace('_', ' ')}</Badge>
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
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Performance Metrics</CardTitle>
                  <CardDescription>
                    Key performance indicators for vendor management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{metrics.vendorRetention}%</div>
                      <div className="text-sm text-gray-600">Vendor Retention Rate</div>
                      <div className="text-xs text-gray-500">Year-over-year</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-xl font-bold text-blue-600">95s</div>
                        <div className="text-xs text-gray-600">Avg Assessment Time</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-xl font-bold text-purple-600">89%</div>
                        <div className="text-xs text-gray-600">First Pass Rate</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Vendors</CardTitle>
                  <CardDescription>
                    Vendors with highest performance scores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vendors
                      .sort((a, b) => (b.performance + b.compliance) - (a.performance + a.compliance))
                      .slice(0, 3)
                      .map((vendor) => (
                        <div key={vendor.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <Star className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">{vendor.name}</h4>
                              <p className="text-xs text-gray-600">{vendor.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-sm">
                              {Math.round((vendor.performance + vendor.compliance) / 2)}%
                            </div>
                            <div className="text-xs text-gray-500">Avg Score</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}