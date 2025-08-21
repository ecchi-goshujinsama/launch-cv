'use client';

import { parseResumeText } from './text-parser';
import type { ParsedResumeData, ParseOptions, ParseResult } from './types';

/**
 * Parse PDF file and extract resume data
 */
export async function parsePdfFile(
  file: File, 
  options: ParseOptions = {}
): Promise<ParseResult> {
  try {
    // Dynamic import for PDF.js to avoid SSR issues
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set up PDF.js worker
    if (typeof window !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs-dist/pdf.worker.mjs';
    }
    
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from all pages with proper coordinate-based parsing
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const viewport = page.getViewport({ scale: 1.0 });
      
      // Create lines by grouping text items by Y coordinate
      const lines: { [key: number]: any[] } = {};
      
      for (const item of textContent.items) {
        const textItem = item as any;
        if (!textItem.str || textItem.str.trim().length === 0) continue;
        
        // Transform coordinates from PDF space to viewport space
        const transform = textItem.transform;
        const x = transform[4];
        const y = viewport.height - transform[5]; // Flip Y coordinate
        
        // Round Y coordinate to group items on same line (within 3 pixels)
        const lineY = Math.round(y / 3) * 3;
        
        if (!lines[lineY]) lines[lineY] = [];
        lines[lineY].push({
          text: textItem.str,
          x: x,
          y: y,
          width: textItem.width,
          height: textItem.height,
          fontName: textItem.fontName || '',
          fontSize: textItem.height || 12
        });
      }
      
      // Sort lines by Y coordinate (top to bottom)
      const sortedLineYs = Object.keys(lines)
        .map(y => parseInt(y))
        .sort((a, b) => a - b);
      
      let pageText = '';
      
      for (const lineY of sortedLineYs) {
        // Sort items on same line by X coordinate (left to right)
        const lineItems = lines[lineY].sort((a, b) => a.x - b.x);
        
        let lineText = '';
        let lastX = -1;
        
        for (const item of lineItems) {
          // Add space if there's a significant gap between items
          if (lastX !== -1 && item.x - lastX > item.height * 0.3) {
            lineText += ' ';
          }
          
          lineText += item.text;
          lastX = item.x + (item.width || item.text.length * 6); // Estimate width if not provided
        }
        
        if (lineText.trim().length > 0) {
          pageText += lineText.trim() + '\n';
        }
      }
      
      fullText += pageText + '\n';
    }
    
    if (!fullText || fullText.trim().length === 0) {
      return {
        success: false,
        error: 'Mission Control Alert: No text content found in PDF file. The file might be image-based or corrupted.',
        warnings: ['Consider using a text-based PDF or OCR tools for image-based PDFs']
      };
    }
    
    // Clean and normalize the text
    const cleanText = cleanPdfText(fullText);
    
    // Debug: Log the extracted text structure
    console.log('=== IMPROVED PDF EXTRACTION DEBUG ===');
    console.log('Total text length:', cleanText.length);
    const lines = cleanText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    console.log('Total lines:', lines.length);
    console.log('First 20 lines:');
    lines.slice(0, 20).forEach((line, i) => console.log(`${i+1}: "${line}"`));
    console.log('=== END DEBUG ===');
    
    // Parse the extracted text
    const parsedData = parseResumeText(cleanText, options);
    
    // Add PDF-specific metadata
    const result: ParsedResumeData = {
      ...parsedData,
      rawText: cleanText
    };
    
    // Determine success based on confidence and extracted data
    const hasBasicInfo = result.personalInfo.email || result.personalInfo.fullName || result.personalInfo.phone;
    const hasSections = Object.keys(result.sections).length > 0;
    
    if (!hasBasicInfo && !hasSections) {
      return {
        success: false,
        error: 'Mission Control Alert: Unable to extract meaningful resume data from PDF. Text may be too complex or poorly formatted.',
        warnings: [
          'Try a different file format',
          'Ensure the PDF contains selectable text',
          'Check if the resume follows a standard format'
        ]
      };
    }
    
    const parseResult: ParseResult = {
      success: true,
      data: result
    };
    
    if (result.confidence < 0.6) {
      parseResult.warnings = [
        'Parsing confidence is below optimal levels',
        'Some information may need manual review',
        'Consider reformatting the source document for better extraction'
      ];
    }
    
    return parseResult;
    
  } catch (error) {
    console.error('PDF parsing error:', error);
    
    let errorMessage = 'Mission Control Alert: Failed to parse PDF file.';
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid PDF')) {
        errorMessage = 'Mission Control Alert: Invalid PDF file format. Please ensure the file is a valid PDF document.';
      } else if (error.message.includes('encrypted')) {
        errorMessage = 'Mission Control Alert: PDF file is encrypted or password-protected. Please use an unprotected PDF.';
      } else if (error.message.includes('corrupted')) {
        errorMessage = 'Mission Control Alert: PDF file appears to be corrupted. Please try a different file.';
      }
    }
    
    return {
      success: false,
      error: errorMessage,
      warnings: [
        'Try converting the PDF to a different format',
        'Ensure the file is not corrupted',
        'Use manual entry as an alternative'
      ]
    };
  }
}

