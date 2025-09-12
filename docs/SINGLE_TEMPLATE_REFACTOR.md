# Single Template System Refactor Guide

## Overview
This guide provides step-by-step instructions to refactor LaunchCV from a dual template system (React + @react-pdf) to a single React template system using HTML-to-PDF generation. This will ensure perfect consistency between template previews and PDF exports.

## Current Problem
- **Two separate template systems**: React components for preview, @react-pdf components for export
- **Visual inconsistencies**: Templates look different between preview and PDF
- **Maintenance overhead**: Changes must be made in two places
- **Limited capabilities**: @react-pdf has severe styling limitations

## Solution: Single React Template System
- Use React components for both preview AND PDF generation
- Convert HTML to PDF using Puppeteer
- Perfect visual consistency guaranteed
- Full CSS and component support in PDFs

---

## Phase 1: Setup HTML-to-PDF Infrastructure

### Step 1: Install Required Dependencies

```bash
npm install puppeteer react-dom
npm install --save-dev @types/puppeteer
```

### Step 2: Create HTML-to-PDF Service

Create file: `src/lib/pdf/html-pdf-generator.ts`

```typescript
import puppeteer from 'puppeteer';
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
  preferCSSPageSize: true
};

export class HTMLToPDFGenerator {
  private static async getBrowser() {
    return await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });
  }

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
    const htmlContent = renderToString(
      React.createElement(TemplateComponent, {
        resume,
        template,
        isPrintMode: true,
        scale: 1
      })
    );

    // Create complete HTML document with CSS
    const fullHTML = this.createFullHTMLDocument(htmlContent, template);

    let browser;
    try {
      browser = await this.getBrowser();
      const page = await browser.newPage();
      
      // Set content and wait for it to load
      await page.setContent(fullHTML, { waitUntil: 'networkidle0' });
      
      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: finalOptions.format,
        margin: finalOptions.margin,
        printBackground: finalOptions.printBackground,
        preferCSSPageSize: finalOptions.preferCSSPageSize
      });

      return pdfBuffer;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  static async generatePreviewBlob(
    resume: Resume,
    template: Template,
    options: Partial<HTMLToPDFOptions> = {}
  ): Promise<string> {
    const buffer = await this.generatePDF(resume, template, options);
    const blob = new Blob([buffer], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  }

  private static createFullHTMLDocument(content: string, template: Template): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume - ${template.name}</title>
  <style>
    /* Reset and base styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.4;
      color: #000;
      background: #fff;
    }

    /* Print-specific styles */
    @media print {
      html, body {
        width: 8.5in;
        height: 11in;
        margin: 0;
        padding: 0;
      }
      
      .no-print {
        display: none !important;
      }
      
      .print-break-before {
        page-break-before: always;
      }
      
      .print-break-after {
        page-break-after: always;
      }
      
      .print-break-inside-avoid {
        page-break-inside: avoid;
      }
    }

    /* Template-specific CSS will be injected here */
    ${this.getTemplatePrintCSS(template.id)}
  </style>
</head>
<body>
  ${content}
</body>
</html>`;
  }

  private static getTemplatePrintCSS(templateId: string): string {
    const commonCSS = `
      /* Common print styles */
      body {
        font-size: 11pt;
        line-height: 1.4;
      }
      
      h1, h2, h3, h4, h5, h6 {
        margin-bottom: 0.5em;
        page-break-after: avoid;
      }
      
      p {
        margin-bottom: 0.5em;
      }
      
      ul, ol {
        margin-bottom: 0.5em;
        padding-left: 1.5em;
      }
      
      .section {
        margin-bottom: 1em;
        page-break-inside: avoid;
      }
    `;

    const templateSpecificCSS = {
      'technical': `
        .technical-template {
          font-family: 'Courier New', monospace;
        }
        
        .tech-header {
          border-bottom: 2px solid #0d1117;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        
        .skill-item {
          background: #0d1117;
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 8pt;
          display: inline-block;
          margin: 2px;
        }
      `,
      'classic-professional': `
        .classic-template {
          font-family: 'Times New Roman', serif;
        }
      `,
      'modern-minimal': `
        .modern-template {
          font-family: system-ui, -apple-system, sans-serif;
        }
      `,
      'executive': `
        .executive-template {
          font-family: Georgia, serif;
        }
      `,
      'creative': `
        .creative-template {
          font-family: Helvetica, sans-serif;
        }
      `
    };

    return commonCSS + (templateSpecificCSS[templateId as keyof typeof templateSpecificCSS] || '');
  }
}
```

### Step 3: Create Print CSS Framework

Create file: `src/styles/print.css`

```css
/* Print-specific styles for PDF generation */

