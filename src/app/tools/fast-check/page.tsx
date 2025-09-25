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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Zap,
  Shield,
  Target,
  BarChart3,
  Download,
  Eye,
  RefreshCw,
  File,
  X,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  Database,
  Settings,
  Search,
  Filter,
  Calendar,
  User,
  Building2,
  Globe,
  Star,
  ThumbsUp
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';

interface FastCheckResult {
  vendorName: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  processingTime: number;
  keyFindings: string[];
  recommendations: string[];
  complianceStatus: {
    soc2: boolean;
    iso27001: boolean;
    pcidss: boolean;
    gdpr: boolean;
  };
  documentAnalysis: {
    totalDocuments: number;
    processedDocuments: number;
    issuesFound: number;
  };
}

export default function FastCheckPage() {
  const { user, hasPermission } = useRole();
  const [files, setFiles] = useState<File[]>([]);
  const [vendorInfo, setVendorInfo] = useState({
    name: '',
    description: '',
    category: '',
    contact: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<FastCheckResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    // Check if user has permission to access this tool
    if (!hasPermission('assess_vendors')) {
      // In a real app, this would redirect to unauthorized
      console.log('Access denied: User does not have permission to assess vendors');
    }
  }, [hasPermission]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files).filter(file => 
      file.type === 'application/pdf' || 
      file.type === 'application/msword' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processFastCheck = async () => {
    if (files.length === 0 || !vendorInfo.name) {
      alert('Please upload files and provide vendor information');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    // Simulate processing with progress updates
    const processingSteps = [
      { progress: 20, message: 'Analyzing documents...' },
      { progress: 40, message: 'Extracting compliance data...' },
      { progress: 60, message: 'Evaluating risk factors...' },
      { progress: 80, message: 'Generating recommendations...' },
      { progress: 100, message: 'Finalizing assessment...' }
    ];

    for (let i = 0; i < processingSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(processingSteps[i].progress);
    }

    // Mock result
    const mockResult: FastCheckResult = {
      vendorName: vendorInfo.name,
      riskScore: 72,
      riskLevel: 'medium',
      confidence: 89,
      processingTime: 95,
      keyFindings: [
        'SOC 2 Type II certification is current and valid',
        'Strong encryption practices detected',
        'Regular security audits conducted',
        'Comprehensive incident response plan in place',
        'Multi-factor authentication implemented'
      ],
      recommendations: [
        'Implement additional data loss prevention measures',
        'Enhance vendor monitoring procedures',
        'Schedule quarterly security reviews',
        'Update business continuity documentation',
        'Establish regular compliance reporting'
      ],
      complianceStatus: {
        soc2: true,
        iso27001: true,
        pcidss: false,
        gdpr: true
      },
      documentAnalysis: {
        totalDocuments: files.length,
        processedDocuments: files.length,
        issuesFound: 2
      }
    };

    setResult(mockResult);
    setIsProcessing(false);
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

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'high': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'medium': return <Shield className="h-5 w-5 text-yellow-600" />;
      case 'low': return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return <Shield className="h-5 w-5 text-gray-600" />;
    }
  };

  if (!hasPermission('assess_vendors')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the Fast Check tool.
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fast Check</h1>
              <p className="text-gray-600 mt-1">
                Rapid vendor risk assessment with AI-powered analysis
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                <Zap className="h-3 w-3 mr-1" />
                2-Minute Assessment
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Input */}
          <div className="lg:col-span-2 space-y-6">
            {!result ? (
              <>
                {/* Vendor Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Vendor Information</CardTitle>
                    <CardDescription>
                      Provide basic information about the vendor you want to assess
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="vendorName">Vendor Name *</Label>
                      <Input
                        id="vendorName"
                        value={vendorInfo.name}
                        onChange={(e) => setVendorInfo(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter vendor name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vendorDescription">Description</Label>
                      <Textarea
                        id="vendorDescription"
                        value={vendorInfo.description}
                        onChange={(e) => setVendorInfo(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of the vendor and their services"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vendorCategory">Category</Label>
                        <Input
                          id="vendorCategory"
                          value={vendorInfo.category}
                          onChange={(e) => setVendorInfo(prev => ({ ...prev, category: e.target.value }))}
                          placeholder="e.g., Cloud Services, Security"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vendorContact">Contact Person</Label>
                        <Input
                          id="vendorContact"
                          value={vendorInfo.contact}
                          onChange={(e) => setVendorInfo(prev => ({ ...prev, contact: e.target.value }))}
                          placeholder="Contact name or email"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Document Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Documents</CardTitle>
                    <CardDescription>
                      Upload compliance documents (SOC2, ISO27001, PCI DSS, etc.)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center ${
                        dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Drop files here or click to upload
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        Supports PDF, DOC, DOCX files
                      </p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileInput}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload">
                        <Button variant="outline" className="cursor-pointer">
                          <Plus className="h-4 w-4 mr-2" />
                          Select Files
                        </Button>
                      </label>
                    </div>

                    {/* File List */}
                    {files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Uploaded Files:</h4>
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="font-medium text-sm">{file.name}</p>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Process Button */}
                    <div className="mt-6">
                      <Button
                        onClick={processFastCheck}
                        disabled={isProcessing || files.length === 0 || !vendorInfo.name}
                        className="w-full"
                        size="lg"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Start Fast Check
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Progress */}
                    {isProcessing && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Processing...</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              /* Results */
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getRiskIcon(result.riskLevel)}
                        Risk Assessment Complete
                      </CardTitle>
                      <CardDescription>
                        {result.vendorName} - Completed in {result.processingTime} seconds
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getRiskColor(result.riskLevel)}>
                        {result.riskLevel.toUpperCase()} RISK
                      </Badge>
                      <Badge variant="outline">
                        {result.confidence}% Confidence
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold mb-2">{result.riskScore}/100</div>
                      <div className="text-sm text-gray-600">Risk Score</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold mb-2 text-green-600">
                        {result.processingTime}s
                      </div>
                      <div className="text-sm text-gray-600">Processing Time</div>
                    </div>
                  </div>

                  <Tabs defaultValue="findings" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="findings">Key Findings</TabsTrigger>
                      <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                      <TabsTrigger value="compliance">Compliance</TabsTrigger>
                      <TabsTrigger value="documents">Documents</TabsTrigger>
                    </TabsList>

                    <TabsContent value="findings">
                      <div className="space-y-3">
                        {result.keyFindings.map((finding, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            <p className="text-sm">{finding}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="recommendations">
                      <div className="space-y-3">
                        {result.recommendations.map((recommendation, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                            <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                            <p className="text-sm">{recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="compliance">
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(result.complianceStatus).map(([framework, status]) => (
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
                    </TabsContent>

                    <TabsContent value="documents">
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-3 border rounded-lg">
                            <div className="text-2xl font-bold">{result.documentAnalysis.totalDocuments}</div>
                            <div className="text-sm text-gray-600">Total Documents</div>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{result.documentAnalysis.processedDocuments}</div>
                            <div className="text-sm text-gray-600">Processed</div>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <div className="text-2xl font-bold text-red-600">{result.documentAnalysis.issuesFound}</div>
                            <div className="text-sm text-gray-600">Issues Found</div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="mt-6 flex gap-4">
                    <Button onClick={() => setResult(null)} variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      New Assessment
                    </Button>
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Upload Documents</h4>
                    <p className="text-sm text-gray-600">Drag and drop compliance documents</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-blue-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">AI Analysis</h4>
                    <p className="text-sm text-gray-600">Our AI analyzes and extracts key data</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-blue-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Risk Assessment</h4>
                    <p className="text-sm text-gray-600">Get comprehensive risk scoring</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-blue-600">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Actionable Insights</h4>
                    <p className="text-sm text-gray-600">Receive recommendations and next steps</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Supported Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>SOC 2 Type I & II Reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>ISO 27001 Certifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>PCI DSS Compliance Reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>HIPAA Documentation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>GDPR Compliance Papers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Security Policies</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Time</span>
                    <span className="font-medium">95 seconds</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Accuracy Rate</span>
                    <span className="font-medium">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Confidence Score</span>
                    <span className="font-medium">89%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Document Processing</span>
                    <span className="font-medium">100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}