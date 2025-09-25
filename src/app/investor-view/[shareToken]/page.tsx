"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Download,
  ExternalLink,
  Github,
  Calendar,
  BarChart3,
  FileText,
  Building2,
  Mail,
  Phone
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
  problemWorld?: string;
  newWorld?: string;
  valueUnlock?: string;
  originStory?: string;
  deepCapability?: string;
  unfairAdvantage?: string;
  unlockFactor?: string;
  inevitability?: string;
  urgencyTrigger?: string;
  marketSize?: string;
  fundingNeed?: string;
  timeline?: string;
  repository?: string;
  language?: string;
  createdAt: string;
  lastUpdated: string;
}

interface InvestorShare {
  id: string;
  name: string;
  viewTemplate: string;
  includeMetrics: boolean;
  includeTimeline: boolean;
  includeFinancial: boolean;
  allowDownload: boolean;
  customMessage?: string;
}

export default function InvestorView() {
  const params = useParams();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [share, setShare] = useState<InvestorShare | null>(null);
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const shareToken = params.shareToken as string;

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem(`investor-auth-${shareToken}`);
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchShareData();
    }
  }, [shareToken]);

  const fetchShareData = async () => {
    try {
      const response = await fetch('/api/investor-shares/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareToken, password: '' })
      });

      if (response.ok) {
        const data = await response.json();
        setShare(data.share);
        setVentures(data.ventures);
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem(`investor-auth-${shareToken}`);
      }
    } catch (error) {
      console.error('Error fetching share data:', error);
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/investor-shares/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareToken, password })
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setShare(data.share);
        setVentures(data.ventures);
        localStorage.setItem(`investor-auth-${shareToken}`, 'true');
        setLoginAttempts(0);
      } else {
        const attempts = loginAttempts + 1;
        setLoginAttempts(attempts);
        
        if (attempts >= 5) {
          setIsLocked(true);
          setError('Too many failed attempts. Please try again later.');
        } else {
          setError(data.error || `Invalid password. ${5 - attempts} attempts remaining.`);
        }
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      'idea': 'bg-gray-500',
      'prototype': 'bg-blue-500',
      'mvp': 'bg-green-500',
      'growth': 'bg-purple-500',
      'maturity': 'bg-orange-500'
    };
    return colors[stage] || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'high': 'bg-red-500',
      'medium': 'bg-yellow-500',
      'low': 'bg-green-500'
    };
    return colors[priority] || 'bg-gray-500';
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'active': 'bg-green-500',
      'paused': 'bg-yellow-500',
      'completed': 'bg-blue-500',
      'terminated': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const renderProfessionalView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Investment Portfolio</h1>
              <p className="text-gray-600">Exclusive access for {share?.name}</p>
              {share?.company && (
                <p className="text-sm text-gray-500">{share.company}</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Shield className="h-3 w-3 mr-1" />
                Secure Access
              </Badge>
              {share?.allowDownload && (
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Custom Message */}
      {share?.customMessage && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Alert className="bg-blue-50 border-blue-200">
            <FileText className="h-4 w-4" />
            <AlertDescription className="text-blue-800">
              {share.customMessage}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Portfolio Overview */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Ventures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{ventures.length}</div>
              <p className="text-xs text-gray-500">In portfolio</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Ventures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {ventures.filter(v => v.status === 'active').length}
              </div>
              <p className="text-xs text-gray-500">Currently active</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Maturity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {ventures.length > 0 ? Math.round(ventures.reduce((sum, v) => sum + v.maturity, 0) / ventures.length) : 0}%
              </div>
              <p className="text-xs text-gray-500">Portfolio average</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {ventures.filter(v => v.priority === 'high').length}
              </div>
              <p className="text-xs text-gray-500">Strategic focus</p>
            </CardContent>
          </Card>
        </div>

        {/* Ventures Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {ventures.map((venture) => (
            <Card key={venture.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                      {venture.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 mb-3">
                      {venture.description}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge className={`${getStageColor(venture.stage)} text-white`}>
                      {venture.stage}
                    </Badge>
                    <Badge className={`${getPriorityColor(venture.priority)} text-white`}>
                      {venture.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Maturity</span>
                    <span className="font-medium">{venture.maturity}%</span>
                  </div>
                  <Progress value={venture.maturity} className="h-2" />
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <div className="font-medium text-gray-900">{venture.category}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <Badge className={`${getStatusColor(venture.status)} text-white mt-1`}>
                      {venture.status}
                    </Badge>
                  </div>
                </div>

                {/* Value Proposition */}
                {venture.valueUnlock && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Value Proposition</h4>
                    <p className="text-sm text-gray-600">{venture.valueUnlock}</p>
                  </div>
                )}

                {/* Market Size */}
                {venture.marketSize && share?.includeFinancial && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Market Size</h4>
                    <p className="text-sm text-gray-600">{venture.marketSize}</p>
                  </div>
                )}

                {/* Timeline */}
                {venture.timeline && share?.includeTimeline && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Timeline</h4>
                    <p className="text-sm text-gray-600">{venture.timeline}</p>
                  </div>
                )}

                {/* Repository Link */}
                {venture.repository && (
                  <div>
                    <a 
                      href={venture.repository} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Github className="h-4 w-4 mr-1" />
                      View Repository
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>This is a secure, confidential investor presentation. Unauthorized distribution is prohibited.</p>
            <p className="mt-1">© 2024 Venture Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );

  const renderLoginScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Secure Investor Access
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter your password to access the exclusive investment portfolio
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {isLocked ? (
              <div className="text-center space-y-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <Shield className="h-6 w-6 mx-auto mb-2" />
                  <p className="font-medium">Access Locked</p>
                  <p className="text-sm">Too many failed login attempts. Please try again later.</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsLocked(false);
                    setLoginAttempts(0);
                  }}
                  className="w-full"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Access Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your access password"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Lock className="h-4 w-4 mr-2" />
                      Access Portfolio
                    </div>
                  )}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                This is a secure, confidential investor portal. Access is restricted to authorized parties only.
              </p>
              {loginAttempts > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  {5 - loginAttempts} attempts remaining
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div>
      {!isAuthenticated ? renderLoginScreen() : renderProfessionalView()}
    </div>
  );
}