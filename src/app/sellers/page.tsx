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
  Plus, 
  Edit, 
  Eye, 
  Download, 
  Upload, 
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
  HelpCircle,
  Link as LinkIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Certificate,
  DollarSign,
  Users2,
  Building,
  Server,
  Lock,
  FileCheck,
  TrendingDown
} from 'lucide-react';
import Link from 'next/link';

interface VendorProfile {
  id: string;
  companyName: string;
  domain: string;
  description: string;
  category: string;
  location: string;
  employeeCount: string;
  revenue: string;
  foundedYear: number;
  website: string;
  contactEmail: string;
  contactPhone: string;
  certifications: string[];
  keyServices: string[];
  complianceScore: number;
  riskScore: number;
  passportStatus: 'draft' | 'pending' | 'approved' | 'rejected';
  lastUpdated: string;
  assessmentHistory: Array<{
    date: string;
    score: number;
    status: string;
    assessor: string;
    notes: string;
  }>;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    uploadDate: string;
    status: 'uploaded' | 'verified' | 'rejected';
  }>;
}

interface AssessmentRequest {
  id: string;
  buyerCompany: string;
  buyerDomain: string;
  category: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  requestedDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  estimatedTime: string;
  progress: number;
}

export default function SellersPage() {
  const { data: session, status } = useSession();
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
  const [assessmentRequests, setAssessmentRequests] = useState<AssessmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [newDocument, setNewDocument] = useState({ name: '', type: '' });

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setVendorProfile({
        id: '1',
        companyName: 'TechCorp Solutions',
        domain: 'techcorp.com',
        description: 'Leading provider of cloud infrastructure and enterprise solutions with a focus on security and scalability.',
        category: 'Cloud Services',
        location: 'San Francisco, CA',
        employeeCount: '500-1000',
        revenue: '$100M-500M',
        foundedYear: 2015,
        website: 'https://techcorp.com',
        contactEmail: 'contact@techcorp.com',
        contactPhone: '+1 (555) 123-4567',
        certifications: ['SOC 2 Type II', 'ISO 27001', 'GDPR', 'PCI DSS'],
        keyServices: ['Cloud Hosting', 'Data Analytics', 'Security Services', 'DevOps Solutions'],
        complianceScore: 92,
        riskScore: 85,
        passportStatus: 'approved',
        lastUpdated: '2024-01-15',
        assessmentHistory: [
          { date: '2024-01-15', score: 85, status: 'approved', assessor: 'John Doe', notes: 'Excellent security posture' },
          { date: '2023-10-20', score: 78, status: 'approved', assessor: 'Jane Smith', notes: 'Good overall, minor improvements needed' }
        ],
        documents: [
          { id: '1', name: 'SOC 2 Type II Report', type: 'Compliance', uploadDate: '2024-01-10', status: 'verified' },
          { id: '2', name: 'ISO 27001 Certificate', type: 'Certification', uploadDate: '2024-01-08', status: 'verified' },
          { id: '3', name: 'Security Policy Document', type: 'Policy', uploadDate: '2024-01-05', status: 'uploaded' }
        ]
      });

      setAssessmentRequests([
        {
          id: '1',
          buyerCompany: 'Global Enterprises',
          buyerDomain: 'globalenterprises.com',
          category: 'Cloud Services',
          urgency: 'high',
          requestedDate: '2024-01-20',
          status: 'in_progress',
          estimatedTime: '2 minutes',
          progress: 75
        },
        {
          id: '2',
          buyerCompany: 'TechStart Inc',
          buyerDomain: 'techstart.io',
          category: 'Cloud Services',
          urgency: 'medium',
          requestedDate: '2024-01-19',
          status: 'pending',
          estimatedTime: '5 minutes',
          progress: 0
        },
        {
          id: '3',
          buyerCompany: 'Finance Corp',
          buyerDomain: 'financecorp.com',
          category: 'Cloud Services',
          urgency: 'critical',
          requestedDate: '2024-01-18',
          status: 'completed',
          estimatedTime: '1 minute',
          progress: 100
        }
      ]);

      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleUploadDocument = () => {
    if (!newDocument.name || !newDocument.type) return;

    if (vendorProfile) {
      const document = {
        id: Date.now().toString(),
        name: newDocument.name,
        type: newDocument.type,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'uploaded' as const
      };

      setVendorProfile({
        ...vendorProfile,
        documents: [document, ...vendorProfile.documents],
        lastUpdated: new Date().toISOString().split('T')[0]
      });

      setNewDocument({ name: '', type: '' });
      setShowDocumentUpload(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'draft': 'bg-gray-500',
      'pending': 'bg-yellow-500',
      'approved': 'bg-green-500',
      'rejected': 'bg-red-500',
      'uploaded': 'bg-blue-500',
      'verified': 'bg-green-500',
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
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Buyers
                </Link>
                <Link
                  href="/sellers"
                  className="text-emerald-600 hover:text-emerald-700 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
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
                        <p className="text-xs text-gray-500">Vendor</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Passport</h1>
          <p className="text-gray-600">Manage your vendor profile and respond to assessment requests</p>
        </div>

        {/* Quick Stats */}
        {vendorProfile && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Passport Status</p>
                    <Badge className={`${getStatusColor(vendorProfile.passportStatus)} text-white mt-1`}>
                      {vendorProfile.passportStatus.toUpperCase()}
                    </Badge>
                  </div>
                  <FileCheck className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                    <p className="text-2xl font-bold text-green-600">{vendorProfile.complianceScore}%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Risk Score</p>
                    <p className="text-2xl font-bold text-blue-600">{vendorProfile.riskScore}/100</p>
                  </div>
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {assessmentRequests.filter(r => r.status === 'pending').length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Vendor Profile</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="requests">Assessment Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {vendorProfile && (
              <>
                {/* Profile Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl">{vendorProfile.companyName}</CardTitle>
                        <CardDescription className="text-lg">{vendorProfile.domain}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setEditingProfile(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Export Passport
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-600">{vendorProfile.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">Location</p>
                          <p className="text-sm">{vendorProfile.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users2 className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">Employees</p>
                          <p className="text-sm">{vendorProfile.employeeCount}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">Revenue</p>
                          <p className="text-sm">{vendorProfile.revenue}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">Founded</p>
                          <p className="text-sm">{vendorProfile.foundedYear}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">Email</p>
                          <p className="text-sm">{vendorProfile.contactEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">Phone</p>
                          <p className="text-sm">{vendorProfile.contactPhone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Key Services</h3>
                        <div className="flex flex-wrap gap-2">
                          {vendorProfile.keyServices.map(service => (
                            <Badge key={service} variant="outline">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Certifications</h3>
                        <div className="flex flex-wrap gap-2">
                          {vendorProfile.certifications.map(cert => (
                            <Badge key={cert} className="bg-green-100 text-green-800">
                              <Certificate className="h-3 w-3 mr-1" />
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Compliance Score</span>
                          <span className="text-sm font-bold">{vendorProfile.complianceScore}%</span>
                        </div>
                        <Progress value={vendorProfile.complianceScore} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Risk Score</span>
                          <span className="text-sm font-bold">{vendorProfile.riskScore}/100</span>
                        </div>
                        <Progress value={vendorProfile.riskScore} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Assessment History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Assessment History</CardTitle>
                    <CardDescription>Previous assessment results and feedback</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {vendorProfile.assessmentHistory.map((assessment, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <Badge className={`${getStatusColor(assessment.status)} text-white`}>
                                {assessment.status.toUpperCase()}
                              </Badge>
                              <span className="text-sm font-medium">{assessment.date}</span>
                              <span className="text-sm text-gray-500">by {assessment.assessor}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Score:</span>
                              <span className="text-lg font-bold">{assessment.score}/100</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{assessment.notes}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Document Management</h2>
              <Dialog open={showDocumentUpload} onOpenChange={setShowDocumentUpload}>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload New Document</DialogTitle>
                    <DialogDescription>
                      Add compliance certificates, security policies, or other relevant documents
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="documentName">Document Name</Label>
                      <Input
                        id="documentName"
                        value={newDocument.name}
                        onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter document name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="documentType">Document Type</Label>
                      <Select value={newDocument.type} onValueChange={(value) => setNewDocument(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Compliance">Compliance</SelectItem>
                          <SelectItem value="Certification">Certification</SelectItem>
                          <SelectItem value="Policy">Policy</SelectItem>
                          <SelectItem value="Security">Security</SelectItem>
                          <SelectItem value="Legal">Legal</SelectItem>
                          <SelectItem value="Financial">Financial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleUploadDocument} className="w-full">
                      Upload Document
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {vendorProfile && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendorProfile.documents.map(document => (
                  <Card key={document.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <h3 className="font-medium">{document.name}</h3>
                            <p className="text-sm text-gray-500">{document.type}</p>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(document.status)} text-white`}>
                          {document.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>Uploaded: {document.uploadDate}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Assessment Requests</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {assessmentRequests.filter(r => r.status === 'pending').length} pending
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {assessmentRequests.map(request => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{request.buyerCompany}</h3>
                          <Badge className={getUrgencyColor(request.urgency)}>
                            {request.urgency.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {request.category}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{request.buyerDomain}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <span>Requested: {request.requestedDate}</span>
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
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Zap className="h-4 w-4 mr-2" />
                            Start Assessment
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
                            View Results
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