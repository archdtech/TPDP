import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shareToken, password } = body;

    if (!shareToken || !password) {
      return NextResponse.json({ error: 'Missing share token or password' }, { status: 400 });
    }

    // Find the investor share
    const investorShare = await db.investorShare.findUnique({
      where: { shareToken }
    });

    if (!investorShare) {
      return NextResponse.json({ error: 'Invalid share token' }, { status: 404 });
    }

    // Check if share is active
    if (!investorShare.isActive) {
      return NextResponse.json({ error: 'This share has been deactivated' }, { status: 403 });
    }

    // Check if share has expired
    if (investorShare.expiresAt && new Date() > investorShare.expiresAt) {
      return NextResponse.json({ error: 'This share has expired' }, { status: 403 });
    }

    // Verify password
    if (investorShare.password !== password) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Parse venture IDs
    const ventureIds = JSON.parse(investorShare.ventureIds);

    // Get ventures data
    const ventures = await db.venture.findMany({
      where: {
        id: {
          in: ventureIds
        }
      },
      orderBy: [
        { priority: 'desc' },
        { maturity: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Update access analytics
    await db.investorShare.update({
      where: { id: investorShare.id },
      data: {
        accessCount: {
          increment: 1
        },
        lastAccessed: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      share: {
        id: investorShare.id,
        name: investorShare.name,
        viewTemplate: investorShare.viewTemplate,
        includeMetrics: investorShare.includeMetrics,
        includeTimeline: investorShare.includeTimeline,
        includeFinancial: investorShare.includeFinancial,
        allowDownload: investorShare.allowDownload,
        customMessage: investorShare.customMessage
      },
      ventures
    });
  } catch (error) {
    console.error('Error verifying investor share:', error);
    return NextResponse.json({ error: 'Failed to verify investor share' }, { status: 500 });
  }
}