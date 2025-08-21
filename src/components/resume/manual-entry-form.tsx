'use client';

import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileText, Plus, Minus, AlertCircle, Rocket, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionContainer, MissionSection, MissionCard } from '@/components/layout';
import type { ParsedResumeData } from '@/lib/parsers';
import { 
  personalInfoSchema, 
  experienceSchema, 
  educationSchema 
} from '@/lib/validations/resume-schemas';

// Manual entry schema (similar to review form but starts empty)
const manualEntrySchema = z.object({
  personalInfo: personalInfoSchema.extend({
    summary: z.string().optional()
  }),
  experience: z.array(experienceSchema.extend({
    id: z.string().optional()
  })),
  education: z.array(educationSchema.extend({
    id: z.string().optional()
  })),
  skills: z.array(z.string().min(1, 'Skill cannot be empty')),
  projects: z.array(z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().optional(),
    technologies: z.array(z.string()).optional(),
    url: z.string().optional()
  })).optional()
});

type ManualEntryFormData = z.infer<typeof manualEntrySchema>;

interface ManualEntryFormProps {
  onSubmit: (data: ParsedResumeData) => void;
  onCancel: () => void;
  initialData?: Partial<ParsedResumeData>;
  className?: string;
}

export function ManualEntryForm({
  onSubmit,
  onCancel,
  initialData,
  className
}: ManualEntryFormProps) {
  // const [activeSection] = useState<string>('personal'); // Unused in current implementation
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 4;

  // Default empty form data
  const getDefaultFormData = (): ManualEntryFormData => {
    return {
      personalInfo: {
        fullName: initialData?.personalInfo?.fullName || '',
        email: initialData?.personalInfo?.email || '',
        phone: initialData?.personalInfo?.phone || '',
        location: initialData?.personalInfo?.location || '',
        linkedin: initialData?.personalInfo?.linkedin || '',
        website: initialData?.personalInfo?.website || '',
        summary: initialData?.personalInfo?.summary || ''
      },
      experience: initialData?.sections?.experience?.length ? 
        initialData.sections.experience.map((exp, index) => ({ 
          id: `exp-${index}`,
          title: exp.title || '',
          company: exp.company || '',
          location: exp.location || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          description: exp.description || '',
          current: exp.current || false
        })) : 
        [{
          id: 'exp-1',
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          description: '',
          current: false
        }],
      education: initialData?.sections?.education?.length ?
        initialData.sections.education.map((edu, index) => ({ 
          id: `edu-${index}`,
          institution: edu.institution || '',
          degree: edu.degree || '',
          field: edu.field || '',
          location: edu.location || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || '',
          gpa: edu.gpa || ''
        })) :
        [{
          id: 'edu-1',
          institution: '',
          degree: '',
          field: '',
          location: '',
          startDate: '',
          endDate: '',
          gpa: ''
        }],
      skills: initialData?.sections?.skills?.length ? initialData.sections.skills : [''],
      projects: initialData?.sections?.projects?.map(project => ({
        name: project.name || '',
        description: project.description,
        technologies: project.technologies,
        url: project.url
      })) || []
    };
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isValid },
    trigger
  } = useForm<ManualEntryFormData>({
    resolver: zodResolver(manualEntrySchema),
    defaultValues: getDefaultFormData(),
    mode: 'onBlur'
  });

  const watchedData = watch();

  const handleFormSubmit = (data: ManualEntryFormData) => {
    // Transform to ParsedResumeData format
    const transformedData: ParsedResumeData = {
      personalInfo: {
        ...(data.personalInfo.fullName && { fullName: data.personalInfo.fullName }),
        ...(data.personalInfo.email && { email: data.personalInfo.email }),
        ...(data.personalInfo.phone && { phone: data.personalInfo.phone }),
        ...(data.personalInfo.location && { location: data.personalInfo.location }),
        ...(data.personalInfo.linkedin && { linkedin: data.personalInfo.linkedin }),
        ...(data.personalInfo.website && { website: data.personalInfo.website }),
        ...(data.personalInfo.summary && { summary: data.personalInfo.summary })
      },
      sections: {
        ...(data.experience.length > 0 && {
          experience: data.experience.map(exp => ({
            ...(exp.title && { title: exp.title }),
            ...(exp.company && { company: exp.company }),
            ...(exp.location && { location: exp.location }),
            ...(exp.startDate && { startDate: exp.startDate }),
            ...(exp.endDate && { endDate: exp.endDate }),
            ...(exp.description && { description: exp.description }),
            ...(exp.current !== undefined && { current: exp.current })
          }))
        }),
        ...(data.education.length > 0 && {
          education: data.education.map(edu => ({
            ...(edu.institution && { institution: edu.institution }),
            ...(edu.degree && { degree: edu.degree }),
            ...(edu.field && { field: edu.field }),
            ...(edu.location && { location: edu.location }),
            ...(edu.startDate && { startDate: edu.startDate }),
            ...(edu.endDate && { endDate: edu.endDate }),
            ...(edu.gpa && { gpa: edu.gpa })
          }))
        }),
        ...(data.skills.filter(skill => skill.trim() !== '').length > 0 && { 
          skills: data.skills.filter(skill => skill.trim() !== '') 
        }),
        ...(data.projects && data.projects.length > 0 && {
          projects: data.projects.map(project => ({
            ...(project.name && { name: project.name }),
            ...(project.description && { description: project.description }),
            ...(project.technologies && { technologies: project.technologies }),
            ...(project.url && { url: project.url })
          }))
        })
      },
      rawText: 'Manually entered data',
      extractedDates: [],
      extractedEmails: data.personalInfo.email ? [data.personalInfo.email] : [],
      extractedPhones: data.personalInfo.phone ? [data.personalInfo.phone] : [],
      confidence: 1.0 // Manual entry is 100% confident
    };

    onSubmit(transformedData);
  };

  const nextStep = async () => {
    const isStepValid = await trigger();
    if (isStepValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      // Update active section based on step - not currently used
      // const sections = ['personal', 'experience', 'education', 'skills'];
      // setActiveSection(sections[currentStep]); // currentStep will be incremented - not used
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // const sections = ['personal', 'experience', 'education', 'skills'];
      // setActiveSection(sections[currentStep - 2]); // currentStep will be decremented - not used
    }
  };

  // Experience management
  const addExperience = () => {
    const current = getValues('experience');
    setValue('experience', [
      ...current,
      {
        id: `exp-new-${Date.now()}`,
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
        current: false
      }
    ]);
  };

  const removeExperience = (index: number) => {
    const current = getValues('experience');
    if (current.length > 1) {
      setValue('experience', current.filter((_, i) => i !== index));
    }
  };

  // Education management
  const addEducation = () => {
    const current = getValues('education');
    setValue('education', [
      ...current,
      {
        id: `edu-new-${Date.now()}`,
        institution: '',
        degree: '',
        field: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: ''
      }
    ]);
  };

  const removeEducation = (index: number) => {
    const current = getValues('education');
    if (current.length > 1) {
      setValue('education', current.filter((_, i) => i !== index));
    }
  };

  // Skills management
  const addSkill = () => {
    const current = getValues('skills');
    setValue('skills', [...current, '']);
  };

  const removeSkill = (index: number) => {
    const current = getValues('skills');
    if (current.length > 1) {
      setValue('skills', current.filter((_, i) => i !== index));
    }
  };

  const updateSkill = (index: number, value: string) => {
    const current = getValues('skills');
    const updated = [...current];
    updated[index] = value;
    setValue('skills', updated);
  };

  const getFieldError = (fieldName: string) => {
    const keys = fieldName.split('.');
    let current: any = errors;
    for (const key of keys) {
      if (!current) return undefined;
      current = current[key];
    }
    return current as { message?: string } | undefined;
  };

  const renderInput = (
    name: string,
    label: string,
    type: 'text' | 'email' | 'url' = 'text',
    required = false,
    placeholder?: string
  ) => {
    const error = getFieldError(name);
    return (
      <div className="space-y-1">
          {...register(name as keyof ManualEntryFormData)}
          type={type}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          {...register(name as any)}
          type={type}
          placeholder={placeholder}
          className={cn(
            "w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-offset-1",
            error 
              ? "border-red-300 focus:ring-red-200" 
              : "border-gray-300 focus:ring-launch-blue-200"
          )}
        />
        {error && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error.message}
          </p>
        )}
      </div>
    );
  };

  const renderTextarea = (name: string, label: string, rows = 3, placeholder?: string) => {
    const error = getFieldError(name);
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <textarea
          {...register(name as any)}
          rows={rows}
          placeholder={placeholder}
          className={cn(
            "w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 resize-y",
            error 
              ? "border-red-300 focus:ring-red-200" 
              : "border-gray-300 focus:ring-launch-blue-200"
          )}
        />
        {error && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error.message}
          </p>
        )}
      </div>
    );
  };

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
              <span>Education</span>
              <span>Skills</span>
            </div>
          </div>
        </MissionCard>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <MissionCard variant="mission">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👤</span>
                  <h3 className="text-lg font-semibold mission-text">Personal Information</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {renderInput('personalInfo.fullName', 'Full Name', 'text', true, 'John Doe')}
                  {renderInput('personalInfo.email', 'Email Address', 'email', true, 'john@example.com')}
                  {renderInput('personalInfo.phone', 'Phone Number', 'text', false, '+1 (555) 123-4567')}
                  {renderInput('personalInfo.location', 'Location', 'text', false, 'New York, NY')}
                  {renderInput('personalInfo.linkedin', 'LinkedIn Profile', 'url', false, 'https://linkedin.com/in/johndoe')}
                  {renderInput('personalInfo.website', 'Website/Portfolio', 'url', false, 'https://johndoe.com')}
                </div>
                
                <div>
                  {renderTextarea('personalInfo.summary', 'Professional Summary', 4, 'Write a brief summary of your professional background, key skills, and career objectives...')}
                </div>
              </div>
            </MissionCard>
          )}

          {/* Step 2: Experience */}
          {currentStep === 2 && (
            <MissionCard variant="mission">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💼</span>
                    <h3 className="text-lg font-semibold mission-text">Work Experience</h3>
                  </div>
                  <LaunchButton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addExperience}
                    icon="none"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </LaunchButton>
                </div>

                {watchedData.experience.map((exp, index) => (
                  <div key={exp.id || index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Position {index + 1}</h4>
                      {watchedData.experience.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {renderInput(`experience.${index}.title`, 'Job Title', 'text', true, 'Software Engineer')}
                      {renderInput(`experience.${index}.company`, 'Company', 'text', true, 'Tech Corp')}
                      {renderInput(`experience.${index}.location`, 'Location', 'text', false, 'San Francisco, CA')}
                      <div className="space-y-1">
                        <label className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            {...register(`experience.${index}.current`)}
                            className="mr-2 rounded border-gray-300 text-launch-blue focus:ring-launch-blue-200"
                          />
                          This is my current position
                        </label>
                      </div>
                      {renderInput(`experience.${index}.startDate`, 'Start Date', 'text', false, 'January 2022')}
                      {!watchedData.experience[index]?.current && 
                        renderInput(`experience.${index}.endDate`, 'End Date', 'text', false, 'Present')
                      }
                    </div>
                    
                    {renderTextarea(`experience.${index}.description`, 'Job Description', 4, 'Describe your key responsibilities, achievements, and impact in this role...')}
                  </div>
                ))}
              </div>
            </MissionCard>
          )}

          {/* Step 3: Education */}
          {currentStep === 3 && (
            <MissionCard variant="mission">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎓</span>
                    <h3 className="text-lg font-semibold mission-text">Education</h3>
                  </div>
                  <LaunchButton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEducation}
                    icon="none"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </LaunchButton>
                </div>

                {watchedData.education.map((edu, index) => (
                  <div key={edu.id || index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Education {index + 1}</h4>
                      {watchedData.education.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEducation(index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {renderInput(`education.${index}.institution`, 'School/University', 'text', true, 'University of California')}
                      {renderInput(`education.${index}.degree`, 'Degree', 'text', true, 'Bachelor of Science')}
                      {renderInput(`education.${index}.field`, 'Field of Study', 'text', false, 'Computer Science')}
                      {renderInput(`education.${index}.location`, 'Location', 'text', false, 'Berkeley, CA')}
                      {renderInput(`education.${index}.startDate`, 'Start Year', 'text', false, '2018')}
                      {renderInput(`education.${index}.endDate`, 'Graduation Year', 'text', false, '2022')}
                      {renderInput(`education.${index}.gpa`, 'GPA (Optional)', 'text', false, '3.8')}
                    </div>
                  </div>
                ))}
              </div>
            </MissionCard>
          )}

          {/* Step 4: Skills */}
          {currentStep === 4 && (
            <MissionCard variant="mission">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔧</span>
                    <h3 className="text-lg font-semibold mission-text">Skills & Expertise</h3>
                  </div>
                  <LaunchButton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSkill}
                    icon="none"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </LaunchButton>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {watchedData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => updateSkill(index, e.target.value)}
                        placeholder="e.g., JavaScript, Project Management"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-launch-blue-200"
                      />
                      {watchedData.skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h4 className="font-medium text-blue-900 mb-2">💡 Skill Tips</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Include both technical and soft skills relevant to your target role</li>
                    <li>• Be specific (e.g., &quot;React.js&quot; instead of just &quot;JavaScript&quot;)</li>
                    <li>• Add skills that match job descriptions you&apos;re interested in</li>
                  </ul>
                </div>
              </div>
            </MissionCard>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="flex gap-3">
              <LaunchButton
                type="button"
                variant="ghost"
                onClick={onCancel}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Cancel
              </LaunchButton>
              
              {currentStep > 1 && (
                <LaunchButton
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                >
                  Previous Step
                </LaunchButton>
              )}
            </div>
            
            {currentStep < totalSteps ? (
              <LaunchButton
                type="button"
                variant="mission"
                onClick={nextStep}
              >
                Next Step
              </LaunchButton>
            ) : (
              <LaunchButton
                type="submit"
                variant="mission"
                icon="rocket"
                iconPosition="right"
                animation="rocket"
                size="lg"
                disabled={!isValid}
              >
                Launch Mission Control
              </LaunchButton>
            )}
          </div>
        </form>
      </MissionContainer>
    </div>
  );
}