'use client';

import * as React from 'react';
import { useState } from 'react';
import { FileText, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionContainer, MissionSection, MissionCard } from '@/components/layout';
import type { ParsedResumeData } from '@/lib/parsers';

interface ManualEntryFormProps {
  onSubmit: (data: ParsedResumeData) => void;
  onCancel: () => void;
  className?: string;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  jobTitle: string;
  company: string;
  workDescription: string;
  skills: string;
}

export function ManualEntryForm({ onSubmit, onCancel, className }: ManualEntryFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    jobTitle: '',
    company: '',
    workDescription: '',
    skills: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Transform form data to ParsedResumeData format
    const transformedData: ParsedResumeData = {
      personalInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        summary: formData.summary
      },
      sections: {
        experience: formData.jobTitle ? [{
          id: 'manual-exp-1',
          title: formData.jobTitle,
          company: formData.company,
          location: '',
          startDate: '',
          endDate: '',
          description: formData.workDescription,
          current: false
        }] : [],
        education: [],
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : []
      },
      confidence: 1.0
    };

    onSubmit(transformedData);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedFromStep = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName.trim() && formData.email.trim();
      case 2:
        return formData.jobTitle.trim() && formData.company.trim();
      case 3:
        return formData.skills.trim();
      default:
        return true;
    }
  };

  const renderInput = (
    field: keyof FormData,
    label: string,
    type: 'text' | 'email' | 'tel' = 'text',
    required = false,
    placeholder?: string
  ) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-launch-blue-200 focus:border-launch-blue"
      />
    </div>
  );

  const renderTextarea = (
    field: keyof FormData,
    label: string,
    rows = 3,
    placeholder?: string
  ) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        value={formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-launch-blue-200 focus:border-launch-blue resize-y"
      />
    </div>
  );

  return (
    <div className={cn('w-full', className)}>
      <MissionContainer maxWidth="2xl" padding="lg" background="transparent">
        <MissionSection
          title="Manual Mission Entry"
          subtitle="Begin your career launch mission from scratch. Enter your professional information step by step to create your perfect resume."
          icon={<FileText className="w-6 h-6 text-launch-blue" />}
        >
          <></>
        </MissionSection>

        {/* Progress Indicator */}
        <MissionCard variant="elevated" className="mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold mission-text">Mission Progress</h3>
              <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <React.Fragment key={i}>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    i + 1 <= currentStep 
                      ? "bg-launch-blue text-white" 
                      : "bg-gray-200 text-gray-600"
                  )}>
                    {i + 1 <= currentStep ? (
                      <Rocket className="w-4 h-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < totalSteps - 1 && (
                    <div className={cn(
                      "flex-1 h-1 rounded transition-colors",
                      i + 1 < currentStep ? "bg-launch-blue" : "bg-gray-200"
                    )} />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="flex justify-between text-xs text-gray-600">
              <span>Personal Info</span>
              <span>Experience</span>
              <span>Skills</span>
              <span>Review</span>
            </div>
          </div>
        </MissionCard>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <MissionCard variant="mission">
              <div className="space-y-6">
                <div className="text-center border-b border-slate-700 pb-4">
                  <h3 className="text-xl font-bold mission-text">Personal Information</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Basic information to identify you professionally
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {renderInput('fullName', 'Full Name', 'text', true, 'Enter your full name')}
                  {renderInput('email', 'Email Address', 'email', true, 'your.email@example.com')}
                  {renderInput('phone', 'Phone Number', 'tel', false, '+1 (555) 123-4567')}
                  {renderInput('location', 'Location', 'text', false, 'City, State')}
                </div>

                <div>
                  {renderTextarea('summary', 'Professional Summary', 4, 'Brief overview of your professional background and goals...')}
                </div>
              </div>
            </MissionCard>
          )}

          {/* Step 2: Work Experience */}
          {currentStep === 2 && (
            <MissionCard variant="mission">
              <div className="space-y-6">
                <div className="text-center border-b border-slate-700 pb-4">
                  <h3 className="text-xl font-bold mission-text">Work Experience</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Your most recent or relevant work experience
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {renderInput('jobTitle', 'Job Title', 'text', true, 'Software Engineer')}
                  {renderInput('company', 'Company', 'text', true, 'Company Name')}
                </div>

                <div>
                  {renderTextarea('workDescription', 'Job Description', 5, 'Describe your key responsibilities and achievements...')}
                </div>
              </div>
            </MissionCard>
          )}

          {/* Step 3: Skills */}
          {currentStep === 3 && (
            <MissionCard variant="mission">
              <div className="space-y-6">
                <div className="text-center border-b border-slate-700 pb-4">
                  <h3 className="text-xl font-bold mission-text">Skills & Technologies</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    List your technical and professional skills
                  </p>
                </div>

                <div>
                  {renderTextarea('skills', 'Skills (comma-separated)', 4, 'JavaScript, React, Node.js, Python, AWS...')}
                </div>
              </div>
            </MissionCard>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <MissionCard variant="mission">
              <div className="space-y-6">
                <div className="text-center border-b border-slate-700 pb-4">
                  <h3 className="text-xl font-bold mission-text">Review Your Information</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Please review your information before launching your mission
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-200">Personal Info</h4>
                    <p className="text-sm text-slate-400">{formData.fullName} • {formData.email}</p>
                  </div>
                  
                  {formData.jobTitle && (
                    <div>
                      <h4 className="font-semibold text-slate-200">Experience</h4>
                      <p className="text-sm text-slate-400">{formData.jobTitle} at {formData.company}</p>
                    </div>
                  )}
                  
                  {formData.skills && (
                    <div>
                      <h4 className="font-semibold text-slate-200">Skills</h4>
                      <p className="text-sm text-slate-400">{formData.skills}</p>
                    </div>
                  )}
                </div>
              </div>
            </MissionCard>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <div>
              <LaunchButton
                variant="outline"
                onClick={onCancel}
                type="button"
              >
                Cancel Mission
              </LaunchButton>
            </div>

            <div className="flex gap-3">
              {currentStep > 1 && (
                <LaunchButton
                  variant="outline"
                  onClick={prevStep}
                  type="button"
                >
                  Previous
                </LaunchButton>
              )}
              
              {currentStep < totalSteps ? (
                <LaunchButton
                  variant="mission"
                  onClick={nextStep}
                  type="button"
                  disabled={!canProceedFromStep()}
                >
                  Next Step
                </LaunchButton>
              ) : (
                <LaunchButton
                  variant="mission"
                  type="submit"
                  icon="rocket"
                  animation="rocket"
                >
                  Launch Mission
                </LaunchButton>
              )}
            </div>
          </div>
        </form>
      </MissionContainer>
    </div>
  );
}
