import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const templatePath = join(process.cwd(), 'VENTURE_TEMPLATE.md');
    const templateContent = readFileSync(templatePath, 'utf8');
    
    return new NextResponse(templateContent, {
      headers: {
        'Content-Type': 'text/markdown',
        'Content-Disposition': 'attachment; filename="venture-template.md"'
      }
    });
  } catch (error) {
    console.error('Error reading template file:', error);
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }
}