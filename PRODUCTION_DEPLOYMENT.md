# 🚀 Project Sentinel - Production Deployment Guide

**Version**: 1.0.0  
**Last Updated**: $(date)  
**Environment**: Production  
**Audience**: DevOps Engineers, System Administrators, Deployment Team  

---

## 📋 Overview

This guide provides comprehensive instructions for deploying Project Sentinel to a production environment. It covers infrastructure setup, application deployment, configuration management, monitoring, and maintenance procedures.

---

## 🎯 Deployment Objectives

### Primary Goals
- **Zero Downtime**: Deploy without service interruption
- **Security**: Maintain enterprise-grade security standards
- **Performance**: Achieve <2s page load times
- **Scalability**: Support 10,000+ concurrent users
- **Reliability**: Maintain 99.9% uptime

### Key Requirements
- **Infrastructure**: Cloud-based deployment (AWS/Azure/GCP)
- **Database**: PostgreSQL with read replicas
- **Load Balancing**: Auto-scaling load balancers
- **Monitoring**: Comprehensive monitoring and alerting
- **Backup**: Automated backup and disaster recovery

---

## 🏗️ Infrastructure Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   CDN / WAF     │    │   DNS Provider  │
│   (Auto-scaling) │    │   (Cloudflare)  │    │   (Route53)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌─────────────────────────────────────────────────────────┐
         │                  Application Layer                       │
         │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
         │  │  Web App    │ │  API App    │ │  Admin App  │       │
         │  │  (Next.js)   │ │  (Next.js)   │ │  (Next.js)   │       │
         │  └─────────────┘ └─────────────┘ └─────────────┘       │
         └─────────────────────────────────────────────────────────┘
                                 │
         ┌─────────────────────────────────────────────────────────┐
         │                   Data Layer                             │
         │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
         │  │  Primary    │ │  Read       │ │  Cache      │       │
         │  │  Database   │ │  Replicas   │  │  (Redis)    │       │
         │  │ (PostgreSQL)│ │ (PostgreSQL)│ │             │       │
         │  └─────────────┘ └─────────────┘ └─────────────┘       │
         └─────────────────────────────────────────────────────────┘
                                 │
         ┌─────────────────────────────────────────────────────────┐
         │                  Storage Layer                           │
         │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
         │  │  Object     │ │  File       │ │  Backup     │       │
         │  │  Storage    │ │  Storage    │ │  Storage    │       │
         │  │   (S3)      │ │   (EFS)     │ │   (Glacier) │       │
         │  └─────────────┘ └─────────────┘ └─────────────┘       │
         └─────────────────────────────────────────────────────────┘
```

### Component Details

#### 1. Web Application Layer
- **Framework**: Next.js 15 with App Router
- **Runtime**: Node.js 18+
- **Instances**: Auto-scaling (2-20 instances)
- **Memory**: 4GB per instance
- **CPU**: 2 vCPUs per instance

#### 2. Database Layer
- **Primary Database**: PostgreSQL 15+
- **Read Replicas**: 2 read replicas
- **Connection Pooling**: PgBouncer
- **Backup**: Daily full backups + WAL archiving
- **Monitoring**: Enhanced monitoring with alerts

#### 3. Caching Layer
- **Redis Cluster**: 3 nodes (1 master + 2 replicas)
- **Memory**: 16GB total
- **Persistence**: RDB + AOF persistence
- **Monitoring**: Redis metrics collection

#### 4. Storage Layer
- **Object Storage**: S3 for file uploads and static assets
- **File Storage**: EFS for shared file system
- **Backup Storage**: Glacier for long-term backups
- **CDN**: Cloudflare for global content delivery

#### 5. Monitoring & Logging
- **Application Monitoring**: New Relic / Datadog
- **Infrastructure Monitoring**: CloudWatch / Prometheus
- **Log Management**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Error Tracking**: Sentry / Rollbar

---

## 🔧 Environment Configuration

### Environment Variables

#### Required Environment Variables

```bash
# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://app.projectsentinel.ai
NEXT_PUBLIC_API_URL=https://api.projectsentinel.ai
NEXT_PUBLIC_WS_URL=wss://api.projectsentinel.ai

