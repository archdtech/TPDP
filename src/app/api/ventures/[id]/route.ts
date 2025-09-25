import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const venture = await db.venture.findUnique({
      where: { id: params.id }
    });
    
    if (!venture) {
      return NextResponse.json({ error: 'Venture not found' }, { status: 404 });
    }
    
    return NextResponse.json(venture);
  } catch (error) {
    console.error('Error fetching venture:', error);
    return NextResponse.json({ error: 'Failed to fetch venture' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const venture = await db.venture.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        stage: body.stage,
        maturity: body.maturity,
        priority: body.priority,
        status: body.status,
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
    
    return NextResponse.json(venture);
  } catch (error) {
    console.error('Error updating venture:', error);
    return NextResponse.json({ error: 'Failed to update venture' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.venture.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting venture:', error);
    return NextResponse.json({ error: 'Failed to delete venture' }, { status: 500 });
  }
}