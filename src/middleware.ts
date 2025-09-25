import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define role-based access control rules
const ROLE_PERMISSIONS = {
  admin: [
    '/dashboards',
    '/dashboards/main',
    '/dashboards/risk',
    '/dashboards/compliance',
    '/dashboards/vendors',
    '/tools',
    '/tools/fast-check',
    '/tools/assessment-queue',
    '/tools/document-processor',
    '/tools/vendor-passport',
    '/tools/sharing-center',
    '/analytics',
    '/analytics/passport',
    '/analytics/executive',
    '/analytics/performance',
    '/reports',
    '/reports/custom',
    '/admin',
    '/admin/users',
    '/admin/settings',
    '/admin/audit',
    '/admin/api',
    '/tools/github-integration'
  ],
  risk_analyst: [
    '/dashboards',
    '/dashboards/main',
    '/dashboards/risk',
    '/dashboards/compliance',
    '/tools',
    '/tools/fast-check',
    '/tools/assessment-queue',
    '/tools/document-processor',
    '/analytics',
    '/analytics/passport',
    '/analytics/performance',
    '/tools/github-integration'
  ],
  vendor_manager: [
    '/dashboards',
    '/dashboards/main',
    '/dashboards/vendors',
    '/tools',
    '/tools/fast-check',
    '/tools/document-processor',
    '/tools/vendor-passport',
    '/tools/sharing-center',
    '/analytics',
    '/analytics/passport'
  ],
  compliance_officer: [
    '/dashboards',
    '/dashboards/main',
    '/dashboards/risk',
    '/dashboards/compliance',
    '/tools',
    '/tools/document-processor',
    '/analytics',
    '/analytics/executive',
    '/reports',
    '/reports/custom',
    '/admin',
    '/admin/audit'
  ],
  executive: [
    '/dashboards',
    '/dashboards/main',
    '/dashboards/risk',
    '/dashboards/compliance',
    '/analytics',
    '/analytics/executive',
    '/analytics/passport',
    '/reports',
    '/reports/custom'
  ],
  readonly: [
    '/dashboards',
    '/dashboards/main',
    '/dashboards/risk',
    '/dashboards/compliance',
    '/dashboards/vendors',
    '/reports',
    '/reports/custom'
  ]
};

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/auth/signin',
  '/auth/signout',
  '/auth/error',
  '/api/auth',
  '/api/health'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Get JWT token from request
  const token = await getToken({ req: request });
  
  if (!token) {
    // Redirect to sign-in if no token
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
  
  // Check if user has role in token
  if (!token.role) {
    return NextResponse.redirect(new URL('/auth/error?error=CredentialsSignin', request.url));
  }
  
  // Check if user has permission to access the route
  const userPermissions = ROLE_PERMISSIONS[token.role as keyof typeof ROLE_PERMISSIONS] || [];
  
  // Check if the path matches any of the user's permissions
  const hasAccess = userPermissions.some(permission => {
    // Exact match
    if (pathname === permission) return true;
    // Prefix match (for nested routes)
    if (pathname.startsWith(permission + '/')) return true;
    // Wildcard match for dashboard routes
    if (permission === '/dashboards' && pathname.startsWith('/dashboards/')) return true;
    if (permission === '/tools' && pathname.startsWith('/tools/')) return true;
    if (permission === '/analytics' && pathname.startsWith('/analytics/')) return true;
    if (permission === '/reports' && pathname.startsWith('/reports/')) return true;
    if (permission === '/admin' && pathname.startsWith('/admin/')) return true;
    return false;
  });
  
  if (!hasAccess) {
    // Redirect to unauthorized page
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};