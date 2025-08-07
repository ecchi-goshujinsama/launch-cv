// Core data types for LaunchCV
export interface Resume {
  id: string;
  title: string;
  templateId: string;
  personalInfo: PersonalInfo;
  sections: ResumeSection[];
  metadata: ResumeMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  summary: string;
}

export interface ResumeSection {
  id: string;
  type: 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'custom';
  title: string;
  items: SectionItem[];
  order: number;
  visible: boolean;
}

export interface SectionItem {
  id: string;
  [key: string]: unknown;
}

export interface ExperienceItem extends SectionItem {
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  location: string;
  description: string[];
  skills: string[];
}

export interface EducationItem extends SectionItem {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  location: string;
  gpa?: string;
  honors?: string[];
  coursework?: string[];
}

export interface ProjectItem extends SectionItem {
  name: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string | null;
  url?: string;
  github?: string;
  highlights: string[];
}

export interface SkillsItem extends SectionItem {
  category: string;
  skills: string[];
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface CertificationItem extends SectionItem {
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string | null;
  credentialId?: string;
  url?: string;
}

export interface CustomSectionItem extends SectionItem {
  title: string;
  subtitle?: string;
  date?: string;
  location?: string;
  description: string[];
}

export interface ResumeMetadata {
  lastEdited: Date;
  version: number;
  exportCount: number;
  importSource?: 'upload' | 'manual' | 'template';
  wordCount: number;
}

// Template types
export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'modern' | 'creative' | 'technical' | 'executive';
  previewImage: string;
  isAtsCompatible: boolean;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

// Store state types
export interface ResumeState {
  currentResume: Resume | null;
  resumes: Resume[];
  selectedTemplate: string;
  isLoading: boolean;
  isDirty: boolean;
  lastSaved: Date | null;
}

// Form validation types
export type ValidationError = {
  field: string;
  message: string;
};

export type FormState = {
  errors: ValidationError[];
  touched: Record<string, boolean>;
  isValid: boolean;
};