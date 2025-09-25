"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Globe, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  Shield, 
  FileText,
  Building2,
  Users,
  Share2,
  Download,
  Eye,
  Edit,
  Plus,
  Star,
  ThumbsUp,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Database,
  Settings,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Clock,
  Award,
  Certificate,
  Lock,
  Zap,
  Target,
  Activity,
  RefreshCw,
  Copy,
  ExternalLink,
  QrCode,
  MoreHorizontal
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';

interface VendorPassport {
  id: string;
  vendorName: string;
  description: string;
  category: string;
  status: 'draft' | 'active' | 'expired' | 'revoked';
  score: number;
  createdAt: string;
  expiresAt: string;
  lastUpdated: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  compliance: {
    soc2: boolean;
    iso27001: boolean;
    pcidss: boolean;
    gdpr: boolean;
    hipaa: boolean;
  };
  documents: {
    id: string;
    name: string;
    type: string;
    uploadDate: string;
    expiresAt?: string;
    status: 'valid' | 'expired' | 'expiring_soon';
  }[];
  sharing: {
    isPublic: boolean;
    sharedWith: string[];
    accessCount: number;
    lastAccessed: string;
  };
  analytics: {
    views: number;
    downloads: number;
    shares: number;
    averageRating: number;
  };
}

export default function VendorPassportPage() {
  const { user, hasPermission } = useRole();
  const [passport, setPassport] = useState<VendorPassport | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    vendorName: '',
    description: '',
    category: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: ''
  });

  useEffect(() => {
    // Check if user has permission to access this tool
    if (!hasPermission('manage_vendor_profile')) {
      console.log('Access denied: User does not have permission to manage vendor profiles');
    }
  }, [hasPermission]);

  const createNewPassport = () => {
    setIsCreating(true);
    setFormData({
      vendorName: '',
      description: '',
      category: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      contactAddress: ''
    });
  };

  const savePassport = () => {
    const newPassport: VendorPassport = {
      id: Math.random().toString(36).substr(2, 9),
      vendorName: formData.vendorName,
      description: formData.description,
      category: formData.category,
      status: 'draft',
      score: 0,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdated: new Date().toISOString(),
      contactInfo: {
        name: formData.contactName,
        email: formData.contactEmail,
        phone: formData.contactPhone,
        address: formData.contactAddress
      },
      compliance: {
        soc2: false,
        iso27001: false,
        pcidss: false,
        gdpr: false,
        hipaa: false
      },
      documents: [],
      sharing: {
        isPublic: false,
        sharedWith: [],
        accessCount: 0,
        lastAccessed: new Date().toISOString()
      },
      analytics: {
        views: 0,
        downloads: 0,
        shares: 0,
        averageRating: 0
      }
    };

    setPassport(newPassport);
    setIsCreating(false);
  };

  const updatePassport = () => {
    if (passport) {
      setPassport({
        ...passport,
        vendorName: formData.vendorName,
        description: formData.description,
        category: formData.category,
        contactInfo: {
          ...passport.contactInfo,
          name: formData.contactName,
          email: formData.contactEmail,
          phone: formData.contactPhone,
          address: formData.contactAddress
        },
        lastUpdated: new Date().toISOString()
      });
      setIsEditing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'expired': return 'text-red-600 bg-red-100';
      case 'revoked': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!hasPermission('manage_vendor_profile')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the Vendor Passport tool.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.history.back()} variant="outline" className="w-full">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCreating) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create Vendor Passport</h1>
                <p className="text-gray-600 mt-1">
                  Create a new vendor compliance passport
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Information</CardTitle>
              <CardDescription>
                Enter the basic information for the vendor passport
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="vendorName">Vendor Name *</Label>
                  <Input
                    id="vendorName"
                    value={formData.vendorName}
                    onChange={(e) => setFormData(prev => ({ ...prev, vendorName: e.target.value }))}
                    placeholder="Enter vendor name"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cloud-services">Cloud Services</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="networking">Networking</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the vendor and their services"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                      placeholder="Contact person name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="contact@vendor.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Phone</Label>
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactAddress">Address</Label>
                    <Input
                      id="contactAddress"
                      value={formData.contactAddress}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactAddress: e.target.value }))}
                      placeholder="123 Business St, City, State"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={savePassport} disabled={!formData.vendorName}>
                  Create Passport
                </Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!passport) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Vendor Passport</h1>
                <p className="text-gray-600 mt-1">
                  Create and manage vendor compliance passports
                </p>
              </div>
              <Button onClick={createNewPassport}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Passport
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <Globe className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Vendor Passports Yet</h2>
            <p className="text-gray-600 mb-6">
              Create your first vendor passport to get started with streamlined compliance management.
            </p>
            <Button onClick={createNewPassport} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Passport
            </Button>
          </div>
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
              <h1 className="text-3xl font-bold text-gray-900">Vendor Passport</h1>
              <p className="text-gray-600 mt-1">
                {passport.vendorName} - Compliance passport management
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className={getStatusColor(passport.status)}>
                {passport.status.toUpperCase()}
              </Badge>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Card>
            <CardHeader>
              <CardTitle>Edit Vendor Passport</CardTitle>
              <CardDescription>
                Update vendor information and passport details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="vendorName">Vendor Name</Label>
                  <Input
                    id="vendorName"
                    value={formData.vendorName || passport.vendorName}
                    onChange={(e) => setFormData(prev => ({ ...prev, vendorName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select defaultValue={passport.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cloud-services">Cloud Services</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="networking">Networking</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || passport.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName || passport.contactInfo.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail || passport.contactInfo.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Phone</Label>
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone || passport.contactInfo.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactAddress">Address</Label>
                    <Input
                      id="contactAddress"
                      value={formData.contactAddress || passport.contactInfo.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactAddress: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={updatePassport}>
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Passport Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-blue-600" />
                        Passport Overview
                      </CardTitle>
                      <CardDescription>
                        Created {new Date(passport.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(passport.score)}`}>
                        {passport.score}/100
                      </div>
                      <div className="text-sm text-gray-500">Passport Score</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{passport.analytics.views}</div>
                      <div className="text-sm text-gray-600">Total Views</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{passport.analytics.downloads}</div>
                      <div className="text-sm text-gray-600">Downloads</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{passport.analytics.shares}</div>
                      <div className="text-sm text-gray-600">Shares</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-gray-600">{passport.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Contact Information</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{passport.contactInfo.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{passport.contactInfo.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{passport.contactInfo.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{passport.contactInfo.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Status</CardTitle>
                  <CardDescription>
                    Current compliance certification status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(passport.compliance).map(([framework, status]) => (
                      <div key={framework} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium uppercase">{framework}</span>
                        {status ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <X className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Documents</CardTitle>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                  <CardDescription>
                    Compliance and certification documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {passport.documents.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-2" />
                      <p>No documents uploaded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {passport.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-gray-500">{doc.type} • Uploaded {new Date(doc.uploadDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={doc.status === 'valid' ? 'default' : 'destructive'}>
                              {doc.status}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Passport
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Passport
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR Code
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </CardContent>
              </Card>

              {/* Passport Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Passport Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Status</span>
                    <Badge variant="outline" className={getStatusColor(passport.status)}>
                      {passport.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Created</span>
                    <span className="text-sm">{new Date(passport.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Expires</span>
                    <span className="text-sm">{new Date(passport.expiresAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Last Updated</span>
                    <span className="text-sm">{new Date(passport.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Category</span>
                    <span className="text-sm">{passport.category}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Sharing Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sharing Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Public Access</span>
                    <Badge variant={passport.sharing.isPublic ? 'default' : 'secondary'}>
                      {passport.sharing.isPublic ? 'Public' : 'Private'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Access Count</span>
                    <span className="text-sm">{passport.sharing.accessCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Shared With</span>
                    <span className="text-sm">{passport.sharing.sharedWith.length} users</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Last Accessed</span>
                    <span className="text-sm">{new Date(passport.sharing.lastAccessed).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}