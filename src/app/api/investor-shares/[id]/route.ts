import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete the investor share
    await db.investorShare.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Investor share deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting investor share:', error);
    return NextResponse.json({ error: 'Failed to delete investor share' }, { status: 500 });
  }
}