# Database Configuration
DATABASE_URL=postgresql://user:password@primary-db:5432/projectsentinel
DATABASE_READ_REPLICA_URL=postgresql://user:password@read-replica:5432/projectsentinel
DATABASE_POOL_SIZE=20
DATABASE_CONNECTION_TIMEOUT=30000

# Redis Configuration
REDIS_URL=redis://redis-cluster:6379
REDIS_PASSWORD=your-redis-password
REDIS_DB=0

# Authentication & Security
NEXTAUTH_URL=https://app.projectsentinel.ai
NEXTAUTH_SECRET=your-nextauth-secret
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key

# AI Services
ZAI_API_KEY=your-z-ai-api-key
ZAI_API_URL=https://api.z-ai.com

# Email Service
EMAIL_SMTP_HOST=smtp.sendgrid.net
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=your-sendgrid-user
EMAIL_SMTP_PASS=your-sendgrid-password

# File Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=projectsentinel-uploads

# Monitoring & Logging
NEW_RELIC_LICENSE_KEY=your-new-relic-key
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info

# Backup Configuration
BACKUP_ENABLED=true
BACKUP_SCHEDULE=daily
BACKUP_RETENTION_DAYS=30
BACKUP_COMPRESSION=true
BACKUP_DESTINATION=s3
BACKUP_S3_BUCKET=projectsentinel-backups

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60000

# Security Headers
CSP_ENABLED=true
HSTS_ENABLED=true
XSS_PROTECTION=true
```

### Configuration Files

#### 1. Next.js Configuration (next.config.ts)
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
  
  // Environment-specific settings
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Security headers
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' wss: https:;",
          },
        ],
      },
    ];
  },
  
  // Image optimization
  images: {
    domains: ['projectsentinel.ai'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Experimental features
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;
```

#### 2. Database Configuration (prisma/schema.prisma)
```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}

// Production-specific configurations
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  role          Role      @default(READ_ONLY)
  status        UserStatus @default(ACTIVE)
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  accounts      Account[]
  sessions      Session[]
  vendorPassports VendorPassport[]
  assessments   Assessment[]
  
  @@map("users")
}

model VendorPassport {
  id          String   @id @default(cuid())
  name        String
  description String?
  status      PassportStatus @default(DRAFT)
  vendorId    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  documents   Document[]
  assessments Assessment[]
  
  @@map("vendor_passports")
}

model Assessment {
  id          String        @id @default(cuid())
  type        AssessmentType
  status      AssessmentStatus @default(PENDING)
  riskScore   Int?
  confidence  Float?
  findings    Json?
  recommendations Json?
  createdAt   DateTime      @default(now())
  completedAt DateTime?
  
  // Relations
  userId      String
  user        User          @relation(fields: [userId], references: [id])
  vendorPassportId String?
  vendorPassport VendorPassport? @relation(fields: [vendorPassportId], references: [id])
  
  @@map("assessments")
}

model Document {
  id          String   @id @default(cuid())
  filename    String
  originalName String
  path        String
  size        Int
  mimeType    String
  status      DocumentStatus @default(ACTIVE)
  uploadedAt  DateTime @default(now())
  
  // Relations
  vendorPassportId String
  vendorPassport   VendorPassport @relation(fields: [vendorPassportId], references: [id])
  
  @@map("documents")
}

// Enums
enum Role {
  ADMINISTRATOR
  RISK_ANALYST
  VENDOR_MANAGER
  COMPLIANCE_OFFICER
  EXECUTIVE
  READ_ONLY
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
  PENDING
}

enum PassportStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
  SUSPENDED
}

enum AssessmentType {
  FAST_CHECK
  COMPREHENSIVE
  CUSTOM
}

enum AssessmentStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  FAILED
  CANCELLED
}

enum DocumentStatus {
  ACTIVE
  ARCHIVED
  DELETED
}
```

---

## 🚀 Deployment Process

### 1. Pre-Deployment Checklist

#### Infrastructure Readiness
- [ ] Cloud infrastructure is provisioned
- [ ] Database clusters are configured
- [ ] Redis cluster is set up
- [ ] Storage buckets are created
- [ ] CDN and WAF are configured
- [ ] DNS records are set up
- [ ] SSL certificates are installed
- [ ] Monitoring and logging are configured

