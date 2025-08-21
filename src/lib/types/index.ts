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

export interface BaseSectionItem {
  id: string;
}

export interface ExperienceItem extends BaseSectionItem {
  type: 'experience';
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  location: string;
  description: string[];
  skills: string[];
}

export interface EducationItem extends BaseSectionItem {
  type: 'education';
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

export interface ProjectItem extends BaseSectionItem {
  type: 'projects';
  name: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string | null;
  url?: string;
  github?: string;
  highlights: string[];
}

export interface SkillsItem extends BaseSectionItem {
  type: 'skills';
  category: string;
  skills: string[];
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface CertificationItem extends BaseSectionItem {
  type: 'certifications';
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string | null;
  credentialId?: string;
  url?: string;
  date?: string;
  expires?: string;
}

export interface CustomSectionItem extends BaseSectionItem {
  type: 'custom';
  title: string;
  name?: string;
  subtitle?: string;
  date?: string;
  location?: string;
  description: string | string[];
}

// Discriminated union for all section item types
export type SectionItem = 
  | ExperienceItem 
  | EducationItem 
  | ProjectItem 
  | SkillsItem 
  | CertificationItem 
  | CustomSectionItem;

// Type guard functions
export function isExperienceItem(item: SectionItem): item is ExperienceItem {
  return item.type === 'experience';
}

export function isEducationItem(item: SectionItem): item is EducationItem {
  return item.type === 'education';
}

export function isProjectItem(item: SectionItem): item is ProjectItem {
  return item.type === 'projects';
}

export function isSkillsItem(item: SectionItem): item is SkillsItem {
  return item.type === 'skills';
}

export function isCertificationItem(item: SectionItem): item is CertificationItem {
  return item.type === 'certifications';
}

export function isCustomSectionItem(item: SectionItem): item is CustomSectionItem {
  return item.type === 'custom';
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

// Resume data structure for validation and manipulation
export interface ResumeData {
  personalInfo: PersonalInfo;
  experience?: ExperienceItem[];
  education?: EducationItem[];
  skills?: string[];
  projects?: ProjectItem[];
  certifications?: CertificationItem[];
  [key: string]: unknown;
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