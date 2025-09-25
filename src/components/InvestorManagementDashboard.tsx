"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Shield, 
  Users, 
  Calendar, 
  BarChart3,
  Activity,
  Clock,
  Building2,
  Mail,
  Phone,
  Download,
  Share2,
  Settings
} from 'lucide-react';

interface Venture {
  id: string;
  name: string;
  description: string;
  category: string;
  stage: string;
  maturity: number;
  priority: string;
  status: string;
}

interface InvestorShare {
  id: string;
  name: string;
  email?: string;
  company?: string;
  shareToken: string;
  ventureIds: string;
  isActive: boolean;
  expiresAt?: string;
  accessCount: number;
  lastAccessed?: string;
  createdAt: string;
  viewTemplate: string;
  includeMetrics: boolean;
  includeTimeline: boolean;
  includeFinancial: boolean;
  allowDownload: boolean;
  customMessage?: string;
}

interface InvestorManagementDashboardProps {
  ventures: Venture[];
  onRefresh: () => void;
}

export default function InvestorManagementDashboard({ ventures, onRefresh }: InvestorManagementDashboardProps) {
  const [shares, setShares] = useState<InvestorShare[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingShare, setEditingShare] = useState<InvestorShare | null>(null);
  const [selectedVentures, setSelectedVentures] = useState<string[]>([]);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    viewTemplate: 'professional',
    includeMetrics: true,
    includeTimeline: true,
    includeFinancial: true,
    allowDownload: false,
    customMessage: '',
    expiresAt: ''
  });

  useEffect(() => {
    fetchShares();
  }, []);

  const fetchShares = async () => {
    try {
      const response = await fetch('/api/investor-shares');
      if (response.ok) {
        const data = await response.json();
        setShares(data.shares);
      }
    } catch (error) {
      console.error('Error fetching shares:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShare = async () => {
    try {
      const response = await fetch('/api/investor-shares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ventureIds: selectedVentures,
          expiresAt: formData.expiresAt || null
        })
      });

      if (response.ok) {
        await fetchShares();
        setShowCreateDialog(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating share:', error);
    }
  };

  const handleDeleteShare = async (id: string) => {
    if (!confirm('Are you sure you want to delete this investor share?')) return;

    try {
      const response = await fetch(`/api/investor-shares/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchShares();
      }
    } catch (error) {
      console.error('Error deleting share:', error);
    }
  };

  const copyToClipboard = async (text: string, token: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      password: '',
      viewTemplate: 'professional',
      includeMetrics: true,
      includeTimeline: true,
      includeFinancial: true,
      allowDownload: false,
      customMessage: '',
      expiresAt: ''
    });
    setSelectedVentures([]);
  };

  const getTemplateColor = (template: string) => {
    const colors: { [key: string]: string } = {
      'professional': 'bg-blue-100 text-blue-800',
      'detailed': 'bg-purple-100 text-purple-800',
      'executive': 'bg-green-100 text-green-800',
      'technical': 'bg-orange-100 text-orange-800'
    };
    return colors[template] || 'bg-gray-100 text-gray-800';
  };

  const getShareUrl = (token: string) => {
    return `${window.location.origin}/investor-view/${token}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Investor Sharing</h2>
          <p className="text-gray-600">Create and manage secure investor presentations</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Investor Share
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Investor Share</DialogTitle>
              <DialogDescription>
                Generate a secure, password-protected view for investors or stakeholders
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Investor Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Investor Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Investor name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="investor@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Access Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Secure password"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Venture Selection */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Select Ventures to Include</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 border rounded-lg">
                  {ventures.map((venture) => (
                    <div key={venture.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                      <Checkbox
                        id={`venture-${venture.id}`}
                        checked={selectedVentures.includes(venture.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedVentures([...selectedVentures, venture.id]);
                          } else {
                            setSelectedVentures(selectedVentures.filter(id => id !== venture.id));
                          }
                        }}
                      />
                      <div className="flex-1">
                        <label htmlFor={`venture-${venture.id}`} className="text-sm font-medium cursor-pointer">
                          {venture.name}
                        </label>
                        <div className="flex gap-1 mt-1">
                          <Badge className={`${getTemplateColor(venture.stage)} text-xs`}>
                            {venture.stage}
                          </Badge>
                          <Badge className={`${getTemplateColor(venture.priority)} text-xs`}>
                            {venture.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* View Configuration */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">View Configuration</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="viewTemplate">Template</Label>
                    <Select value={formData.viewTemplate} onValueChange={(value) => setFormData({ ...formData, viewTemplate: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                        <SelectItem value="executive">Executive</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="expiresAt">Expires At</Label>
                    <Input
                      id="expiresAt"
                      type="datetime-local"
                      value={formData.expiresAt}
                      onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeMetrics"
                      checked={formData.includeMetrics}
                      onCheckedChange={(checked) => setFormData({ ...formData, includeMetrics: !!checked })}
                    />
                    <Label htmlFor="includeMetrics">Include Performance Metrics</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeTimeline"
                      checked={formData.includeTimeline}
                      onCheckedChange={(checked) => setFormData({ ...formData, includeTimeline: !!checked })}
                    />
                    <Label htmlFor="includeTimeline">Include Timeline Information</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeFinancial"
                      checked={formData.includeFinancial}
                      onCheckedChange={(checked) => setFormData({ ...formData, includeFinancial: !!checked })}
                    />
                    <Label htmlFor="includeFinancial">Include Financial Data</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowDownload"
                      checked={formData.allowDownload}
                      onCheckedChange={(checked) => setFormData({ ...formData, allowDownload: !!checked })}
                    />
                    <Label htmlFor="allowDownload">Allow Download</Label>
                  </div>
                </div>
              </div>

              {/* Custom Message */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Custom Message</h4>
                <Textarea
                  value={formData.customMessage}
                  onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
                  placeholder="Add a personal message for the investor..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateShare} disabled={selectedVentures.length === 0}>
                  Create Share
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Shares Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shares.map((share) => (
          <Card key={share.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{share.name}</CardTitle>
                  {share.company && (
                    <CardDescription className="text-sm">{share.company}</CardDescription>
                  )}
                </div>
                <Badge className={getTemplateColor(share.viewTemplate)}>
                  {share.viewTemplate}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Access Count</div>
                  <div className="font-medium">{share.accessCount}</div>
                </div>
                <div>
                  <div className="text-gray-500">Ventures</div>
                  <div className="font-medium">{JSON.parse(share.ventureIds).length}</div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${share.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-gray-600">
                  {share.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Last Accessed */}
              {share.lastAccessed && (
                <div className="text-xs text-gray-500">
                  Last accessed: {new Date(share.lastAccessed).toLocaleDateString()}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(getShareUrl(share.shareToken), share.shareToken)}
                  className="flex-1"
                >
                  {copiedToken === share.shareToken ? 'Copied!' : 'Copy Link'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(getShareUrl(share.shareToken), '_blank')}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteShare(share.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {shares.length === 0 && (
        <div className="text-center py-12">
          <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Investor Shares Yet</h3>
          <p className="text-gray-600 mb-4">Create your first secure investor presentation to get started</p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Investor Share
          </Button>
        </div>
      )}
    </div>
  );
}