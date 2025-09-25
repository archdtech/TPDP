"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
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
  Users,
  Building2,
  Database,
  Settings,
  Zap,
  Globe,
  Star,
  ThumbsUp,
  Certificate,
  Award,
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckSquare,
  Square,
  ClipboardList
} from 'lucide-react';
import Link from 'next/link';

interface ComplianceMetrics {
  overallCompliance: number;
  frameworksCompleted: number;
  totalFrameworks: number;
  auditsCompleted: number;
  totalAudits: number;
  criticalFindings: number;
  openFindings: number;
  avgResolutionTime: number;
}

interface ComplianceFramework {
  id: string;
  name: string;
  type: 'soc2' | 'iso27001' | 'pcidss' | 'hipaa' | 'gdpr' | 'other';
  compliance: number;
  status: 'compliant' | 'partial' | 'non_compliant' | 'not_assessed';
  lastAssessed: string;
  nextAssessment: string;
  vendors: number;
  findings: number;
  criticalFindings: number;
}

interface ComplianceAudit {
  id: string;
  framework: string;
  vendor: string;
  type: 'internal' | 'external' | 'certification';
  status: 'completed' | 'in_progress' | 'scheduled' | 'overdue';
  scheduledDate: string;
  completedDate?: string;
  score?: number;
  findings: number;
  auditor: string;
}

interface ComplianceFinding {
  id: string;
  framework: string;
  vendor: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  identifiedDate: string;
  targetResolution: string;
  assignedTo: string;
}

