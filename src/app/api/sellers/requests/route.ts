import { NextRequest, NextResponse } from 'next/server';

// Mock assessment requests for sellers
const mockRequests = [
  {
    id: '1',
    buyerCompany: 'Global Enterprises',
    buyerDomain: 'globalenterprises.com',
    category: 'Cloud Services',
    urgency: 'high',
    requestedDate: '2024-01-20',
    status: 'in_progress',
    estimatedTime: '2 minutes',
    progress: 75
  },
  {
    id: '2',
    buyerCompany: 'TechStart Inc',
    buyerDomain: 'techstart.io',
    category: 'Cloud Services',
    urgency: 'medium',
    requestedDate: '2024-01-19',
    status: 'pending',
    estimatedTime: '5 minutes',
    progress: 0
  },
  {
    id: '3',
    buyerCompany: 'Finance Corp',
    buyerDomain: 'financecorp.com',
    category: 'Cloud Services',
    urgency: 'critical',
    requestedDate: '2024-01-18',
    status: 'completed',
    estimatedTime: '1 minute',
    progress: 100
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let filteredRequests = mockRequests;

    if (status) {
      filteredRequests = filteredRequests.filter(r => r.status === status);
    }

    return NextResponse.json(filteredRequests);
  } catch (error) {
    console.error('Error fetching assessment requests:', error);
    return NextResponse.json({ error: 'Failed to fetch assessment requests' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    // Simulate updating assessment request status
    const requestIndex = mockRequests.findIndex(r => r.id === id);
    if (requestIndex === -1) {
      return NextResponse.json({ error: 'Assessment request not found' }, { status: 404 });
    }

    const updatedRequest = {
      ...mockRequests[requestIndex],
      ...updateData
    };

    // In a real implementation, this would save to a database
    console.log('Updated assessment request:', updatedRequest);

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Error updating assessment request:', error);
    return NextResponse.json({ error: 'Failed to update assessment request' }, { status: 500 });
  }
}