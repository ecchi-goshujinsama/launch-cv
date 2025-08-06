'use client';

import * as React from 'react';
import { useState } from 'react';
import { AlertTriangle, CheckCircle2, AlertCircle, Edit3, Save, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionContainer, MissionSection, MissionCard } from '@/components/layout';
import type { ParsedResumeData } from '@/lib/parsers';
import { validateEmail, validatePhone } from '@/lib/validations/resume-schemas';

interface PreFlightCheckProps {
  parsedData: ParsedResumeData;
  onDataValidated: (validatedData: ParsedResumeData) => void;
  onEdit: () => void;
  onReparse: () => void;
  className?: string;
}

interface ValidationIssue {
  field: string;
  section: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  value?: string;
}

export function PreFlightCheck({
  parsedData,
  onDataValidated,
  onEdit,
  onReparse,
  className
}: PreFlightCheckProps) {
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<ParsedResumeData>(parsedData);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);

  // Run validation on mount and data changes
  React.useEffect(() => {
    const issues = validateResumeData(editedData);
    setValidationIssues(issues);
  }, [editedData]);

  const validateResumeData = (data: ParsedResumeData): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];

    // Personal Info Validation
    const personalInfo = data.personalInfo;

    if (!personalInfo.fullName?.trim()) {
      issues.push({
        field: 'fullName',
        section: 'Personal Info',
        message: 'Full name is required for professional resumes',
        severity: 'error'
      });
    }

    if (!personalInfo.email?.trim()) {
      issues.push({
        field: 'email',
        section: 'Personal Info',
        message: 'Email address is required',
        severity: 'error'
      });
    } else {
      const emailValidation = validateEmail(personalInfo.email);
      if (emailValidation !== true) {
        issues.push({
          field: 'email',
          section: 'Personal Info',
          message: emailValidation,
          severity: 'error',
          value: personalInfo.email
        });
      }
    }

    if (personalInfo.phone) {
      const phoneValidation = validatePhone(personalInfo.phone);
      if (phoneValidation !== true) {
        issues.push({
          field: 'phone',
          section: 'Personal Info',
          message: phoneValidation,
          severity: 'warning',
          value: personalInfo.phone
        });
      }
    }

    // Experience Section Validation
    if (!data.sections.experience || data.sections.experience.length === 0) {
      issues.push({
        field: 'experience',
        section: 'Work Experience',
        message: 'At least one work experience entry is recommended',
        severity: 'warning'
      });
    } else {
      data.sections.experience.forEach((exp, index) => {
        if (!exp.title?.trim()) {
          issues.push({
            field: `experience.${index}.title`,
            section: 'Work Experience',
            message: `Job title is missing for experience entry ${index + 1}`,
            severity: 'error'
          });
        }
        if (!exp.company?.trim()) {
          issues.push({
            field: `experience.${index}.company`,
            section: 'Work Experience',
            message: `Company name is missing for experience entry ${index + 1}`,
            severity: 'error'
          });
        }
      });
    }

    // Skills Section Validation
    if (!data.sections.skills || data.sections.skills.length === 0) {
      issues.push({
        field: 'skills',
        section: 'Skills',
        message: 'Adding skills section will improve your resume visibility',
        severity: 'info'
      });
    }

    // Confidence Score Analysis
    if (data.confidence < 0.3) {
      issues.push({
        field: 'confidence',
        section: 'Overall',
        message: 'Low parsing confidence - consider manual review of all sections',
        severity: 'error'
      });
    } else if (data.confidence < 0.6) {
      issues.push({
        field: 'confidence',
        section: 'Overall',
        message: 'Medium parsing confidence - some data may need verification',
        severity: 'warning'
      });
    }

    return issues;
  };

  const handleFieldEdit = (field: string, value: string) => {
    setEditedData(prev => {
      const updated = { ...prev };
      
      // Handle nested field updates
      if (field.includes('.')) {
        const parts = field.split('.');
        let current = updated as any;
        
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          }
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
      } else {
        // Handle top-level personal info fields
        if (updated.personalInfo) {
          (updated.personalInfo as any)[field] = value;
        }
      }
      
      return updated;
    });
  };

  const handleSaveEdit = () => {
    setEditMode(null);
  };

  const getIssueIcon = (severity: ValidationIssue['severity']) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'info':
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getIssueColor = (severity: ValidationIssue['severity']) => {
    switch (severity) {
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-amber-200 bg-amber-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const errorCount = validationIssues.filter(i => i.severity === 'error').length;
  const warningCount = validationIssues.filter(i => i.severity === 'warning').length;
  const infoCount = validationIssues.filter(i => i.severity === 'info').length;

  const canProceed = errorCount === 0;

  const renderPersonalInfoField = (field: keyof ParsedResumeData['personalInfo'], label: string, required = false) => {
    const value = editedData.personalInfo[field] || '';
    const isEditing = editMode === field;
    const fieldKey = field as string;
    const hasIssue = validationIssues.some(issue => issue.field === fieldKey);

    return (
      <div className="grid md:grid-cols-3 gap-2 py-2">
        <div className="font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </div>
        <div className="md:col-span-2">
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={value}
                onChange={(e) => handleFieldEdit(fieldKey, e.target.value)}
                className={cn(
                  "flex-1 px-3 py-1 border rounded-md text-sm",
                  hasIssue ? "border-red-300 focus:ring-red-200" : "border-gray-300 focus:ring-launch-blue-200"
                )}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
              <button
                onClick={handleSaveEdit}
                className="px-2 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                <Save className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className={cn(
                "flex-1 text-sm",
                !value && "text-gray-400 italic",
                hasIssue && "text-red-600"
              )}>
                {value || `No ${label.toLowerCase()} provided`}
              </span>
              <button
                onClick={() => setEditMode(fieldKey)}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={cn('w-full', className)}>
      <MissionContainer maxWidth="2xl" padding="lg" background="transparent">
        <MissionSection
          title="Pre-flight Check"
          subtitle="Mission Control has analyzed your resume data. Review and verify the extracted information before launch."
          icon={<AlertTriangle className="w-6 h-6 text-amber-500" />}
        >
          <></>
        </MissionSection>

        {/* Validation Summary */}
        <MissionCard variant="elevated" className="mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold mission-text">Mission Status</h3>
              <div className="text-sm text-gray-600">
                Confidence: {Math.round(parsedData.confidence * 100)}%
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className={cn(
                "p-3 rounded-lg border",
                errorCount > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
              )}>
                <div className="flex items-center gap-2">
                  {errorCount > 0 ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  <span className="font-medium">
                    {errorCount > 0 ? `${errorCount} Errors` : 'All Clear'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {errorCount > 0 ? 'Must fix before launch' : 'Ready for launch'}
                </p>
              </div>

              <div className="p-3 rounded-lg border bg-amber-50 border-amber-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">{warningCount} Warnings</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Recommended fixes</p>
              </div>

              <div className="p-3 rounded-lg border bg-blue-50 border-blue-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">{infoCount} Suggestions</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Optional improvements</p>
              </div>
            </div>

            {/* Issues List */}
            {validationIssues.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Issues to Address:</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {validationIssues.map((issue, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-2 rounded-md border text-sm",
                        getIssueColor(issue.severity)
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {getIssueIcon(issue.severity)}
                        <div className="flex-1">
                          <span className="font-medium">{issue.section}:</span> {issue.message}
                          {issue.value && (
                            <div className="text-xs text-gray-600 mt-1">
                              Current value: "{issue.value}"
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </MissionCard>

        {/* Personal Information Review */}
        <MissionCard variant="mission" className="mb-6">
          <div className="space-y-4">
            <h3 className="font-semibold mission-text">Personal Information</h3>
            <div className="space-y-1 divide-y divide-gray-100">
              {renderPersonalInfoField('fullName', 'Full Name', true)}
              {renderPersonalInfoField('email', 'Email Address', true)}
              {renderPersonalInfoField('phone', 'Phone Number')}
              {renderPersonalInfoField('location', 'Location')}
              {renderPersonalInfoField('linkedin', 'LinkedIn Profile')}
              {renderPersonalInfoField('website', 'Website/Portfolio')}
            </div>
          </div>
        </MissionCard>

        {/* Extracted Sections Summary */}
        <MissionCard variant="bordered" className="mb-6">
          <div className="space-y-4">
            <h3 className="font-semibold mission-text">Extracted Resume Sections</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Work Experience</h4>
                {editedData.sections.experience && editedData.sections.experience.length > 0 ? (
                  <div className="space-y-2">
                    {editedData.sections.experience.slice(0, 3).map((exp, index) => (
                      <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                        <div className="font-medium">{exp.title || 'Untitled Position'}</div>
                        <div className="text-gray-600">{exp.company || 'Company not specified'}</div>
                        {exp.startDate && (
                          <div className="text-xs text-gray-500">
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate || 'End date not specified'}
                          </div>
                        )}
                      </div>
                    ))}
                    {editedData.sections.experience.length > 3 && (
                      <div className="text-sm text-gray-500">
                        +{editedData.sections.experience.length - 3} more entries
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No work experience found</p>
                )}
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Skills & Other Sections</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Skills:</span> {' '}
                    {editedData.sections.skills && editedData.sections.skills.length > 0
                      ? `${editedData.sections.skills.length} skills identified`
                      : 'No skills found'
                    }
                  </div>
                  <div>
                    <span className="font-medium">Education:</span> {' '}
                    {editedData.sections.education && editedData.sections.education.length > 0
                      ? `${editedData.sections.education.length} education entries`
                      : 'No education found'
                    }
                  </div>
                  <div>
                    <span className="font-medium">Projects:</span> {' '}
                    {editedData.sections.projects && editedData.sections.projects.length > 0
                      ? `${editedData.sections.projects.length} projects found`
                      : 'No projects found'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MissionCard>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex gap-3">
            <LaunchButton
              variant="ghost"
              onClick={onReparse}
              icon="none"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Re-parse File
            </LaunchButton>
            
            <LaunchButton
              variant="outline"
              onClick={onEdit}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Manual Edit
            </LaunchButton>
          </div>
          
          <LaunchButton
            variant={canProceed ? "mission" : "outline"}
            onClick={() => onDataValidated(editedData)}
            disabled={!canProceed}
            icon={canProceed ? "rocket" : "none"}
            iconPosition="right"
            animation={canProceed ? "rocket" : undefined}
            size="lg"
          >
            {canProceed ? 'Pre-flight Complete - Continue' : `Fix ${errorCount} Error${errorCount !== 1 ? 's' : ''} First`}
          </LaunchButton>
        </div>
      </MissionContainer>
    </div>
  );
}