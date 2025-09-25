"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ExternalLink, 
  Upload, 
  RefreshCw, 
  Clock, 
  GitBranch, 
  FileText, 
  User, 
  Brain,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Database,
  Settings,
  Plus,
  Edit
} from 'lucide-react';

interface UniversalRepositoryInfo {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'stalled' | 'archived' | 'planning' | 'unknown';
  activity: 'high' | 'medium' | 'low' | 'none';
  lastActivity: string;
  estimatedProgress: number;
  technologies: string[];
  teamSize?: number;
  contributors: string[];
  recentChanges: string[];
  riskFactors: string[];
  opportunities: string[];
  dataSources: Array<{
    type: 'git' | 'local' | 'document' | 'manual' | 'api' | 'ai';
    source: string;
    confidence: number;
    metadata?: Record<string, any>;
  }>;
  confidence: number;
  lastUpdated: string;
}

interface MonitoringResult {
  success: boolean;
  data: UniversalRepositoryInfo;
  inputType?: string;
  documentInfo?: {
    id: string;
    filename: string;
    type: string;
    size: number;
  };
  timestamp: string;
}

export default function UniversalRepositoryMonitor() {
  const [data, setData] = useState<UniversalRepositoryInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('url');
  const [repoUrl, setRepoUrl] = useState('');
  const [localPath, setLocalPath] = useState('');
  const [context, setContext] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [manualEntries, setManualEntries] = useState<Array<{
    field: string;
    value: any;
    confidence: number;
  }>>([]);

  const monitorRepository = useCallback(async (input: any, type: string) => {
    try {
      setLoading(true);
      setError('');
      
      const formData = new FormData();
      
      if (type === 'file') {
        if (!selectedFile) {
          setError('Please select a file to upload');
          return;
        }
        formData.append('file', selectedFile);
        if (context) formData.append('context', context);
      } else {
        const response = await fetch('/api/universal-repo-monitor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type,
            data: input,
            context: context || undefined
          })
        });
        
        if (response.ok) {
          const result: MonitoringResult = await response.json();
          setData(result.data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to monitor repository');
        }
        return;
      }
      
      const response = await fetch('/api/universal-repo-monitor', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result: MonitoringResult = await response.json();
        setData(result.data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to monitor repository');
      }
    } catch (error) {
      setError('Failed to monitor repository');
    } finally {
      setLoading(false);
    }
  }, [selectedFile, context]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'bg-green-100 text-green-800',
      'stalled': 'bg-yellow-100 text-yellow-800',
      'archived': 'bg-gray-100 text-gray-800',
      'planning': 'bg-blue-100 text-blue-800',
      'unknown': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getActivityColor = (activity: string) => {
    const colors: Record<string, string> = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-blue-100 text-blue-800',
      'none': 'bg-gray-100 text-gray-800'
    };
    return colors[activity] || 'bg-gray-100 text-gray-800';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    if (confidence >= 0.4) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getDataSourceIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      'git': <GitBranch className="w-4 h-4" />,
      'local': <Database className="w-4 h-4" />,
      'document': <FileText className="w-4 h-4" />,
      'manual': <User className="w-4 h-4" />,
      'api': <ExternalLink className="w-4 h-4" />,
      'ai': <Brain className="w-4 h-4" />
    };
    return icons[type] || <Settings className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const addManualEntry = () => {
    setManualEntries([...manualEntries, {
      field: '',
      value: '',
      confidence: 0.8
    }]);
  };

  const updateManualEntry = (index: number, field: string, value: any) => {
    const updated = [...manualEntries];
    updated[index] = { ...updated[index], [field]: value };
    setManualEntries(updated);
  };

  const removeManualEntry = (index: number) => {
    setManualEntries(manualEntries.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Universal Repository Monitor
        </CardTitle>
        <CardDescription>
          Smart monitoring for any repository - public, private, local, or document-based
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Methods */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="url">Repository URL</TabsTrigger>
            <TabsTrigger value="local">Local Path</TabsTrigger>
            <TabsTrigger value="document">Document Upload</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4">
            <div>
              <Label htmlFor="repoUrl">Repository URL</Label>
              <Input
                id="repoUrl"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Supports GitHub, GitLab, Bitbucket, and other Git platforms
              </p>
            </div>
            <Button 
              onClick={() => monitorRepository(repoUrl, 'url')}
              disabled={loading || !repoUrl.trim()}
              className="w-full"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Monitor Repository
            </Button>
          </TabsContent>

          <TabsContent value="local" className="space-y-4">
            <div>
              <Label htmlFor="localPath">Local Path</Label>
              <Input
                id="localPath"
                value={localPath}
                onChange={(e) => setLocalPath(e.target.value)}
                placeholder="/path/to/local/repository"
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Monitor local Git repositories or project directories
              </p>
            </div>
            <Button 
              onClick={() => monitorRepository(localPath, 'path')}
              disabled={loading || !localPath.trim()}
              className="w-full"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Monitor Local Path
            </Button>
          </TabsContent>

          <TabsContent value="document" className="space-y-4">
            <div>
              <Label htmlFor="fileUpload">Upload Document</Label>
              <div className="mt-1">
                <Input
                  id="fileUpload"
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx,.txt,.md,.ppt,.pptx,.xls,.xlsx"
                  className="cursor-pointer"
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Upload project documents, reports, or specifications for analysis
              </p>
            </div>
            <Button 
              onClick={() => monitorRepository(null, 'file')}
              disabled={loading || !selectedFile}
              className="w-full"
            >
              <Upload className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Analyze Document
            </Button>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <div>
              <Label>Manual Data Entry</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Provide repository information manually when other methods aren't available
              </p>
              
              <div className="space-y-3 mt-3">
                {manualEntries.map((entry, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label className="text-sm">Field</Label>
                      <Select
                        value={entry.field}
                        onValueChange={(value) => updateManualEntry(index, 'field', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Repository Name</SelectItem>
                          <SelectItem value="description">Description</SelectItem>
                          <SelectItem value="status">Status</SelectItem>
                          <SelectItem value="activity">Activity Level</SelectItem>
                          <SelectItem value="progress">Progress %</SelectItem>
                          <SelectItem value="technologies">Technologies</SelectItem>
                          <SelectItem value="teamSize">Team Size</SelectItem>
                          <SelectItem value="lastActivity">Last Activity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Label className="text-sm">Value</Label>
                      <Input
                        value={entry.value}
                        onChange={(e) => updateManualEntry(index, 'value', e.target.value)}
                        placeholder="Enter value"
                      />
                    </div>
                    <div className="w-20">
                      <Label className="text-sm">Confidence</Label>
                      <Select
                        value={entry.confidence.toString()}
                        onValueChange={(value) => updateManualEntry(index, 'confidence', parseFloat(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.5">50%</SelectItem>
                          <SelectItem value="0.6">60%</SelectItem>
                          <SelectItem value="0.7">70%</SelectItem>
                          <SelectItem value="0.8">80%</SelectItem>
                          <SelectItem value="0.9">90%</SelectItem>
                          <SelectItem value="1.0">100%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeManualEntry(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={addManualEntry}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Field
                </Button>
              </div>
            </div>
            <Button 
              onClick={() => monitorRepository(
                {
                  repositoryId: 'manual-repo',
                  entries: manualEntries
                }, 
                'manual'
              )}
              disabled={loading || manualEntries.length === 0}
              className="w-full"
            >
              <User className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Process Manual Entry
            </Button>
          </TabsContent>
        </Tabs>

        {/* Additional Context */}
        <div>
          <Label htmlFor="context">Additional Context (Optional)</Label>
          <Textarea
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Provide additional context about the repository, project goals, current status, or any other relevant information..."
            rows={3}
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Context helps improve analysis accuracy, especially for AI-powered monitoring
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {data && (
          <div className="space-y-6">
            {/* Repository Overview */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{data.name}</h3>
                  {data.description && (
                    <p className="text-sm text-muted-foreground mt-1">{data.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(data.status)}>
                    {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                  </Badge>
                  <Badge className={getActivityColor(data.activity)}>
                    {data.activity.charAt(0).toUpperCase() + data.activity.slice(1)} Activity
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{data.estimatedProgress}%</div>
                  <div className="text-sm text-muted-foreground">Progress</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getConfidenceColor(data.confidence).split(' ')[0]}`}>
                    {Math.round(data.confidence * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Confidence</div>
                </div>
                {data.teamSize && (
                  <div className="text-center">
                    <div className="text-2xl font-bold">{data.teamSize}</div>
                    <div className="text-sm text-muted-foreground">Team Size</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-2xl font-bold">{data.technologies.length}</div>
                  <div className="text-sm text-muted-foreground">Technologies</div>
                </div>
              </div>
            </div>

            {/* Data Sources */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Data Sources
              </h4>
              <div className="space-y-2">
                {data.dataSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      {getDataSourceIcon(source.type)}
                      <span className="text-sm font-medium">{source.type.charAt(0).toUpperCase() + source.type.slice(1)}</span>
                      <span className="text-xs text-muted-foreground">{source.source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getConfidenceColor(source.confidence)}>
                        {Math.round(source.confidence * 100)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technologies */}
            {data.technologies.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {data.technologies.map((tech, index) => (
                    <Badge key={index} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Changes */}
            {data.recentChanges.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Recent Changes</h4>
                <div className="space-y-1">
                  {data.recentChanges.map((change, index) => (
                    <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                      {change}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contributors */}
            {data.contributors.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Contributors</h4>
                <div className="flex flex-wrap gap-2">
                  {data.contributors.map((contributor, index) => (
                    <Badge key={index} variant="secondary">
                      {contributor}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Analysis */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Risk Factors */}
              {data.riskFactors.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-4 h-4" />
                    Risk Factors
                  </h4>
                  <div className="space-y-1">
                    {data.riskFactors.map((risk, index) => (
                      <div key={index} className="text-sm p-2 bg-red-50 rounded text-red-700">
                        {risk}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Opportunities */}
              {data.opportunities.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    Opportunities
                  </h4>
                  <div className="space-y-1">
                    {data.opportunities.map((opportunity, index) => (
                      <div key={index} className="text-sm p-2 bg-green-50 rounded text-green-700">
                        {opportunity}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last Activity: {formatDate(data.lastActivity)}
              </div>
              <div>
                Last Updated: {formatDate(data.lastUpdated)}
              </div>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!data && !error && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="mb-2">Universal Repository Monitor Ready</p>
            <p className="text-sm">Choose a monitoring method above to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}