export default function ComplianceDashboard() {
  const [metrics, setMetrics] = useState<ComplianceMetrics>({
    overallCompliance: 0,
    frameworksCompleted: 0,
    totalFrameworks: 0,
    auditsCompleted: 0,
    totalAudits: 0,
    criticalFindings: 0,
    openFindings: 0,
    avgResolutionTime: 0
  });

  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [audits, setAudits] = useState<ComplianceAudit[]>([]);
  const [findings, setFindings] = useState<ComplianceFinding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setMetrics({
        overallCompliance: 86,
        frameworksCompleted: 4,
        totalFrameworks: 6,
        auditsCompleted: 34,
        totalAudits: 42,
        criticalFindings: 8,
        openFindings: 23,
        avgResolutionTime: 45
      });

      setFrameworks([
        {
          id: '1',
          name: 'SOC 2 Type II',
          type: 'soc2',
          compliance: 92,
          status: 'compliant',
          lastAssessed: '2024-01-15',
          nextAssessment: '2025-01-15',
          vendors: 45,
          findings: 3,
          criticalFindings: 1
        },
        {
          id: '2',
          name: 'ISO 27001:2022',
          type: 'iso27001',
          compliance: 78,
          status: 'partial',
          lastAssessed: '2024-01-10',
          nextAssessment: '2024-07-10',
          vendors: 38,
          findings: 8,
          criticalFindings: 2
        },
        {
          id: '3',
          name: 'PCI DSS 4.0',
          type: 'pcidss',
          compliance: 95,
          status: 'compliant',
          lastAssessed: '2024-01-20',
          nextAssessment: '2025-01-20',
          vendors: 12,
          findings: 1,
          criticalFindings: 0
        },
        {
          id: '4',
          name: 'GDPR',
          type: 'gdpr',
          compliance: 88,
          status: 'compliant',
          lastAssessed: '2024-01-05',
          nextAssessment: '2024-07-05',
          vendors: 28,
          findings: 4,
          criticalFindings: 1
        },
        {
          id: '5',
          name: 'HIPAA',
          type: 'hipaa',
          compliance: 65,
          status: 'partial',
          lastAssessed: '2023-12-15',
          nextAssessment: '2024-06-15',
          vendors: 8,
          findings: 6,
          criticalFindings: 3
        },
        {
          id: '6',
          name: 'CCPA',
          type: 'other',
          compliance: 45,
          status: 'non_compliant',
          lastAssessed: '2023-11-20',
          nextAssessment: '2024-05-20',
          vendors: 15,
          findings: 12,
          criticalFindings: 1
        }
      ]);

      setAudits([
        {
          id: '1',
          framework: 'SOC 2 Type II',
          vendor: 'CloudTech Solutions',
          type: 'certification',
          status: 'completed',
          scheduledDate: '2024-01-15',
          completedDate: '2024-01-15',
          score: 92,
          findings: 3,
          auditor: 'Deloitte'
        },
        {
          id: '2',
          framework: 'ISO 27001:2022',
          vendor: 'DataSecure Inc.',
          type: 'external',
          status: 'in_progress',
          scheduledDate: '2024-01-25',
          findings: 0,
          auditor: 'KPMG'
        },
        {
          id: '3',
          framework: 'PCI DSS 4.0',
          vendor: 'PaymentTech Corp',
          type: 'certification',
          status: 'scheduled',
          scheduledDate: '2024-02-01',
          findings: 0,
          auditor: 'Trustwave'
        }
      ]);

      setFindings([
        {
          id: '1',
          framework: 'SOC 2 Type II',
          vendor: 'CloudTech Solutions',
          severity: 'critical',
          category: 'Access Control',
          description: 'Inadequate segregation of duties in privileged access management',
          status: 'open',
          identifiedDate: '2024-01-15',
          targetResolution: '2024-02-15',
          assignedTo: 'Security Team'
        },
        {
          id: '2',
          framework: 'ISO 27001:2022',
          vendor: 'DataSecure Inc.',
          severity: 'high',
          category: 'Encryption',
          description: 'Weak encryption standards for data at rest',
          status: 'in_progress',
          identifiedDate: '2024-01-10',
          targetResolution: '2024-02-10',
          assignedTo: 'Engineering Team'
        },
        {
          id: '3',
          framework: 'PCI DSS 4.0',
          vendor: 'PaymentTech Corp',
          severity: 'medium',
          category: 'Network Security',
          description: 'Firewall rules need review and update',
          status: 'resolved',
          identifiedDate: '2024-01-05',
          targetResolution: '2024-01-20',
          assignedTo: 'Network Team'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getFrameworkIcon = (type: string) => {
    switch (type) {
      case 'soc2': return <Shield className="h-4 w-4" />;
      case 'iso27001': return <Certificate className="h-4 w-4" />;
      case 'pcidss': return <Award className="h-4 w-4" />;
      case 'hipaa': return <FileText className="h-4 w-4" />;
      case 'gdpr': return <Globe className="h-4 w-4" />;
      default: return <ClipboardList className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-100';
      case 'partial': return 'text-yellow-600 bg-yellow-100';
      case 'non_compliant': return 'text-red-600 bg-red-100';
      case 'not_assessed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAuditStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'scheduled': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getFindingStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'resolved': return 'bg-blue-500';
      case 'closed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading Compliance Dashboard...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Compliance Dashboard</h1>
              <p className="text-gray-600 mt-1">
                SOC2, ISO27001, PCI DSS, and regulatory compliance tracking
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

      {/* Compliance Overview */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.overallCompliance}%</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +5% from last quarter
              </p>
              <Progress value={metrics.overallCompliance} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Frameworks</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.frameworksCompleted}/{metrics.totalFrameworks}</div>
              <p className="text-xs text-muted-foreground">
                Active frameworks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Audits Completed</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.auditsCompleted}</div>
              <p className="text-xs text-muted-foreground">
                Of {metrics.totalAudits} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Findings</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{metrics.criticalFindings}</div>
              <p className="text-xs text-muted-foreground">
                Require immediate action
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <Tabs defaultValue="frameworks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
            <TabsTrigger value="audits">Audits</TabsTrigger>
            <TabsTrigger value="findings">Findings</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>

          <TabsContent value="frameworks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Frameworks</CardTitle>
                <CardDescription>
                  Status and compliance across all regulatory frameworks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {frameworks.map((framework) => (
                    <div key={framework.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${getStatusColor(framework.status)}`}>
                          {getFrameworkIcon(framework.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{framework.name}</h4>
                          <p className="text-sm text-gray-600">{framework.vendors} vendors covered</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="font-medium">{framework.compliance}%</div>
                          <div className="text-xs text-gray-500">Compliance</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">{framework.findings} findings</div>
                          <div className="text-xs text-red-500">{framework.criticalFindings} critical</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">Next: {framework.nextAssessment}</div>
                          <div className="text-xs text-gray-500">Last: {framework.lastAssessed}</div>
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

          <TabsContent value="audits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Audits</CardTitle>
                <CardDescription>
                  Internal, external, and certification audit status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {audits.map((audit) => (
                    <div key={audit.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${getAuditStatusColor(audit.status)}`}></div>
                        <div>
                          <h4 className="font-medium">{audit.framework}</h4>
                          <p className="text-sm text-gray-600">{audit.vendor} • {audit.auditor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="font-medium">{audit.status}</div>
                          <div className="text-xs text-gray-500">{audit.type}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">{audit.scheduledDate}</div>
                          {audit.completedDate && (
                            <div className="text-xs text-green-600">Completed: {audit.completedDate}</div>
                          )}
                        </div>
                        {audit.score && (
                          <div className="text-right">
                            <div className="font-medium">{audit.score}%</div>
                            <div className="text-xs text-gray-500">Score</div>
                          </div>
                        )}
                        <div className="text-right">
                          <div className="text-sm">{audit.findings} findings</div>
                          <div className="text-xs text-gray-500">Identified</div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="findings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Findings</CardTitle>
                <CardDescription>
                  Open and resolved compliance findings across all frameworks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {findings.map((finding) => (
                    <div key={finding.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${getFindingStatusColor(finding.status)}`}></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{finding.framework}</h4>
                            <Badge variant="outline" className={getSeverityColor(finding.severity)}>
                              {finding.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{finding.vendor} • {finding.category}</p>
                          <p className="text-sm text-gray-700">{finding.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-sm">{finding.status}</div>
                          <div className="text-xs text-gray-500">Assigned to {finding.assignedTo}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">Target: {finding.targetResolution}</div>
                          <div className="text-xs text-gray-500">Found: {finding.identifiedDate}</div>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">SOC 2 Type II</CardTitle>
                  </div>
                  <CardDescription>
                    Service Organization Control 2
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Status</span>
                      <Badge className="bg-green-100 text-green-800">Certified</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Valid Until</span>
                      <span className="text-sm">2025-01-15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Auditor</span>
                      <span className="text-sm">Deloitte</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Certificate
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Certificate className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-lg">ISO 27001</CardTitle>
                  </div>
                  <CardDescription>
                    Information Security Management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Status</span>
                      <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Target Date</span>
                      <span className="text-sm">2024-07-10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Auditor</span>
                      <span className="text-sm">KPMG</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg">PCI DSS 4.0</CardTitle>
                  </div>
                  <CardDescription>
                    Payment Card Industry Data Security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Status</span>
                      <Badge className="bg-green-100 text-green-800">Certified</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Valid Until</span>
                      <span className="text-sm">2025-01-20</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Auditor</span>
                      <span className="text-sm">Trustwave</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Certificate
                    </Button>
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