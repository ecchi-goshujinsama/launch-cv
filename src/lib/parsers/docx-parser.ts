'use client';

import mammoth from 'mammoth';
import { parseResumeText } from './text-parser';
import type { ParsedResumeData, ParseOptions, ParseResult } from './types';

/**
 * Parse DOCX file and extract resume data
 */
export async function parseDocxFile(
  file: File, 
  options: ParseOptions = {}
): Promise<ParseResult> {
  try {
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Parse DOCX to extract text using mammoth
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (!result.value || result.value.trim().length === 0) {
      return {
        success: false,
        error: 'Mission Control Alert: No text content found in DOCX file. The document might be empty or corrupted.',
        warnings: ['Ensure the document contains readable text', 'Try saving as a different format']
      };
    }
    
    // Clean and normalize the text
    const cleanText = cleanDocxText(result.value);
    
    // Parse the extracted text
    const parsedData = parseResumeText(cleanText, options);
    
    // Add DOCX-specific metadata and warnings
    const warnings: string[] = [];
    
    // Check for mammoth parsing messages
    if (result.messages && result.messages.length > 0) {
      const errorMessages = result.messages.filter(msg => msg.type === 'error');
      const warningMessages = result.messages.filter(msg => msg.type === 'warning');
      
      if (errorMessages.length > 0) {
        warnings.push('Some document elements could not be processed correctly');
      }
      
      if (warningMessages.length > 0) {
        warnings.push('Document formatting may affect text extraction accuracy');
      }
    }
    
    // Add PDF-specific metadata
    const parsedResult: ParsedResumeData = {
      ...parsedData,
      rawText: cleanText
    };
    
    // Determine success based on confidence and extracted data
    const hasBasicInfo = parsedResult.personalInfo.email || parsedResult.personalInfo.fullName || parsedResult.personalInfo.phone;
    const hasSections = Object.keys(parsedResult.sections).length > 0;
    
    if (!hasBasicInfo && !hasSections) {
      return {
        success: false,
        error: 'Mission Control Alert: Unable to extract meaningful resume data from DOCX. Document may be poorly formatted or contain mostly non-text elements.',
        warnings: [
          'Try a different file format',
          'Ensure the document contains standard resume sections',
          'Check if the document uses tables or complex formatting'
        ]
      };
    }
    
    // Add confidence-based warnings
    if (parsedResult.confidence < 0.6) {
      warnings.push(
        'Parsing confidence is below optimal levels',
        'Some information may need manual review',
        'Consider using simpler formatting for better extraction'
      );
    }
    
    const parseResult: ParseResult = {
      success: true,
      data: parsedResult
    };
    
    if (warnings.length > 0) {
      parseResult.warnings = warnings;
    }
    
    return parseResult;
    
  } catch (error) {
    console.error('DOCX parsing error:', error);
    
    let errorMessage = 'Mission Control Alert: Failed to parse DOCX file.';
    
    if (error instanceof Error) {
      if (error.message.includes('not a valid zip file')) {
        errorMessage = 'Mission Control Alert: Invalid DOCX file format. The file may be corrupted or not a valid Word document.';
      } else if (error.message.includes('password')) {
        errorMessage = 'Mission Control Alert: DOCX file is password-protected. Please use an unprotected document.';
      } else if (error.message.includes('corrupted')) {
        errorMessage = 'Mission Control Alert: DOCX file appears to be corrupted. Please try a different file.';
      }
    }
    
    return {
      success: false,
      error: errorMessage,
      warnings: [
        'Try saving the document in a different format (PDF, TXT)',
        'Ensure the file is not corrupted',
        'Remove password protection if applicable',
        'Use manual entry as an alternative'
      ]
    };
  }
}

/**
 * Clean and normalize DOCX text for better parsing
 */
function cleanDocxText(text: string): string {
  return text
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Normalize line breaks (DOCX often has inconsistent line breaks)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove multiple consecutive line breaks
    .replace(/\n{3,}/g, '\n\n')
    // Fix spacing around punctuation
    .replace(/\s+([.,;:])/g, '$1')
    .replace(/([.,;:])\s+/g, '$1 ')
    // Clean up bullet points and special characters
    .replace(/[•·▪▫‣⁃]/g, '•')
    // Remove tab characters and replace with spaces
    .replace(/\t/g, ' ')
    // Remove page breaks and section breaks
    .replace(/\f/g, '\n')
    // Remove extra spaces at start/end of lines
    .replace(/^[ \t]+|[ \t]+$/gm, '')
    // Remove empty lines with only whitespace
    .replace(/^\s*$/gm, '')
    // Trim overall
    .trim();
}

/**
 * Validate DOCX file before parsing
 */
export function validateDocxFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  const validMimeTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-word.document.macroEnabled.12'
  ];
  
  const hasValidMimeType = validMimeTypes.includes(file.type);
  const hasValidExtension = file.name.toLowerCase().endsWith('.docx');
  
  if (!hasValidMimeType && !hasValidExtension) {
    return {
      isValid: false,
      error: 'Mission Control Alert: File must be a DOCX document (Microsoft Word format).'
    };
  }
  
  // Check file size (10MB limit)
  const maxSizeInMB = 10;
  const fileSizeInMB = file.size / (1024 * 1024);
  
  if (fileSizeInMB > maxSizeInMB) {
    return {
      isValid: false,
      error: `Mission Control Alert: DOCX file size exceeds ${maxSizeInMB}MB limit. Current size: ${fileSizeInMB.toFixed(1)}MB.`
    };
  }
  
  // Check minimum file size (DOCX files have a minimum structure size)
  if (file.size < 2048) { // Less than 2KB
    return {
      isValid: false,
      error: 'Mission Control Alert: DOCX file appears to be empty or corrupted.'
    };
  }
  
  return { isValid: true };
}

/**
 * Parse DOCX with HTML extraction (for better formatting preservation)
 */
export async function parseDocxWithFormatting(
  file: File,
  options: ParseOptions = {}
): Promise<ParseResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Extract HTML to preserve some formatting
    const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
    
    if (!htmlResult.value || htmlResult.value.trim().length === 0) {
      // Fallback to plain text extraction
      return parseDocxFile(file, options);
    }
    
    // Convert HTML to clean text while preserving structure
    const cleanText = htmlToCleanText(htmlResult.value);
    const parsedData = parseResumeText(cleanText, options);
    
    const result: ParsedResumeData = {
      ...parsedData,
      rawText: cleanText
    };
    
    const finalResult: ParseResult = {
      success: true,
      data: result
    };
    
    if (htmlResult.messages.length > 0) {
      finalResult.warnings = ['Some formatting elements were not preserved during conversion'];
    }
    
    return finalResult;
    
  } catch {
    // Fallback to regular text extraction
    return parseDocxFile(file, options);
  }
}

/**
 * Convert HTML to clean text while preserving structure
 */
function htmlToCleanText(html: string): string {
  return html
    // Replace paragraph tags with line breaks
    .replace(/<\/p>/gi, '\n')
    .replace(/<p[^>]*>/gi, '')
    // Replace line break tags
    .replace(/<br[^>]*>/gi, '\n')
    // Replace list items with bullet points
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    // Remove all other HTML tags
    .replace(/<[^>]+>/g, '')
    // Decode HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Clean up whitespace
    .replace(/\s+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .trim();
}