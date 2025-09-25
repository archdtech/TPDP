import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with security and business data...');

  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.session.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.venture.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.investorShare.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();

  // Create Permissions
  const permissions = await Promise.all([
    prisma.permission.create({
      data: {
        name: 'view_dashboards',
        description: 'View all dashboards',
        resource: 'dashboard',
        action: 'read'
      }
    }),
    prisma.permission.create({
      data: {
        name: 'view_risk_assessments',
        description: 'View risk assessments',
        resource: 'risk',
        action: 'read'
      }
    }),
    prisma.permission.create({
      data: {
        name: 'create_risk_assessments',
        description: 'Create new risk assessments',
        resource: 'risk',
        action: 'create'
      }
    }),
    prisma.permission.create({
      data: {
        name: 'edit_risk_assessments',
        description: 'Edit existing risk assessments',
        resource: 'risk',
        action: 'update'
      }
    }),
    prisma.permission.create({
      data: {
        name: 'view_vendors',
        description: 'View vendor information',
        resource: 'vendor',
        action: 'read'
      }
    }),
    prisma.permission.create({
      data: {
        name: 'create_vendors',
        description: 'Create new vendor records',
        resource: 'vendor',
        action: 'create'
      }
    }),
    prisma.permission.create({
      data: {
        name: 'edit_vendors',
        description: 'Edit vendor information',
        resource: 'vendor',
        action: 'update'
      }
    }),
    prisma.permission.create({
      data: {
        name: 'view_compliance_reports',
        description: 'View compliance reports',
        resource: 'compliance',
        action: 'read'
      }
    }),
    prisma.permission.create({
      data: {
        name: 'generate_compliance_reports',
        description: 'Generate compliance reports',
        resource: 'compliance',
        action: 'create'
      }
    }),
    prisma.permission.create({
      data: {
        name: 'view_audit_trails',
        description: 'View audit trails',
        resource: 'audit',
        action: 'read'
      }
    }),
    prisma.permission.create({
      data: {
        name: 'manage_users',
        description: 'Manage user accounts',
        resource: 'user',
        action: 'manage'
      }
    }),
    prisma.permission.create({
      data: {
        name: 'manage_roles',
        description: 'Manage roles and permissions',
        resource: 'role',
        action: 'manage'
      }
    }),
    prisma.permission.create({
      data: {
        name: 'view_reports',
        description: 'View system reports',
        resource: 'report',
        action: 'read'
      }
    }),
    prisma.permission.create({
      data: {
        name: 'manage_compliance_settings',
        description: 'Manage compliance settings',
        resource: 'compliance',
        action: 'manage'
      }
    }),
    prisma.permission.create({
      data: {
        name: 'manage_vendor_relationships',
        description: 'Manage vendor relationships',
        resource: 'vendor',
        action: 'manage'
      }
    }),
    prisma.permission.create({
      data: {
        name: 'view_vendor_assessments',
        description: 'View vendor assessments',
        resource: 'vendor',
        action: 'read'
      }
    }),
    prisma.permission.create({
      data: {
        name: 'view_tools',
        description: 'Access system tools',
        resource: 'tool',
        action: 'read'
      }
    }),
    prisma.permission.create({
      data: {
        name: 'manage_system_settings',
        description: 'Manage system settings',
        resource: 'system',
        action: 'manage'
      }
    })
  ]);

  // Create Roles with Permissions
  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
      description: 'System administrator with full access',
      permissions: {
        connect: permissions.map(p => ({ id: p.id }))
      }
    }
  });

  const riskAnalystRole = await prisma.role.create({
    data: {
      name: 'risk_analyst',
      description: 'Risk management specialist',
      permissions: {
        connect: [
          { id: permissions.find(p => p.name === 'view_dashboards')!.id },
          { id: permissions.find(p => p.name === 'view_risk_assessments')!.id },
          { id: permissions.find(p => p.name === 'create_risk_assessments')!.id },
          { id: permissions.find(p => p.name === 'edit_risk_assessments')!.id },
          { id: permissions.find(p => p.name === 'view_vendors')!.id },
          { id: permissions.find(p => p.name === 'view_tools')!.id }
        ]
      }
    }
  });

  const vendorManagerRole = await prisma.role.create({
    data: {
      name: 'vendor_manager',
      description: 'Vendor management specialist',
      permissions: {
        connect: [
          { id: permissions.find(p => p.name === 'view_dashboards')!.id },
          { id: permissions.find(p => p.name === 'view_vendors')!.id },
          { id: permissions.find(p => p.name === 'create_vendors')!.id },
          { id: permissions.find(p => p.name === 'edit_vendors')!.id },
          { id: permissions.find(p => p.name === 'view_vendor_assessments')!.id },
          { id: permissions.find(p => p.name === 'manage_vendor_relationships')!.id },
          { id: permissions.find(p => p.name === 'view_tools')!.id }
        ]
      }
    }
  });

  const complianceOfficerRole = await prisma.role.create({
    data: {
      name: 'compliance_officer',
      description: 'Compliance and audit specialist',
      permissions: {
        connect: [
          { id: permissions.find(p => p.name === 'view_dashboards')!.id },
          { id: permissions.find(p => p.name === 'view_risk_assessments')!.id },
          { id: permissions.find(p => p.name === 'view_compliance_reports')!.id },
          { id: permissions.find(p => p.name === 'generate_compliance_reports')!.id },
          { id: permissions.find(p => p.name === 'view_audit_trails')!.id },
          { id: permissions.find(p => p.name === 'manage_compliance_settings')!.id },
          { id: permissions.find(p => p.name === 'view_reports')!.id }
        ]
      }
    }
  });

  const executiveRole = await prisma.role.create({
    data: {
      name: 'executive',
      description: 'Executive with oversight access',
      permissions: {
        connect: [
          { id: permissions.find(p => p.name === 'view_dashboards')!.id },
          { id: permissions.find(p => p.name === 'view_risk_assessments')!.id },
          { id: permissions.find(p => p.name === 'view_compliance_reports')!.id },
          { id: permissions.find(p => p.name === 'view_audit_trails')!.id },
          { id: permissions.find(p => p.name === 'view_reports')!.id },
          { id: permissions.find(p => p.name === 'manage_users')!.id }
        ]
      }
    }
  });

  const readonlyRole = await prisma.role.create({
    data: {
      name: 'readonly',
      description: 'Read-only access for viewing',
      permissions: {
        connect: [
          { id: permissions.find(p => p.name === 'view_dashboards')!.id },
          { id: permissions.find(p => p.name === 'view_risk_assessments')!.id },
          { id: permissions.find(p => p.name === 'view_compliance_reports')!.id },
          { id: permissions.find(p => p.name === 'view_reports')!.id }
        ]
      }
    }
  });

  // Hash passwords for demo users
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const analystPassword = await bcrypt.hash('analyst123', 12);
  const vendorPassword = await bcrypt.hash('vendor123', 12);

  // Create Users with Profiles
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@tpdp.com',
      password: hashedPassword,
      isActive: true,
      roleId: adminRole.id,
      userProfile: {
        create: {
          firstName: 'System',
          lastName: 'Administrator',
          phone: '+1-555-0001'
        }
      }
    }
  });

  const analystUser = await prisma.user.create({
    data: {
      email: 'analyst@tpdp.com',
      password: analystPassword,
      isActive: true,
      roleId: riskAnalystRole.id,
      userProfile: {
        create: {
          firstName: 'Risk',
          lastName: 'Analyst',
          phone: '+1-555-0002'
        }
      }
    }
  });

  const vendorUser = await prisma.user.create({
    data: {
      email: 'vendor@tpdp.com',
      password: vendorPassword,
      isActive: true,
      roleId: vendorManagerRole.id,
      userProfile: {
        create: {
          firstName: 'Vendor',
          lastName: 'Manager',
          phone: '+1-555-0003'
        }
      }
    }
  });

  // Create ventures from our analysis
  const ventures = [
    {
      name: 'metabite-dna-nutrition-app',
      description: 'DNA-powered nutrition management application with enhanced features',
      category: 'Health & Nutrition',
      stage: 'mvp',
      maturity: 75,
      priority: 'high',
      status: 'active',
      problemWorld: '90% of nutrition plans fail because they\'re designed for averages, not individuals.',
      newWorld: 'Every person gets nutrition plans perfectly matched to their genetic blueprint.',
      valueUnlock: 'Trillions in healthcare savings through preventive, personalized nutrition.',
      originStory: 'Watching friends struggle with generic diets while knowing their DNA held the answers.',
      deepCapability: 'Technical expertise in both health data and consumer applications.',
      unfairAdvantage: 'Proprietary DNA interpretation algorithms that turn genetic data into actionable nutrition plans.',
      unlockFactor: 'DNA testing costs have collapsed from $1000 to $100 while AI can now interpret complex genetic interactions.',
      inevitability: 'Healthcare is shifting from treatment to prevention.',
      urgencyTrigger: 'First-mover advantage in DNA-personalized nutrition is being decided now.',
      marketSize: '$100B personalized nutrition market',
      fundingNeed: '$500K for Series A preparation',
      timeline: '6 months to market leadership',
      repository: 'https://github.com/ddevaix-commits/metabite-dna-nutrition-app',
      language: 'TypeScript'
    },
    {
      name: 'relationship-coaching-platform',
      description: 'A comprehensive relationship coaching platform with AI-powered insights and gamification',
      category: 'Relationships & Social',
      stage: 'mvp',
      maturity: 70,
      priority: 'high',
      status: 'active',
      problemWorld: '50% of marriages end in divorce because couples lack the tools to navigate modern relationship complexity.',
      newWorld: 'Every couple has an AI coach that provides personalized guidance and gamified growth.',
      valueUnlock: 'Trillions in economic productivity from stable, supportive relationships.',
      originStory: 'Seeing brilliant friends struggle in relationships not from lack of love, but lack of skills.',
      deepCapability: 'Expertise in behavioral psychology, AI, and user experience design.',
      unfairAdvantage: 'Proprietary relationship assessment algorithms that predict compatibility and growth areas.',
      unlockFactor: 'AI has reached the sophistication to understand human emotional complexity while social isolation has reached crisis levels.',
      inevitability: 'Mental health becoming mainstream healthcare priority.',
      urgencyTrigger: 'Relationship tech is moving from dating to maintenance and growth.',
      marketSize: '$50B relationship and mental health market',
      fundingNeed: '$750K for growth scaling',
      timeline: '4 months to category leadership',
      repository: 'https://github.com/ddevaix-commits/relationship-coaching-platform',
      language: 'TypeScript'
    },
    {
      name: 'tprm-monitor-platform',
      description: 'Enterprise-grade real-time vendor risk monitoring platform built with Next.js 15 and TypeScript',
      category: 'Vendor & Risk Management',
      stage: 'mvp',
      maturity: 80,
      priority: 'high',
      status: 'active',
      problemWorld: 'Enterprises lose billions to vendor failures because they monitor the wrong signals and react too slowly.',
      newWorld: 'Every vendor relationship is monitored in real-time with AI that predicts failures before they happen.',
      valueUnlock: 'Protection of global supply chains and enterprise value.',
      originStory: 'Consulting for enterprises that lost millions to vendor failures they should have seen coming.',
      deepCapability: 'Enterprise software architecture and risk modeling expertise.',
      unfairAdvantage: 'Proprietary risk prediction algorithms that analyze vendor health beyond financial metrics.',
      unlockFactor: 'Supply chain vulnerabilities have been exposed while AI can now process complex vendor data patterns.',
      inevitability: 'Risk management becoming CEO-level priority.',
      urgencyTrigger: 'First major vendor failure could happen any month now.',
      marketSize: '$25B vendor risk management market',
      fundingNeed: '$1M for enterprise scaling',
      timeline: '8 months to market dominance',
      repository: 'https://github.com/ddevaix-commits/tprm-monitor-platform',
      language: 'TypeScript'
    }
  ];

  for (const venture of ventures) {
    await prisma.venture.create({
      data: venture
    });
  }

  console.log('Database seeded successfully with security data and ventures!');
  console.log('Demo users created:');
  console.log('- Admin: admin@tpdp.com / admin123');
  console.log('- Risk Analyst: analyst@tpdp.com / analyst123');
  console.log('- Vendor Manager: vendor@tpdp.com / vendor123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });