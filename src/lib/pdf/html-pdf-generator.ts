import puppeteer, { Browser, Page } from 'puppeteer';
import { renderToString } from 'react-dom/server';
import React from 'react';
import type { Resume, Template } from '../types';
import { getTemplateRenderer } from '../../components/templates/renderers';

export interface HTMLToPDFOptions {
  format?: 'A4' | 'Letter';
  margin?: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  printBackground?: boolean;
  preferCSSPageSize?: boolean;
  scale?: number;
  landscape?: boolean;
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2';
}

const DEFAULT_PDF_OPTIONS: HTMLToPDFOptions = {
  format: 'A4',
  margin: {
    top: '0.5in',
    right: '0.5in',
    bottom: '0.5in',
    left: '0.5in'
  },
  printBackground: true,
  preferCSSPageSize: true,
  scale: 1,
  landscape: false,
  waitUntil: 'networkidle0'
};

/**
 * HTML-to-PDF Generator using Puppeteer
 * Converts React templates to PDF by rendering HTML and using Chrome's PDF engine
 */
export class HTMLToPDFGenerator {
  private static browserInstance: Browser | null = null;

  /**
   * Get or create a shared browser instance for better performance
   */
  private static async getBrowser(): Promise<Browser> {
    if (!this.browserInstance || !this.browserInstance.connected) {
      this.browserInstance = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu',
          '--disable-extensions',
          '--disable-default-apps',
          '--disable-translate',
          '--disable-sync',
          '--disable-background-networking',
          '--disable-background-timer-throttling',
          '--disable-renderer-backgrounding',
          '--disable-backgrounding-occluded-windows',
          '--disable-ipc-flooding-protection',
        ]
      });
    }
    return this.browserInstance;
  }

  /**
   * Close the shared browser instance
   */
  static async closeBrowser(): Promise<void> {
    if (this.browserInstance) {
      await this.browserInstance.close();
      this.browserInstance = null;
    }
  }

  /**
   * Generate PDF from React template
   */
  static async generatePDF(
    resume: Resume,
    template: Template,
    options: Partial<HTMLToPDFOptions> = {}
  ): Promise<Buffer> {
    const finalOptions = { ...DEFAULT_PDF_OPTIONS, ...options };
    
    // Get the React template component
    const TemplateComponent = getTemplateRenderer(template.id);
    if (!TemplateComponent) {
      throw new Error(`Template not found: ${template.id}`);
    }

    // Render React component to HTML string
    let htmlContent: string;
    try {
      htmlContent = renderToString(
        React.createElement(TemplateComponent, {
          resume,
          template,
          isPrintMode: true,
          scale: 1,
          className: 'pdf-optimized'
        })
      );
    } catch (error) {
      throw new Error(`Failed to render template to HTML: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Create complete HTML document with CSS
    const fullHTML = this.createFullHTMLDocument(htmlContent, template);

    let browser: Browser;
    let page: Page;
    
    try {
      browser = await this.getBrowser();
      page = await browser.newPage();
      
      // Set viewport for consistent rendering
      await page.setViewport({
        width: 1200,
        height: 1600,
        deviceScaleFactor: 1
      });
      
      // Emulate print media for CSS @media print rules
      await page.emulateMediaType('print');
      
      // Set content and wait for it to load
      await page.setContent(fullHTML, { 
        waitUntil: finalOptions.waitUntil,
        timeout: 30000
      });
      
      // Wait for fonts to load
      await page.evaluateHandle(() => document.fonts.ready);
      
      // Generate PDF with optimized settings
      const pdfBuffer = await page.pdf({
        format: finalOptions.format,
        margin: finalOptions.margin,
        printBackground: finalOptions.printBackground,
        preferCSSPageSize: finalOptions.preferCSSPageSize,
        scale: finalOptions.scale,
        landscape: finalOptions.landscape,
        timeout: 30000
      });

      return Buffer.from(pdfBuffer);
    } catch (error) {
      throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  /**
   * Generate PDF preview blob URL
   */
  static async generatePreviewBlob(
    resume: Resume,
    template: Template,
    options: Partial<HTMLToPDFOptions> = {}
  ): Promise<string> {
    const buffer = await this.generatePDF(resume, template, options);
    const blob = new Blob([buffer.buffer], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  }

  /**
   * Create complete HTML document with embedded CSS and fonts
   */
  private static createFullHTMLDocument(content: string, template: Template): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume - ${template.name}</title>
  
  <!-- Web fonts for better typography -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <style>
    /* Reset and base styles */
    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      font-size: 11pt;
      line-height: 1.4;
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: #000;
      background: #fff;
      margin: 0;
      padding: 0;
    }

    /* Print-specific page setup */
    @page {
      size: A4;
      margin: 0.5in;
    }

    /* Typography optimizations */
    h1, h2, h3, h4, h5, h6 {
      margin-bottom: 0.5em;
      page-break-after: avoid;
      line-height: 1.2;
    }

    p, li {
      margin-bottom: 0.3em;
      line-height: 1.4;
    }

    ul, ol {
      margin-bottom: 0.5em;
      padding-left: 1.5em;
    }

    /* Layout utilities */
    .pdf-optimized {
      max-width: 8.5in;
      margin: 0 auto;
      background: white;
    }

    .print-section {
      margin-bottom: 1em;
      page-break-inside: avoid;
    }

    .print-break-before { page-break-before: always; }
    .print-break-after { page-break-after: always; }
    .print-break-inside-avoid { page-break-inside: avoid; }

    /* Color and background adjustments */
    .print-force-black { color: #000 !important; }
    .print-preserve-colors * {
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    /* Template-specific optimizations */
    ${this.getTemplatePrintCSS(template.id)}

    /* Tailwind-like utilities for PDF */
    .grid { display: flex; flex-wrap: wrap; }
    .grid-cols-1 > * { flex: 1 1 100%; }
    .grid-cols-2 > * { flex: 1 1 50%; }
    .grid-cols-3 > * { flex: 1 1 33.333%; }
    .gap-2 { gap: 0.5rem; }
    .gap-4 { gap: 1rem; }
    .gap-6 { gap: 1.5rem; }
    .gap-8 { gap: 2rem; }
    
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .items-center { align-items: center; }
    .items-start { align-items: flex-start; }
    .justify-between { justify-content: space-between; }
    .justify-center { justify-content: center; }
    
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-3 { margin-bottom: 0.75rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .mb-8 { margin-bottom: 2rem; }
    
    .p-2 { padding: 0.5rem; }
    .p-3 { padding: 0.75rem; }
    .p-4 { padding: 1rem; }
    .p-6 { padding: 1.5rem; }
    
    .text-sm { font-size: 0.875rem; }
    .text-xs { font-size: 0.75rem; }
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    
    .rounded { border-radius: 0.25rem; }
    .rounded-lg { border-radius: 0.5rem; }
    
    /* Hide elements not suitable for print */
    .no-print { display: none !important; }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;
  }

  /**
   * Get template-specific CSS optimized for PDF output
   */
  private static getTemplatePrintCSS(templateId: string): string {
    const templateSpecificCSS: Record<string, string> = {
      'technical': `
        .technical-template {
          font-family: 'JetBrains Mono', 'Courier New', monospace !important;
        }
        
        .technical-template h1 {
          font-family: 'JetBrains Mono', monospace !important;
          font-size: 24pt;
          font-weight: 700;
          color: #0d1117 !important;
          text-transform: uppercase;
          letter-spacing: 0.5pt;
        }
        
        .technical-template h2 {
          font-family: 'JetBrains Mono', monospace !important;
          font-size: 14pt;
          font-weight: 700;
          color: #0d1117 !important;
          text-transform: uppercase;
          letter-spacing: 0.25pt;
          border: 1px solid #0d1117;
          background: #f6f8fa;
          padding: 4pt 8pt;
          margin: 12pt 0 8pt 0;
        }
        
        .skill-item {
          background: #0d1117 !important;
          color: white !important;
          padding: 2pt 6pt;
          border-radius: 3pt;
          font-size: 8pt;
          font-family: 'JetBrains Mono', monospace !important;
          font-weight: 700;
          display: inline-block;
          margin: 1pt;
        }
        
        .contact-dot {
          width: 4pt;
          height: 4pt;
          border-radius: 2pt;
          background: #58a6ff !important;
          display: inline-block;
          margin-right: 6pt;
        }
        
        .stats-box {
          background: #f6f8fa !important;
          border: 1pt solid #d0d7de;
          border-radius: 4pt;
          padding: 8pt;
          margin-bottom: 12pt;
        }
        
        .experience-item {
          padding: 8pt;
          margin-bottom: 12pt;
          border-left: 4pt solid #58a6ff;
          background: #f6f8fa !important;
        }
        
        .bullet-point::before {
          content: "▶";
          color: #58a6ff;
          margin-right: 6pt;
        }
      `,
      
      'classic-professional': `
        .classic-template {
          font-family: 'Times New Roman', serif !important;
        }
        .classic-template h1 { font-size: 20pt; }
        .classic-template h2 { font-size: 14pt; border-bottom: 1pt solid #2c3e50; }
      `,
      
      'modern-minimal': `
        .modern-template {
          font-family: 'Inter', system-ui, sans-serif !important;
        }
        .modern-template h1 { font-size: 18pt; font-weight: 600; }
        .modern-template h2 { font-size: 13pt; font-weight: 600; }
      `,
      
      'executive': `
        .executive-template {
          font-family: Georgia, serif !important;
        }
        .executive-template h1 { font-size: 22pt; font-weight: 700; }
        .executive-template h2 { font-size: 15pt; font-weight: 700; }
      `,
      
      'creative': `
        .creative-template {
          font-family: Helvetica, sans-serif !important;
        }
        .creative-template h1 { font-size: 20pt; font-weight: 800; letter-spacing: -0.5pt; }
        .creative-template h2 { font-size: 14pt; font-weight: 700; }
      `
    };

    return templateSpecificCSS[templateId] || '';
  }
}