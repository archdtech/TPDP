"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, ArrowLeft } from "lucide-react";

function AuthErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  // Get error from URL query parameters
  useEffect(() => {
    const errorParam = searchParams.get("error");
    setError(errorParam);
    console.log("Auth error:", errorParam);
  }, [searchParams]);

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "CredentialsSignin":
        return "Invalid email or password. Please check your credentials and try again.";
      case "SessionRequired":
        return "You must be signed in to access this page.";
      case "AccessDenied":
        return "You don't have permission to access this resource.";
      default:
        return "An authentication error occurred. Please try again.";
    }
  };

  const errorMessage = getErrorMessage(error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-emerald-600" />
            <span className="text-2xl font-bold text-gray-900">Project Sentinel</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Authentication Error
          </h1>
          <p className="text-gray-600">
            We encountered an issue with your authentication
          </p>
        </div>

        {/* Error Card */}
        <Card className="shadow-lg border-red-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2 text-red-600">
              <AlertTriangle className="h-6 w-6" />
              Authentication Failed
            </CardTitle>
            <CardDescription className="text-center">
              {errorMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Details */}
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800 mb-1">
                    Error Details
                  </p>
                  <p className="text-xs text-red-700">
                    {error ? `Error code: ${error}` : "Unknown error occurred"}
                  </p>
                </div>
              </div>
            </div>

            {/* Troubleshooting Steps */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Troubleshooting Steps:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Check your email and password for typos</li>
                <li>• Ensure your Caps Lock is off</li>
                <li>• Verify your account is active</li>
                <li>• Clear your browser cache and cookies</li>
                <li>• Try signing in again</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={() => router.push("/auth/signin")}
                className="w-full"
              >
                Try Again
              </Button>
              
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>

            {/* Support Contact */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                If the problem persists, please contact your system administrator or IT support team.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}