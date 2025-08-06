'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Shield,
  Eye,
  Info,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionCard } from '@/components/layout';
import { 
  personalInfoSchema,
  experienceSchema, 
  educationSchema 
} from '@/lib/validations/resume-schemas';
import type { ResumeSection } from './section-manager';

// Extended validation schemas for complete sections
const sectionValidationSchemas = {
  personalInfo: personalInfoSchema.extend({
    summary: z.string().min(50, 'Summary should be at least 50 characters').optional()
  }),
  experience: z.array(experienceSchema).min(1, 'At least one experience entry is required'),
  education: z.array(educationSchema).min(1, 'At least one education entry is required'),
  skills: z.array(z.string().min(1)).min(3, 'At least 3 skills are recommended'),
  projects: z.array(z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().min(10, 'Description should be at least 10 characters').optional(),
    technologies: z.array(z.string()).optional(),
    url: z.string().url('Must be a valid URL').optional()
  })).optional(),
  certifications: z.array(z.object({
    name: z.string().min(1, 'Certification name is required'),
    issuer: z.string().min(1, 'Issuer is required'),
    date: z.string().optional(),
    url: z.string().url('Must be a valid URL').optional()
  })).optional()
};

type ValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-100
  completeness: number; // 0-100
};

type SectionValidationResult = {
  [key: string]: ValidationResult;
};

interface SectionValidatorProps {
  sections: ResumeSection[];
  resumeData: any; // The actual resume data
  onValidationChange?: (results: SectionValidationResult) => void;
  autoValidate?: boolean;
  className?: string;
}

