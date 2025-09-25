import { NextRequest, NextResponse } from 'next/server';

// Mock vendor data for buyers
const mockVendors = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    category: 'Cloud Services',
    riskScore: 85,
    riskLevel: 'low',
    complianceScore: 92,
    status: 'active',
    lastAssessed: '2024-01-15',
    description: 'Leading provider of cloud infrastructure and enterprise solutions',
    location: 'San Francisco, CA',
    employeeCount: '500-1000',
    revenue: '$100M-500M',
    certifications: ['SOC 2 Type II', 'ISO 27001', 'GDPR'],
    keyServices: ['Cloud Hosting', 'Data Analytics', 'Security Services'],
    assessmentHistory: [
      { date: '2024-01-15', score: 85, assessor: 'John Doe', notes: 'Excellent security posture' }
    ]
  },
  {
    id: '2',
    name: 'DataSecure Inc',
    category: 'Cybersecurity',
    riskScore: 45,
    riskLevel: 'medium',
    complianceScore: 78,
    status: 'active',
    lastAssessed: '2024-01-10',
    description: 'Specialized cybersecurity solutions for enterprise clients',
    location: 'New York, NY',
    employeeCount: '100-500',
    revenue: '$50M-100M',
    certifications: ['SOC 2 Type I', 'ISO 27001'],
    keyServices: ['Threat Detection', 'Incident Response', 'Compliance Management'],
    assessmentHistory: [
      { date: '2024-01-10', score: 45, assessor: 'Jane Smith', notes: 'Needs improvement in incident response' }
    ]
  },
  {
    id: '3',
    name: 'GlobalPay Systems',
    category: 'Financial Services',
    riskScore: 25,
    riskLevel: 'high',
    complianceScore: 65,
    status: 'under_review',
    lastAssessed: '2024-01-05',
    description: 'Payment processing and financial technology solutions',
    location: 'London, UK',
    employeeCount: '1000-5000',
    revenue: '$500M-1B',
    certifications: ['PCI DSS', 'SOC 1'],
    keyServices: ['Payment Processing', 'Risk Management', 'Compliance'],
    assessmentHistory: [
      { date: '2024-01-05', score: 25, assessor: 'Mike Johnson', notes: 'Critical compliance issues identified' }
    ]
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const riskLevel = searchParams.get('riskLevel');
    const search = searchParams.get('search');

    let filteredVendors = mockVendors;

    if (category && category !== 'all') {
      filteredVendors = filteredVendors.filter(v => v.category === category);
    }

    if (riskLevel && riskLevel !== 'all') {
      filteredVendors = filteredVendors.filter(v => v.riskLevel === riskLevel);
    }

    if (search) {
      filteredVendors = filteredVendors.filter(v => 
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json(filteredVendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simulate creating a new vendor assessment request
    const newVendor = {
      id: Date.now().toString(),
      ...body,
      riskScore: 0,
      riskLevel: 'pending',
      complianceScore: 0,
      status: 'pending',
      lastAssessed: new Date().toISOString().split('T')[0],
      assessmentHistory: []
    };

    // In a real implementation, this would save to a database
    console.log('New vendor assessment request:', newVendor);

    return NextResponse.json(newVendor, { status: 201 });
  } catch (error) {
    console.error('Error creating vendor:', error);
    return NextResponse.json({ error: 'Failed to create vendor' }, { status: 500 });
  }
}