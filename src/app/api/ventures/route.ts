import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const ventures = await db.venture.findMany({
      orderBy: [
        { priority: 'desc' },
        { maturity: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    
    return NextResponse.json(ventures);
  } catch (error) {
    console.error('Error fetching ventures:', error);
    return NextResponse.json({ error: 'Failed to fetch ventures' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const venture = await db.venture.create({
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        stage: body.stage || 'idea',
        maturity: body.maturity || 10,
        priority: body.priority || 'medium',
        status: body.status || 'active',
        problemWorld: body.problemWorld,
        newWorld: body.newWorld,
        valueUnlock: body.valueUnlock,
        originStory: body.originStory,
        deepCapability: body.deepCapability,
        unfairAdvantage: body.unfairAdvantage,
        unlockFactor: body.unlockFactor,
        inevitability: body.inevitability,
        urgencyTrigger: body.urgencyTrigger,
        marketSize: body.marketSize,
        fundingNeed: body.fundingNeed,
        timeline: body.timeline,
        repository: body.repository,
        language: body.language
      }
    });
    
    return NextResponse.json(venture, { status: 201 });
  } catch (error) {
    console.error('Error creating venture:', error);
    return NextResponse.json({ error: 'Failed to create venture' }, { status: 500 });
  }
}