export function SectionValidator({
  sections,
  resumeData,
  onValidationChange,
  autoValidate = true,
  className
}: SectionValidatorProps) {
  const [validationResults, setValidationResults] = useState<SectionValidationResult>({});
  const [isValidating, setIsValidating] = useState(false);
  const [lastValidated, setLastValidated] = useState<Date | null>(null);

  // Validate individual section
  const validateSection = (section: ResumeSection): ValidationResult => {
    const sectionData = resumeData[section.type];
    const schema = sectionValidationSchemas[section.type as keyof typeof sectionValidationSchemas];
    
    if (!schema) {
      return {
        isValid: true,
        errors: [],
        warnings: [],
        score: 100,
        completeness: 100
      };
    }

    try {
      schema.parse(sectionData);
      
      // Calculate completeness and score
      let completeness = 100;
      let score = 100;
      const warnings: string[] = [];

      // Section-specific completeness checks
      if (section.type === 'personalInfo') {
        const optionalFields = ['linkedin', 'website', 'summary'];
        const missingOptional = optionalFields.filter(field => !sectionData[field]);
        completeness = Math.max(60, 100 - (missingOptional.length * 15));
        
        if (!sectionData.summary) {
          warnings.push('Consider adding a professional summary to strengthen your profile');
          score -= 10;
        }
        if (!sectionData.linkedin) {
          warnings.push('LinkedIn profile can enhance your professional presence');
          score -= 5;
        }
      }

      if (section.type === 'experience') {
        const experiences = sectionData || [];
        if (experiences.length < 2) {
          warnings.push('Consider adding more work experience if available');
          score -= 10;
        }
        
        experiences.forEach((exp: any, index: number) => {
          if (!exp.description || exp.description.length < 50) {
            warnings.push(`Experience ${index + 1}: Description could be more detailed`);
            score -= 5;
          }
        });
      }

      if (section.type === 'skills') {
        const skills = sectionData || [];
        if (skills.length < 5) {
          warnings.push('Consider adding more skills to showcase your expertise');
          score -= 10;
        }
        if (skills.length > 15) {
          warnings.push('Too many skills might dilute focus - consider prioritizing');
          score -= 5;
        }
      }

      return {
        isValid: true,
        errors: [],
        warnings,
        score: Math.max(0, score),
        completeness
      };

    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map(issue => issue.message);
        return {
          isValid: false,
          errors,
          warnings: [],
          score: 0,
          completeness: 20
        };
      }

      return {
        isValid: false,
        errors: ['Unknown validation error'],
        warnings: [],
        score: 0,
        completeness: 0
      };
    }
  };

  // Validate all sections
  const validateAllSections = async () => {
    setIsValidating(true);
    
    const results: SectionValidationResult = {};
    
    for (const section of sections.filter(s => s.visible)) {
      results[section.id] = validateSection(section);
    }
    
    setValidationResults(results);
    setLastValidated(new Date());
    setIsValidating(false);
    
    if (onValidationChange) {
      onValidationChange(results);
    }
  };

  // Auto-validate when data changes
  useEffect(() => {
    if (autoValidate) {
      const timeoutId = setTimeout(() => {
        validateAllSections();
      }, 500); // Debounce validation
      
      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [resumeData, sections, autoValidate]);

  // Calculate overall score
  const overallResults = React.useMemo(() => {
    const results = Object.values(validationResults);
    if (results.length === 0) {
      return { score: 0, completeness: 0, totalErrors: 0, totalWarnings: 0 };
    }

    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    const totalCompleteness = results.reduce((sum, result) => sum + result.completeness, 0);
    const totalErrors = results.reduce((sum, result) => sum + result.errors.length, 0);
    const totalWarnings = results.reduce((sum, result) => sum + result.warnings.length, 0);

    return {
      score: Math.round(totalScore / results.length),
      completeness: Math.round(totalCompleteness / results.length),
      totalErrors,
      totalWarnings
    };
  }, [validationResults]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getValidationIcon = (result: ValidationResult) => {
    if (result.errors.length > 0) return <XCircle className="w-4 h-4 text-red-500" />;
    if (result.warnings.length > 0) return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'personalInfo': return '👤';
      case 'summary': return '📄';
      case 'experience': return '💼';
      case 'education': return '🎓';
      case 'skills': return '🔧';
      case 'projects': return '🚀';
      case 'certifications': return '🏆';
      default: return '📋';
    }
  };

  return (
    <MissionCard variant="elevated" className={cn('', className)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-launch-blue/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-launch-blue" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mission-text">Resume Validation</h3>
              <p className="text-sm text-gray-600">Check your resume for completeness and quality</p>
            </div>
          </div>

          <LaunchButton
            variant="outline"
            size="sm"
            onClick={validateAllSections}
            disabled={isValidating}
            icon="none"
          >
            {isValidating ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Shield className="w-4 h-4 mr-2" />
            )}
            {isValidating ? 'Validating...' : 'Validate Now'}
          </LaunchButton>
        </div>

        {/* Overall Score */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={cn(
            "text-center p-4 border rounded-lg",
            getScoreColor(overallResults.score)
          )}>
            <div className="text-3xl font-bold">{overallResults.score}</div>
            <div className="text-xs uppercase font-medium">Overall Score</div>
          </div>
          <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-3xl font-bold text-blue-700">{overallResults.completeness}%</div>
            <div className="text-xs text-blue-600 uppercase font-medium">Complete</div>
          </div>
          <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-3xl font-bold text-red-700">{overallResults.totalErrors}</div>
            <div className="text-xs text-red-600 uppercase font-medium">Errors</div>
          </div>
          <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="text-3xl font-bold text-amber-700">{overallResults.totalWarnings}</div>
            <div className="text-xs text-amber-600 uppercase font-medium">Warnings</div>
          </div>
        </div>

        {/* Section Results */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Section Validation Results</h4>
          
          {sections.filter(s => s.visible).map((section) => {
            const result = validationResults[section.id];
            
            if (!result) {
              return (
                <div key={section.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <span className="text-lg">{getSectionIcon(section.type)}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{section.title}</div>
                    <div className="text-xs text-gray-500">Not yet validated</div>
                  </div>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
              );
            }

            return (
              <div key={section.id} className="border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 p-3">
                  <span className="text-lg">{getSectionIcon(section.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{section.title}</span>
                      <span className={cn(
                        "px-2 py-1 text-xs rounded-full",
                        getScoreColor(result.score)
                      )}>
                        {result.score}/100
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {result.completeness}% complete • 
                      {result.errors.length} errors • 
                      {result.warnings.length} warnings
                    </div>
                  </div>
                  {getValidationIcon(result)}
                </div>

                {/* Errors and Warnings */}
                {(result.errors.length > 0 || result.warnings.length > 0) && (
                  <div className="px-3 pb-3 space-y-2">
                    {result.errors.map((error, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-red-700 bg-red-50 p-2 rounded">
                        <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    ))}
                    {result.warnings.map((warning, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-2 rounded">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{warning}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Last Validated */}
        {lastValidated && (
          <div className="text-xs text-gray-500 flex items-center justify-center gap-1 pt-2 border-t border-gray-100">
            <Eye className="w-3 h-3" />
            Last validated: {lastValidated.toLocaleTimeString()}
          </div>
        )}

        {/* Tips */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <span>💡</span>
            Validation Tips
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Aim for a score of 85+ for a competitive resume</li>
            <li>• Fix all errors before finalizing your resume</li>
            <li>• Address warnings to improve your resume quality</li>
            <li>• Validation runs automatically as you edit</li>
          </ul>
        </div>
      </div>
    </MissionCard>
  );
}