#### Application Readiness
- [ ] Code is reviewed and approved
- [ ] All tests are passing
- [ ] Security scan is completed
- [ ] Performance testing is done
- [ ] Database migrations are prepared
- [ ] Configuration files are updated
- [ ] Environment variables are set
- [ ] Backup strategy is tested

#### Team Readiness
- [ ] Deployment team is assembled
- [ ] Rollback plan is prepared
- [ ] Communication plan is established
- [ ] Stakeholders are notified
- [ ] Support team is on standby
- [ ] Emergency contacts are verified

### 2. Deployment Steps

#### Phase 1: Preparation (1 hour before deployment)
```bash
# 1. Notify stakeholders
echo "Starting deployment preparation" | mail -s "Deployment Notification" team@projectsentinel.ai

# 2. Create deployment branch
git checkout -b deployment/production-$(date +%Y%m%d-%H%M%S)

# 3. Pull latest changes
git pull origin main

# 4. Run final tests
npm run test
npm run lint
npm run build:staging

# 5. Create backup
./scripts/backup.sh
```

#### Phase 2: Database Migration (30 minutes)
```bash
# 1. Generate migration
npx prisma migrate dev --name production-deployment

# 2. Review migration
cat prisma/migrations/*/migration.sql

# 3. Apply migration to staging
DATABASE_URL=$STAGING_DATABASE_URL npx prisma migrate deploy

# 4. Verify migration
npx prisma db seed

# 5. Backup database post-migration
./scripts/backup-database.sh
```

#### Phase 3: Application Deployment (1 hour)
```bash
# 1. Build application
npm run build:production

# 2. Deploy to production
npm run deploy:production

# 3. Run database migrations on production
DATABASE_URL=$PRODUCTION_DATABASE_URL npx prisma migrate deploy

# 4. Seed database
DATABASE_URL=$PRODUCTION_DATABASE_URL npx prisma db seed

# 5. Restart application servers
npm run restart:production
```

#### Phase 4: Verification (30 minutes)
```bash
# 1. Health checks
curl -f https://app.projectsentinel.ai/health || exit 1
curl -f https://api.projectsentinel.ai/health || exit 1

# 2. Smoke tests
npm run test:smoke

# 3. Performance tests
npm run test:performance

# 4. Security validation
npm run test:security

# 5. Monitoring verification
curl -f https://monitoring.projectsentinel.ai/api/health || exit 1
```

#### Phase 5: Post-Deployment (30 minutes)
```bash
# 1. Clear caches
npm run clear:cache

# 2. Warm up caches
npm run warm:cache

# 3. Verify monitoring
curl -f https://monitoring.projectsentinel.ai/api/health

# 4. Send completion notification
echo "Deployment completed successfully" | mail -s "Deployment Complete" team@projectsentinel.ai

# 5. Create deployment tag
git tag -a v$(npm version patch)-production -m "Production deployment $(date)"
git push origin --tags
```

### 3. Rollback Procedure

#### Immediate Rollback (if deployment fails)
```bash
# 1. Stop deployment
npm run deploy:stop

# 2. Restore previous version
git checkout $(git describe --tags --abbrev=0)

# 3. Restore database
./scripts/restore-database.sh --backup-id $(git describe --tags --abbrev=0)

# 4. Restart services
npm run restart:production

# 5. Verify rollback
npm run test:smoke
```

#### Database Rollback
```bash
# 1. Identify last good migration
npx prisma migrate status

# 2. Rollback migration
npx prisma migrate rollback --to <migration-name>

# 3. Verify database state
npx prisma db seed
```

---

## 🔒 Security Configuration

### 1. Network Security

#### Security Groups and Firewalls
```yaml
# Web Application Security Group
webapp_sg:
  description: "Security group for web application servers"
  ingress:
    - protocol: tcp
      ports: [80, 443]
      source: 0.0.0.0/0
    - protocol: tcp
      ports: [22]
      source: bastion_sg
  egress:
    - protocol: -1
      destination: 0.0.0.0/0

# Database Security Group
database_sg:
  description: "Security group for database servers"
  ingress:
    - protocol: tcp
      ports: [5432]
      source: webapp_sg
    - protocol: tcp
      ports: [5432]
      source: bastion_sg
  egress:
    - protocol: -1
      destination: 0.0.0.0/0
```

