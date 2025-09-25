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
  Database,
  FileText,
  Settings,
  Eye,
  Filter,
  Search,
  Download,
  RefreshCw,
  UserCheck,
  Building2,
  Globe,
  Lock,
  Zap,
  Target,
  Activity,
  DollarSign,
  TrendingDown,
  ThumbsUp,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Plus,
  ExternalLink,
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
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
  icon: any;
}

interface DashboardLink {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  roles: string[];
  icon: any;
  color: string;
  badge?: string;
  stats?: {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'stable';
  };
}

export default function DashboardsPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVendors: 0,
    activeAssessments: 0,
    completedAssessments: 0,
    highRiskVendors: 0,
    compliantVendors: 0,
    averageProcessingTime: 0,
    passportUtilization: 0
  });
  
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock data - in real implementation, this would come from API
  useEffect(() => {
    setStats({
      totalVendors: 156,
      activeAssessments: 23,
      completedAssessments: 89,
      highRiskVendors: 12,
      compliantVendors: 134,
      averageProcessingTime: 95, // seconds
      passportUtilization: 68
    });
  }, []);

  const roles: Role[] = [
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full system access and configuration',
      permissions: ['manage_vendors', 'manage_users', 'view_analytics', 'system_config', 'manage_billing'],
      color: 'bg-red-100 text-red-800',
      icon: Settings
    },
    {
      id: 'risk_analyst',
      name: 'Risk Analyst',
      description: 'Vendor assessment and risk analysis',
      permissions: ['assess_vendors', 'view_findings', 'generate_reports', 'view_analytics'],
      color: 'bg-blue-100 text-blue-800',
      icon: Shield
    },
    {
      id: 'vendor_manager',
      name: 'Vendor Manager',
      description: 'Vendor relationship and passport management',
      permissions: ['manage_vendor_profile', 'upload_documents', 'share_passport', 'view_vendor_analytics'],
      color: 'bg-green-100 text-green-800',
      icon: Users
    },
    {
      id: 'compliance_officer',
      name: 'Compliance Officer',
      description: 'Compliance monitoring and reporting',
      permissions: ['view_compliance', 'generate_reports', 'audit_logs', 'view_analytics'],
      color: 'bg-purple-100 text-purple-800',
      icon: FileText
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'High-level overview and strategic insights',
      permissions: ['view_dashboard', 'view_reports', 'view_analytics'],
      color: 'bg-amber-100 text-amber-800',
      icon: TrendingUp
    },
    {
      id: 'readonly',
      name: 'Read Only',
      description: 'View-only access to vendor information',
      permissions: ['view_vendors', 'view_reports'],
      color: 'bg-gray-100 text-gray-800',
      icon: Eye
    }
  ];

  const dashboardLinks: DashboardLink[] = [
    // Main Dashboards
    {
      id: 'main-dashboard',
      title: 'Main Dashboard',
      description: 'Comprehensive overview of all TPRM activities and metrics',
      url: '/dashboards/main',
      category: 'dashboards',
      roles: ['admin', 'risk_analyst', 'compliance_officer', 'executive'],
      icon: BarChart3,
      color: 'text-blue-600',
      stats: { label: 'Views Today', value: '1,234', trend: 'up' }
    },
    {
      id: 'risk-dashboard',
      title: 'Risk Analytics Dashboard',
      description: 'Detailed risk analysis, scoring, and trends',
      url: '/dashboards/risk',
      category: 'dashboards',
      roles: ['admin', 'risk_analyst', 'compliance_officer', 'executive'],
      icon: AlertTriangle,
      color: 'text-red-600',
      stats: { label: 'High Risk', value: '12', trend: 'down' }
    },
    {
      id: 'compliance-dashboard',
      title: 'Compliance Dashboard',
      description: 'SOC2, ISO27001, and PCI DSS compliance tracking',
      url: '/dashboards/compliance',
      category: 'dashboards',
      roles: ['admin', 'compliance_officer', 'executive'],
      icon: CheckCircle,
      color: 'text-green-600',
      stats: { label: 'Compliant', value: '86%', trend: 'up' }
    },
    {
      id: 'vendor-dashboard',
      title: 'Vendor Management Dashboard',
      description: 'Vendor portfolio management and performance tracking',
      url: '/dashboards/vendors',
      category: 'dashboards',
      roles: ['admin', 'vendor_manager', 'risk_analyst'],
      icon: Building2,
      color: 'text-purple-600',
      stats: { label: 'Active Vendors', value: '156', trend: 'up' }
    },

    // Fast Check Tools
    {
      id: 'fast-check',
      title: 'Fast Check',
      description: 'Rapid vendor risk assessment with AI-powered analysis',
      url: '/tools/fast-check',
      category: 'tools',
      roles: ['admin', 'risk_analyst', 'vendor_manager'],
      icon: Zap,
      color: 'text-emerald-600',
      badge: 'NEW',
      stats: { label: 'Avg Time', value: '95s', trend: 'down' }
    },
    {
      id: 'assessment-queue',
      title: 'Assessment Queue',
      description: 'Monitor and manage ongoing vendor assessments',
      url: '/tools/assessment-queue',
      category: 'tools',
      roles: ['admin', 'risk_analyst'],
      icon: Clock,
      color: 'text-orange-600',
      stats: { label: 'In Progress', value: '23', trend: 'stable' }
    },
    {
      id: 'document-processor',
      title: 'Document Processor',
      description: 'Upload and process compliance documents (SOC2, COI, etc.)',
      url: '/tools/document-processor',
      category: 'tools',
      roles: ['admin', 'risk_analyst', 'vendor_manager'],
      icon: FileText,
      color: 'text-indigo-600',
      stats: { label: 'Processed', value: '447', trend: 'up' }
    },

    // Vendor Passport Tools
    {
      id: 'vendor-passport',
      title: 'Vendor Passport',
      description: 'Create and manage vendor compliance passports',
      url: '/tools/vendor-passport',
      category: 'tools',
      roles: ['admin', 'vendor_manager'],
      icon: Globe,
      color: 'text-cyan-600',
      badge: 'POPULAR',
      stats: { label: 'Active', value: '89', trend: 'up' }
    },
    {
      id: 'passport-analytics',
      title: 'Passport Analytics',
      description: 'Analytics on vendor passport usage and engagement',
      url: '/analytics/passport',
      category: 'analytics',
      roles: ['admin', 'vendor_manager', 'executive'],
      icon: TrendingUp,
      color: 'text-teal-600',
      stats: { label: 'Utilization', value: '68%', trend: 'up' }
    },
    {
      id: 'sharing-center',
      title: 'Sharing Center',
      description: 'Manage secure document sharing and access requests',
      url: '/tools/sharing-center',
      category: 'tools',
      roles: ['admin', 'vendor_manager'],
      icon: Users,
      color: 'text-pink-600',
      stats: { label: 'Shared Today', value: '45', trend: 'up' }
    },

    // Analytics & Reporting
    {
      id: 'executive-analytics',
      title: 'Executive Analytics',
      description: 'High-level metrics and strategic insights for leadership',
      url: '/analytics/executive',
      category: 'analytics',
      roles: ['admin', 'executive'],
      icon: TrendingUp,
      color: 'text-amber-600',
      stats: { label: 'Score', value: 'B+', trend: 'up' }
    },
    {
      id: 'performance-metrics',
      title: 'Performance Metrics',
      description: 'System performance and processing efficiency metrics',
      url: '/analytics/performance',
      category: 'analytics',
      roles: ['admin', 'risk_analyst'],
      icon: Activity,
      color: 'text-lime-600',
      stats: { label: 'Efficiency', value: '94%', trend: 'up' }
    },
    {
      id: 'custom-reports',
      title: 'Custom Reports',
      description: 'Generate and schedule custom compliance reports',
      url: '/reports/custom',
      category: 'reports',
      roles: ['admin', 'compliance_officer', 'executive'],
      icon: Download,
      color: 'text-violet-600',
      stats: { label: 'Generated', value: '23', trend: 'up' }
    },

    // Administration
    {
      id: 'user-management',
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      url: '/admin/users',
      category: 'admin',
      roles: ['admin'],
      icon: UserCheck,
      color: 'text-red-600',
      stats: { label: 'Active Users', value: '47', trend: 'up' }
    },
    {
      id: 'system-settings',
      title: 'System Settings',
      description: 'Configure system settings and integrations',
      url: '/admin/settings',
      category: 'admin',
      roles: ['admin'],
      icon: Settings,
      color: 'text-gray-600',
      stats: { label: 'Configured', value: '100%', trend: 'stable' }
    },
    {
      id: 'audit-logs',
      title: 'Audit Logs',
      description: 'View system audit logs and compliance tracking',
      url: '/admin/audit',
      category: 'admin',
      roles: ['admin', 'compliance_officer'],
      icon: Lock,
      color: 'text-slate-600',
      stats: { label: 'Events Today', value: '1,847', trend: 'up' }
    },

    // External Integrations
    {
      id: 'github-integration',
      title: 'GitHub Integration',
      description: 'Monitor development repositories and track progress',
      url: '/tools/github-integration',
      category: 'integrations',
      roles: ['admin', 'risk_analyst'],
      icon: ExternalLink,
      color: 'text-gray-800',
      stats: { label: 'Active Repos', value: '12', trend: 'stable' }
    },
    {
      id: 'api-access',
      title: 'API Access',
      description: 'Manage API keys and integration endpoints',
      url: '/admin/api',
      category: 'admin',
      roles: ['admin'],
      icon: ExternalLink,
      color: 'text-indigo-600',
      stats: { label: 'API Calls', value: '45K', trend: 'up' }
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', count: dashboardLinks.length },
    { id: 'dashboards', name: 'Dashboards', count: dashboardLinks.filter(l => l.category === 'dashboards').length },
    { id: 'tools', name: 'Tools', count: dashboardLinks.filter(l => l.category === 'tools').length },
    { id: 'analytics', name: 'Analytics', count: dashboardLinks.filter(l => l.category === 'analytics').length },
    { id: 'reports', name: 'Reports', count: dashboardLinks.filter(l => l.category === 'reports').length },
    { id: 'admin', name: 'Administration', count: dashboardLinks.filter(l => l.category === 'admin').length },
    { id: 'integrations', name: 'Integrations', count: dashboardLinks.filter(l => l.category === 'integrations').length }
  ];

  const filteredLinks = dashboardLinks.filter(link => {
    const roleMatch = selectedRole === 'all' || link.roles.includes(selectedRole);
    const categoryMatch = selectedCategory === 'all' || link.category === selectedCategory;
    const searchMatch = searchTerm === '' || 
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return roleMatch && categoryMatch && searchMatch;
  });

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="h-3 w-3 text-green-600" />;
      case 'down': return <ArrowDownRight className="h-3 w-3 text-red-600" />;
      default: return <Minus className="h-3 w-3 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboards & Tools</h1>
              <p className="text-gray-600 mt-1">
                Role-based access to all Project Sentinel dashboards and tools
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageProcessingTime}s</div>
              <p className="text-xs text-muted-foreground">
                Target: ≤120s
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Passport Usage</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.passportUtilization}%</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Role Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedRole === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRole('all')}
            >
              All Roles
            </Button>
            {roles.map((role) => (
              <Button
                key={role.id}
                variant={selectedRole === role.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRole(role.id)}
                className="flex items-center gap-2"
              >
                <role.icon className="h-4 w-4" />
                {role.name}
              </Button>
            ))}
          </div>

          {/* Search and Category Filter */}
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search dashboards..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Roles Overview */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">User Roles & Permissions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => {
              const RoleIcon = role.icon;
              return (
                <div key={role.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${role.color}`}>
                      <RoleIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{role.name}</h3>
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Permissions:</p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission.replace('_', ' ')}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dashboard Links Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Available Dashboards & Tools
          </h2>
          <p className="text-gray-600">
            {filteredLinks.length} items {selectedRole !== 'all' ? `for ${roles.find(r => r.id === selectedRole)?.name}` : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLinks.map((link) => {
            const LinkIcon = link.icon;
            return (
              <Card key={link.id} className="hover:shadow-lg transition-shadow duration-200 group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                        <LinkIcon className={`h-6 w-6 ${link.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                            {link.title}
                          </CardTitle>
                          {link.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {link.badge}
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="mt-1">
                          {link.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Stats */}
                  {link.stats && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-500">{link.stats.label}</p>
                        <p className="text-lg font-semibold">{link.stats.value}</p>
                      </div>
                      {getTrendIcon(link.stats.trend)}
                    </div>
                  )}

                  {/* Roles */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Accessible to:</p>
                    <div className="flex flex-wrap gap-1">
                      {link.roles.slice(0, 2).map((roleId) => {
                        const role = roles.find(r => r.id === roleId);
                        return role ? (
                          <Badge key={roleId} variant="outline" className="text-xs">
                            {role.name}
                          </Badge>
                        ) : null;
                      })}
                      {link.roles.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{link.roles.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <Link href={link.url} className="block">
                    <Button className="w-full" size="lg">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Dashboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredLinks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No dashboards found</h3>
            <p className="text-gray-600">
              Try adjusting your search, role filter, or category selection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}