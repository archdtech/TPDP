import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateToken } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const shares = await db.investorShare.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    const total = await db.investorShare.count();

    return NextResponse.json({
      shares,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching investor shares:', error);
    return NextResponse.json({ error: 'Failed to fetch investor shares' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      email,
      company,
      password,
      ventureIds,
      viewTemplate = 'professional',
      includeMetrics = true,
      includeTimeline = true,
      includeFinancial = true,
      allowDownload = false,
      customMessage,
      expiresAt
    } = body;

    // Validate required fields
    if (!name || !password || !ventureIds || !Array.isArray(ventureIds) || ventureIds.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate unique share token
    const shareToken = generateToken();

    // Create investor share
    const investorShare = await db.investorShare.create({
      data: {
        name,
        email,
        company,
        password,
        shareToken,
        ventureIds: JSON.stringify(ventureIds),
        viewTemplate,
        includeMetrics,
        includeTimeline,
        includeFinancial,
        allowDownload,
        customMessage,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });

    return NextResponse.json({
      success: true,
      share: investorShare,
      shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/investor-view/${shareToken}`
    });
  } catch (error) {
    console.error('Error creating investor share:', error);
    return NextResponse.json({ error: 'Failed to create investor share' }, { status: 500 });
  }
}