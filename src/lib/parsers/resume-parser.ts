'use client';

import { parsePdfFile, validatePdfFile } from './pdf-parser';
import { parseDocxFile, validateDocxFile } from './docx-parser';
import { parseResumeText } from './text-parser';
import type { ParseOptions, ParseResult } from './types';

/**
 * Main resume parser that handles different file types
 */
export async function parseResumeFile(
  file: File,
  options: ParseOptions = {}
): Promise<ParseResult> {
  try {
    // Determine file type
    const fileType = getFileType(file);
    
    switch (fileType) {
      case 'pdf':
        // Validate PDF file first
        const pdfValidation = validatePdfFile(file);
        if (!pdfValidation.isValid) {
          return {
            success: false,
            error: pdfValidation.error || 'PDF validation failed'
          };
        }
        return await parsePdfFile(file, options);
        
      case 'docx':
        // Validate DOCX file first
        const docxValidation = validateDocxFile(file);
        if (!docxValidation.isValid) {
          return {
            success: false,
            error: docxValidation.error || 'DOCX validation failed'
          };
        }
        return await parseDocxFile(file, options);
        
      case 'txt':
        return await parseTxtFile(file, options);
        
      default:
        return {
          success: false,
          error: 'Mission Control Alert: Unsupported file format. Please use PDF, DOCX, or TXT files.',
          warnings: ['Supported formats: PDF, DOCX, TXT']
        };
    }
  } catch (error) {
    console.error('Resume parsing error:', error);
    return {
      success: false,
      error: 'Mission Control Alert: An unexpected error occurred while parsing your resume. Please try again or use manual entry.',
      warnings: [
        'Check if the file is corrupted',
        'Try a different file format',
        'Use manual entry as an alternative'
      ]
    };
  }
}

/**
 * Parse TXT file
 */
async function parseTxtFile(
  file: File,
  options: ParseOptions = {}
): Promise<ParseResult> {
  try {
    // Validate TXT file
    const validation = validateTxtFile(file);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error || 'Text file validation failed'
      };
    }
    
    // Read file as text
    const text = await file.text();
    
    if (!text || text.trim().length === 0) {
      return {
        success: false,
        error: 'Mission Control Alert: Text file appears to be empty.',
        warnings: ['Ensure the file contains resume content']
      };
    }
    
    // Parse the text
    const parsedData = parseResumeText(text, options);
    
    // Check if we extracted meaningful data
    const hasBasicInfo = parsedData.personalInfo.email || parsedData.personalInfo.fullName || parsedData.personalInfo.phone;
    const hasSections = Object.keys(parsedData.sections).length > 0;
    
    if (!hasBasicInfo && !hasSections) {
      return {
        success: false,
        error: 'Mission Control Alert: Unable to extract meaningful resume data from text file. Content may be poorly formatted.',
        warnings: [
          'Ensure the text follows a standard resume format',
          'Include clear section headers (EXPERIENCE, EDUCATION, etc.)',
          'Use manual entry for better control'
        ]
      };
    }
    
    const finalResult: ParseResult = {
      success: true,
      data: parsedData
    };
    
    if (parsedData.confidence < 0.6) {
      finalResult.warnings = [
        'Parsing confidence is below optimal levels',
        'Consider adding clear section headers',
        'Some information may need manual review'
      ];
    }
    
    return finalResult;
    
  } catch (error) {
    console.error('TXT parsing error:', error);
    return {
      success: false,
      error: 'Mission Control Alert: Failed to read text file. The file may be corrupted or in an unsupported encoding.',
      warnings: [
        'Ensure the file is saved as plain text (UTF-8)',
        'Check if the file is corrupted',
        'Try copying and pasting the content manually'
      ]
    };
  }
}

/**
 * Validate TXT file
 */
function validateTxtFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  const validMimeTypes = ['text/plain', 'text/txt'];
  const hasValidMimeType = validMimeTypes.includes(file.type);
  const hasValidExtension = file.name.toLowerCase().endsWith('.txt');
  
  if (!hasValidMimeType && !hasValidExtension) {
    return {
      isValid: false,
      error: 'Mission Control Alert: File must be a plain text (.txt) file.'
    };
  }
  
  // Check file size (5MB limit for text files)
  const maxSizeInMB = 5;
  const fileSizeInMB = file.size / (1024 * 1024);
  
  if (fileSizeInMB > maxSizeInMB) {
    return {
      isValid: false,
      error: `Mission Control Alert: Text file size exceeds ${maxSizeInMB}MB limit. Current size: ${fileSizeInMB.toFixed(1)}MB.`
    };
  }
  
  // Check minimum file size
  if (file.size < 10) { // Less than 10 bytes
    return {
      isValid: false,
      error: 'Mission Control Alert: Text file appears to be empty.'
    };
  }
  
  return { isValid: true };
}

/**
 * Determine file type from file object
 */
function getFileType(file: File): 'pdf' | 'docx' | 'txt' | 'unknown' {
  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();
  
  // Check by MIME type first
  if (mimeType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return 'pdf';
  }
  
  if (mimeType.includes('wordprocessingml') || fileName.endsWith('.docx')) {
    return 'docx';
  }
  
  if (mimeType === 'text/plain' || fileName.endsWith('.txt')) {
    return 'txt';
  }
  
  return 'unknown';
}

/**
 * Get supported file types
 */
export function getSupportedFileTypes(): {
  extensions: string[];
  mimeTypes: string[];
  maxSizes: Record<string, number>; // in MB
} {
  return {
    extensions: ['pdf', 'docx', 'txt'],
    mimeTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-word.document.macroEnabled.12',
      'text/plain'
    ],
    maxSizes: {
      pdf: 10,
      docx: 10,
      txt: 5
    }
  };
}

/**
 * Preview file content before parsing
 */
export async function previewFileContent(file: File): Promise<{
  success: boolean;
  preview?: string;
  fileInfo: {
    name: string;
    type: string;
    size: string;
    lastModified: string;
  };
  error?: string;
}> {
  const fileInfo = {
    name: file.name,
    type: file.type || 'unknown',
    size: formatFileSize(file.size),
    lastModified: new Date(file.lastModified).toLocaleDateString()
  };
  
  try {
    const fileType = getFileType(file);
    let preview = '';
    
    switch (fileType) {
      case 'txt':
        const text = await file.text();
        preview = text.substring(0, 500) + (text.length > 500 ? '...' : '');
        break;
        
      case 'pdf':
      case 'docx':
        preview = `${fileType.toUpperCase()} file - Content will be extracted during parsing`;
        break;
        
      default:
        preview = 'Unsupported file format';
        break;
    }
    
    return {
      success: true,
      preview,
      fileInfo
    };
    
  } catch {
    return {
      success: false,
      fileInfo,
      error: 'Failed to preview file content'
    };
  }
}

/**
 * Format file size for display
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}