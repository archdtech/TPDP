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
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Download, 
  Timer, 
  CheckCircle, 
  AlertTriangle, 
  Shield, 
  Building2, 
  Globe, 
  Star,
  TrendingUp,
  Users,
  FileText,
  BarChart3,
  Activity,
  Zap,
  Target,
  Database,
  Settings,
  LogOut,
  User,
  ArrowRight,
  Clock,
  Award,
  ThumbsUp,
  ThumbsDown,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

interface Vendor {
  id: string;
  name: string;
  category: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  complianceScore: number;
  status: 'active' | 'pending' | 'under_review' | 'rejected';
  lastAssessed: string;
  description: string;
  location: string;
  employeeCount: string;
  revenue: string;
  certifications: string[];
  keyServices: string[];
  assessmentHistory: Array<{
    date: string;
    score: number;
    assessor: string;
    notes: string;
  }>;
}

interface AssessmentRequest {
  id: string;
  vendorName: string;
  vendorDomain: string;
  category: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  requestedBy: string;
  requestedDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  estimatedTime: string;
  progress: number;
}

export default function BuyersPage() {
  const { data: session, status } = useSession();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [assessmentRequests, setAssessmentRequests] = useState<AssessmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewAssessmentDialog, setShowNewAssessmentDialog] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    vendorName: '',
    vendorDomain: '',
    category: '',
    urgency: 'medium'
  });

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setVendors([
        {
          id: '1',
          name: 'TechCorp Solutions',
          category: 'Cloud Services',
          riskScore: 85,
          riskLevel: 'low',
          complianceScore: 92,
          status: 'active',
          lastAssessed: '2024-01-15',
          description: 'Leading provider of cloud infrastructure and enterprise solutions',
          location: 'San Francisco, CA',
          employeeCount: '500-1000',
          revenue: '$100M-500M',
          certifications: ['SOC 2 Type II', 'ISO 27001', 'GDPR'],
          keyServices: ['Cloud Hosting', 'Data Analytics', 'Security Services'],
          assessmentHistory: [
            { date: '2024-01-15', score: 85, assessor: 'John Doe', notes: 'Excellent security posture' }
          ]
        },
        {
          id: '2',
          name: 'DataSecure Inc',
          category: 'Cybersecurity',
          riskScore: 45,
          riskLevel: 'medium',
          complianceScore: 78,
          status: 'active',
          lastAssessed: '2024-01-10',
          description: 'Specialized cybersecurity solutions for enterprise clients',
          location: 'New York, NY',
          employeeCount: '100-500',
          revenue: '$50M-100M',
          certifications: ['SOC 2 Type I', 'ISO 27001'],
          keyServices: ['Threat Detection', 'Incident Response', 'Compliance Management'],
          assessmentHistory: [
            { date: '2024-01-10', score: 45, assessor: 'Jane Smith', notes: 'Needs improvement in incident response' }
          ]
        },
        {
          id: '3',
          name: 'GlobalPay Systems',
          category: 'Financial Services',
          riskScore: 25,
          riskLevel: 'high',
          complianceScore: 65,
          status: 'under_review',
          lastAssessed: '2024-01-05',
          description: 'Payment processing and financial technology solutions',
          location: 'London, UK',
          employeeCount: '1000-5000',
          revenue: '$500M-1B',
          certifications: ['PCI DSS', 'SOC 1'],
          keyServices: ['Payment Processing', 'Risk Management', 'Compliance'],
          assessmentHistory: [
            { date: '2024-01-05', score: 25, assessor: 'Mike Johnson', notes: 'Critical compliance issues identified' }
          ]
        }
      ]);

      setAssessmentRequests([
        {
          id: '1',
          vendorName: 'StartupXYZ',
          vendorDomain: 'startupxyz.com',
          category: 'AI Services',
          urgency: 'high',
          requestedBy: 'Sarah Wilson',
          requestedDate: '2024-01-20',
          status: 'in_progress',
          estimatedTime: '2 minutes',
          progress: 75
        },
        {
          id: '2',
          vendorName: 'CloudNet Pro',
          vendorDomain: 'cloudnetpro.com',
          category: 'Cloud Services',
          urgency: 'medium',
          requestedBy: 'Tom Brown',
          requestedDate: '2024-01-19',
          status: 'pending',
          estimatedTime: '5 minutes',
          progress: 0
        }
      ]);

      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleNewAssessment = async () => {
    if (!newAssessment.vendorName || !newAssessment.vendorDomain || !newAssessment.category) {
      return;
    }

    const request: AssessmentRequest = {
      id: Date.now().toString(),
      vendorName: newAssessment.vendorName,
      vendorDomain: newAssessment.vendorDomain,
      category: newAssessment.category,
      urgency: newAssessment.urgency as any,
      requestedBy: session?.user?.name || 'Unknown',
      requestedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      estimatedTime: '2-5 minutes',
      progress: 0
    };

    setAssessmentRequests([request, ...assessmentRequests]);
    setNewAssessment({ vendorName: '', vendorDomain: '', category: '', urgency: 'medium' });
    setShowNewAssessmentDialog(false);

    // Simulate assessment progress
    setTimeout(() => {
      setAssessmentRequests(prev => prev.map(req => 
        req.id === request.id ? { ...req, status: 'in_progress', progress: 50 } : req
      ));
    }, 1000);

    setTimeout(() => {
      setAssessmentRequests(prev => prev.map(req => 
        req.id === request.id ? { ...req, status: 'completed', progress: 100 } : req
      ));
    }, 3000);
  };

  const getRiskColor = (riskLevel: string) => {
    const colors: { [key: string]: string } = {
      'low': 'bg-green-500',
      'medium': 'bg-yellow-500',
      'high': 'bg-orange-500',
      'critical': 'bg-red-500'
    };
    return colors[riskLevel] || 'bg-gray-500';
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'active': 'bg-green-500',
      'pending': 'bg-yellow-500',
      'under_review': 'bg-blue-500',
      'rejected': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getUrgencyColor = (urgency: string) => {
    const colors: { [key: string]: string } = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'critical': 'bg-red-100 text-red-800'
    };
    return colors[urgency] || 'bg-gray-100 text-gray-800';
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
    const matchesRisk = selectedRiskLevel === 'all' || vendor.riskLevel === selectedRiskLevel;
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesRisk && matchesSearch;
  });

  const categories = ['all', ...Array.from(new Set(vendors.map(v => v.category)))];
  const riskLevels = ['all', 'low', 'medium', 'high', 'critical'];

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
                <Link
                  href="/"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/buyers"
                  className="text-emerald-600 hover:text-emerald-700 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Buyers
                </Link>
                <Link
                  href="/sellers"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4" />
                  Sellers
                </Link>
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
                        <p className="text-xs text-gray-500">Buyer</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Risk Management</h1>
          <p className="text-gray-600">Assess and manage third-party vendor risks with AI-powered analysis</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                  <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Risk</p>
                  <p className="text-2xl font-bold text-green-600">
                    {vendors.filter(v => v.riskLevel === 'low').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High Risk</p>
                  <p className="text-2xl font-bold text-red-600">
                    {vendors.filter(v => v.riskLevel === 'high' || v.riskLevel === 'critical').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Assessments</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {assessmentRequests.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="vendors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vendors">Vendor Portfolio</TabsTrigger>
            <TabsTrigger value="assessments">Assessment Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="vendors" className="space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedRiskLevel} onValueChange={setSelectedRiskLevel}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    {riskLevels.map(level => (
                      <SelectItem key={level} value={level}>
                        {level === 'all' ? 'All Risk Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Dialog open={showNewAssessmentDialog} onOpenChange={setShowNewAssessmentDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Assessment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request New Vendor Assessment</DialogTitle>
                    <DialogDescription>
                      Enter vendor details to start an AI-powered risk assessment
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="vendorName">Vendor Name</Label>
                      <Input
                        id="vendorName"
                        value={newAssessment.vendorName}
                        onChange={(e) => setNewAssessment(prev => ({ ...prev, vendorName: e.target.value }))}
                        placeholder="Enter vendor name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vendorDomain">Vendor Domain</Label>
                      <Input
                        id="vendorDomain"
                        value={newAssessment.vendorDomain}
                        onChange={(e) => setNewAssessment(prev => ({ ...prev, vendorDomain: e.target.value }))}
                        placeholder="vendor.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newAssessment.category} onValueChange={(value) => setNewAssessment(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cloud Services">Cloud Services</SelectItem>
                          <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                          <SelectItem value="Financial Services">Financial Services</SelectItem>
                          <SelectItem value="AI Services">AI Services</SelectItem>
                          <SelectItem value="Consulting">Consulting</SelectItem>
                          <SelectItem value="Software Development">Software Development</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="urgency">Urgency</Label>
                      <Select value={newAssessment.urgency} onValueChange={(value) => setNewAssessment(prev => ({ ...prev, urgency: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleNewAssessment} className="w-full">
                      Start Assessment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Vendor Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVendors.map(vendor => (
                <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{vendor.name}</CardTitle>
                        <CardDescription>{vendor.category}</CardDescription>
                      </div>
                      <Badge className={`${getRiskColor(vendor.riskLevel)} text-white`}>
                        {vendor.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{vendor.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Risk Score</span>
                        <span className="text-sm font-bold">{vendor.riskScore}/100</span>
                      </div>
                      <Progress value={vendor.riskScore} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Compliance</span>
                        <span className="text-sm font-bold">{vendor.complianceScore}%</span>
                      </div>
                      <Progress value={vendor.complianceScore} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Last assessed:</span>
                      <span>{vendor.lastAssessed}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {vendor.certifications.slice(0, 3).map(cert => (
                        <Badge key={cert} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                      {vendor.certifications.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{vendor.certifications.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assessments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Assessment Requests</h2>
              <Dialog open={showNewAssessmentDialog} onOpenChange={setShowNewAssessmentDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Assessment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request New Vendor Assessment</DialogTitle>
                    <DialogDescription>
                      Enter vendor details to start an AI-powered risk assessment
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="vendorName">Vendor Name</Label>
                      <Input
                        id="vendorName"
                        value={newAssessment.vendorName}
                        onChange={(e) => setNewAssessment(prev => ({ ...prev, vendorName: e.target.value }))}
                        placeholder="Enter vendor name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vendorDomain">Vendor Domain</Label>
                      <Input
                        id="vendorDomain"
                        value={newAssessment.vendorDomain}
                        onChange={(e) => setNewAssessment(prev => ({ ...prev, vendorDomain: e.target.value }))}
                        placeholder="vendor.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newAssessment.category} onValueChange={(value) => setNewAssessment(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cloud Services">Cloud Services</SelectItem>
                          <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                          <SelectItem value="Financial Services">Financial Services</SelectItem>
                          <SelectItem value="AI Services">AI Services</SelectItem>
                          <SelectItem value="Consulting">Consulting</SelectItem>
                          <SelectItem value="Software Development">Software Development</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="urgency">Urgency</Label>
                      <Select value={newAssessment.urgency} onValueChange={(value) => setNewAssessment(prev => ({ ...prev, urgency: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleNewAssessment} className="w-full">
                      Start Assessment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {assessmentRequests.map(request => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{request.vendorName}</h3>
                          <Badge className={getUrgencyColor(request.urgency)}>
                            {request.urgency.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {request.category}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{request.vendorDomain}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <span>Requested by: {request.requestedBy}</span>
                          <span>•</span>
                          <span>{request.requestedDate}</span>
                          <span>•</span>
                          <span>Est. time: {request.estimatedTime}</span>
                        </div>
                        {request.status === 'in_progress' && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Progress</span>
                              <span className="text-sm">{request.progress}%</span>
                            </div>
                            <Progress value={request.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {request.status === 'pending' && (
                          <Button size="sm" variant="outline">
                            <Clock className="h-4 w-4 mr-2" />
                            Pending
                          </Button>
                        )}
                        {request.status === 'in_progress' && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Zap className="h-4 w-4 mr-2 animate-pulse" />
                            In Progress
                          </Button>
                        )}
                        {request.status === 'completed' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            View Report
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}