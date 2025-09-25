# 👥 Project Sentinel - Developer Workflow Guide

**Version**: 1.0.0  
**Last Updated**: $(date)  
**Audience**: Developers, Contributors, Team Members  

---

## 📋 Overview

This guide provides comprehensive instructions for developers working on Project Sentinel. It covers the development workflow, branching strategy, coding standards, and best practices to avoid conflicts with other developers.

---

## 🎯 Current Project Status

### Repository Information
- **Repository**: https://github.com/archdtech/TPDP
- **Main Branch**: `main`
- **Current Status**: Production-ready MVP with enterprise features
- **Technology Stack**: Next.js 15, TypeScript, Prisma, Tailwind CSS, shadcn/ui

### Latest Updates (Commit e7d11a8)
- ✅ **Production Deployment Preparation**: Complete deployment configuration
- ✅ **Backup Strategy**: Enterprise-grade backup and recovery system
- ✅ **User Onboarding**: Guided setup process for new users
- ✅ **Support Processes**: Comprehensive support documentation
- ✅ **Critical Bug Fixes**: Resolved runtime errors and improved SSR compatibility

### Project Architecture
```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Homepage (Project Sentinel landing)
│   ├── layout.tsx               # Root layout
│   ├── dashboards/              # Dashboard routes
│   │   ├── main/               # Main dashboard
│   │   ├── risk/               # Risk analytics
│   │   ├── compliance/         # Compliance tracking
│   │   └── vendors/            # Vendor management
│   ├── tools/                  # Tool interfaces
│   │   ├── fast-check/         # Rapid assessment tool
│   │   ├── vendor-passport/     # Passport management
│   │   ├── repository-monitor/  # Repository monitoring
│   │   ├── investor-sharing/   # Investor presentations
│   │   ├── github-integration/ # GitHub integration
│   │   └── bmad-method/        # AI agent development
│   ├── api/                    # API routes
│   │   ├── health/             # Health check
│   │   ├── ventures/           # Venture management
│   │   ├── analytics/          # Analytics data
│   │   ├── universal-repo-monitor/ # Repository monitoring API
│   │   └── ...                 # Other API endpoints
│   ├── mobile-optimized-dashboard/ # Mobile dashboard route
│   └── unauthorized/           # Access denied page
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   ├── RoleProviderWrapper.tsx  # Role context provider
│   ├── ClientOnly.tsx          # SSR compatibility
│   ├── UniversalRepositoryMonitor.tsx # Repository monitor component
│   └── ...                     # Other custom components
├── contexts/                   # React contexts
│   └── RoleContext.tsx         # Role-based access context
├── hooks/                      # Custom React hooks
├── lib/                        # Utilities and configurations
│   ├── db.ts                   # Database client
│   ├── auth-config.ts          # Authentication configuration
│   ├── utils.ts                # Utility functions
│   ├── backup.ts               # Backup strategy implementation
│   ├── onboarding.ts           # User onboarding system
│   ├── universal-repo-monitor.ts # Repository monitor logic
│   └── socket.ts               # WebSocket configuration
├── middleware.ts               # Route protection middleware
└── globals.css                 # Global styles
```

---

## 🔄 Git Workflow Strategy

### Branching Strategy

#### 1. Main Branch Protection
- **`main` branch**: Protected, production-ready code only
- **Direct commits**: Not allowed
- **Pull Requests**: Required for all changes
- **CI/CD**: Automated tests and builds required

#### 2. Development Branch Types

```bash
# Feature Branches
feature/description-of-feature
# Example: feature/user-authentication
# Example: feature/advanced-reporting

# Bugfix Branches
bugfix/description-of-bug
# Example: bugfix/mobile-responsive-issue
# Example: bugfix/database-connection-error

# Hotfix Branches (for production issues)
hotfix/description-of-hotfix
# Example: hotfix/security-vulnerability
# Example: hotfix/critical-bug-fix

# Release Branches
release/version-number
# Example: release/v1.1.0
# Example: release/v2.0.0
```

#### 3. Branch Lifecycle

```
main (protected)
│
├── feature/user-authentication
├── feature/advanced-reporting
├── bugfix/mobile-responsive-issue
└── hotfix/security-vulnerability
    │
    └── merged to main (with tag)
```

### Standard Development Workflow

#### Step 1: Start with Latest Main
```bash
# Ensure you're on main branch
git checkout main

# Pull latest changes
git pull origin main

# Create new feature branch
git checkout -b feature/your-feature-name
```

#### Step 2: Development Work
```bash
# Make your changes
# ... development work ...

# Stage your changes
git add .

# Commit with descriptive message
git commit -m "Add your feature description

- Key change 1
- Key change 2
- Technical details

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

#### Step 3: Keep Branch Updated
```bash
# Before pushing, sync with main
git fetch origin
git rebase origin/main

