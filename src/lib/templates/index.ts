import type { Template } from '../types/template';

// Base template configurations
const baseTemplateConfig = {
  isAtsCompatible: true,
  isPrintFriendly: true,
  isMobileResponsive: true,
  metadata: {
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    version: '1.0.0',
    author: 'LaunchCV Team',
    popularity: 0,
    rating: 5,
    downloadCount: 0,
    tags: ['professional', 'modern', 'clean'],
    industry: ['technology', 'business', 'healthcare', 'education'],
    experience: 'all' as const
  }
};

const baseSectionConfigs = [
  {
    type: 'experience' as const,
    displayName: 'Work Experience',
    isRequired: true,
    defaultVisible: true,
    formatting: {
      style: 'list' as const,
      showIcons: false,
      showDates: true,
      showLocation: true,
      dateFormat: 'short' as const,
      bulletStyle: 'bullet' as const
    }
  },
  {
    type: 'education' as const,
    displayName: 'Education',
    isRequired: false,
    defaultVisible: true,
    formatting: {
      style: 'list' as const,
      showIcons: false,
      showDates: true,
      showLocation: true,
      dateFormat: 'short' as const,
      bulletStyle: 'bullet' as const
    }
  },
  {
    type: 'skills' as const,
    displayName: 'Skills',
    isRequired: false,
    defaultVisible: true,
    formatting: {
      style: 'grid' as const,
      showIcons: false,
      showDates: false,
      showLocation: false,
      dateFormat: 'short' as const,
      bulletStyle: 'none' as const
    }
  },
  {
    type: 'projects' as const,
    displayName: 'Projects',
    isRequired: false,
    defaultVisible: true,
    formatting: {
      style: 'cards' as const,
      showIcons: false,
      showDates: true,
      showLocation: false,
      dateFormat: 'short' as const,
      bulletStyle: 'bullet' as const
    }
  },
  {
    type: 'certifications' as const,
    displayName: 'Certifications',
    isRequired: false,
    defaultVisible: true,
    formatting: {
      style: 'list' as const,
      showIcons: false,
      showDates: true,
      showLocation: false,
      dateFormat: 'short' as const,
      bulletStyle: 'bullet' as const
    }
  }
];

// Template 1: Classic Professional
export const classicProfessionalTemplate: Template = {
  id: 'classic-professional',
  name: 'Classic Professional',
  description: 'A traditional, ATS-friendly resume template perfect for conservative industries and corporate environments.',
  category: 'professional',
  previewImage: '/templates/classic-professional-preview.png',
  thumbnailImage: '/templates/classic-professional-thumb.png',
  difficulty: 'beginner',
  colorScheme: {
    primary: '#2c3e50',     // Navy blue
    secondary: '#34495e',    // Dark slate
    accent: '#3498db',       // Blue accent
    text: {
      primary: '#2c3e50',
      secondary: '#5d6d7e',
      muted: '#7f8c8d'
    },
    background: {
      primary: '#ffffff',
      secondary: '#f8f9fa',
      paper: '#ffffff'
    },
    borders: '#e9ecef',
    links: '#3498db'
  },
  typography: {
    headings: {
      fontFamily: 'Times New Roman, serif',
      fontWeight: '700',
      letterSpacing: '0'
    },
    body: {
      fontFamily: 'Times New Roman, serif',
      fontSize: '11pt',
      lineHeight: '1.4'
    },
    small: {
      fontSize: '9pt',
      fontWeight: '400'
    }
  },
  layout: {
    columns: 1,
    spacing: 'normal',
    headerStyle: 'standard',
    sectionStyle: 'simple',
    margins: {
      top: '0.75in',
      right: '0.75in',
      bottom: '0.75in',
      left: '0.75in'
    }
  },
  sections: baseSectionConfigs,
  customization: {
    colors: {
      canChangeColors: true,
      availableColorSchemes: []
    },
    fonts: {
      canChangeFonts: false,
      availableFonts: []
    },
    layout: {
      canChangeLayout: false,
      availableLayouts: []
    },
    sections: {
      canReorderSections: true,
      canHideSections: true,
      canCustomizeSections: false
    }
  },
  ...baseTemplateConfig,
  metadata: {
    ...baseTemplateConfig.metadata,
    tags: ['professional', 'traditional', 'ats-friendly', 'corporate'],
    industry: ['finance', 'law', 'government', 'healthcare']
  }
};