#### WAF Configuration
```yaml
# Web Application Firewall Rules
waf_rules:
  - name: "SQL Injection Protection"
    type: "SQL_INJECTION"
    action: "BLOCK"
  
  - name: "XSS Protection"
    type: "XSS"
    action: "BLOCK"
  
  - name: "Rate Limiting"
    type: "RATE_BASED"
    rate_limit: 100
    action: "BLOCK"
  
  - name: "Bad Bot Protection"
    type: "BAD_BOT"
    action: "BLOCK"
```

### 2. Application Security

#### Security Headers
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' wss: https:;"
  );
  
  // HSTS
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  return response;
}
```

#### Authentication Security
```typescript
// lib/auth-config.ts
import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './db';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Configure your providers
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === 'production',
};
```

### 3. Data Security

#### Encryption Configuration
```typescript
// lib/encryption.ts
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const keyLength = 32;
const ivLength = 16;
const tagLength = 16;

export function encrypt(text: string, secret: string): string {
  const iv = crypto.randomBytes(ivLength);
  const key = crypto.scryptSync(secret, 'salt', keyLength);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);
  
  const tag = cipher.getAuthTag();
  
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

export function decrypt(encrypted: string, secret: string): string {
  const data = Buffer.from(encrypted, 'base64');
  const iv = data.subarray(0, ivLength);
  const tag = data.subarray(ivLength, ivLength + tagLength);
  const encryptedData = data.subarray(ivLength + tagLength);
  
  const key = crypto.scryptSync(secret, 'salt', keyLength);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(tag);
  
  return decipher.update(encryptedData) + decipher.final('utf8');
}
```

---

## 📊 Monitoring and Alerting

### 1. Application Monitoring

#### New Relic Configuration
```typescript
// newrelic.js
exports.config = {
  app_name: ['Project Sentinel'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: 'info',
  },
  allow_all_headers: true,
  attributes: {
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.setCookie*',
    ],
  },
};
```

#### Custom Metrics
```typescript
// lib/monitoring.ts
import * as newrelic from 'newrelic';

export function recordMetric(name: string, value: number): void {
  newrelic.recordMetric(name, value);
}

export function incrementCounter(name: string, amount: number = 1): void {
  newrelic.incrementCounter(name, amount);
}

export function recordCustomEvent(eventType: string, attributes: Record<string, any>): void {
  newrelic.recordCustomEvent(eventType, attributes);
}

export function noticeError(error: Error, customAttributes?: Record<string, any>): void {
  newrelic.noticeError(error, customAttributes);
}
```

### 2. Infrastructure Monitoring

#### CloudWatch Alarms
```yaml
# cloudwatch-alarms.yml
alarms:
  - name: "HighCPUUtilization"
    description: "CPU utilization is too high"
    metric: "CPUUtilization"
    namespace: "AWS/EC2"
    statistic: "Average"
    period: 300
    evaluation_periods: 2
    threshold: 80
    comparison_operator: "GreaterThanThreshold"
  
  - name: "HighMemoryUtilization"
    description: "Memory utilization is too high"
    metric: "MemoryUtilization"
    namespace: "System/Linux"
    statistic: "Average"
    period: 300
    evaluation_periods: 2
    threshold: 90
    comparison_operator: "GreaterThanThreshold"
  
  - name: "HighResponseTime"
    description: "Application response time is too high"
    metric: "ResponseTime"
    namespace: "ProjectSentinel"
    statistic: "Average"
    period: 60
    evaluation_periods: 5
    threshold: 2000
    comparison_operator: "GreaterThanThreshold"
```

### 3. Log Management

#### ELK Stack Configuration
```yaml
# elasticsearch.yml
cluster.name: projectsentinel
node.name: node-1
network.host: 0.0.0.0
http.port: 9200
discovery.type: single-node

# logstash.conf
input {
  beats {
    port => 5044
  }
}

filter {
  grok {
    match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:log_level} %{GREEDYDATA:log_message}" }
  }
  
  date {
    match => [ "timestamp", "ISO8601" ]
  }
}

