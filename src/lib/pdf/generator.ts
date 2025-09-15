import type { Resume, Template } from '../types';
import type { PDFExportOptions } from './types';
import { ClientPDFGenerator } from './client-generator';

export class PDFGenerator {
  static async generatePDF(
    resume: Resume,
    template: Template,
    options: Partial<PDFExportOptions> = {}
  ): Promise<Blob> {
    return await ClientPDFGenerator.generatePDF(resume, template, options);
  }

  static async downloadPDF(
    resume: Resume,
    template: Template,
    options: Partial<PDFExportOptions> = {}
  ): Promise<void> {
    return await ClientPDFGenerator.downloadPDF(resume, template, options);
  }

  static async generatePreviewBlob(
    resume: Resume,
    template: Template,
    options: Partial<PDFExportOptions> = {}
  ): Promise<string> {
    return await ClientPDFGenerator.generatePreviewBlob(resume, template, options);
  }

  // Print optimization method
  static async generatePrintOptimizedPDF(
    resume: Resume,
    template: Template,
    options: Partial<PDFExportOptions> = {}
  ): Promise<Blob> {
    return await ClientPDFGenerator.generatePrintOptimizedPDF(resume, template, options);
  }

  // Browser print method
  static async printResume(
    resume: Resume,
    template: Template,
    options: Partial<PDFExportOptions> = {}
  ): Promise<void> {
    return await ClientPDFGenerator.printResume(resume, template, options);
  }

  // Template support methods
  static isTemplateSupported(templateId: string): boolean {
    return ClientPDFGenerator.isTemplateSupported(templateId);
  }

  // Get supported template IDs
  static getSupportedTemplateIds(): string[] {
    return ClientPDFGenerator.getSupportedTemplateIds();
  }
}