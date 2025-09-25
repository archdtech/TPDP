import { NextRequest, NextResponse } from 'next/server';
import { AuditService } from '@/lib/audit-service';

export async function GET(request: NextRequest) {
  try {
    // Test audit logging
    await AuditService.logSystemEvent('TEST_AUDIT_LOG', 'system', {
      message: 'Testing audit logging functionality',
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ipAddress: request.ip || 'unknown'
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Audit log test completed successfully' 
    });
  } catch (error) {
    console.error('Audit log test failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Audit log test failed' 
    }, { status: 500 });
  }
}