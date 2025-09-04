'use client';

import * as React from 'react';
import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Edit3, Save, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionContainer, MissionSection, MissionCard } from '@/components/layout';
import type { ParsedResumeData } from '@/lib/parsers';

interface PreFlightCheckProps {
  parsedData: ParsedResumeData;
  onDataValidated: (data: ParsedResumeData) => void;
  onEdit?: () => void;
  onReparse?: () => void;
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
  const [editedData, setEditedData] = useState<ParsedResumeData>(parsedData);
  const [editMode, setEditMode] = useState<string | null>(null);

  // Validate the parsed data
  const validateData = (data: ParsedResumeData): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];

    // Personal Info Validation
    if (!data.personalInfo.fullName?.trim()) {
      issues.push({
        field: 'fullName',
        section: 'Personal Info',
        message: 'Full name is required for professional resumes',
        severity: 'error'
      });
    }

    if (!data.personalInfo.email?.trim()) {
      issues.push({
        field: 'email',
        section: 'Personal Info',
        message: 'Email address is required',
        severity: 'error'
      });
    }

    // Experience Section Validation
    if (!data.sections.experience || data.sections.experience.length === 0) {
      issues.push({
        field: 'experience',
        section: 'Work Experience',
        message: 'At least one work experience entry is recommended',
        severity: 'warning'
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
    if (data.confidence < 0.6) {
      issues.push({
        field: 'confidence',
        section: 'Overall',
        message: 'Medium parsing confidence - some data may need verification',
        severity: 'warning'
      });
    }

    return issues;
  };

  const [validationIssues] = useState<ValidationIssue[]>(validateData(editedData));

  const handleFieldEdit = (field: string, value: string) => {
    setEditedData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const handleSaveEdit = () => {
    setEditMode(null);
  };

  const getIssueIcon = (severity: ValidationIssue['severity']) => {
    switch (severity) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'info':
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
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

  // Only block for critical errors (missing name/email)
  const criticalErrors = validationIssues.filter(i => 
    i.severity === 'error' && 
    (i.field === 'fullName' || i.field === 'email')
  );
  const canProceed = criticalErrors.length === 0;

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
              <div className="text-sm text-slate-300">
                Confidence: {Math.round(parsedData.confidence * 100)}%
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              {errorCount > 0 && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{errorCount} error{errorCount !== 1 ? 's' : ''}</span>
                </div>
              )}
              {warningCount > 0 && (
                <div className="flex items-center gap-1 text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{warningCount} warning{warningCount !== 1 ? 's' : ''}</span>
                </div>
              )}
              {infoCount > 0 && (
                <div className="flex items-center gap-1 text-blue-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{infoCount} suggestion{infoCount !== 1 ? 's' : ''}</span>
                </div>
              )}
              {validationIssues.length === 0 && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All systems ready for launch!</span>
                </div>
              )}
            </div>

            {/* Mission Status Indicator */}
            <div className={cn(
              "px-4 py-3 rounded-lg border text-sm",
              canProceed 
                ? "bg-green-50 border-green-200 text-green-800" 
                : "bg-red-50 border-red-200 text-red-800"
            )}>
              {canProceed 
                ? "✅ Ready for launch! All critical systems are operational."
                : "⚠️  Critical systems need attention before launch can proceed."
              }
            </div>
          </div>
        </MissionCard>

        {/* Personal Information */}
        <MissionCard variant="bordered" className="mb-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mission-text">Personal Information</h3>
            <div className="space-y-2 border-t pt-4">
              {renderPersonalInfoField('fullName', 'Full Name', true)}
              {renderPersonalInfoField('email', 'Email Address', true)}
              {renderPersonalInfoField('phone', 'Phone Number')}
              {renderPersonalInfoField('location', 'Location')}
              {renderPersonalInfoField('summary', 'Professional Summary')}
            </div>
          </div>
        </MissionCard>

        {/* Experience Summary */}
        {editedData.sections.experience && editedData.sections.experience.length > 0 && (
          <MissionCard variant="bordered" className="mb-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mission-text">Work Experience</h3>
              <div className="space-y-3">
                {editedData.sections.experience.map((exp, index) => (
                  <div key={exp.id || index} className="border-l-4 border-launch-blue pl-4">
                    <div className="font-medium text-gray-900">{exp.title || 'No title'}</div>
                    <div className="text-sm text-gray-600">{exp.company || 'No company'}</div>
                    <div className="text-sm text-gray-500">{exp.startDate} - {exp.endDate || 'Present'}</div>
                  </div>
                ))}
              </div>
            </div>
          </MissionCard>
        )}

        {/* Skills Summary */}
        {editedData.sections.skills && editedData.sections.skills.length > 0 && (
          <MissionCard variant="bordered" className="mb-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mission-text">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {editedData.sections.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-launch-blue-100 text-launch-blue rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </MissionCard>
        )}

        {/* Validation Issues */}
        {validationIssues.length > 0 && (
          <MissionCard variant="bordered" className="mb-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mission-text">Mission Diagnostics</h3>
              <div className="space-y-3">
                {validationIssues.map((issue, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border",
                      getIssueColor(issue.severity)
                    )}
                  >
                    {getIssueIcon(issue.severity)}
                    <div className="flex-1">
                      <div className="font-medium text-sm">{issue.section}</div>
                      <div className="text-sm text-gray-700">{issue.message}</div>
                      {issue.value && (
                        <div className="text-xs text-gray-500 mt-1">Current value: "{issue.value}"</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </MissionCard>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <div className="flex gap-3">
            {onReparse && (
              <LaunchButton variant="outline" onClick={onReparse}>
                Re-analyze Data
              </LaunchButton>
            )}
            {onEdit && (
              <LaunchButton variant="outline" onClick={onEdit}>
                Manual Edit
              </LaunchButton>
            )}
          </div>

          <LaunchButton
            variant="mission"
            onClick={() => onDataValidated(editedData)}
            disabled={!canProceed}
            icon="rocket"
            animation="rocket"
          >
            {canProceed ? 'Proceed to Launch' : 'Fix Critical Issues'}
          </LaunchButton>
        </div>
      </MissionContainer>
    </div>
  );
}