// Template 2: Modern Minimal
export const modernMinimalTemplate: Template = {
  id: 'modern-minimal',
  name: 'Modern Minimal',
  description: 'A clean, contemporary design with subtle styling and plenty of white space for a modern professional look.',
  category: 'modern',
  previewImage: '/templates/modern-minimal-preview.png',
  thumbnailImage: '/templates/modern-minimal-thumb.png',
  difficulty: 'beginner',
  colorScheme: {
    primary: '#1a202c',     // Dark gray
    secondary: '#2d3748',    // Medium gray
    accent: '#4299e1',       // Blue accent
    text: {
      primary: '#1a202c',
      secondary: '#4a5568',
      muted: '#718096'
    },
    background: {
      primary: '#ffffff',
      secondary: '#f7fafc',
      paper: '#ffffff'
    },
    borders: '#e2e8f0',
    links: '#4299e1'
  },
  typography: {
    headings: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: '600',
      letterSpacing: '-0.025em'
    },
    body: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '10pt',
      lineHeight: '1.5'
    },
    small: {
      fontSize: '9pt',
      fontWeight: '400'
    }
  },
  layout: {
    columns: 1,
    spacing: 'relaxed',
    headerStyle: 'minimal',
    sectionStyle: 'divided',
    margins: {
      top: '1in',
      right: '1in',
      bottom: '1in',
      left: '1in'
    }
  },
  sections: baseSectionConfigs.map(section => ({
    ...section,
    formatting: {
      ...section.formatting,
      bulletStyle: 'dash' as const
    }
  })),
  customization: {
    colors: {
      canChangeColors: true,
      availableColorSchemes: []
    },
    fonts: {
      canChangeFonts: true,
      availableFonts: []
    },
    layout: {
      canChangeLayout: true,
      availableLayouts: []
    },
    sections: {
      canReorderSections: true,
      canHideSections: true,
      canCustomizeSections: true
    }
  },
  ...baseTemplateConfig,
  metadata: {
    ...baseTemplateConfig.metadata,
    tags: ['modern', 'minimal', 'clean', 'contemporary'],
    industry: ['technology', 'design', 'marketing', 'consulting']
  }
};

// Template 3: Executive Premium
export const executiveTemplate: Template = {
  id: 'executive',
  name: 'Executive Premium',
  description: 'A bold, authoritative design with prominent header and premium styling for senior leadership positions.',
  category: 'executive',
  previewImage: '/templates/executive-preview.png',
  thumbnailImage: '/templates/executive-thumb.png',
  difficulty: 'intermediate',
  colorScheme: {
    primary: '#1e293b',     // Slate
    secondary: '#475569',    // Slate gray
    accent: '#dc2626',       // Red accent
    text: {
      primary: '#0f172a',
      secondary: '#334155',
      muted: '#64748b'
    },
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      paper: '#ffffff'
    },
    borders: '#e2e8f0',
    links: '#dc2626'
  },
  typography: {
    headings: {
      fontFamily: 'Georgia, serif',
      fontWeight: '700',
      letterSpacing: '0'
    },
    body: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '11pt',
      lineHeight: '1.4'
    },
    small: {
      fontSize: '9pt',
      fontWeight: '500'
    }
  },
  layout: {
    columns: 1,
    spacing: 'normal',
    headerStyle: 'prominent',
    sectionStyle: 'boxed',
    margins: {
      top: '0.75in',
      right: '0.75in',
      bottom: '0.75in',
      left: '0.75in'
    }
  },
  sections: baseSectionConfigs,
  customization: {
    colors: {
      canChangeColors: true,
      availableColorSchemes: []
    },
    fonts: {
      canChangeFonts: false,
      availableFonts: []
    },
    layout: {
      canChangeLayout: false,
      availableLayouts: []
    },
    sections: {
      canReorderSections: true,
      canHideSections: true,
      canCustomizeSections: false
    }
  },
  ...baseTemplateConfig,
  metadata: {
    ...baseTemplateConfig.metadata,
    tags: ['executive', 'premium', 'bold', 'leadership'],
    industry: ['finance', 'consulting', 'executive', 'management'],
    experience: 'senior' as const
  }
};

