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
  type: 'experience' | 'education' | 'skills' | 'projects' | 'certifications';
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

export interface ResumeMetadata {
  lastEdited: Date;
  version: number;
  exportCount: number;
}