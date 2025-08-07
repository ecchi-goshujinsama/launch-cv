import React from 'react';
import { pdf } from '@react-pdf/renderer';
import type { Resume, Template } from '../types';
import type { PDFExportOptions, PDFRenderContext } from './types';
import { DEFAULT_PDF_OPTIONS } from './types';

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
    const blob = await this.generatePDF(resume, template, options);
    
    // Generate filename
    const fileName = options.fileName || this.generateFileName(resume, template);
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
}