'use client';

import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Minus, AlertCircle, CheckCircle2, Edit3, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionContainer, MissionSection, MissionCard } from '@/components/layout';
import type { ParsedResumeData } from '@/lib/parsers';
import { personalInfoSchema, experienceSchema, educationSchema } from '@/lib/validations/resume-schemas';

// Enhanced schemas for the review form
const reviewPersonalInfoSchema = personalInfoSchema.extend({
  summary: z.string().optional()
});

const reviewExperienceSchema = experienceSchema.extend({
  id: z.string().optional()
});

const reviewEducationSchema = educationSchema.extend({
  id: z.string().optional()
});

const dataReviewSchema = z.object({
  personalInfo: reviewPersonalInfoSchema,
  experience: z.array(reviewExperienceSchema),
  education: z.array(reviewEducationSchema),
  skills: z.array(z.string()),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    technologies: z.array(z.string()).optional(),
    url: z.string().optional()
  })).optional()
});

type DataReviewFormData = z.infer<typeof dataReviewSchema>;

interface DataReviewFormProps {
  initialData: ParsedResumeData;
  onSave: (data: ParsedResumeData) => void;
  onCancel: () => void;
  className?: string;
}

export function DataReviewForm({
  initialData,
  onSave,
  onCancel,
  className
}: DataReviewFormProps) {
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

  // Transform initial data for the form
  const transformToFormData = (data: ParsedResumeData): DataReviewFormData => {
    return {
      personalInfo: {
        fullName: data.personalInfo.fullName || '',
        email: data.personalInfo.email || '',
        phone: data.personalInfo.phone || '',
        location: data.personalInfo.location || '',
        linkedin: data.personalInfo.linkedin || '',
        website: data.personalInfo.website || '',
        summary: data.personalInfo.summary || ''
      },
      experience: (data.sections.experience || []).map((exp, index) => ({
        ...exp,
        id: `exp-${index}`,
        title: exp.title || '',
        company: exp.company || '',
        location: exp.location || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        description: exp.description || '',
        current: exp.current || false
      })),
      education: (data.sections.education || []).map((edu, index) => ({
        ...edu,
        id: `edu-${index}`,
        institution: edu.institution || '',
        degree: edu.degree || '',
        field: edu.field || '',
        location: edu.location || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        gpa: edu.gpa || ''
      })),
      skills: data.sections.skills || [],
      projects: (data.sections.projects || []).map(project => ({
        name: project.name || '',
        description: project.description,
        technologies: project.technologies,
        url: project.url
      }))
    };
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isDirty }
  } = useForm<DataReviewFormData>({
    resolver: zodResolver(dataReviewSchema),
    defaultValues: transformToFormData(initialData),
    mode: 'onBlur'
  });

  const watchedData = watch();

  React.useEffect(() => {
    setUnsavedChanges(isDirty);
  }, [isDirty]);

  const onSubmit = (data: DataReviewFormData) => {
    // Transform back to ParsedResumeData format
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
        ...(data.skills.length > 0 && { skills: data.skills }),
        ...(data.projects && data.projects.length > 0 && {
          projects: data.projects.map(project => ({
            ...(project.name && { name: project.name }),
            ...(project.description && { description: project.description }),
            ...(project.technologies && { technologies: project.technologies }),
            ...(project.url && { url: project.url })
          }))
        })
      },
      rawText: initialData.rawText,
      extractedDates: initialData.extractedDates,
      extractedEmails: initialData.extractedEmails,
      extractedPhones: initialData.extractedPhones,
      confidence: initialData.confidence
    };

    onSave(transformedData);
  };

  const addExperienceEntry = () => {
    const currentExp = getValues('experience');
    setValue('experience', [
      ...currentExp,
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

  const removeExperienceEntry = (index: number) => {
    const currentExp = getValues('experience');
    setValue('experience', currentExp.filter((_, i) => i !== index));
  };

  const addEducationEntry = () => {
    const currentEdu = getValues('education');
    setValue('education', [
      ...currentEdu,
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

  const removeEducationEntry = (index: number) => {
    const currentEdu = getValues('education');
    setValue('education', currentEdu.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    const currentSkills = getValues('skills');
    setValue('skills', [...currentSkills, '']);
  };

  const removeSkill = (index: number) => {
    const currentSkills = getValues('skills');
    setValue('skills', currentSkills.filter((_, i) => i !== index));
  };

  const updateSkill = (index: number, value: string) => {
    const currentSkills = getValues('skills');
    const updated = [...currentSkills];
    updated[index] = value;
    setValue('skills', updated);
  };

  const getFieldError = (fieldName: string) => {
    const fieldError = errors as any;
    return fieldName.split('.').reduce((err, key) => err?.[key], fieldError);
  };

  const renderInputField = (
    name: string,
    label: string,
    type: 'text' | 'email' | 'url' = 'text',
    required = false,
    placeholder?: string
  ) => {
    const error = getFieldError(name);
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {label}
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

  const renderTextareaField = (name: string, label: string, rows = 3, placeholder?: string) => {
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
      <MissionContainer maxWidth="full" padding="lg" background="transparent">
        <MissionSection
          title="Resume Data Review"
          subtitle="Review and edit your extracted resume data. Make corrections and add missing information before proceeding to mission control."
          icon={<Edit3 className="w-6 h-6 text-launch-blue" />}
        >
          <></>
        </MissionSection>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section Navigation */}
          <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-lg">
            {[
              { id: 'personal', label: 'Personal Info', icon: '👤' },
              { id: 'experience', label: 'Experience', icon: '💼' },
              { id: 'education', label: 'Education', icon: '🎓' },
              { id: 'skills', label: 'Skills', icon: '🔧' }
            ].map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  activeSection === section.id
                    ? "bg-white text-launch-blue shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <span className="mr-2">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </div>

          {/* Personal Information Section */}
          {activeSection === 'personal' && (
            <MissionCard variant="elevated">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mission-text">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {renderInputField('personalInfo.fullName', 'Full Name', 'text', true, 'Enter your full name')}
                  {renderInputField('personalInfo.email', 'Email Address', 'email', true, 'your.email@example.com')}
                  {renderInputField('personalInfo.phone', 'Phone Number', 'text', false, '+1 (555) 123-4567')}
                  {renderInputField('personalInfo.location', 'Location', 'text', false, 'City, State')}
                  {renderInputField('personalInfo.linkedin', 'LinkedIn Profile', 'url', false, 'https://linkedin.com/in/yourprofile')}
                  {renderInputField('personalInfo.website', 'Website/Portfolio', 'url', false, 'https://yourwebsite.com')}
                </div>
                <div>
                  {renderTextareaField('personalInfo.summary', 'Professional Summary', 4, 'Brief summary of your professional background and goals...')}
                </div>
              </div>
            </MissionCard>
          )}

          {/* Experience Section */}
          {activeSection === 'experience' && (
            <MissionCard variant="elevated">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold mission-text">Work Experience</h3>
                  <LaunchButton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addExperienceEntry}
                    icon="none"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </LaunchButton>
                </div>

                {watchedData.experience.map((exp, index) => (
                  <div key={exp.id || index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
                      {watchedData.experience.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExperienceEntry(index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {renderInputField(`experience.${index}.title`, 'Job Title', 'text', true, 'Software Engineer')}
                      {renderInputField(`experience.${index}.company`, 'Company', 'text', true, 'Company Name')}
                      {renderInputField(`experience.${index}.location`, 'Location', 'text', false, 'City, State')}
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
                      {renderInputField(`experience.${index}.startDate`, 'Start Date', 'text', false, 'Jan 2023')}
                      {!watchedData.experience[index]?.current && renderInputField(`experience.${index}.endDate`, 'End Date', 'text', false, 'Dec 2023')}
                    </div>
                    {renderTextareaField(`experience.${index}.description`, 'Job Description', 4, 'Describe your responsibilities and achievements...')}
                  </div>
                ))}
              </div>
            </MissionCard>
          )}

          {/* Education Section */}
          {activeSection === 'education' && (
            <MissionCard variant="elevated">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold mission-text">Education</h3>
                  <LaunchButton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEducationEntry}
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
                          onClick={() => removeEducationEntry(index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {renderInputField(`education.${index}.institution`, 'Institution', 'text', true, 'University Name')}
                      {renderInputField(`education.${index}.degree`, 'Degree', 'text', true, 'Bachelor of Science')}
                      {renderInputField(`education.${index}.field`, 'Field of Study', 'text', false, 'Computer Science')}
                      {renderInputField(`education.${index}.location`, 'Location', 'text', false, 'City, State')}
                      {renderInputField(`education.${index}.startDate`, 'Start Date', 'text', false, '2019')}
                      {renderInputField(`education.${index}.endDate`, 'Graduation Date', 'text', false, '2023')}
                      {renderInputField(`education.${index}.gpa`, 'GPA (Optional)', 'text', false, '3.8')}
                    </div>
                  </div>
                ))}

                {watchedData.education.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No education entries found. Click &quot;Add Education&quot; to add your educational background.</p>
                  </div>
                )}
              </div>
            </MissionCard>
          )}

          {/* Skills Section */}
          {activeSection === 'skills' && (
            <MissionCard variant="elevated">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold mission-text">Skills</h3>
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
                        placeholder="Enter a skill"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-launch-blue-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {watchedData.skills.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No skills found. Click &quot;Add Skill&quot; to list your professional skills.</p>
                  </div>
                )}
              </div>
            </MissionCard>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {unsavedChanges ? (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  You have unsaved changes
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  All changes saved
                </>
              )}
            </div>

            <div className="flex gap-3">
              <LaunchButton
                type="button"
                variant="ghost"
                onClick={onCancel}
              >
                Cancel
              </LaunchButton>
              
              <LaunchButton
                type="submit"
                variant="mission"
                icon="rocket"
                iconPosition="right"
                animation="rocket"
                size="lg"
              >
                Save & Continue to Mission Control
              </LaunchButton>
            </div>
          </div>
        </form>
      </MissionContainer>
    </div>
  );
}