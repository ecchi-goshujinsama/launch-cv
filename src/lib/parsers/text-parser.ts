'use client';

import type { ParsedResumeData, ParseOptions, ExperienceEntry, EducationEntry } from './types';

// Regex patterns for data extraction
export const REGEX_PATTERNS = {
  // Email patterns
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  
  // Phone patterns (various formats)
  phone: /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g,
  phoneAlt: /(?:\+?1[-.\s]?)?([0-9]{3})[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g,
  
  // Date patterns
  dateMMYY: /\b(0?[1-9]|1[0-2])\/(20[0-9]{2}|[0-9]{2})\b/g,
  dateMonthYear: /\b(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[\s,]*([0-9]{4})\b/gi,
  dateYearOnly: /\b(19|20)[0-9]{2}\b/g,
  
  // LinkedIn profile
  linkedin: /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?/gi,
  
  // Website/Portfolio
  website: /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/gi,
  
  // Name patterns (basic)
  name: /^([A-Z][a-z]+(?: [A-Z][a-z]+)*)\s*$/m,
  
  // Common section headers
  sectionHeaders: {
    experience: /(?:^|\n)(?:EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT|PROFESSIONAL EXPERIENCE|CAREER HISTORY)(?:\s*:)?\s*$/gmi,
    education: /(?:^|\n)(?:EDUCATION|ACADEMIC BACKGROUND|QUALIFICATIONS)(?:\s*:)?\s*$/gmi,
    skills: /(?:^|\n)(?:SKILLS|TECHNICAL SKILLS|COMPETENCIES|TECHNOLOGIES)(?:\s*:)?\s*$/gmi,
    projects: /(?:^|\n)(?:PROJECTS|PERSONAL PROJECTS|PORTFOLIO)(?:\s*:)?\s*$/gmi,
    certifications: /(?:^|\n)(?:CERTIFICATIONS|CERTIFICATES|LICENSES)(?:\s*:)?\s*$/gmi,
    summary: /(?:^|\n)(?:SUMMARY|PROFESSIONAL SUMMARY|PROFILE|OBJECTIVE)(?:\s*:)?\s*$/gmi
  },
  
  // Experience patterns
  jobTitle: /^([A-Z][a-zA-Z\s&,-]+?)(?:\s+(?:at|@)\s+([A-Z][a-zA-Z\s&,.'-]+?))?$/gm,
  company: /(?:at|@)\s+([A-Z][a-zA-Z\s&,.'-]+?)(?:\s*[,|\n]|$)/gi,
  location: /([A-Z][a-zA-Z\s]+),\s*([A-Z]{2}|[A-Za-z\s]+)(?:\s*,\s*[A-Z]{2,})?/g,
  
  // Education patterns
  degree: /(?:Bachelor|Master|PhD|B\.?A\.?|B\.?S\.?|M\.?A\.?|M\.?S\.?|M\.?B\.?A\.?|Ph\.?D\.?)[\s\w]*(?:\s+in\s+[\w\s]+)?/gi,
  university: /(?:University|College|Institute|School)(?:\s+of\s+[\w\s]+)?/gi,
  
  // Skills extraction
  programmingLanguages: /\b(?:JavaScript|TypeScript|Python|Java|C\+\+|C#|Ruby|Go|Rust|Swift|Kotlin|PHP|SQL|HTML|CSS|React|Vue|Angular|Node\.js|Express|Django|Flask|Spring|Laravel)\b/gi,
  technologies: /\b(?:AWS|Azure|GCP|Docker|Kubernetes|Git|MongoDB|PostgreSQL|MySQL|Redis|Elasticsearch|GraphQL|REST|API|CI\/CD|Jenkins|Terraform|Ansible)\b/gi
} as const;

/**
 * Extract emails from text using regex patterns
 */
export function extractEmails(text: string): string[] {
  const emails = text.match(REGEX_PATTERNS.email) || [];
  return [...new Set(emails)]; // Remove duplicates
}

/**
 * Extract phone numbers from text using regex patterns
 */
export function extractPhoneNumbers(text: string): string[] {
  const phones: string[] = [];
  
  // Try different phone patterns
  const phoneMatches = text.match(REGEX_PATTERNS.phone) || [];
  const phoneAltMatches = text.match(REGEX_PATTERNS.phoneAlt) || [];
  
  phones.push(...phoneMatches, ...phoneAltMatches);
  
  // Clean and format phone numbers
  const cleanPhones = phones
    .map(phone => phone.replace(/[^\d]/g, ''))
    .filter(phone => phone.length >= 10)
    .map(phone => {
      if (phone.length === 10) {
        return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
      } else if (phone.length === 11 && phone.startsWith('1')) {
        return `+1 (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7)}`;
      }
      return phone;
    });
  
  return [...new Set(cleanPhones)];
}

/**
 * Extract dates from text using various patterns
 */
export function extractDates(text: string): string[] {
  const dates: string[] = [];
  
  // MM/YY or MM/YYYY format
  const mmyyDates = text.match(REGEX_PATTERNS.dateMMYY) || [];
  dates.push(...mmyyDates);
  
  // Month Year format
  const monthYearDates = text.match(REGEX_PATTERNS.dateMonthYear) || [];
  dates.push(...monthYearDates);
  
  // Year only
  const yearDates = text.match(REGEX_PATTERNS.dateYearOnly) || [];
  dates.push(...yearDates);
  
  return [...new Set(dates)];
}

/**
 * Extract personal information from text
 */
export function extractPersonalInfo(text: string): ParsedResumeData['personalInfo'] {
  const emails = extractEmails(text);
  const phones = extractPhoneNumbers(text);
  
  // Extract LinkedIn profile
  const linkedinMatches = text.match(REGEX_PATTERNS.linkedin);
  const linkedin = linkedinMatches?.[0];
  
  // Extract website/portfolio
  const websiteMatches = text.match(REGEX_PATTERNS.website);
  const website = websiteMatches?.find(url => 
    !url.includes('linkedin.com') && 
    !url.includes('mailto:')
  );
  
  // Extract location (basic pattern)
  const locationMatches = text.match(REGEX_PATTERNS.location);
  const location = locationMatches?.[0];
  
  // Try to extract name (first non-empty line often contains name)
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  let fullName = '';
  
  for (const line of lines) {
    // Skip lines that look like contact info or headers
    if (!line.includes('@') && !line.match(/\d{3}/) && !line.includes('http') && line.length < 50) {
      // Check if it looks like a name (2-4 words, each capitalized)
      const words = line.split(' ').filter(w => w.length > 0);
      if (words.length >= 2 && words.length <= 4 && 
          words.every(word => /^[A-Z][a-z]+$/.test(word))) {
        fullName = line;
        break;
      }
    }
  }
  
  const personalInfo: ParsedResumeData['personalInfo'] = {};
  
  if (fullName) personalInfo.fullName = fullName;
  if (emails[0]) personalInfo.email = emails[0];
  if (phones[0]) personalInfo.phone = phones[0];
  if (location) personalInfo.location = location;
  if (linkedin) personalInfo.linkedin = linkedin;
  if (website) personalInfo.website = website;
  
  return personalInfo;
}

/**
 * Extract sections from resume text
 */
export function extractSections(text: string): ParsedResumeData['sections'] {
  const sections: ParsedResumeData['sections'] = {};
  
  // Split text by common section headers
  const sectionSplits = text.split(/(?=(?:^|\n)(?:EXPERIENCE|EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|SUMMARY))/gmi);
  
  for (const section of sectionSplits) {
    const sectionLower = section.toLowerCase();
    
    if (sectionLower.includes('experience') || sectionLower.includes('employment')) {
      sections.experience = extractExperience(section);
    } else if (sectionLower.includes('education')) {
      sections.education = extractEducation(section);
    } else if (sectionLower.includes('skills')) {
      sections.skills = extractSkills(section);
    }
  }
  
  return sections;
}

/**
 * Extract work experience from text
 */
function extractExperience(text: string): ExperienceEntry[] {
  const experiences: ExperienceEntry[] = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let currentEntry: Partial<ExperienceEntry> = {};
  
  for (const line of lines) {
    // Skip section headers
    if (line.match(/^(EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT)/i)) continue;
    
    // Check for job title pattern
    const jobTitleMatch = line.match(/^([A-Z][a-zA-Z\s&,-]+?)(?:\s+(?:at|@)\s+([A-Z][a-zA-Z\s&,.'-]+?))?$/);
    if (jobTitleMatch) {
      // Save previous entry if exists
      if (currentEntry.title) {
        experiences.push(currentEntry as ExperienceEntry);
      }
      
      currentEntry = {};
      if (jobTitleMatch[1]?.trim()) currentEntry.title = jobTitleMatch[1].trim();
      if (jobTitleMatch[2]?.trim()) currentEntry.company = jobTitleMatch[2].trim();
      continue;
    }
    
    // Check for company name
    const companyMatch = line.match(/^([A-Z][a-zA-Z\s&,.'-]+?)(?:\s*[,|\n]|$)/);
    if (companyMatch && !currentEntry.company && line.length < 60) {
      const company = companyMatch[1]?.trim();
      if (company) currentEntry.company = company;
      continue;
    }
    
    // Check for dates
    const dates = extractDates(line);
    if (dates.length > 0) {
      if (dates.length >= 2) {
        if (dates[0]) currentEntry.startDate = dates[0];
        if (dates[1]) currentEntry.endDate = dates[1];
      } else {
        if (dates[0]) currentEntry.startDate = dates[0];
      }
      
      // Check for "Present" or "Current"
      if (line.toLowerCase().includes('present') || line.toLowerCase().includes('current')) {
        currentEntry.current = true;
        currentEntry.endDate = 'Present';
      }
      continue;
    }
    
    // Everything else might be description
    if (line.length > 20 && !currentEntry.description) {
      currentEntry.description = line;
    }
  }
  
  // Add last entry
  if (currentEntry.title) {
    experiences.push(currentEntry as ExperienceEntry);
  }
  
  return experiences;
}

/**
 * Extract education from text
 */
function extractEducation(text: string): EducationEntry[] {
  const education: EducationEntry[] = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let currentEntry: Partial<EducationEntry> = {};
  
  for (const line of lines) {
    // Skip section headers
    if (line.match(/^EDUCATION/i)) continue;
    
    // Check for degree
    const degreeMatch = line.match(REGEX_PATTERNS.degree);
    if (degreeMatch) {
      if (currentEntry.degree) {
        education.push(currentEntry as EducationEntry);
      }
      currentEntry = {};
      const degree = degreeMatch[0]?.trim();
      if (degree) currentEntry.degree = degree;
      continue;
    }
    
    // Check for institution
    const universityMatch = line.match(REGEX_PATTERNS.university);
    if (universityMatch && !currentEntry.institution) {
      currentEntry.institution = line.trim();
      continue;
    }
    
    // Check for dates
    const dates = extractDates(line);
    if (dates.length > 0) {
      if (dates.length >= 2) {
        if (dates[0]) currentEntry.startDate = dates[0];
        if (dates[1]) currentEntry.endDate = dates[1];
      } else {
        if (dates[0]) currentEntry.endDate = dates[0]; // Usually graduation year
      }
    }
  }
  
  // Add last entry
  if (currentEntry.degree || currentEntry.institution) {
    education.push(currentEntry as EducationEntry);
  }
  
  return education;
}

/**
 * Extract skills from text
 */
function extractSkills(text: string): string[] {
  const skills: string[] = [];
  
  // Extract programming languages and technologies
  const programmingMatches = text.match(REGEX_PATTERNS.programmingLanguages) || [];
  const technologyMatches = text.match(REGEX_PATTERNS.technologies) || [];
  
  skills.push(...programmingMatches, ...technologyMatches);
  
  // Extract skills from bullet points or comma-separated lists
  const lines = text.split('\n').map(line => line.trim());
  
  for (const line of lines) {
    if (line.includes(',') && line.length < 200) {
      // Comma-separated skills
      const skillsFromLine = line
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 1 && skill.length < 30);
      skills.push(...skillsFromLine);
    }
  }
  
  return [...new Set(skills)]; // Remove duplicates
}

/**
 * Main text parsing function
 */
export function parseResumeText(
  text: string, 
  options: ParseOptions = {}
): ParsedResumeData {
  const {
    extractPersonalInfo: extractPersonal = true,
    extractExperience: extractExp = true,
    extractEducation: extractEdu = true,
    extractSkills: extractSkillsFlag = true
  } = options;
  
  const result: ParsedResumeData = {
    personalInfo: {},
    sections: {},
    rawText: text,
    extractedDates: extractDates(text),
    extractedEmails: extractEmails(text),
    extractedPhones: extractPhoneNumbers(text),
    confidence: 0.5 // Base confidence score
  };
  
  // Extract personal information
  if (extractPersonal) {
    result.personalInfo = extractPersonalInfo(text);
  }
  
  // Extract sections
  if (extractExp || extractEdu || extractSkillsFlag) {
    result.sections = extractSections(text);
  }
  
  // Calculate confidence score based on extracted data
  let confidenceFactors = 0;
  let totalFactors = 0;
  
  // Personal info factors
  if (result.personalInfo.email) confidenceFactors++;
  if (result.personalInfo.fullName) confidenceFactors++;
  if (result.personalInfo.phone) confidenceFactors++;
  totalFactors += 3;
  
  // Experience factors
  if (result.sections.experience && result.sections.experience.length > 0) {
    confidenceFactors += result.sections.experience.length;
    totalFactors += 3; // Expected at least 3 experiences
  }
  
  // Education factors
  if (result.sections.education && result.sections.education.length > 0) {
    confidenceFactors++;
    totalFactors++;
  }
  
  // Skills factors
  if (result.sections.skills && result.sections.skills.length > 0) {
    confidenceFactors++;
    totalFactors++;
  }
  
  result.confidence = Math.min(confidenceFactors / totalFactors, 1);
  
  return result;
}