@media print {
  /* Page setup */
  @page {
    size: A4;
    margin: 0.5in;
  }

  /* Reset and base */
  * {
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  html, body {
    width: 8.5in;
    height: 11in;
    margin: 0;
    padding: 0;
    font-size: 11pt;
    line-height: 1.4;
  }

  /* Typography */
  h1 { font-size: 18pt; margin-bottom: 6pt; }
  h2 { font-size: 14pt; margin-bottom: 4pt; }
  h3 { font-size: 12pt; margin-bottom: 3pt; }
  p { margin-bottom: 6pt; }

  /* Layout utilities */
  .print-hidden { display: none !important; }
  .print-visible { display: block !important; }
  .print-break-before { page-break-before: always; }
  .print-break-after { page-break-after: always; }
  .print-break-inside-avoid { page-break-inside: avoid; }

  /* Spacing adjustments */
  .print-compact { margin: 2pt 0; }
  .print-normal { margin: 6pt 0; }
  .print-spacious { margin: 12pt 0; }

  /* Color adjustments for print */
  .print-force-black { color: #000 !important; }
  .print-force-white { color: #fff !important; background: #000 !important; }
}

/* Screen styles that work well in PDF */
.pdf-optimized {
  /* Styles that look good both on screen and in PDF */
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.4;
}

.pdf-section {
  margin-bottom: 1rem;
  page-break-inside: avoid;
}

.pdf-skill-tag {
  display: inline-block;
  padding: 2px 6px;
  margin: 1px;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 500;
}
```

---

## Phase 2: Enhance React Templates for PDF Mode

### Step 4: Update Template Renderer Interface

Modify `src/components/templates/renderers/index.ts`:

```typescript
// Update the renderer interface
export interface TemplateRendererProps {
  resume: Resume;
  template: Template;
  customizations?: TemplateCustomizations;
  className?: string;
  scale?: number;
  isPrintMode?: boolean; // Add this new prop
}
```

### Step 5: Update Technical Template for PDF Mode

Modify `src/components/templates/renderers/technical.tsx`:

```typescript
export function TechnicalRenderer({
  resume,
  template,
  customizations = {},
  className,
  scale = 1,
  isPrintMode = false // Add this parameter
}: TechnicalRendererProps) {
  // Apply customizations to template
  const appliedColorScheme = {
    ...template.colorScheme,
    ...customizations.colorScheme
  };

  // ... existing code ...

  return (
    <div 
      className={cn(
        'technical-template bg-white font-mono text-slate-900',
        'w-full max-w-[8.5in] mx-auto',
        isPrintMode ? 'min-h-[11in] print-optimized' : 'min-h-[600px]',
        isPrintMode ? 'p-6' : '', // Add print-specific padding
        className
      )}
      style={{
        transform: isPrintMode ? 'none' : `scale(${scale})`, // Don't scale in print mode
        transformOrigin: 'top left',
        fontFamily: appliedTypography.body.fontFamily,
        fontSize: isPrintMode ? '11pt' : appliedTypography.body.fontSize, // Print-friendly font size
        lineHeight: appliedTypography.body.lineHeight,
        backgroundColor: appliedColorScheme.background.primary
      }}
    >
      {/* Rest of the component remains the same */}
      {/* Just add print-friendly classes where needed */}
      
      <header className={cn("mb-8", isPrintMode && "print-break-inside-avoid")}>
        {/* ... existing header code ... */}
      </header>

      <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-8", isPrintMode && "print-section")}>
        {/* ... existing layout code ... */}
      </div>
    </div>
  );
}
```

### Step 6: Update All Other Templates

Repeat Step 5 for:
- `src/components/templates/renderers/classic-professional.tsx`
- `src/components/templates/renderers/modern-minimal.tsx`
- `src/components/templates/renderers/executive.tsx`
- `src/components/templates/renderers/creative.tsx`

Each should receive the `isPrintMode` parameter and apply appropriate print styles.

---

## Phase 3: Replace PDF Generator

### Step 7: Update PDF Generator Class

Replace `src/lib/pdf/generator.ts` content:

```typescript
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
      format: options.format === 'letter' ? 'Letter' : 'A4',
      margin: options.margins ? {
        top: `${options.margins.top}px`,
        right: `${options.margins.right}px`,
        bottom: `${options.margins.bottom}px`,
        left: `${options.margins.left}px`
      } : undefined
    });

    return new Blob([buffer], { type: 'application/pdf' });
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

  // ... keep all other existing utility methods
}
```

---

## Phase 4: Clean Up @react-pdf Dependencies

### Step 8: Remove PDF Template Files

Delete the following files:
- `src/components/pdf/templates/classic-professional-pdf.tsx`
- `src/components/pdf/templates/modern-minimal-pdf.tsx`
- `src/components/pdf/templates/executive-pdf.tsx`
- `src/components/pdf/templates/technical-pdf.tsx`
- `src/components/pdf/templates/creative-pdf.tsx`
- `src/components/pdf/base-pdf-document.tsx`

### Step 9: Update Package Dependencies

```bash
npm uninstall @react-pdf/renderer
```

### Step 10: Clean Up Imports

Remove any imports of @react-pdf components from:
- `src/lib/pdf/generator.ts` (already done in Step 7)
- Any other files that reference the deleted PDF templates

---

## Phase 5: Testing & Validation

### Step 11: Test Each Template

For each template (`technical`, `classic-professional`, `modern-minimal`, `executive`, `creative`):

1. **Preview Test**: Verify template renders correctly in builder
2. **PDF Test**: Generate PDF and verify it matches the preview
3. **Consistency Test**: Compare side-by-side for visual consistency

### Step 12: Performance Testing

1. Test PDF generation speed (should be ~2-5 seconds)
2. Test memory usage during PDF generation
3. Test concurrent PDF generation if needed

---

## Phase 6: Documentation and Deployment

### Step 13: Update Configuration

Add Puppeteer configuration to `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['puppeteer']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('puppeteer');
    }
    return config;
  }
};

