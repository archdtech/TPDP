# Security Implementation Guide

## Overview

Project Sentinel TPRM platform implements enterprise-grade security with NextAuth.js authentication, role-based access control (RBAC), and comprehensive audit logging. This guide documents the security features and implementation details.

## Authentication System

### NextAuth.js Configuration

The platform uses NextAuth.js for secure authentication with the following features:

- **JWT Sessions**: Secure token-based authentication
- **Credentials Provider**: Email/password authentication
- **Database Sessions**: Persistent session management with Prisma
- **Role-Based Access**: Integrated RBAC system
- **Secure Cookies**: HTTPS-only cookies in production

### Key Security Features

1. **Password Hashing**: Uses bcryptjs for secure password storage
2. **Session Management**: 24-hour session timeout with automatic refresh
3. **JWT Security**: Secure token generation and validation
4. **Environment Variables**: Secure configuration management

### Demo Users

The system is pre-configured with demo users for testing:

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| Admin | admin@tpdp.com | admin123 | Full system access |
| Risk Analyst | analyst@tpdp.com | analyst123 | Risk and compliance access |
| Vendor Manager | vendor@tpdp.com | vendor123 | Vendor management access |

## Database Schema

### Security Models

The database includes comprehensive security models:

```sql
-- Users table with security fields
User {
  id String @id @default(cuid())
  email String @unique
  password String  // bcrypt hashed
  isActive Boolean @default(true)
  roleId String
  userProfile UserProfile?
  role Role @relation(fields: [roleId], references: [id])
  sessions Session[]
  auditLogs AuditLog[]
}

-- Role-based access control
Role {
  id String @id @default(cuid())
  name String @unique  // admin, risk_analyst, vendor_manager, etc.
  description String?
  permissions Permission[]
  users User[]
}

-- Permission system
Permission {
  id String @id @default(cuid())
  name String @unique
  description String?
  roles Role[]
}

-- Session management
Session {
  id String @id @default(cuid())
  sessionToken String @unique
  userId String
  expires DateTime
  user User @relation(fields: [userId], references: [id])
}

-- Audit logging
AuditLog {
  id String @id @default(cuid())
  action String
  resource String?
  resourceId String?
  metadata Json?
  ipAddress String?
  userAgent String?
  userId String?
  createdAt DateTime @default(now())
  user User? @relation(fields: [userId], references: [id])
}
```

## Role-Based Access Control (RBAC)

### Role Definitions

The system implements 6 distinct roles with specific permissions:

1. **Admin**: Full system access
   - All dashboards and tools
   - User management
   - System configuration
   - Audit log access

2. **Risk Analyst**: Risk and compliance focus
   - Risk and compliance dashboards
   - Assessment tools
   - Analytics access
   - GitHub integration

3. **Vendor Manager**: Vendor management focus
   - Vendor dashboards
   - Vendor passport tools
   - Document management
   - Sharing capabilities

4. **Compliance Officer**: Compliance oversight
   - Compliance dashboards
   - Reporting tools
   - Audit access
   - Executive analytics

5. **Executive**: Strategic overview
   - Main dashboards
   - Executive analytics
   - Reporting access

6. **Readonly**: View-only access
   - Dashboard viewing
   - Report access

### Permission Matrix

| Permission | Admin | Risk Analyst | Vendor Manager | Compliance | Executive | Readonly |
|-----------|-------|--------------|----------------|-------------|-----------|----------|
| view_dashboard | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| manage_vendors | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ |
| manage_users | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| view_analytics | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| system_config | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| manage_billing | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| view_reports | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| assess_vendors | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| view_findings | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| generate_reports | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| manage_vendor_profile | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ |
| upload_documents | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| share_passport | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ |
| view_vendor_analytics | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ |
| view_compliance | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| audit_logs | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ |
| manage_integrations | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |

## Middleware Security

### Route Protection

The middleware implements comprehensive route protection:

```typescript
// Public routes (no authentication required)
const PUBLIC_ROUTES = [
  '/',
  '/auth/signin',
  '/auth/signout',
  '/auth/error',
  '/api/auth',
  '/api/health'
];

// JWT token validation
const token = await getToken({ req: request });

// Role-based access control
const userPermissions = ROLE_PERMISSIONS[token.role];
const hasAccess = userPermissions.some(permission => 
  pathname.startsWith(permission)
);
```

### Security Features

1. **Token Validation**: JWT token verification on each request
2. **Role Checking**: Dynamic role-based route access
3. **Unauthorized Redirect**: Automatic redirect for unauthorized access
4. **Public Route Exclusion**: Secure public route handling

## Audit Logging

### Audit Service

The platform includes comprehensive audit logging:

