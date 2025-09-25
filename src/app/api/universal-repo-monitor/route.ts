import { NextRequest, NextResponse } from 'next/server';
import { universalMonitor, UniversalRepositoryInfo, DocumentUpload, ManualEntry } from '@/lib/universal-repo-monitor';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Helper function to validate and process file uploads
async function processFileUpload(file: File): Promise<DocumentUpload> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Create uploads directory if it doesn't exist
  const uploadDir = path.join(process.cwd(), 'uploads');
  await mkdir(uploadDir, { recursive: true });
  
  // Save file
  const filename = `${uuidv4()}-${file.name}`;
  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);
  
  // Extract text content (basic implementation)
  const content = await extractTextContent(file, buffer);
  
  return {
    id: uuidv4(),
    filename: file.name,
    type: getFileType(file.name),
    content,
    metadata: {
      size: file.size,
      created: new Date().toISOString(),
      modified: new Date(file.lastModified).toISOString()
    }
  };
}

// Basic text extraction (in production, use proper libraries like pdf-parse, mammoth, etc.)
async function extractTextContent(file: File, buffer: Buffer): Promise<string> {
  const fileType = file.type;
  
  if (fileType === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
    return buffer.toString('utf-8');
  }
  
  if (fileType === 'application/json' || file.name.endsWith('.json')) {
    try {
      const jsonData = JSON.parse(buffer.toString('utf-8'));
      return JSON.stringify(jsonData, null, 2);
    } catch {
      return buffer.toString('utf-8');
    }
  }
  
  // For other file types, return a placeholder
  // In production, integrate with proper text extraction services
  return `[Document content for ${file.name}]

File type: ${fileType}
Size: ${file.size} bytes

Note: Full text extraction requires additional libraries.`;
}

function getFileType(filename: string): 'pdf' | 'doc' | 'docx' | 'txt' | 'md' | 'ppt' | 'xls' | 'xlsx' {
  const ext = filename.toLowerCase();
  if (ext.endsWith('.pdf')) return 'pdf';
  if (ext.endsWith('.doc')) return 'doc';
  if (ext.endsWith('.docx')) return 'docx';
  if (ext.endsWith('.txt')) return 'txt';
  if (ext.endsWith('.md')) return 'md';
  if (ext.endsWith('.ppt')) return 'ppt';
  if (ext.endsWith('.pptx')) return 'ppt';
  if (ext.endsWith('.xls')) return 'xls';
  if (ext.endsWith('.xlsx')) return 'xlsx';
  return 'txt';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const repoUrl = searchParams.get('url');
    const localPath = searchParams.get('path');
    
    if (!repoUrl && !localPath) {
      return NextResponse.json({ 
        error: 'Either repository URL or local path is required' 
      }, { status: 400 });
    }
    
    const input = repoUrl || localPath || '';
    const options = {
      forceMethod: searchParams.get('method') as any,
      additionalContext: searchParams.get('context') || undefined
    };
    
    const result = await universalMonitor.monitorRepository(input, options);
    
    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Universal monitoring error:', error);
    return NextResponse.json({
      error: 'Failed to monitor repository',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      const file = formData.get('file') as File;
      const context = formData.get('context') as string;
      
      if (!file) {
        return NextResponse.json({ 
          error: 'No file provided' 
        }, { status: 400 });
      }
      
      const document = await processFileUpload(file);
      const result = await universalMonitor.monitorRepository(document, {
        additionalContext: context
      });
      
      return NextResponse.json({
        success: true,
        data: result,
        documentInfo: {
          id: document.id,
          filename: document.filename,
          type: document.type,
          size: document.metadata.size
        },
        timestamp: new Date().toISOString()
      });
      
    } else {
      // Handle JSON data (manual entry or URL)
      const body = await request.json();
      const { type, data, context } = body;
      
      if (!type || !data) {
        return NextResponse.json({ 
          error: 'Type and data are required' 
        }, { status: 400 });
      }
      
      let input: any;
      let options: any = { additionalContext: context };
      
      switch (type) {
        case 'url':
          input = data.url || data;
          break;
        case 'path':
          input = data.path || data;
          break;
        case 'manual':
          const manualEntry: ManualEntry = {
            id: uuidv4(),
            repositoryId: data.repositoryId || 'manual-repo',
            field: data.field,
            value: data.value,
            source: data.source || 'user',
            confidence: data.confidence || 0.8,
            timestamp: new Date().toISOString(),
            notes: data.notes
          };
          input = manualEntry;
          break;
        default:
          return NextResponse.json({ 
            error: 'Invalid type. Use: url, path, or manual' 
          }, { status: 400 });
      }
      
      const result = await universalMonitor.monitorRepository(input, options);
      
      return NextResponse.json({
        success: true,
        data: result,
        inputType: type,
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('Universal monitoring POST error:', error);
    return NextResponse.json({
      error: 'Failed to process repository monitoring request',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}