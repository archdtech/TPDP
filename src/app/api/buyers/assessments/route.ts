import { NextRequest, NextResponse } from 'next/server';

// Mock assessment requests
const mockAssessments = [
  {
    id: '1',
    vendorName: 'StartupXYZ',
    vendorDomain: 'startupxyz.com',
    category: 'AI Services',
    urgency: 'high',
    requestedBy: 'Sarah Wilson',
    requestedDate: '2024-01-20',
    status: 'in_progress',
    estimatedTime: '2 minutes',
    progress: 75
  },
  {
    id: '2',
    vendorName: 'CloudNet Pro',
    vendorDomain: 'cloudnetpro.com',
    category: 'Cloud Services',
    urgency: 'medium',
    requestedBy: 'Tom Brown',
    requestedDate: '2024-01-19',
    status: 'pending',
    estimatedTime: '5 minutes',
    progress: 0
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let filteredAssessments = mockAssessments;

    if (status) {
      filteredAssessments = filteredAssessments.filter(a => a.status === status);
    }

    return NextResponse.json(filteredAssessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simulate creating a new assessment request
    const newAssessment = {
      id: Date.now().toString(),
      ...body,
      requestedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      progress: 0
    };

    // In a real implementation, this would save to a database
    console.log('New assessment request:', newAssessment);

    return NextResponse.json(newAssessment, { status: 201 });
  } catch (error) {
    console.error('Error creating assessment:', error);
    return NextResponse.json({ error: 'Failed to create assessment' }, { status: 500 });
  }
}