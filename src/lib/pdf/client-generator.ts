import type { Resume, Template } from '../types';
import type { PDFExportOptions } from './types';
import { useExportStore } from '../stores/export-store';

/**
 * Client-side PDF generator that uses server API routes
 * This avoids importing server-side libraries like Puppeteer in the browser
 */
export class ClientPDFGenerator {
  
  /**
   * Generate PDF by making a request to the server API
   */
  static async generatePDF(
    resume: Resume,
    template: Template,
    options: Partial<PDFExportOptions> = {}
  ): Promise<Blob> {
    const response = await fetch('/api/pdf/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resume,
        template,
        options,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `PDF generation failed with status ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return new Blob([arrayBuffer], { type: 'application/pdf' });
  }

  /**
   * Download PDF file
   */
  static async downloadPDF(
    resume: Resume,
    template: Template,
    options: Partial<PDFExportOptions> = {}
  ): Promise<void> {
    const startTime = Date.now();
    let exportId: string | null = null;
    
    try {
      const blob = await this.generatePDF(resume, template, options);
      
      // Generate filename
      const fileName = options.fileName || this.generateAdvancedFileName(resume, template, options);
      
      // Log export attempt
      exportId = this.logExportAttempt(resume, template, fileName);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Log success
      this.logExportSuccess(exportId, blob.size, Date.now() - startTime);
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
    } catch (error) {
      if (exportId) {
        this.logExportFailure(exportId, error instanceof Error ? error.message : 'Unknown error');
      }
      throw error;
    }
  }

  /**
   * Generate preview blob URL
   */
  static async generatePreviewBlob(
    resume: Resume,
    template: Template,
    options: Partial<PDFExportOptions> = {}
  ): Promise<string> {
    const blob = await this.generatePDF(resume, template, options);
    return URL.createObjectURL(blob);
  }

  /**
   * Generate basic filename
   */
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

  /**
   * Advanced filename generation with export store integration
   */
  private static generateAdvancedFileName(
    resume: Resume,
    template: Template,
    options: Partial<PDFExportOptions> = {}
  ): string {
    if (typeof window !== 'undefined') {
      try {
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

  /**
   * Log export attempt
   */
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

  /**
   * Log export success
   */
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

  /**
   * Log export failure
   */
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

  /**
   * Print optimized PDF generation
   */
  static async generatePrintOptimizedPDF(
    resume: Resume,
    template: Template,
    options: Partial<PDFExportOptions> = {}
  ): Promise<Blob> {
    const printOptions = {
      ...options,
      format: ((options.format === 'letter' || options.format === 'Letter') ? 'Letter' : 'A4') as 'A4' | 'Letter',
      margins: options.margins || {
        top: 36, // 0.5 inch
        right: 36,
        bottom: 36,
        left: 36
      }
    };

    return await this.generatePDF(resume, template, printOptions);
  }

  /**
   * Browser print functionality
   */
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

  /**
   * Check if template is supported
   */
  static isTemplateSupported(templateId: string): boolean {
    const supportedTemplates = ['classic-professional', 'modern-minimal', 'executive', 'technical', 'creative'];
    return supportedTemplates.includes(templateId);
  }

  /**
   * Get supported template IDs
   */
  static getSupportedTemplateIds(): string[] {
    return ['classic-professional', 'modern-minimal', 'executive', 'technical', 'creative'];
  }
}