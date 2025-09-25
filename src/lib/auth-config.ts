/**
 * NextAuth.js Configuration
 * 
 * Secure authentication configuration for TPDP platform
 * Implements enterprise-grade security with JWT sessions and RBAC
 */

import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs";
import { db } from "./db";

// Extended user type to include profile
interface UserWithProfile {
  id: string;
  email: string;
  password: string;
  isActive: boolean;
  roleId: string;
  createdAt: Date;
  updatedAt: Date;
  role: {
    id: string;
    name: string;
    description: string | null;
    permissions: Array<{
      id: string;
      name: string;
      description: string | null;
      resource: string;
      action: string;
      conditions: any;
      createdAt: Date;
      updatedAt: Date;
    }>;
  };
  userProfile?: {
    id: string;
    userId: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

export const authOptions: NextAuthOptions = {
  // Configure Prisma adapter for database sessions
  adapter: PrismaAdapter(db) as any,
  
  // Configure session strategy
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 24 * 60 * 60, // 24 hours
  },
  
  // Configure JWT settings
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  
  // Configure authentication providers
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "your-email@company.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "your-password",
        },
      },
      
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user by email
        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
            userProfile: true,
          },
        }) as UserWithProfile | null;

        if (!user || !user.isActive) {
          return null;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        // Return user with role and permissions
        return {
          id: user.id,
          email: user.email,
          name: `${user.userProfile?.firstName || ''} ${user.userProfile?.lastName || ''}`.trim() || user.email,
          role: user.role.name,
          permissions: user.role.permissions.map(p => p.name),
        };
      },
    }),
  ],
  
  // Configure callbacks
  callbacks: {
    // JWT callback - called when token is created/updated
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.permissions = user.permissions;
        token.userId = user.id;
      }
      return token;
    },
    
    // Session callback - called whenever session is accessed
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.permissions = token.permissions as string[];
      }
      return session;
    },
  },
  
  // Configure pages
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  
  // Configure security settings
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === "production",
  
  // Configure debug mode
  debug: process.env.NODE_ENV === "development",
};

// Type definitions for NextAuth.js
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      permissions: string[];
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    permissions: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    permissions: string[];
    userId: string;
  }
}