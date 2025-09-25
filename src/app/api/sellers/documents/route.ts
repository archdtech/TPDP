import { NextRequest, NextResponse } from 'next/server';

// Mock documents data
const mockDocuments = [
  {
    id: '1',
    name: 'SOC 2 Type II Report',
    type: 'Compliance',
    uploadDate: '2024-01-10',
    status: 'verified'
  },
  {
    id: '2',
    name: 'ISO 27001 Certificate',
    type: 'Certification',
    uploadDate: '2024-01-08',
    status: 'verified'
  },
  {
    id: '3',
    name: 'Security Policy Document',
    type: 'Policy',
    uploadDate: '2024-01-05',
    status: 'uploaded'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let filteredDocuments = mockDocuments;

    if (status) {
      filteredDocuments = filteredDocuments.filter(d => d.status === status);
    }

    if (type) {
      filteredDocuments = filteredDocuments.filter(d => d.type === type);
    }

    return NextResponse.json(filteredDocuments);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simulate uploading a new document
    const newDocument = {
      id: Date.now().toString(),
      ...body,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'uploaded'
    };

    // In a real implementation, this would handle file upload and save to database
    console.log('New document uploaded:', newDocument);

    return NextResponse.json(newDocument, { status: 201 });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
  }
}