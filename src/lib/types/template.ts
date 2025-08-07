import type { Resume } from './index';

// Enhanced template types for LaunchCV
export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'modern' | 'creative' | 'technical' | 'executive';
  previewImage: string;
  thumbnailImage: string;
  isAtsCompatible: boolean;
  isPrintFriendly: boolean;
  isMobileResponsive: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  colorScheme: TemplateColorScheme;
  typography: TemplateTypography;
  layout: TemplateLayout;
  sections: TemplateSectionConfig[];
  customization: TemplateCustomization;
  metadata: TemplateMetadata;
}

export interface TemplateColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  background: {
    primary: string;
    secondary: string;
    paper: string;
  };
  borders: string;
  links: string;
}

export interface TemplateTypography {
  headings: {
    fontFamily: string;
    fontWeight: string;
    letterSpacing: string;
  };
  body: {
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
  };
  small: {
    fontSize: string;
    fontWeight: string;
  };
}

export interface TemplateLayout {
  columns: 1 | 2 | 3;
  spacing: 'compact' | 'normal' | 'relaxed';
  headerStyle: 'minimal' | 'standard' | 'prominent' | 'creative';
  sectionStyle: 'simple' | 'divided' | 'boxed' | 'timeline';
  margins: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
}

export interface TemplateSectionConfig {
  type: 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'custom';
  displayName: string;
  isRequired: boolean;
  defaultVisible: boolean;
  maxItems?: number;
  formatting: SectionFormatting;
}

export interface SectionFormatting {
  style: 'list' | 'grid' | 'timeline' | 'cards' | 'compact';
  showIcons: boolean;
  showDates: boolean;
  showLocation: boolean;
  dateFormat: 'short' | 'long' | 'numeric';
  bulletStyle: 'bullet' | 'dash' | 'arrow' | 'none';
}

export interface TemplateCustomization {
  colors: {
    canChangeColors: boolean;
    availableColorSchemes: TemplateColorScheme[];
  };
  fonts: {
    canChangeFonts: boolean;
    availableFonts: TemplateTypography[];
  };
  layout: {
    canChangeLayout: boolean;
    availableLayouts: Partial<TemplateLayout>[];
  };
  sections: {
    canReorderSections: boolean;
    canHideSections: boolean;
    canCustomizeSections: boolean;
  };
}

export interface TemplateMetadata {
  createdAt: Date;
  updatedAt: Date;
  version: string;
  author: string;
  popularity: number;
  rating: number;
  downloadCount: number;
  tags: string[];
  industry: string[];
  experience: 'entry-level' | 'mid-level' | 'senior' | 'executive' | 'all';
}

// Template application and rendering
export interface TemplateRenderer {
  id: string;
  template: Template;
  resume: Resume;
  customizations?: TemplateCustomizations;
}

export interface TemplateCustomizations {
  colorScheme?: Partial<TemplateColorScheme>;
  typography?: Partial<TemplateTypography>;
  layout?: Partial<TemplateLayout>;
  sectionOrder?: string[];
  hiddenSections?: string[];
}

// Template preview and selection
export interface TemplatePreviewProps {
  template: Template;
  sampleData?: Resume;
  customizations?: TemplateCustomizations;
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
  showInfo?: boolean;
}

export interface TemplateGridProps {
  templates: Template[];
  selectedTemplate?: string;
  onTemplateSelect: (templateId: string) => void;
  category?: Template['category'];
  searchTerm?: string;
  sortBy?: 'name' | 'popularity' | 'rating' | 'recent';
}

// Template store types
export interface TemplateState {
  templates: Template[];
  selectedTemplateId: string | null;
  templateCategories: Template['category'][];
  isLoading: boolean;
  searchTerm: string;
  selectedCategory: Template['category'] | null;
  sortBy: 'name' | 'popularity' | 'rating' | 'recent';
}

export interface TemplateActions {
  // Template management
  loadTemplates: () => Promise<void>;
  selectTemplate: (templateId: string) => void;
  getTemplate: (templateId: string) => Template | null;
  getTemplatesByCategory: (category: Template['category']) => Template[];
  
  // Search and filter
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: Template['category'] | null) => void;
  setSortBy: (sortBy: TemplateState['sortBy']) => void;
  
  // Customization
  applyCustomizations: (templateId: string, customizations: TemplateCustomizations) => void;
  resetCustomizations: (templateId: string) => void;
}

export type TemplateStore = TemplateState & TemplateActions;