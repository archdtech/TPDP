"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, LogOut, CheckCircle } from "lucide-react";

export default function SignOut() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If no session, redirect to sign-in
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, router]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/signin" });
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <p>Redirecting to sign-in...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            Sign Out
          </h1>
          <p className="text-gray-600">
            Are you sure you want to sign out?
          </p>
        </div>

        {/* Sign Out Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
              <LogOut className="h-6 w-6" />
              Confirm Sign Out
            </CardTitle>
            <CardDescription className="text-center">
              You are currently signed in as <strong>{session.user?.email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* User Info */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-medium">
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{session.user?.name}</p>
                  <p className="text-sm text-gray-500">{session.user?.email}</p>
                  <p className="text-xs text-emerald-600">{session.user?.role}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={handleSignOut}
                className="w-full"
                variant="destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Yes, Sign Me Out
              </Button>
              
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="w-full"
              >
                Cancel, Go Back
              </Button>
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <p className="text-xs text-blue-800">
                For security reasons, your session will be terminated and you'll need to sign in again to access the system.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}