# Resolve any conflicts if they arise
# ... resolve conflicts ...

# Continue rebase if needed
git rebase --continue
```

#### Step 4: Push and Create PR
```bash
# Push your branch
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# Target: main
# Title: Clear description of changes
# Description: Detailed explanation, testing done, etc.
```

#### Step 5: Code Review and Merge
```bash
# Address review comments
# ... make changes ...

# Commit review fixes
git commit -m "Address review feedback"

# Push updated branch
git push origin feature/your-feature-name

# After merge, delete local and remote branch
git checkout main
git pull origin main
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

---

## 🛠️ Development Environment Setup

### Prerequisites
- **Node.js**: Version 18+ 
- **npm**: Latest version
- **Git**: Latest version
- **VS Code**: Recommended with extensions
- **Database**: SQLite (development), PostgreSQL (production)

### Initial Setup
```bash
# Clone repository
git clone https://github.com/archdtech/TPDP.git
cd TPDP

# Install dependencies
npm install

# Set up database
npm run db:push
npm run db:generate

# Start development server
npm run dev
```

### Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your settings
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
DATABASE_URL=file:./dev.db
```

---

## 📝 Coding Standards and Best Practices

### TypeScript Standards

#### 1. Type Safety
```typescript
// ✅ Good: Explicit typing
interface User {
  id: string;
  email: string;
  role: UserRole;
}

const getUser = async (id: string): Promise<User | null> => {
  // Implementation
};

// ❌ Bad: Any type
const getUser = async (id: string) => {
  // Implementation
};
```

#### 2. Component Props
```typescript
// ✅ Good: Interface for props
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'default',
  size = 'default',
  className,
  onClick 
}) => {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} onClick={onClick}>
      {children}
    </button>
  );
};
```

### React Best Practices

#### 1. Component Structure
```typescript
// ✅ Good: Functional component with hooks
export const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};
```

#### 2. Custom Hooks
```typescript
// ✅ Good: Reusable custom hook
export const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  return { user, loading, error, refetch: () => fetchUser() };
};
```

### Styling Guidelines

#### 1. Tailwind CSS Usage
```typescript
// ✅ Good: Consistent utility usage
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200">
  <div className="flex items-center space-x-3">
    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
      <User className="w-5 h-5 text-blue-600" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-900">User Name</h3>
      <p className="text-sm text-gray-500">user@example.com</p>
    </div>
  </div>
  <Button variant="outline" size="sm">
    Edit Profile
  </Button>
