import { NextRequest, NextResponse } from 'next/server';

// Mock vendor profile data
const mockProfile = {
  id: '1',
  companyName: 'TechCorp Solutions',
  domain: 'techcorp.com',
  description: 'Leading provider of cloud infrastructure and enterprise solutions with a focus on security and scalability.',
  category: 'Cloud Services',
  location: 'San Francisco, CA',
  employeeCount: '500-1000',
  revenue: '$100M-500M',
  foundedYear: 2015,
  website: 'https://techcorp.com',
  contactEmail: 'contact@techcorp.com',
  contactPhone: '+1 (555) 123-4567',
  certifications: ['SOC 2 Type II', 'ISO 27001', 'GDPR', 'PCI DSS'],
  keyServices: ['Cloud Hosting', 'Data Analytics', 'Security Services', 'DevOps Solutions'],
  complianceScore: 92,
  riskScore: 85,
  passportStatus: 'approved',
  lastUpdated: '2024-01-15',
  assessmentHistory: [
    { date: '2024-01-15', score: 85, status: 'approved', assessor: 'John Doe', notes: 'Excellent security posture' },
    { date: '2023-10-20', score: 78, status: 'approved', assessor: 'Jane Smith', notes: 'Good overall, minor improvements needed' }
  ]
};

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(mockProfile);
  } catch (error) {
    console.error('Error fetching vendor profile:', error);
    return NextResponse.json({ error: 'Failed to fetch vendor profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simulate updating vendor profile
    const updatedProfile = {
      ...mockProfile,
      ...body,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    // In a real implementation, this would save to a database
    console.log('Updated vendor profile:', updatedProfile);

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating vendor profile:', error);
    return NextResponse.json({ error: 'Failed to update vendor profile' }, { status: 500 });
  }
}