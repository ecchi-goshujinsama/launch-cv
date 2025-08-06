export interface ParsedResumeData {
  personalInfo: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
    summary?: string;
  };
  sections: {
    experience?: ExperienceEntry[];
    education?: EducationEntry[];
    skills?: string[];
    projects?: ProjectEntry[];
    certifications?: CertificationEntry[];
  };
  rawText: string;
  extractedDates: string[];
  extractedEmails: string[];
  extractedPhones: string[];
  confidence: number; // 0-1 score for parsing accuracy
}

export interface ExperienceEntry {
  title?: string;
  company?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  current?: boolean;
}

export interface EducationEntry {
  institution?: string;
  degree?: string;
  field?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
}

export interface ProjectEntry {
  name?: string;
  description?: string;
  technologies?: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
}

export interface CertificationEntry {
  name?: string;
  issuer?: string;
  date?: string;
  url?: string;
}

export interface ParseOptions {
  extractPersonalInfo?: boolean;
  extractExperience?: boolean;
  extractEducation?: boolean;
  extractSkills?: boolean;
  extractProjects?: boolean;
  extractCertifications?: boolean;
}

export interface ParseResult {
  success: boolean;
  data?: ParsedResumeData;
  error?: string;
  warnings?: string[];
}