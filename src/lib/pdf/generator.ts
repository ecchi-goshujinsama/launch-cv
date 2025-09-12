import type { Resume, Template } from '../types';
import type { PDFExportOptions } from './types';
import { HTMLToPDFGenerator } from './html-pdf-generator';
import { useExportStore } from '../stores/export-store';

export class PDFGenerator {
  static async generatePDF(
    resume: Resume,
    template: Template,
    options: Partial<PDFExportOptions> = {}
  ): Promise<Blob> {
    const buffer = await HTMLToPDFGenerator.generatePDF(resume, template, {
      format: (options.format === 'letter' || options.format === 'Letter') ? 'Letter' : 'A4',
      margin: options.margins ? {
        top: `${options.margins.top}px`,
        right: `${options.margins.right}px`,
        bottom: `${options.margins.bottom}px`,
        left: `${options.margins.left}px`
      } : undefined
    });

    return new Blob([buffer.buffer], { type: 'application/pdf' });
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

  static async generatePreviewBlob(
    resume: Resume,
    template: Template,
    options: Partial<PDFExportOptions> = {}
  ): Promise<string> {
    return await HTMLToPDFGenerator.generatePreviewBlob(resume, template, options);
  }

  // Keep existing utility methods
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
    const printOptions = {
      format: ((options.format === 'letter' || options.format === 'Letter') ? 'Letter' : 'A4') as 'A4' | 'Letter',
      margin: options.margins ? {
        top: `${options.margins.top}px`,
        right: `${options.margins.right}px`,
        bottom: `${options.margins.bottom}px`,
        left: `${options.margins.left}px`
      } : {
        top: '0.5in',
        right: '0.5in', 
        bottom: '0.5in',
        left: '0.5in'
      },
      printBackground: true,
      preferCSSPageSize: true
    };

    const buffer = await HTMLToPDFGenerator.generatePDF(resume, template, printOptions);
    return new Blob([buffer.buffer], { type: 'application/pdf' });
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

  // Template support methods (updated for HTML-to-PDF)
  static isTemplateSupported(templateId: string): boolean {
    // All templates are now supported via HTML-to-PDF
    const supportedTemplates = ['classic-professional', 'modern-minimal', 'executive', 'technical', 'creative'];
    return supportedTemplates.includes(templateId);
  }

  // Get supported template IDs
  static getSupportedTemplateIds(): string[] {
    return ['classic-professional', 'modern-minimal', 'executive', 'technical', 'creative'];
  }
}