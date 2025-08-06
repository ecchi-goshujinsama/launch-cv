import { z } from 'zod';

// Personal Information Schema
export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Full name is too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required').max(20, 'Phone number is too long'),
  location: z.string().min(1, 'Location is required').max(100, 'Location is too long'),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  summary: z.string().max(500, 'Summary is too long').optional()
});

// Experience Item Schema
export const experienceItemSchema = z.object({
  id: z.string(),
  company: z.string().min(1, 'Company name is required').max(100, 'Company name is too long'),
  position: z.string().min(1, 'Position is required').max(100, 'Position is too long'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().nullable(),
  location: z.string().min(1, 'Location is required').max(100, 'Location is too long'),
  description: z.array(z.string().max(300, 'Description item is too long')).max(10, 'Too many description items'),
  skills: z.array(z.string().max(50, 'Skill name is too long')).max(20, 'Too many skills')
});

// Education Item Schema
export const educationItemSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'Institution name is required').max(100, 'Institution name is too long'),
  degree: z.string().min(1, 'Degree is required').max(100, 'Degree is too long'),
  field: z.string().min(1, 'Field of study is required').max(100, 'Field of study is too long'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().nullable(),
  location: z.string().min(1, 'Location is required').max(100, 'Location is too long'),
  gpa: z.string().max(10, 'GPA is too long').optional(),
  honors: z.array(z.string().max(100, 'Honor is too long')).max(10, 'Too many honors').optional(),
  coursework: z.array(z.string().max(100, 'Course is too long')).max(20, 'Too many courses').optional()
});

// Project Item Schema
export const projectItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Project name is required').max(100, 'Project name is too long'),
  description: z.string().min(1, 'Project description is required').max(500, 'Project description is too long'),
  technologies: z.array(z.string().max(50, 'Technology name is too long')).max(20, 'Too many technologies'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().nullable(),
  url: z.string().url('Invalid project URL').optional().or(z.literal('')),
  github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  highlights: z.array(z.string().max(300, 'Highlight is too long')).max(10, 'Too many highlights')
});

// Skills Item Schema
export const skillsItemSchema = z.object({
  id: z.string(),
  category: z.string().min(1, 'Category is required').max(50, 'Category name is too long'),
  skills: z.array(z.string().max(50, 'Skill name is too long')).min(1, 'At least one skill is required').max(20, 'Too many skills'),
  proficiency: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional()
});

// Certification Item Schema
export const certificationItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Certification name is required').max(100, 'Certification name is too long'),
  issuer: z.string().min(1, 'Issuer is required').max(100, 'Issuer name is too long'),
  issueDate: z.string().min(1, 'Issue date is required'),
  expirationDate: z.string().nullable(),
  credentialId: z.string().max(100, 'Credential ID is too long').optional(),
  url: z.string().url('Invalid certification URL').optional().or(z.literal(''))
});

// Custom Section Item Schema
export const customSectionItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  subtitle: z.string().max(100, 'Subtitle is too long').optional(),
  date: z.string().max(50, 'Date is too long').optional(),
  location: z.string().max(100, 'Location is too long').optional(),
  description: z.array(z.string().max(300, 'Description item is too long')).max(10, 'Too many description items')
});

// Section Schema
export const sectionSchema = z.object({
  id: z.string(),
  type: z.enum(['experience', 'education', 'skills', 'projects', 'certifications']),
  title: z.string().min(1, 'Section title is required').max(50, 'Section title is too long'),
  items: z.array(z.any()), // Will be validated based on section type
  order: z.number().int().min(0),
  visible: z.boolean()
});

// Resume Metadata Schema
export const resumeMetadataSchema = z.object({
  lastEdited: z.date(),
  version: z.number().int().min(1),
  exportCount: z.number().int().min(0),
  importSource: z.enum(['upload', 'manual', 'template']).optional(),
  wordCount: z.number().int().min(0)
});

// Full Resume Schema
export const resumeSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Resume title is required').max(100, 'Resume title is too long'),
  templateId: z.string().min(1, 'Template ID is required'),
  personalInfo: personalInfoSchema,
  sections: z.array(sectionSchema).max(20, 'Too many sections'),
  metadata: resumeMetadataSchema,
  createdAt: z.date(),
  updatedAt: z.date()
});

// Template Schema
export const templateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Template name is required').max(50, 'Template name is too long'),
  description: z.string().max(200, 'Template description is too long'),
  category: z.enum(['professional', 'modern', 'creative', 'technical', 'executive']),
  previewImage: z.string().url('Invalid preview image URL'),
  isAtsCompatible: z.boolean(),
  colorScheme: z.object({
    primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
    secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
    accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color')
  })
});

// Form validation helpers
export const validateSectionItem = (item: any, sectionType: string) => {
  switch (sectionType) {
    case 'experience':
      return experienceItemSchema.parse(item);
    case 'education':
      return educationItemSchema.parse(item);
    case 'projects':
      return projectItemSchema.parse(item);
    case 'skills':
      return skillsItemSchema.parse(item);
    case 'certifications':
      return certificationItemSchema.parse(item);
    default:
      return customSectionItemSchema.parse(item);
  }
};

// Quick validation functions for forms
export const validateEmail = (email: string) => {
  try {
    z.string().email().parse(email);
    return true;
  } catch {
    return 'Invalid email address';
  }
};

export const validateUrl = (url: string) => {
  if (!url) return true; // Optional URLs
  try {
    z.string().url().parse(url);
    return true;
  } catch {
    return 'Invalid URL format';
  }
};

export const validateRequired = (value: string, fieldName: string) => {
  try {
    z.string().min(1, `${fieldName} is required`).parse(value);
    return true;
  } catch (error) {
    return (error as z.ZodError).errors[0].message;
  }
};

export const validateLength = (value: string, maxLength: number, fieldName: string) => {
  try {
    z.string().max(maxLength, `${fieldName} is too long (max ${maxLength} characters)`).parse(value);
    return true;
  } catch (error) {
    return (error as z.ZodError).errors[0].message;
  }
};

// Export all schemas for use in forms
export const schemas = {
  personalInfo: personalInfoSchema,
  experience: experienceItemSchema,
  education: educationItemSchema,
  project: projectItemSchema,
  skills: skillsItemSchema,
  certification: certificationItemSchema,
  customSection: customSectionItemSchema,
  section: sectionSchema,
  resume: resumeSchema,
  template: templateSchema
};

// Types derived from schemas
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type ExperienceFormData = z.infer<typeof experienceItemSchema>;
export type EducationFormData = z.infer<typeof educationItemSchema>;
export type ProjectFormData = z.infer<typeof projectItemSchema>;
export type SkillsFormData = z.infer<typeof skillsItemSchema>;
export type CertificationFormData = z.infer<typeof certificationItemSchema>;
export type CustomSectionFormData = z.infer<typeof customSectionItemSchema>;