module.exports = nextConfig;
```

### Step 14: Update README.md

Add section about the new single template system:

```markdown
## Template System

LaunchCV uses a single React template system for both preview and PDF generation:

- **Templates**: Located in `src/components/templates/renderers/`
- **PDF Generation**: Uses HTML-to-PDF via Puppeteer
- **Perfect Consistency**: Same React component renders both preview and PDF
- **Full CSS Support**: Complete styling capabilities in PDF exports

### Adding New Templates

1. Create new React component in `src/components/templates/renderers/`
2. Add `isPrintMode` parameter support
3. Register in `src/components/templates/renderers/index.ts`
4. Add to template definitions in `src/lib/templates/index.ts`

### PDF Optimization

Templates automatically optimize for PDF output when `isPrintMode=true`:
- Print-friendly font sizes and spacing
- Page break controls
- Color adjustments for printing
```

---

## Expected Results After Refactor

✅ **Perfect Consistency**: Preview and PDF will be pixel-perfect matches
✅ **Better Performance**: Faster PDF generation than @react-pdf
✅ **Full CSS Support**: No styling limitations in PDF exports  
✅ **Easier Maintenance**: Single template files to maintain
✅ **Better Developer Experience**: No need to learn @react-pdf constraints
✅ **Future-Proof**: Easy to add complex layouts and features

## Troubleshooting

### Common Issues

1. **Puppeteer Installation Issues**
   - Solution: Use `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true` and install system Chrome
   
2. **Fonts Not Rendering in PDF**
   - Solution: Add web fonts to the HTML document head
   
3. **CSS Not Applied in PDF**
   - Solution: Ensure styles are inline or in `<style>` tags, not external CSS files

4. **Memory Issues with Puppeteer**
   - Solution: Ensure browser instances are properly closed
   - Use `--no-sandbox` flag in production environments

### Performance Optimization

- Cache browser instances for multiple PDF generations
- Use browser pooling for high-volume usage
- Optimize CSS to reduce PDF file size

---

## Migration Checklist

- [ ] Install Puppeteer and react-dom dependencies
- [ ] Create HTML-to-PDF generator service
- [ ] Create print CSS framework
- [ ] Update all 5 template renderers with `isPrintMode` support
- [ ] Replace PDF generator class
- [ ] Remove @react-pdf dependencies and files
- [ ] Test all templates in both modes
- [ ] Update Next.js configuration
- [ ] Update documentation
- [ ] Deploy and validate in production

---

**Estimated Time: 4-6 hours**  
**Difficulty: Intermediate**  
**Impact: High - Eliminates template consistency issues permanently**