output {
  elasticsearch {
    hosts => ["localhost:9200"]
    index => "projectsentinel-logs-%{+YYYY.MM.dd}"
  }
}
```

---

## 🔄 Maintenance and Updates

### 1. Regular Maintenance Schedule

#### Daily Maintenance
- **Backup Verification**: Verify backup completion
- **Log Rotation**: Rotate and archive logs
- **Security Updates**: Apply security patches
- **Performance Monitoring**: Review performance metrics

#### Weekly Maintenance
- **Database Optimization**: Run database maintenance
- **Cache Clearing**: Clear application caches
- **System Updates**: Apply system updates
- **Capacity Planning**: Review resource utilization

#### Monthly Maintenance
- **Security Audits**: Conduct security assessments
- **Performance Tuning**: Optimize system performance
- **Backup Testing**: Test backup restoration
- **Documentation Updates**: Update system documentation

### 2. Update Procedures

#### Security Updates
```bash
# 1. Check for security updates
npm audit
npm audit fix

# 2. Update dependencies
npm update

# 3. Test updates
npm run test

# 4. Deploy updates
npm run deploy:security-updates
```

#### Feature Updates
```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Implement feature
# ... development work ...

# 3. Test feature
npm run test:feature

# 4. Deploy to staging
npm run deploy:staging

# 5. Deploy to production
npm run deploy:production
```

---

## 📋 Appendix

### A. Deployment Scripts

#### Deployment Script (deploy.sh)
```bash
#!/bin/bash

set -e

ENVIRONMENT=${1:-staging}
BRANCH=${2:-main}

echo "🚀 Starting deployment to $ENVIRONMENT environment"

# Pre-deployment checks
echo "📋 Running pre-deployment checks..."
npm run lint
npm run test
npm run build

# Database migration
echo "🗄️ Running database migrations..."
if [ "$ENVIRONMENT" = "production" ]; then
  DATABASE_URL=$PRODUCTION_DATABASE_URL npx prisma migrate deploy
else
  DATABASE_URL=$STAGING_DATABASE_URL npx prisma migrate deploy
fi

# Application deployment
echo "📦 Deploying application..."
npm run deploy:$ENVIRONMENT

# Post-deployment verification
echo "✅ Running post-deployment verification..."
npm run test:smoke

echo "🎉 Deployment completed successfully!"
```

#### Backup Script (backup.sh)
```bash
#!/bin/bash

set -e

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/$DATE"

echo "💾 Starting backup process..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
echo "🗄️ Backing up database..."
pg_dump $DATABASE_URL > $BACKUP_DIR/database.sql

# File backup
echo "📁 Backing up files..."
tar -czf $BACKUP_DIR/files.tar.gz /var/www/projectsentinel/uploads

# Configuration backup
echo "⚙️ Backing up configuration..."
cp -r /etc/projectsentinel $BACKUP_DIR/config

# Upload to cloud storage
echo "☁️ Uploading to cloud storage..."
aws s3 sync $BACKUP_DIR s3://$BACKUP_S3_BUCKET/$DATE

# Clean old backups
echo "🧹 Cleaning old backups..."
find /backups -type d -mtime +$BACKUP_RETENTION_DAYS -exec rm -rf {} +

echo "✅ Backup completed successfully!"
```

### B. Emergency Procedures

#### Incident Response Checklist
- [ ] **Detection**: Identify and confirm the incident
- [ ] **Assessment**: Determine impact and severity
- [ ] **Containment**: Isolate affected systems
- [ ] **Eradication**: Remove root cause
- [ ] **Recovery**: Restore normal operations
- [ ] **Lessons Learned**: Document and improve

#### Disaster Recovery Checklist
- [ ] **Declaration**: Declare disaster situation
- [ ] **Activation**: Activate disaster recovery team
- [ ] **Assessment**: Assess damage and impact
- [ ] **Recovery**: Restore systems from backups
- [ ] **Verification**: Verify system functionality
- [ ] **Communication**: Notify stakeholders
- [ ] **Documentation**: Document recovery process

---

*This deployment guide is a living document and should be reviewed and updated regularly to reflect changes in the system, infrastructure, and deployment processes.*