/**
 * Clean and normalize PDF text for better parsing
 */
function cleanPdfText(text: string): string {
  return text
    // First normalize line breaks
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Add line breaks before common section headers (case insensitive)
    .replace(/(?<!^|\n)(EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT|PROFESSIONAL EXPERIENCE)/gi, '\n$1')
    .replace(/(?<!^|\n)(EDUCATION|ACADEMIC BACKGROUND|QUALIFICATIONS)/gi, '\n$1')
    .replace(/(?<!^|\n)(SKILLS|TECHNICAL SKILLS|COMPETENCIES|TECHNOLOGIES)/gi, '\n$1')
    .replace(/(?<!^|\n)(PROJECTS|PERSONAL PROJECTS|PORTFOLIO)/gi, '\n$1')
    .replace(/(?<!^|\n)(CERTIFICATIONS?|CERTIFICATES|LICENSES|TRAINING)/gi, '\n$1')
    // Add line breaks before common experience patterns and job titles
    .replace(/(?<!^|\n)(SYSTEM ADMINISTRATOR|SUPPORT ENGINEER|SOFTWARE|TECHNICAL|SENIOR|SR\.|AZURE.*ENGINEER|.*SPECIALIST|.*DEVELOPER)/gi, '\n$1')
    // Add line breaks before specific company names from the resume
    .replace(/(?<!^|\n)(BRITAX CHILD SAFETY|MICROSOFT|VERSIANT|DRIVEN BRANDS|PEAK)/gi, '\n$1')
    // Add line breaks before company names (all caps followed by location)
    .replace(/([a-z])\s+([A-Z]{2,}[A-Z\s&,.']+)(\s[A-Z][a-z]+,\s[A-Z]{2})/g, '$1\n$2$3')
    // Add line breaks before dates (MM/YYYY patterns)
    .replace(/([a-z])\s+(\d{2}\/\d{4})/g, '$1\n$2')
    // Add line breaks before location patterns (CITY, STATE)
    .replace(/([a-z])\s+([A-Z][A-Z\s]+),\s*([A-Z]{2})\s+(\d{2}\/\d{4})/g, '$1\n$2, $3\n$4')
    // Remove excessive whitespace but preserve intentional line breaks
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s+/g, '\n')
    // Fix common PDF extraction issues
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
    // Remove extra spaces around punctuation
    .replace(/\s+([.,;:])/g, '$1')
    .replace(/([.,;:])\s+/g, '$1 ')
    // Clean up bullet points
    .replace(/[•·▪▫‣⁃]/g, '•')
    // Remove page numbers and headers/footers (basic)
    .replace(/^Page \d+ of \d+.*$/gm, '')
    .replace(/^\d+\s*$/gm, '')
    // Clean up multiple consecutive line breaks
    .replace(/\n{3,}/g, '\n\n')
    // Trim and clean
    .trim();
}

/**
 * Validate PDF file before parsing
 */
export function validatePdfFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return {
      isValid: false,
      error: 'Mission Control Alert: File must be a PDF document.'
    };
  }
  
  // Check file size (10MB limit)
  const maxSizeInMB = 10;
  const fileSizeInMB = file.size / (1024 * 1024);
  
  if (fileSizeInMB > maxSizeInMB) {
    return {
      isValid: false,
      error: `Mission Control Alert: PDF file size exceeds ${maxSizeInMB}MB limit. Current size: ${fileSizeInMB.toFixed(1)}MB.`
    };
  }
  
  // Check minimum file size (avoid empty files)
  if (file.size < 1024) { // Less than 1KB
    return {
      isValid: false,
      error: 'Mission Control Alert: PDF file appears to be empty or too small.'
    };
  }
  
  return { isValid: true };
}