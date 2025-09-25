"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Github, RefreshCw, Clock, Star, GitCommit, Tag } from 'lucide-react';

interface GitHubUpdateData {
  repository: {
    name: string;
    description: string;
    updated_at: string;
    stargazers_count: number;
    html_url: string;
    last_updated: string;
    days_since_update: number;
  };
  recent_commits: Array<{
    sha: string;
    message: string;
    author: string;
    date: string;
    url: string;
  }>;
  recent_releases: Array<{
    name: string;
    tag_name: string;
    published_at: string;
    body: string;
    url: string;
  }>;
  checked_at: string;
}

interface GitHubUpdatesProps {
  owner?: string;
  repo?: string;
}

export default function GitHubUpdates({ owner = '', repo = '' }: GitHubUpdatesProps) {
  const [data, setData] = useState<GitHubUpdateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [repoOwner, setRepoOwner] = useState(owner);
  const [repoName, setRepoName] = useState(repo);

  const checkUpdates = async () => {
    if (!repoOwner.trim() || !repoName.trim()) {
      setError('Please enter both repository owner and name');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/github-updates?owner=${encodeURIComponent(repoOwner)}&repo=${encodeURIComponent(repoName)}`);
      
      if (response.ok) {
        const updateData = await response.json();
        setData(updateData);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to check updates');
      }
    } catch (error) {
      setError('Failed to check GitHub updates');
    } finally {
      setLoading(false);
    }
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

  const getUpdateStatusColor = (daysSinceUpdate: number) => {
    if (daysSinceUpdate <= 7) return 'text-green-600 bg-green-50';
    if (daysSinceUpdate <= 30) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getUpdateStatusText = (daysSinceUpdate: number) => {
    if (daysSinceUpdate === 0) return 'Updated today';
    if (daysSinceUpdate === 1) return 'Updated yesterday';
    if (daysSinceUpdate <= 7) return `Updated ${daysSinceUpdate} days ago`;
    if (daysSinceUpdate <= 30) return `Updated ${daysSinceUpdate} days ago`;
    return `Last updated ${daysSinceUpdate} days ago`;
  };

  useEffect(() => {
    if (repoOwner && repoName) {
      checkUpdates();
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="w-5 h-5" />
          GitHub Repository Updates
        </CardTitle>
        <CardDescription>
          Check for recent updates, commits, and releases from your GitHub repository
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Repository Input */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="repoOwner">Repository Owner</Label>
            <Input
              id="repoOwner"
              value={repoOwner}
              onChange={(e) => setRepoOwner(e.target.value)}
              placeholder="e.g., microsoft"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="repoName">Repository Name</Label>
            <Input
              id="repoName"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="e.g., typescript"
            />
          </div>
        </div>
        
        <Button onClick={checkUpdates} disabled={loading} className="w-full">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Checking Updates...' : 'Check Updates'}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {data && (
          <div className="space-y-4">
            {/* Repository Info */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <a 
                      href={data.repository.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors"
                    >
                      {data.repository.name}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </h3>
                  <p className="text-sm text-muted-foreground">{data.repository.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">{data.repository.stargazers_count}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getUpdateStatusColor(data.repository.days_since_update)}`}>
                  {getUpdateStatusText(data.repository.days_since_update)}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Last checked: {formatDate(data.checked_at)}</span>
                </div>
              </div>
            </div>

            {/* Recent Commits */}
            {data.recent_commits.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <GitCommit className="w-4 h-4" />
                  Recent Commits
                </h4>
                <div className="space-y-2">
                  {data.recent_commits.map((commit, index) => (
                    <div key={index} className="border rounded p-3 text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {commit.sha}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(commit.date)}
                        </span>
                      </div>
                      <p className="text-sm mb-1">{commit.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">by {commit.author}</span>
                        <a 
                          href={commit.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View commit
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Releases */}
            {data.recent_releases.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Recent Releases
                </h4>
                <div className="space-y-2">
                  {data.recent_releases.map((release, index) => (
                    <div key={index} className="border rounded p-3 text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline">{release.tag_name}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(release.published_at)}
                        </span>
                      </div>
                      {release.name && (
                        <h5 className="font-medium mb-1">{release.name}</h5>
                      )}
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {release.body}
                      </p>
                      <a 
                        href={release.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View release
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.recent_commits.length === 0 && data.recent_releases.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Github className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent commits or releases found</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}