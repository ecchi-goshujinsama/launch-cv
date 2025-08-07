import React from 'react';
import { pdf } from '@react-pdf/renderer';
import type { Resume, Template } from '../types';
import type { PDFExportOptions, PDFRenderContext } from './types';
import { DEFAULT_PDF_OPTIONS } from './types';
import { useExportStore } from '../stores/export-store';

// PDF template components will be imported here
import { ClassicProfessionalPDF } from '../../components/pdf/templates/classic-professional-pdf';
import { ModernMinimalPDF } from '../../components/pdf/templates/modern-minimal-pdf';
import { ExecutivePDF } from '../../components/pdf/templates/executive-pdf';
import { TechnicalPDF } from '../../components/pdf/templates/technical-pdf';
import { CreativePDF } from '../../components/pdf/templates/creative-pdf';

// Template mapping for PDF export
const PDF_TEMPLATES = {
  'classic-professional': ClassicProfessionalPDF,
  'modern-minimal': ModernMinimalPDF,
  'executive': ExecutivePDF,
  'technical': TechnicalPDF,
  'creative': CreativePDF,
} as const;

export class PDFGenerator {
  static async generatePDF(
    resume: Resume,
    template: Template,
    options: Partial<PDFExportOptions> = {}
  ): Promise<Blob> {
    const finalOptions: PDFExportOptions = {
      ...DEFAULT_PDF_OPTIONS,
      ...options,
      templateId: template.id,
    };

    const context: PDFRenderContext = {
      resume,
      template,
      options: finalOptions,
    };

    // Get the appropriate PDF template component
    const PDFComponent = this.getPDFTemplate(template.id);
    if (!PDFComponent) {
      throw new Error(`PDF template not found for template ID: ${template.id}`);
    }

    try {
      // Generate the PDF using React-PDF
      const blob = await pdf(React.createElement(PDFComponent, { context })).toBlob();
      return blob;
    } catch (error) {
      console.error('PDF Generation Error:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  static async downloadPDF(
    resume: Resume,
    template: Template,
    options: Partial<PDFExportOptions> = {}
  ): Promise<void> {
    const startTime = Date.now();
    let exportId: string | null = null;
    
    try {
      const blob = await this.generatePDF(resume, template, options);
      
      // Generate filename using the new naming convention
      const fileName = options.fileName || this.generateAdvancedFileName(resume, template, options);
      
      // Log export attempt to history
      exportId = this.logExportAttempt(resume, template, fileName);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      
      // Add print optimization attributes
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Log successful export
      this.logExportSuccess(exportId, blob.size, Date.now() - startTime);
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
    } catch (error) {
      // Log failed export
      if (exportId) {
        this.logExportFailure(exportId, error instanceof Error ? error.message : 'Unknown error');
      }
      throw error;
    }
  }

  private static getPDFTemplate(templateId: string) {
    return PDF_TEMPLATES[templateId as keyof typeof PDF_TEMPLATES] || null;
  }

  private static generateFileName(resume: Resume, template: Template): string {
    const name = resume.personalInfo.fullName
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
    
    const templateName = template.name
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
    
    const timestamp = new Date().toISOString().split('T')[0];
    
    return `${name}_Resume_${templateName}_${timestamp}.pdf`;
  }

  // Utility methods for PDF preview
  static async generatePreviewBlob(
    resume: Resume,
    template: Template,
    options: Partial<PDFExportOptions> = {}
  ): Promise<string> {
    const blob = await this.generatePDF(resume, template, options);
    return URL.createObjectURL(blob);
  }

  // Method to check if template supports PDF export
  static isTemplateSupported(templateId: string): boolean {
    return templateId in PDF_TEMPLATES;
  }

  // Get supported template IDs
  static getSupportedTemplateIds(): string[] {
    return Object.keys(PDF_TEMPLATES);
  }

  // Advanced filename generation with export store integration
  private static generateAdvancedFileName(
    resume: Resume,
    template: Template,
    options: Partial<PDFExportOptions> = {}
  ): string {
    // This method will be called from browser context where useExportStore is available
    if (typeof window !== 'undefined') {
      try {
        // Get the store state directly
        const store = useExportStore.getState();
        return store.generateFileName(
          resume.title || resume.personalInfo.fullName,
          template.name,
          options.fileName
        );
      } catch {
        console.warn('Could not use export store for filename generation, falling back to basic method');
      }
    }
    
    // Fallback to basic filename generation
    return this.generateFileName(resume, template);
  }

  // Export logging methods
  private static logExportAttempt(resume: Resume, template: Template, fileName: string): string | null {
    if (typeof window !== 'undefined') {
      try {
        const store = useExportStore.getState();
        return store.addExportEntry({
          resumeId: resume.id,
          resumeTitle: resume.title || resume.personalInfo.fullName,
          templateId: template.id,
          templateName: template.name,
          fileName,
          exportedAt: new Date(),
          success: false, // Will be updated on success
        });
      } catch (error) {
        console.warn('Could not log export attempt:', error);
      }
    }
    return null;
  }

  private static logExportSuccess(exportId: string, fileSize: number, duration: number): void {
    if (typeof window !== 'undefined' && exportId) {
      try {
        const store = useExportStore.getState();
        store.updateExportEntry(exportId, {
          success: true,
          fileSize,
        });
        console.log(`PDF export successful: ${fileSize} bytes in ${duration}ms`);
      } catch (error) {
        console.warn('Could not log export success:', error);
      }
    }
  }

  private static logExportFailure(exportId: string, errorMessage: string): void {
    if (typeof window !== 'undefined' && exportId) {
      try {
        const store = useExportStore.getState();
        store.updateExportEntry(exportId, {
          success: false,
          error: errorMessage,
        });
      } catch (error) {
        console.warn('Could not log export failure:', error);
      }
    }
  }

  // Print optimization method
  static async generatePrintOptimizedPDF(
    resume: Resume,
    template: Template,
    options: Partial<PDFExportOptions> = {}
  ): Promise<Blob> {
    const printOptions: PDFExportOptions = {
      ...DEFAULT_PDF_OPTIONS,
      ...options,
      templateId: template.id,
      // Print-specific optimizations
      format: options.format || 'a4',
      margins: options.margins || { top: 36, right: 36, bottom: 36, left: 36 }, // 0.5 inch margins
      compression: true,
      metadata: {
        title: `${resume.personalInfo.fullName} - Resume`,
        author: resume.personalInfo.fullName,
        subject: `Resume - ${template.name}`,
        creator: 'LaunchCV',
        producer: 'LaunchCV PDF Generator',
        creationDate: new Date(),
        modDate: new Date(),
        ...options.metadata,
      },
    };

    return this.generatePDF(resume, template, printOptions);
  }

  // Browser print method
  static async printResume(
    resume: Resume,
    template: Template,
    options: Partial<PDFExportOptions> = {}
  ): Promise<void> {
    const blob = await this.generatePrintOptimizedPDF(resume, template, options);
    const url = URL.createObjectURL(blob);
    
    // Open in new window for printing
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
    } else {
      // Fallback: trigger download if popup blocked
      await this.downloadPDF(resume, template, options);
    }
    
    // Cleanup URL after a delay
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 10000);
  }
}