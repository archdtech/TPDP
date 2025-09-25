import { db } from './db';

export interface AuditLogData {
  action: string;
  resource?: string;
  resourceId?: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
}

export class AuditService {
  static async log(data: AuditLogData) {
    try {
      await db.auditLog.create({
        data: {
          action: data.action,
          resource: data.resource,
          resourceId: data.resourceId,
          metadata: data.metadata,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          userId: data.userId
        }
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
    }
  }

  static async logAuthentication(
    userId: string,
    action: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT',
    metadata: any = {}
  ) {
    await this.log({
      userId,
      action,
      resource: 'authentication',
      metadata
    });
  }

  static async logAuthorization(
    userId: string,
    action: 'AUTHORIZATION_SUCCESS' | 'AUTHORIZATION_FAILED',
    resource: string,
    metadata: any = {}
  ) {
    await this.log({
      userId,
      action,
      resource,
      metadata
    });
  }

  static async logDataAccess(
    userId: string,
    action: string,
    resource: string,
    resourceId: string,
    metadata: any = {}
  ) {
    await this.log({
      userId,
      action,
      resource,
      resourceId,
      metadata
    });
  }

  static async logSystemEvent(
    action: string,
    resource: string,
    metadata: any = {}
  ) {
    await this.log({
      action,
      resource,
      metadata
    });
  }

  static async getAuditLogs(filters: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  } = {}) {
    const where: any = {};

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.action) {
      where.action = filters.action;
    }

    if (filters.resource) {
      where.resource = filters.resource;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    const limit = filters.limit || 100;

    return await db.auditLog.findMany({
      where,
      include: {
        user: {
          include: {
            userProfile: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });
  }
}