</div>
```

#### 2. shadcn/ui Components
```typescript
// ✅ Good: Use existing shadcn/ui components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {vendor.name}
          <Badge variant={vendor.status === 'active' ? 'default' : 'secondary'}>
            {vendor.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{vendor.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Risk Score: {vendor.riskScore}</span>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## 🔍 Conflict Prevention Strategies

### 1. Regular Sync with Main
```bash
# Before starting work, sync with main
git checkout main
git pull origin main

# Then create your feature branch
git checkout -b feature/your-feature
```

### 2. Frequent Small Commits
```bash
# Commit frequently with small, logical changes
git add .
git commit -m "Add user authentication component"

# Rather than one large commit
git add .
git commit -m "Add entire user system"  # ❌ Bad practice
```

### 3. Branch-Specific Work Areas
```typescript
// Work on specific areas to avoid conflicts
// ✅ Good: Focus on specific components
// - Work only on dashboard components
// - Work only on API endpoints
// - Work only on database schema

// ❌ Bad: Work across multiple areas simultaneously
// - Modifying components, API, and database in same commit
```

### 4. Communication and Coordination
```bash
# Use GitHub issues to track work
# Create issue before starting work
# Assign yourself to the issue
# Reference issue in commits: git commit -m "Add user login #123"

# Communicate with team about:
# - What you're working on
# - Areas of the codebase you're modifying
# - Estimated completion time
```

---

## 🧪 Testing and Quality Assurance

### Testing Requirements

#### 1. Unit Tests
```typescript
// ✅ Good: Component testing
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### 2. Integration Tests
```typescript
// ✅ Good: API endpoint testing
import { createMocks } from 'node-mocks-http';
import { GET, POST } from '@/app/api/users/route';

describe('Users API', () => {
  it('GET /api/users returns user list', async () => {
    const { req } = createMocks({
      method: 'GET',
    });

    const res = await GET(req);
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(Array.isArray(data.users)).toBe(true);
  });
});
```

### Code Quality Checks

#### 1. ESLint Configuration
```bash
# Run linting before committing
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix

# Check for specific rules
npm run lint -- --rule @typescript-eslint/no-unused-vars
```

#### 2. TypeScript Validation
```bash
# Type checking
npx tsc --noEmit

# Strict mode checking
npx tsc --strict --noEmit
```

---

## 📦 Deployment and Release Process

### Pre-Deployment Checklist

#### 1. Code Quality
- [ ] All tests passing
- [ ] Linting checks passing
- [ ] TypeScript compilation successful
- [ ] No security vulnerabilities

#### 2. Performance
- [ ] Bundle size optimization
- [ ] Loading time checks
- [ ] Memory usage optimization
- [ ] Database query optimization

#### 3. Documentation
- [ ] Code comments updated
- [ ] API documentation current
- [ ] README updated if needed
- [ ] Changelog updated

### Release Process

#### 1. Version Bumping
```bash
# Update version in package.json
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

#### 2. Release Branch
```bash
# Create release branch
git checkout -b release/v1.1.0

# Merge feature branches
git merge feature/new-feature
git merge bugfix/issue-fix

# Tag release
git tag -a v1.1.0 -m "Version 1.1.0 release"

# Push to main
git checkout main
git merge release/v1.1.0
git push origin main --tags
```

---

## 🚨 Common Issues and Solutions

### 1. Merge Conflicts
```bash
# Identify conflict files
git status

# Resolve conflicts manually
# Edit conflicted files, look for <<<<<<<, =======, >>>>>> markers

# Mark conflicts as resolved
git add conflicted-file.tsx

# Continue merge/rebase
git merge --continue  # or git rebase --continue
```

### 2. Dependency Conflicts
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Check for outdated dependencies
npm outdated

# Update specific dependency
npm update package-name
```

### 3. Database Schema Changes
```bash
# Create migration
npx prisma migrate dev --name descriptive-name

# Generate client
npx prisma generate

# Push to database
npx prisma db push

# Reset database (caution: data loss)
npx prisma migrate reset
```

### 4. Build Issues
```bash
# Clean build
rm -rf .next
npm run build

# Check for specific errors
npm run build 2>&1 | grep error
```

---

## 📞 Communication and Collaboration

### Team Communication Channels

#### 1. GitHub
- **Issues**: Bug reports and feature requests
- **Pull Requests**: Code review and discussion
- **Discussions**: General questions and ideas
- **Projects**: Project management and tracking

#### 2. Documentation
- **README.md**: Project overview and quick start
- **DEVELOPER_WORKFLOW.md**: This guide
- **PRODUCTION_DEPLOYMENT.md**: Deployment instructions
- **SUPPORT_PROCESSES.md**: Support procedures

#### 3. Code Review Standards

#### Pull Request Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project standards
- [ ] Self-review of code completed
- [ ] Documentation updated if needed
- [ ] No breaking changes
- [ ] Ready for review

## Related Issues
Closes #123
Related to #456
```

### Best Practices for Collaboration

#### 1. Before Starting Work
- Check if someone is already working on similar features
- Create an issue to track your work
- Discuss approach with team if needed

#### 2. During Development
- Commit frequently with descriptive messages
- Keep your branch updated with main
- Communicate blockers or delays

#### 3. Before Submitting PR
- Ensure all tests pass
- Run linting and fix issues
- Update documentation
- Test your changes thoroughly

#### 4. During Review
- Be responsive to feedback
- Address review comments promptly
- Be respectful and constructive
- Help reviewers understand your changes

---

## 🎯 Next Steps and Resources

### Immediate Actions
1. **Fork the repository** if you haven't already
2. **Set up your development environment**
3. **Review existing codebase** to understand patterns
4. **Pick a small task** to get familiar with the workflow

### Learning Resources
- **Next.js Documentation**: https://nextjs.org/docs
- **TypeScript Documentation**: https://www.typescriptlang.org/docs
- **Prisma Documentation**: https://www.prisma.io/docs
- **Tailwind CSS Documentation**: https://tailwindcss.com/docs
- **shadcn/ui Documentation**: https://ui.shadcn.com

### Getting Help
- **GitHub Issues**: Report bugs and request features
- **GitHub Discussions**: Ask questions and share ideas
- **Code Review**: Request review from team members
- **Documentation**: Check existing docs and guides

---

## 📋 Summary

Project Sentinel is a mature, production-ready TPRM platform with enterprise-grade features. By following this developer workflow guide, you can:

- ✅ **Avoid conflicts** with other developers
- ✅ **Maintain code quality** and consistency
- ✅ **Follow best practices** for modern web development
- ✅ **Contribute effectively** to the project
- ✅ **Understand the architecture** and patterns used

The project uses modern technologies and follows industry best practices. With proper communication, regular synchronization, and adherence to coding standards, you can contribute successfully while minimizing conflicts and maintaining high code quality.

---

*This workflow guide is a living document and should be updated as the project evolves and new best practices emerge.*