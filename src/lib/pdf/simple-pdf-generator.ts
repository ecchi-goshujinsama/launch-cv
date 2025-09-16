import type { ResumeData } from '@/lib/types';

export interface ExportOptions {
  template: string;
  settings?: {
    colorScheme?: string;
    fontSize?: string;
    spacing?: string;
  };
}

// Simple PDF generation using browser's built-in PDF capabilities
export const generatePDF = async (resume: ResumeData, options: ExportOptions): Promise<Blob> => {
  try {
    // Create HTML representation of the resume
    const htmlContent = generateHTMLResume(resume, options);
    
    // Create a temporary iframe to render the HTML
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.width = '8.5in';
    iframe.style.height = '11in';
    
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      throw new Error('Failed to create PDF document');
    }
    
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();
    
    // Wait for content to render
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Use window.print() API to create PDF
    const printWindow = iframe.contentWindow;
    if (!printWindow) {
      document.body.removeChild(iframe);
      throw new Error('Failed to access print window');
    }
    
    // For now, return a simple blob with HTML content
    // In a real implementation, you'd use a PDF library or server-side generation
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    document.body.removeChild(iframe);
    return blob;
    
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

function generateHTMLResume(resume: ResumeData, options: ExportOptions): string {
  const { settings = {} } = options;
  const { colorScheme = 'blue' } = settings;
  
  const colors = {
    blue: { primary: '#2563eb', secondary: '#1e40af' },
    purple: { primary: '#7c3aed', secondary: '#5b21b6' },
    orange: { primary: '#f97316', secondary: '#ea580c' }
  };
  
  const themeColors = colors[colorScheme as keyof typeof colors] || colors.blue;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${resume.personalInfo.fullName} - Resume</title>
      <style>
        @page {
          size: A4;
          margin: 0.5in;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.4;
          color: #1f2937;
          margin: 0;
          padding: 0;
        }
        
        .header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 2px solid ${themeColors.primary};
          padding-bottom: 15px;
        }
        
        .name {
          font-size: 28px;
          font-weight: bold;
          color: ${themeColors.primary};
          margin: 0 0 8px 0;
        }
        
        .contact-info {
          font-size: 12px;
          color: #6b7280;
          margin: 5px 0;
        }
        
        .section {
          margin: 20px 0;
        }
        
        .section-title {
          font-size: 14px;
          font-weight: bold;
          color: ${themeColors.primary};
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 5px;
          margin-bottom: 12px;
        }
        
        .job-title {
          font-size: 12px;
          font-weight: bold;
          color: #1f2937;
          margin: 8px 0 2px 0;
        }
        
        .company {
          font-size: 11px;
          font-weight: bold;
          color: ${themeColors.secondary};
          margin-bottom: 2px;
        }
        
        .date-location {
          font-size: 9px;
          color: #6b7280;
          margin-bottom: 5px;
        }
        
        .description {
          font-size: 10px;
          color: #374151;
          margin-bottom: 10px;
        }
        
        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
        
        .skill-tag {
          background-color: ${themeColors.primary};
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 9px;
          margin-bottom: 3px;
        }
        
        .subsection {
          margin-bottom: 15px;
        }
      </style>
    </head>
    <body>
      <!-- Header -->
      <div class="header">
        <h1 class="name">${resume.personalInfo.fullName}</h1>
        <div class="contact-info">
          ${resume.personalInfo.email}
          ${resume.personalInfo.phone ? ` • ${resume.personalInfo.phone}` : ''}
          ${resume.personalInfo.location ? ` • ${resume.personalInfo.location}` : ''}
        </div>
      </div>
      
      <!-- Professional Summary -->
      ${resume.personalInfo.summary ? `
        <div class="section">
          <h2 class="section-title">Professional Summary</h2>
          <p class="description">${resume.personalInfo.summary}</p>
        </div>
      ` : ''}
      
      <!-- Experience -->
      ${resume.sections.experience && resume.sections.experience.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Experience</h2>
          ${resume.sections.experience.map(exp => `
            <div class="subsection">
              <div class="job-title">${exp.title}</div>
              <div class="company">${exp.company}</div>
              <div class="date-location">
                ${exp.startDate} - ${exp.endDate || 'Present'}
                ${exp.location ? ` • ${exp.location}` : ''}
              </div>
              ${exp.description ? `<p class="description">${exp.description}</p>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <!-- Education -->
      ${resume.sections.education && resume.sections.education.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Education</h2>
          ${resume.sections.education.map(edu => `
            <div class="subsection">
              <div class="job-title">
                ${edu.degree}${edu.field ? ` in ${edu.field}` : ''}
              </div>
              <div class="company">${edu.institution}</div>
              <div class="date-location">
                ${edu.startDate} - ${edu.endDate}
                ${edu.location ? ` • ${edu.location}` : ''}
                ${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <!-- Skills -->
      ${resume.sections.skills && resume.sections.skills.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skills-container">
            ${resume.sections.skills.slice(0, 20).map(skill => `
              <span class="skill-tag">${skill}</span>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      <!-- Projects -->
      ${resume.sections.projects && resume.sections.projects.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Projects</h2>
          ${resume.sections.projects.map(project => `
            <div class="subsection">
              <div class="job-title">${project.name}</div>
              ${project.url ? `<div class="date-location">${project.url}</div>` : ''}
              ${project.description ? `<p class="description">${project.description}</p>` : ''}
              ${project.technologies && project.technologies.length > 0 ? `
                <div class="skills-container">
                  ${project.technologies.slice(0, 10).map(tech => `
                    <span class="skill-tag">${tech}</span>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
    </body>
    </html>
  `;
}

// Helper function to get template-specific settings
export const getTemplateDefaults = (templateId: string) => {
  const defaults = {
    'modern-professional': {
      colorScheme: 'blue' as const,
      fontSize: 'medium' as const,
      spacing: 'normal' as const,
    },
    'technical': {
      colorScheme: 'purple' as const,
      fontSize: 'medium' as const,
      spacing: 'compact' as const,
    },
    'classic-formal': {
      colorScheme: 'blue' as const,
      fontSize: 'medium' as const,
      spacing: 'spacious' as const,
    },
    'creative-modern': {
      colorScheme: 'orange' as const,
      fontSize: 'medium' as const,
      spacing: 'normal' as const,
    },
  };

  return defaults[templateId as keyof typeof defaults] || defaults['modern-professional'];
};