```typescript
export class AuditService {
  // Authentication events
  static async logAuthentication(userId, action, metadata)
  
  // Authorization events
  static async logAuthorization(userId, action, resource, metadata)
  
  // Data access events
  static async logDataAccess(userId, action, resource, resourceId, metadata)
  
  // System events
  static async logSystemEvent(action, resource, metadata)
  
  // Query audit logs
  static async getAuditLogs(filters)
}
```

### Logged Events

1. **Authentication Events**:
   - LOGIN_SUCCESS
   - LOGIN_FAILED
   - LOGOUT

2. **Authorization Events**:
   - AUTHORIZATION_SUCCESS
   - AUTHORIZATION_FAILED

3. **Data Access Events**:
   - VENTURE_READ
   - VENTURE_UPDATE
   - VENTURE_DELETE

4. **System Events**:
   - SYSTEM_CONFIG_CHANGE
   - USER_CREATE
   - USER_UPDATE

### Audit Log Data

Each audit log includes:
- **Action**: Type of event
- **Resource**: Target resource
- **Resource ID**: Specific resource identifier
- **Metadata**: Additional event data
- **IP Address**: Client IP address
- **User Agent**: Client user agent
- **User ID**: Associated user
- **Timestamp**: Event timestamp

## Security Best Practices

### Password Security

1. **Hashing**: All passwords are hashed using bcryptjs
2. **Complexity**: Minimum password length enforced
3. **Storage**: No plain text password storage
4. **Transmission**: Secure HTTPS transmission

### Session Security

1. **Token Expiration**: 24-hour session timeout
2. **Secure Cookies**: HTTP-only, secure cookies in production
3. **JWT Validation**: Comprehensive token validation
4. **Session Revocation**: Administrative session management

### Data Security

1. **Encryption**: Sensitive data encryption at rest
2. **Access Control**: Role-based data access
3. **Audit Trail**: Complete data access logging
4. **Input Validation**: Comprehensive input sanitization

### Network Security

1. **HTTPS**: Secure communication in production
2. **CORS**: Cross-origin resource sharing protection
3. **Rate Limiting**: API rate limiting
4. **Headers**: Security headers implementation

## Security Testing

### Test Scenarios

1. **Authentication Testing**:
   - Valid login scenarios
   - Invalid login attempts
   - Session timeout behavior
   - Logout functionality

2. **Authorization Testing**:
   - Role-based access control
   - Unauthorized access attempts
   - Privilege escalation attempts
   - Cross-role access testing

3. **Audit Testing**:
   - Log generation verification
   - Log data completeness
   - Log query functionality
   - Audit trail integrity

### Security Tools

1. **ESLint**: Code security analysis
2. **TypeScript**: Type safety enforcement
3. **Next.js Security**: Built-in security features
4. **Prisma**: Secure database access

## Configuration

### Environment Variables

```bash
# Database configuration
DATABASE_URL=file:/path/to/database.db

# NextAuth.js configuration
NEXTAUTH_SECRET=your-secure-secret-key-here

# Optional: Production settings
NODE_ENV=production
```

### Security Settings

```typescript
// NextAuth.js security configuration
{
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === "production",
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  debug: process.env.NODE_ENV === "development"
}
```

## Troubleshooting

### Common Issues

1. **Authentication Failures**:
   - Verify database connection
   - Check user credentials
   - Validate session configuration

2. **Authorization Issues**:
   - Verify role assignments
   - Check permission configuration
   - Validate middleware settings

3. **Audit Log Problems**:
   - Verify database schema
   - Check audit service configuration
   - Validate log access permissions

### Debug Mode

Enable debug mode in development:

```typescript
debug: process.env.NODE_ENV === "development"
```

## Future Enhancements

### Planned Security Features

1. **Multi-Factor Authentication (MFA)**:
   - TOTP integration
   - SMS verification
   - Email confirmation

2. **Advanced Audit Features**:
   - Real-time monitoring
   - Anomaly detection
   - Compliance reporting

3. **Security Enhancements**:
   - Password policy enforcement
   - Account lockout mechanisms
   - Security headers enhancement

4. **Compliance Features**:
   - GDPR compliance tools
   - SOC 2 reporting
   - Risk assessment workflows

## Conclusion

The Project Sentinel TPRM platform implements a comprehensive security framework that provides:

- **Secure Authentication**: NextAuth.js with JWT sessions
- **Role-Based Access**: Comprehensive RBAC system
- **Audit Logging**: Complete security event tracking
- **Data Protection**: Enterprise-grade data security
- **Compliance Ready**: Built for regulatory compliance

This security implementation ensures that the platform meets enterprise security requirements while providing a seamless user experience for authorized personnel.