// Template 4: Technical Skills-focused
export const technicalTemplate: Template = {
  id: 'technical',
  name: 'Technical Developer',
  description: 'Skills-focused template with GitHub integration, perfect for developers and technical professionals.',
  category: 'technical',
  previewImage: '/templates/technical-preview.png',
  thumbnailImage: '/templates/technical-thumb.png',
  difficulty: 'intermediate',
  colorScheme: {
    primary: '#0d1117',     // GitHub dark
    secondary: '#21262d',    // GitHub gray
    accent: '#58a6ff',       // GitHub blue
    text: {
      primary: '#0d1117',
      secondary: '#656d76',
      muted: '#8b949e'
    },
    background: {
      primary: '#ffffff',
      secondary: '#f6f8fa',
      paper: '#ffffff'
    },
    borders: '#d0d7de',
    links: '#0969da'
  },
  typography: {
    headings: {
      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", monospace',
      fontWeight: '700',
      letterSpacing: '0'
    },
    body: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '10pt',
      lineHeight: '1.5'
    },
    small: {
      fontSize: '9pt',
      fontWeight: '400'
    }
  },
  layout: {
    columns: 2,
    spacing: 'compact',
    headerStyle: 'tech',
    sectionStyle: 'cards',
    margins: {
      top: '0.5in',
      right: '0.5in',
      bottom: '0.5in',
      left: '0.5in'
    }
  },
  sections: baseSectionConfigs.map(section => ({
    ...section,
    formatting: {
      ...section.formatting,
      showIcons: true,
      bulletStyle: 'arrow' as const
    }
  })),
  customization: {
    colors: {
      canChangeColors: true,
      availableColorSchemes: []
    },
    fonts: {
      canChangeFonts: true,
      availableFonts: []
    },
    layout: {
      canChangeLayout: true,
      availableLayouts: []
    },
    sections: {
      canReorderSections: true,
      canHideSections: true,
      canCustomizeSections: true
    }
  },
  ...baseTemplateConfig,
  metadata: {
    ...baseTemplateConfig.metadata,
    tags: ['technical', 'developer', 'github', 'skills-focused'],
    industry: ['technology', 'software', 'engineering', 'startups'],
    experience: 'all' as const
  }
};

// Template 5: Creative Unique
export const creativeTemplate: Template = {
  id: 'creative',
  name: 'Creative Portfolio',
  description: 'Unique layout with personality and visual elements, perfect for creative professionals and designers.',
  category: 'creative',
  previewImage: '/templates/creative-preview.png',
  thumbnailImage: '/templates/creative-thumb.png',
  difficulty: 'advanced',
  colorScheme: {
    primary: '#6366f1',     // Indigo
    secondary: '#8b5cf6',    // Purple
    accent: '#f59e0b',       // Amber
    text: {
      primary: '#111827',
      secondary: '#4b5563',
      muted: '#9ca3af'
    },
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      paper: '#ffffff'
    },
    borders: '#e5e7eb',
    links: '#6366f1'
  },
  typography: {
    headings: {
      fontFamily: 'Helvetica',
      fontWeight: '800',
      letterSpacing: '-0.05em'
    },
    body: {
      fontFamily: 'Helvetica',
      fontSize: '10pt',
      lineHeight: '1.6'
    },
    small: {
      fontSize: '9pt',
      fontWeight: '500'
    }
  },
  layout: {
    columns: 2,
    spacing: 'relaxed',
    headerStyle: 'creative',
    sectionStyle: 'artistic',
    margins: {
      top: '0.75in',
      right: '0.75in',
      bottom: '0.75in',
      left: '0.75in'
    }
  },
  sections: baseSectionConfigs.map(section => ({
    ...section,
    formatting: {
      ...section.formatting,
      showIcons: true,
      bulletStyle: 'custom' as const
    }
  })),
  customization: {
    colors: {
      canChangeColors: true,
      availableColorSchemes: []
    },
    fonts: {
      canChangeFonts: true,
      availableFonts: []
    },
    layout: {
      canChangeLayout: true,
      availableLayouts: []
    },
    sections: {
      canReorderSections: true,
      canHideSections: true,
      canCustomizeSections: true
    }
  },
  ...baseTemplateConfig,
  metadata: {
    ...baseTemplateConfig.metadata,
    tags: ['creative', 'unique', 'artistic', 'portfolio'],
    industry: ['design', 'creative', 'marketing', 'media'],
    experience: 'all' as const
  }
};

// Export all templates
export const templates: Template[] = [
  classicProfessionalTemplate,
  modernMinimalTemplate,
  executiveTemplate,
  technicalTemplate,
  creativeTemplate
];

// Utility functions
export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: Template['category']): Template[] => {
  return templates.filter(template => template.category === category);
};

export const getDefaultTemplate = (): Template => {
  return classicProfessionalTemplate;
};

export default templates;