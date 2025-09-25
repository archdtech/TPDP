import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ventureIds } = body;

    if (!ventureIds || !Array.isArray(ventureIds)) {
      return NextResponse.json({ error: 'Invalid venture IDs' }, { status: 400 });
    }

    const ventures = await db.venture.findMany({
      where: {
        id: {
          in: ventureIds
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(ventures);
  } catch (error) {
    console.error('Error fetching ventures by IDs:', error);
    return NextResponse.json({ error: 'Failed to fetch ventures' }, { status: 500 });
  }
}