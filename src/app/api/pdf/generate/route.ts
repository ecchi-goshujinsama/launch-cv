import { NextRequest, NextResponse } from 'next/server';
import { HTMLToPDFGenerator } from '@/lib/pdf/html-pdf-generator';
import type { Resume, Template } from '@/lib/types';
import type { PDFExportOptions } from '@/lib/pdf/types';

export async function POST(request: NextRequest) {
  try {
    const { resume, template, options }: {
      resume: Resume;
      template: Template;
      options?: Partial<PDFExportOptions>;
    } = await request.json();

    // Validate required data
    if (!resume || !template) {
      return NextResponse.json(
        { error: 'Missing required resume or template data' },
        { status: 400 }
      );
    }

    // Generate PDF using server-side Puppeteer
    const buffer = await HTMLToPDFGenerator.generatePDF(resume, template, {
      format: (options?.format === 'letter' || options?.format === 'Letter') ? 'Letter' : 'A4',
      margin: options?.margins ? {
        top: `${options.margins.top}px`,
        right: `${options.margins.right}px`,
        bottom: `${options.margins.bottom}px`,
        left: `${options.margins.left}px`
      } : undefined
    });

    // Return PDF as binary data
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'PDF generation failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}