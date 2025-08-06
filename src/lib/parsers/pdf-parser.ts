'use client';

import pdfParse from 'pdf-parse';
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
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Parse PDF to extract text
    const pdfData = await pdfParse(buffer);
    
    if (!pdfData.text || pdfData.text.trim().length === 0) {
      return {
        success: false,
        error: 'Mission Control Alert: No text content found in PDF file. The file might be image-based or corrupted.',
        warnings: ['Consider using a text-based PDF or OCR tools for image-based PDFs']
      };
    }
    
    // Clean and normalize the text
    const cleanText = cleanPdfText(pdfData.text);
    
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
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Fix common PDF extraction issues
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
    // Normalize line breaks
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove extra spaces around punctuation
    .replace(/\s+([.,;:])/g, '$1')
    .replace(/([.,;:])\s+/g, '$1 ')
    // Clean up bullet points
    .replace(/[•·▪▫‣⁃]/g, '•')
    // Remove page numbers and headers/footers (basic)
    .replace(/^Page \d+ of \d+.*$/gm, '')
    .replace(/^\d+\s*$/gm, '')
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