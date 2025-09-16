import puppeteer, { Browser, Page } from 'puppeteer';
import { tmpdir } from 'os';
import { join } from 'path';
import type { Resume, Template } from '../types';


// Dynamic imports for server-side only
async function loadServerDependencies() {
  if (typeof window !== 'undefined') {
    throw new Error('This function can only be called on the server');
  }

  const { renderToString } = await import('react-dom/server');
  const React = await import('react');
  const { getTemplateRenderer } = await import('@/components/templates/renderers');

  return { renderToString, React, getTemplateRenderer };
}

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
      // Create a temporary directory for Chrome user data to avoid permission issues
      const userDataDir = join(tmpdir(), `puppeteer_chrome_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

      this.browserInstance = await puppeteer.launch({
        headless: true,
        userDataDir,
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
   * Generate PDF from template data
   */
  static async generatePDF(
    resume: Resume,
    template: Template,
    options: Partial<HTMLToPDFOptions> = {}
  ): Promise<Buffer> {
    const finalOptions = { ...DEFAULT_PDF_OPTIONS, ...options };

    // Generate HTML content using React server-side rendering
    const htmlContent = await this.generateHTMLFromResume(resume, template);

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
    if (typeof window !== 'undefined') {
      throw new Error('generatePreviewBlob must be called server-side');
    }
    const buffer = await this.generatePDF(resume, template, options);
    const blob = new Blob([buffer.buffer], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  }

  /**
   * Generate HTML content using React server-side rendering
   */
  private static async generateHTMLFromResume(resume: Resume, template: Template): Promise<string> {
    // Ensure we're on the server side
    if (typeof window !== 'undefined') {
      throw new Error('PDF generation must be done server-side only');
    }

    try {
      // Load server dependencies dynamically
      const { renderToString, React, getTemplateRenderer } = await loadServerDependencies();

      // Get the appropriate template renderer
      const TemplateRenderer = getTemplateRenderer(template.id);

      if (!TemplateRenderer) {
        throw new Error(`Template renderer not found for template: ${template.id}`);
      }

      // Render the React component to HTML string using server-side rendering
      const reactElement = React.createElement(TemplateRenderer, {
        resume,
        template,
        isPrintMode: true, // Enable print-optimized mode
        scale: 1,
        customizations: {}
      });

      return renderToString(reactElement);
    } catch (error) {
      console.error('Error rendering template:', error);

      // Fallback to basic template if React rendering fails
      return `
        <div class="pdf-optimized fallback-template" style="font-family: Inter, sans-serif; max-width: 8.5in; margin: 0 auto; padding: 0.5in; background: white; color: black;">
          <header style="margin-bottom: 2rem;">
            <h1 style="font-size: 24pt; margin-bottom: 0.5rem; color: #000;">${resume.personalInfo.fullName}</h1>
            <div style="margin-bottom: 1rem; color: #666;">
              ${resume.personalInfo.email ? `<span>${resume.personalInfo.email}</span>` : ''}
              ${resume.personalInfo.phone ? ` • ${resume.personalInfo.phone}` : ''}
              ${resume.personalInfo.location ? ` • ${resume.personalInfo.location}` : ''}
            </div>
            ${resume.personalInfo.summary ? `<p style="margin-bottom: 1rem; line-height: 1.4;">${resume.personalInfo.summary}</p>` : ''}
          </header>

          ${this.generateFallbackSections(resume)}
        </div>
      `;
    }
  }

  /**
   * Create complete HTML document with embedded CSS and fonts for PDF rendering
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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Georgia:wght@400;700&family=Helvetica:wght@400;700;800&display=swap" rel="stylesheet">

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

    /* Typography optimizations for PDF */
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
      margin-bottom: 0.5em;
      page-break-inside: avoid;
    }

    .pdf-section {
      margin-bottom: 0.75em;
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

    /* Tailwind-like utilities for PDF rendering */
    .bg-white { background-color: white; }
    .font-sans { font-family: 'Inter', system-ui, sans-serif; }
    .text-gray-900 { color: #111827; }
    .w-full { width: 100%; }
    .max-w-\[8\.5in\] { max-width: 8.5in; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .min-h-\[11in\] { min-height: 11in; }
    .print-optimized { /* handled above */ }
    .p-6 { padding: 0.5rem; }

    .mb-12 { margin-bottom: 1rem; }
    .mb-6 { margin-bottom: 0.75rem; }
    .mb-3 { margin-bottom: 0.5rem; }
    .mb-4 { margin-bottom: 0.5rem; }
    .mb-8 { margin-bottom: 1rem; }
    .mb-2 { margin-bottom: 0.25rem; }
    .mb-1 { margin-bottom: 0.125rem; }
    .mt-1 { margin-top: 0.25rem; }
    .mt-2 { margin-top: 0.5rem; }
    .mr-3 { margin-right: 0.75rem; }
    .mr-4 { margin-right: 1rem; }

    .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
    .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
    .text-base { font-size: 1rem; line-height: 1.5rem; }
    .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
    .text-xs { font-size: 0.75rem; line-height: 1rem; }

    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    .font-bold { font-weight: 700; }

    .tracking-tight { letter-spacing: -0.025em; }
    .tracking-wide { letter-spacing: 0.025em; }

    .grid { display: grid; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .gap-4 { gap: 1rem; }
    .gap-6 { gap: 1.5rem; }
    .gap-8 { gap: 1.5rem; }
    .gap-2 { gap: 0.5rem; }

    .lg\\:col-span-1 { grid-column: span 1 / span 1; }
    .lg\\:col-span-3 { grid-column: span 3 / span 3; }

    .space-y-1 > * + * { margin-top: 0.125rem; }
    .space-y-2 > * + * { margin-top: 0.25rem; }
    .space-y-4 > * + * { margin-top: 0.5rem; }
    .space-y-6 > * + * { margin-top: 0.75rem; }
    .space-y-8 > * + * { margin-top: 1rem; }
    .space-y-10 > * + * { margin-top: 1.25rem; }

    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .flex-wrap { flex-wrap: wrap; }
    .items-center { align-items: center; }
    .items-start { align-items: flex-start; }
    .justify-between { justify-content: space-between; }
    .justify-center { justify-content: center; }
    .flex-1 { flex: 1 1 0%; }
    .flex-shrink-0 { flex-shrink: 0; }

    .border-l-4 { border-left-width: 4px; }
    .pl-6 { padding-left: 1.5rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
    .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
    .p-8 { padding: 2rem; }

    .leading-relaxed { line-height: 1.625; }
    .leading-relaxed { line-height: 1.625; }

    .inline-block { display: inline-block; }
    .block { display: block; }

    .w-2 { width: 0.5rem; }
    .h-2 { height: 0.5rem; }
    .h-px { height: 1px; }

    .rounded-full { border-radius: 9999px; }
    .rounded { border-radius: 0.25rem; }

    .border { border-width: 1px; }

    .relative { position: relative; }

    .hover\\:underline:hover { text-decoration: underline; }

    .text-right { text-align: right; }

    /* Hide elements not suitable for print */
    .no-print { display: none !important; }

    /* Template-specific styles */
    .modern-minimal-template h1 {
      font-size: 2.25rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
      letter-spacing: -0.025em;
    }

    .modern-minimal-template h2 {
      font-size: 1.25rem;
      font-weight: 500;
      letter-spacing: 0.025em;
      margin-right: 1rem;
    }

    .modern-minimal-template h3 {
      font-size: 1.125rem;
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    .modern-minimal-template h4 {
      font-size: 1rem;
      font-weight: 500;
      margin-bottom: 0.75rem;
    }

    /* Responsive grid adjustments for PDF */
    @media print {
      .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
      .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .lg\\:col-span-1 { grid-column: span 1 / span 1; }
      .lg\\:col-span-3 { grid-column: span 3 / span 3; }
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;
  }

  /**
   * Generate fallback sections when React rendering fails
   */
  private static generateFallbackSections(resume: Resume): string {
    const sections = [];

    // Experience section
    const experienceSection = resume.sections?.find(s => s.type === 'experience');
    const experienceItems = experienceSection?.items?.filter(item => item.type === 'experience') || [];
    if (experienceItems.length > 0) {
      sections.push(`
        <section style="margin-bottom: 2rem; page-break-inside: avoid;">
          <h2 style="font-size: 18pt; margin-bottom: 1rem; color: #000; border-bottom: 2px solid #2563eb; padding-bottom: 0.5rem;">Work Experience</h2>
          ${experienceItems.map((exp: any) => `
            <div style="margin-bottom: 1.5rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <h3 style="font-size: 14pt; font-weight: 600; color: #000;">${exp.position || exp.title || ''}</h3>
                <span style="font-size: 10pt; color: #666;">${exp.startDate} - ${exp.endDate || 'Present'}</span>
              </div>
              <h4 style="font-size: 12pt; font-weight: 500; color: #2563eb; margin-bottom: 0.75rem;">${exp.company}</h4>
              ${exp.location ? `<p style="font-size: 10pt; color: #666; margin-bottom: 0.5rem;">${exp.location}</p>` : ''}
              ${exp.description?.length ? `
                <ul style="margin-bottom: 0.75rem; padding-left: 1.5rem;">
                  ${exp.description.map((item: string) => `<li style="margin-bottom: 0.25rem; line-height: 1.4;">${item}</li>`).join('')}
                </ul>
              ` : ''}
              ${exp.skills?.length ? `
                <div style="margin-top: 0.5rem;">
                  ${exp.skills.map((skill: string) => `<span style="display: inline-block; background: #f3f4f6; color: #374151; padding: 0.25rem 0.5rem; margin: 0.125rem; border-radius: 0.25rem; font-size: 9pt;">${skill}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </section>
      `);
    }

    // Education section
    const educationSection = resume.sections?.find(s => s.type === 'education');
    const educationItems = educationSection?.items?.filter(item => item.type === 'education') || [];
    if (educationItems.length > 0) {
      sections.push(`
        <section style="margin-bottom: 2rem; page-break-inside: avoid;">
          <h2 style="font-size: 18pt; margin-bottom: 1rem; color: #000; border-bottom: 2px solid #2563eb; padding-bottom: 0.5rem;">Education</h2>
          ${educationItems.map((edu: any) => `
            <div style="margin-bottom: 1rem;">
              <h3 style="font-size: 14pt; font-weight: 600; color: #000;">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</h3>
              <h4 style="font-size: 12pt; font-weight: 500; color: #2563eb;">${edu.institution}</h4>
              <div style="font-size: 10pt; color: #666;">
                ${edu.endDate ? `<span>${edu.endDate}</span>` : ''}
                ${edu.location ? `<span> • ${edu.location}</span>` : ''}
                ${edu.gpa ? `<span> • GPA: ${edu.gpa}</span>` : ''}
              </div>
            </div>
          `).join('')}
        </section>
      `);
    }

    // Skills section
    const skillsSection = resume.sections?.find(s => s.type === 'skills');
    const skillsItems = skillsSection?.items?.filter(item => item.type === 'skills') || [];
    if (skillsItems.length > 0) {
      sections.push(`
        <section style="margin-bottom: 2rem; page-break-inside: avoid;">
          <h2 style="font-size: 18pt; margin-bottom: 1rem; color: #000; border-bottom: 2px solid #2563eb; padding-bottom: 0.5rem;">Skills</h2>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
            ${skillsItems.map((skillCategory: any) => `
              <div>
                <h3 style="font-size: 12pt; font-weight: 600; color: #000; margin-bottom: 0.5rem;">${skillCategory.category || 'Skills'}</h3>
                <div>
                  ${skillCategory.skills?.map((skill: string) => `<span style="display: inline-block; background: #2563eb; color: white; padding: 0.25rem 0.5rem; margin: 0.125rem; border-radius: 0.25rem; font-size: 9pt;">${skill}</span>`).join('') || ''}
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      `);
    }

    return sections.join('');
  }
}