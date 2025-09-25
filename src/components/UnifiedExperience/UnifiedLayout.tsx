"use client";

import { useState } from 'react';
import Link from 'next/link';
import { UnifiedExperienceProvider } from './UnifiedExperienceProvider';
import { DataSyncProvider } from './DataSyncManager';
import { HelpProvider } from './ContextualHelp';
import { ProgressProvider } from './ProgressTracker';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressSummary } from './ProgressTracker';
import { SyncStatusIndicator } from './DataSyncManager';
import { useHelp } from './ContextualHelp';
import { 
  Shield, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  ChevronDown,
  User,
  Bell,
  Search,
  HelpCircle,
  LogOut,
  Home,
  FolderOpen,
  Wrench,
  Users,
  Target,
  Database,
  Brain,
  Globe,
  Zap,
  Activity,
  TrendingUp,
  Award,
  Sparkles
} from 'lucide-react';

interface UnifiedLayoutProps {
  children: ReactNode;
  userId: string;
  userRole?: string;
}

export function UnifiedLayout({ children, userId, userRole = 'risk_analyst' }: UnifiedLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openHelp } = useHelp();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, current: false },
    { 
      name: 'Unified Dashboard', 
      href: '/unified-dashboard', 
      icon: BarChart3, 
      current: false,
      badge: 'NEW'
    },
    { name: 'Dashboards', href: '/dashboards', icon: Activity, current: false },
    { name: 'Tools', href: '/tools', icon: Wrench, current: false },
  ];

  const tools = [
    { name: 'Fast Check', href: '/tools/fast-check', icon: Zap, description: '2-minute risk assessments' },
    { name: 'Vendor Passport', href: '/tools/vendor-passport', icon: Globe, description: 'Secure vendor profiles' },
    { name: 'Risk Analytics', href: '/dashboards/risk', icon: Target, description: 'Advanced risk analysis' },
    { name: 'Compliance Hub', href: '/dashboards/compliance', icon: Shield, description: 'Multi-framework tracking' },
    { name: 'Repository Monitor', href: '/tools/repository-monitor', icon: Database, description: 'Development progress' },
    { name: 'AI Agent Studio', href: '/tools/bmad-method', icon: Brain, description: 'Build AI agents' },
  ];

  const userNavigation = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help', href: '#', icon: HelpCircle, onClick: openHelp },
    { name: 'Sign out', href: '/logout', icon: LogOut },
  ];

  return (
    <UnifiedExperienceProvider userId={userId}>
      <DataSyncProvider userId={userId}>
        <HelpProvider userId={userId}>
          <ProgressProvider userId={userId}>
            <div className="min-h-screen bg-gray-50">
              {/* Navigation */}
              <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-16">
                    <div className="flex items-center">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Project Sentinel</span>
                      </div>
                      
                      {/* Desktop Navigation */}
                      <div className="hidden md:flex ml-10 space-x-1">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              item.current
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                          >
                            <item.icon className="h-4 w-4 mr-2" />
                            {item.name}
                            {item.badge && (
                              <Badge variant="default" className="ml-2 text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Progress Summary */}
                      <div className="hidden sm:block">
                        <ProgressSummary />
                      </div>

                      {/* Sync Status */}
                      <SyncStatusIndicator />

                      {/* Help Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={openHelp}
                        className="hidden sm:flex"
                      >
                        <HelpCircle className="h-4 w-4" />
                      </Button>

                      {/* User Menu */}
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Bell className="h-4 w-4" />
                        </Button>
                        
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="flex items-center gap-2"
                          >
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-white" />
                            </div>
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                          
                          {/* User Dropdown */}
                          {mobileMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                              <div className="p-2">
                                <div className="px-3 py-2 text-sm text-gray-700 border-b">
                                  <div className="font-medium">Risk Analyst</div>
                                  <div className="text-xs text-gray-500">user@example.com</div>
                                </div>
                                {userNavigation.map((item) => (
                                  <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                    onClick={item.onClick}
                                  >
                                    <item.icon className="h-4 w-4 mr-2" />
                                    {item.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Mobile menu button */}
                      <div className="md:hidden">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                          {mobileMenuOpen ? (
                            <X className="h-5 w-5" />
                          ) : (
                            <Menu className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                  <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 border-t">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        >
                          <item.icon className="h-5 w-5 mr-3" />
                          {item.name}
                          {item.badge && (
                            <Badge variant="default" className="ml-2 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      ))}
                      
                      <div className="border-t pt-3 mt-3">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Tools
                        </div>
                        {tools.map((tool) => (
                          <Link
                            key={tool.name}
                            href={tool.href}
                            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                          >
                            <tool.icon className="h-5 w-5 mr-3" />
                            <div>
                              <div>{tool.name}</div>
                              <div className="text-xs text-gray-500">{tool.description}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </nav>

              {/* Quick Access Toolbar */}
              <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between h-12">
                    <div className="flex items-center gap-6 overflow-x-auto">
                      <span className="text-sm font-medium text-gray-700">Quick Access:</span>
                      <div className="flex items-center gap-4">
                        {tools.slice(0, 4).map((tool) => (
                          <Link
                            key={tool.name}
                            href={tool.href}
                            className="flex items-center gap-2 px-3 py-1 rounded-md text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 whitespace-nowrap transition-colors"
                          >
                            <tool.icon className="h-4 w-4" />
                            {tool.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                        <span>Try the new Unified Dashboard</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <main className="flex-1">
                {children}
              </main>

              {/* Footer */}
              <footer className="bg-white border-t mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-600">
                        Project Sentinel - AI-Powered TPRM Platform
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <SyncStatusIndicator />
                        <span>Data synchronized</span>
                      </div>
                      <div>•</div>
                      <div>v2.0.0</div>
                      <div>•</div>
                      <div>
                        <Link href="/help" className="hover:text-gray-700">Help Center</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </ProgressProvider>
        </HelpProvider>
      </DataSyncProvider>
    </UnifiedExperienceProvider>
  );
}

// Sidebar Layout Component
export function UnifiedSidebarLayout({ children, userId, userRole = 'risk_analyst' }: UnifiedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Overview', href: '/unified-dashboard', icon: Home, current: true },
    { name: 'Fast Check', href: '/tools/fast-check', icon: Zap },
    { name: 'Vendor Passports', href: '/tools/vendor-passport', icon: Globe },
    { name: 'Risk Analytics', href: '/dashboards/risk', icon: Target },
    { name: 'Compliance Hub', href: '/dashboards/compliance', icon: Shield },
    { name: 'Vendor Management', href: '/dashboards/vendors', icon: Users },
    { name: 'Repository Monitor', href: '/tools/repository-monitor', icon: Database },
    { name: 'AI Agent Studio', href: '/tools/bmad-method', icon: Brain },
  ];

  const analytics = [
    { name: 'Portfolio Health', href: '/analytics/portfolio', icon: TrendingUp },
    { name: 'Performance Metrics', href: '/analytics/performance', icon: BarChart3 },
    { name: 'User Activity', href: '/analytics/activity', icon: Activity },
    { name: 'System Status', href: '/analytics/system', icon: Award },
  ];

  return (
    <UnifiedLayout userId={userId} userRole={userRole}>
      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <div className={`bg-white border-r transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-4 border-b">
              {sidebarOpen ? (
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Navigation</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <ChevronDown className="h-4 w-4 rotate-90" />
                  </Button>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Button>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto">
              {sidebarOpen ? (
                <div className="p-4 space-y-6">
                  {/* Main Navigation */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Main Features
                    </h3>
                    <nav className="space-y-1">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            item.current
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          <item.icon className="h-4 w-4 mr-3" />
                          {item.name}
                        </Link>
                      ))}
                    </nav>
                  </div>

                  {/* Analytics */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Analytics
                    </h3>
                    <nav className="space-y-1">
                      {analytics.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        >
                          <item.icon className="h-4 w-4 mr-3" />
                          {item.name}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      title={item.name}
                    >
                      <item.icon className="h-5 w-5" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t">
              {sidebarOpen ? (
                <div className="space-y-2">
                  <ProgressSummary />
                  <div className="text-xs text-gray-500 text-center">
                    Connected and synchronized
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </UnifiedLayout>
  );
}