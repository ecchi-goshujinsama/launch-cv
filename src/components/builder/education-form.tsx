'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  GraduationCap, 
  Plus, 
  MapPin, 
  Calendar, 
  Award,
  GripVertical,
  Trash2,
  School
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionCard } from '@/components/layout';
import { educationSchema } from '@/lib/validations/resume-schemas';

const educationFormSchema = z.object({
  education: z.array(educationSchema.extend({
    id: z.string().optional()
  }))
});

type EducationFormData = z.infer<typeof educationFormSchema>;
type EducationEntry = EducationFormData['education'][0];

interface EducationFormProps {
  initialData?: EducationEntry[];
  onSave: (data: EducationEntry[]) => void;
  onCancel?: () => void;
  className?: string;
  autoSave?: boolean;
}

export function EducationForm({
  initialData = [],
  onSave,
  onCancel,
  className,
  autoSave = true
}: EducationFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty, isValid }
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationFormSchema) as any,
    defaultValues: {
      education: initialData.length > 0 ? initialData : [{
        id: crypto.randomUUID(),
        institution: '',
        degree: '',
        field: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: ''
      }]
    },
    mode: 'onBlur'
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education'
  });

  const watchedData = watch();

  // Auto-save functionality
  React.useEffect(() => {
    if (autoSave && isDirty && isValid) {
      const timeoutId = setTimeout(() => {
        onSave(watchedData.education);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [watchedData.education, isDirty, isValid, autoSave, onSave]);

  const handleFormSubmit = (data: EducationFormData) => {
    onSave(data.education);
  };

  const addEducation = () => {
    append({
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: ''
    });
  };

  const removeEducation = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  // const moveEducation = (from: number, to: number) => {
  //   move(from, to);
  // };

  const renderField = (
    name: string,
    label: string,
    type: 'text' | 'number' = 'text',
    icon?: React.ReactNode,
    placeholder?: string,
    required = false
  ) => {
    const fieldError = name.split('.').reduce((err: any, key) => err?.[key], errors);
    
    return (
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {icon}
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        <input
          {...register(name as any)}
          type={type}
          placeholder={placeholder}
          step={type === 'number' ? '0.1' : undefined}
          min={type === 'number' ? '0' : undefined}
          max={type === 'number' ? '4' : undefined}
          className={cn(
            "w-full px-3 py-2 border rounded-md text-sm transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-launch-blue-200",
            fieldError
              ? "border-red-300 bg-red-50"
              : "border-gray-300 hover:border-gray-400 focus:border-launch-blue"
          )}
        />
        {fieldError && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <span>⚠️</span>
            {fieldError.message}
          </p>
        )}
      </div>
    );
  };

  return (
    <MissionCard variant="elevated" className={cn('', className)}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-launch-blue/10 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-launch-blue" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mission-text">Education</h3>
              <p className="text-sm text-gray-600">Your academic background and qualifications</p>
            </div>
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

        {/* Education Entries */}
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="relative">
              <div className="p-4 border border-gray-200 rounded-lg space-y-4 bg-white">
                {/* Entry Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
                      onMouseDown={(e) => {
                        // Drag functionality would be implemented here
                        e.preventDefault();
                      }}
                    >
                      <GripVertical className="w-4 h-4" />
                    </button>
                    <h4 className="font-medium text-gray-900">
                      {watchedData.education[index]?.degree && watchedData.education[index]?.institution
                        ? `${watchedData.education[index].degree} - ${watchedData.education[index].institution}`
                        : `Education ${index + 1}`
                      }
                    </h4>
                  </div>
                  {fields.length > 1 && (
                    <LaunchButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </LaunchButton>
                  )}
                </div>

                {/* Main Fields Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {renderField(
                    `education.${index}.institution`,
                    'School/University',
                    'text',
                    <School className="w-4 h-4" />,
                    'University of California',
                    true
                  )}
                  {renderField(
                    `education.${index}.degree`,
                    'Degree',
                    'text',
                    <GraduationCap className="w-4 h-4" />,
                    'Bachelor of Science',
                    true
                  )}
                  {renderField(
                    `education.${index}.field`,
                    'Field of Study',
                    'text',
                    <Award className="w-4 h-4" />,
                    'Computer Science'
                  )}
                  {renderField(
                    `education.${index}.location`,
                    'Location',
                    'text',
                    <MapPin className="w-4 h-4" />,
                    'Berkeley, CA'
                  )}
                  {renderField(
                    `education.${index}.startDate`,
                    'Start Date',
                    'text',
                    <Calendar className="w-4 h-4" />,
                    '2018'
                  )}
                  {renderField(
                    `education.${index}.endDate`,
                    'Graduation Date',
                    'text',
                    <Calendar className="w-4 h-4" />,
                    '2022'
                  )}
                </div>

                {/* GPA Field (full width) */}
                <div className="grid md:grid-cols-4 gap-4">
                  <div></div> {/* Spacer */}
                  <div></div> {/* Spacer */}
                  <div></div> {/* Spacer */}
                  {renderField(
                    `education.${index}.gpa`,
                    'GPA (Optional)',
                    'text',
                    <Award className="w-4 h-4" />,
                    '3.8'
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <span>💡</span>
            Education Section Tips
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• List your highest degree first, then work backwards</li>
            <li>• Include relevant coursework, honors, or academic achievements</li>
            <li>• Only include GPA if it&apos;s 3.5 or higher</li>
            <li>• Add certifications, bootcamps, or professional training</li>
          </ul>
        </div>

        {/* Auto-save Status */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {autoSave ? (
              isDirty ? (
                <>
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                  Auto-saving changes...
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  All changes saved
                </>
              )
            ) : (
              <>
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
                Auto-save disabled
              </>
            )}
          </div>

          {/* Manual Save Buttons */}
          {!autoSave && (
            <div className="flex gap-3">
              {onCancel && (
                <LaunchButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                >
                  Cancel
                </LaunchButton>
              )}
              <LaunchButton
                type="submit"
                variant="mission"
                size="sm"
                disabled={!isDirty || !isValid}
                icon="rocket"
                iconPosition="right"
              >
                Save Changes
              </LaunchButton>
            </div>
          )}
        </div>
      </form>
    </MissionCard>
  );
}