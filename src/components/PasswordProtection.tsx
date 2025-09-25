"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { AUTH_CONFIG, validatePassword, isPasswordProtectionEnabled } from '@/lib/auth-config';

interface PasswordProtectionProps {
  children: React.ReactNode;
  requiredPassword?: string;
}

export default function PasswordProtection({ 
  children, 
  requiredPassword 
}: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Use the provided password or fall back to config
  const actualPassword = requiredPassword || AUTH_CONFIG.PASSWORD;

  useEffect(() => {
    // Check if password protection is enabled
    if (!isPasswordProtectionEnabled()) {
      setIsAuthenticated(true);
      return;
    }

    // Check if user is already authenticated
    const auth = localStorage.getItem('dashboard-auth');
    const authExpiry = localStorage.getItem('dashboard-auth-expiry');
    
    if (auth === 'true' && authExpiry) {
      const expiryTime = parseInt(authExpiry);
      if (Date.now() < expiryTime) {
        setIsAuthenticated(true);
      } else {
        // Session expired, clear storage
        localStorage.removeItem('dashboard-auth');
        localStorage.removeItem('dashboard-auth-expiry');
      }
    }

    // Check if user is locked out
    const lockExpiry = localStorage.getItem('dashboard-lock-expiry');
    if (lockExpiry) {
      const lockTime = parseInt(lockExpiry);
      if (Date.now() < lockTime) {
        setIsLocked(true);
      } else {
        // Lock expired, reset attempts
        localStorage.removeItem('dashboard-lock-expiry');
        localStorage.removeItem('dashboard-login-attempts');
        setLoginAttempts(0);
        setIsLocked(false);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === actualPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('dashboard-auth', 'true');
      
      // Set session expiry
      const expiryTime = Date.now() + AUTH_CONFIG.SESSION_TIMEOUT;
      localStorage.setItem('dashboard-auth-expiry', expiryTime.toString());
      
      // Reset login attempts
      setLoginAttempts(0);
      localStorage.removeItem('dashboard-login-attempts');
    } else {
      const attempts = loginAttempts + 1;
      setLoginAttempts(attempts);
      localStorage.setItem('dashboard-login-attempts', attempts.toString());
      
      if (attempts >= AUTH_CONFIG.MAX_LOGIN_ATTEMPTS) {
        // Lock the account
        setIsLocked(true);
        const lockExpiry = Date.now() + AUTH_CONFIG.LOCKOUT_DURATION;
        localStorage.setItem('dashboard-lock-expiry', lockExpiry.toString());
        setError(`Too many failed attempts. Account locked for ${AUTH_CONFIG.LOCKOUT_DURATION / 60000} minutes.`);
      } else {
        setError(`Invalid password. ${AUTH_CONFIG.MAX_LOGIN_ATTEMPTS - attempts} attempts remaining.`);
      }
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setError('');
    localStorage.removeItem('dashboard-auth');
    localStorage.removeItem('dashboard-auth-expiry');
  };

  // If password protection is disabled, just render children
  if (!isPasswordProtectionEnabled()) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Secure Access
              </CardTitle>
              <CardDescription className="text-gray-600">
                {AUTH_CONFIG.LOGIN_MESSAGE}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isLocked ? (
                <div className="text-center space-y-4">
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <Shield className="h-6 w-6 mx-auto mb-2" />
                    <p className="font-medium">Account Locked</p>
                    <p className="text-sm">Too many failed login attempts. Please try again later.</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      localStorage.removeItem('dashboard-lock-expiry');
                      localStorage.removeItem('dashboard-login-attempts');
                      setIsLocked(false);
                      setLoginAttempts(0);
                    }}
                    className="w-full"
                  >
                    Refresh Page
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
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
                        Authenticating...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Lock className="h-4 w-4 mr-2" />
                        Access Dashboard
                      </div>
                    )}
                  </Button>
                </form>
              )}

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Protected access for authorized personnel only
                </p>
                {AUTH_CONFIG.MAX_LOGIN_ATTEMPTS > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {AUTH_CONFIG.MAX_LOGIN_ATTEMPTS - loginAttempts} attempts remaining
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Logout button in top-right corner */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="bg-white/90 backdrop-blur-sm border-gray-200"
        >
          <Shield className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
      
      {/* Protected content */}
      {children}
    </div>
  );
}