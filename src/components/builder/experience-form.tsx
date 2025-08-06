'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Briefcase, 
  Plus, 
 
  Building, 
  MapPin, 
  Calendar, 
  Clock,
  GripVertical,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionCard } from '@/components/layout';
import { experienceSchema } from '@/lib/validations/resume-schemas';

const experienceFormSchema = z.object({
  experiences: z.array(experienceSchema.extend({
    id: z.string().optional()
  }))
});

type ExperienceFormData = z.infer<typeof experienceFormSchema>;
type ExperienceEntry = ExperienceFormData['experiences'][0];

interface ExperienceFormProps {
  initialData?: ExperienceEntry[];
  onSave: (data: ExperienceEntry[]) => void;
  onCancel?: () => void;
  className?: string;
  autoSave?: boolean;
}

export function ExperienceForm({
  initialData = [],
  onSave,
  onCancel,
  className,
  autoSave = true
}: ExperienceFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty, isValid }
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceFormSchema) as any,
    defaultValues: {
      experiences: initialData.length > 0 ? initialData : [{
        id: crypto.randomUUID(),
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
        current: false
      }]
    },
    mode: 'onBlur'
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experiences'
  });

  const watchedData = watch();

  // Auto-save functionality
  React.useEffect(() => {
    if (autoSave && isDirty && isValid) {
      const timeoutId = setTimeout(() => {
        onSave(watchedData.experiences);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [watchedData.experiences, isDirty, isValid, autoSave, onSave]);

  const handleFormSubmit = (data: ExperienceFormData) => {
    onSave(data.experiences);
  };

  const addExperience = () => {
    append({
      id: crypto.randomUUID(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false
    });
  };

  const removeExperience = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  // const moveExperience = (from: number, to: number) => {
  //   move(from, to);
  // };

  const renderField = (
    name: string,
    label: string,
    type: 'text' | 'textarea' = 'text',
    icon?: React.ReactNode,
    placeholder?: string,
    required = false,
    rows = 3
  ) => {
    const fieldError = name.split('.').reduce((err: any, key) => err?.[key], errors);
    
    return (
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {icon}
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        {type === 'textarea' ? (
          <textarea
            {...register(name as any)}
            rows={rows}
            placeholder={placeholder}
            className={cn(
              "w-full px-3 py-2 border rounded-md text-sm transition-colors resize-y",
              "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-launch-blue-200",
              fieldError
                ? "border-red-300 bg-red-50"
                : "border-gray-300 hover:border-gray-400 focus:border-launch-blue"
            )}
          />
        ) : (
          <input
            {...register(name as any)}
            type={type}
            placeholder={placeholder}
            className={cn(
              "w-full px-3 py-2 border rounded-md text-sm transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-launch-blue-200",
              fieldError
                ? "border-red-300 bg-red-50"
                : "border-gray-300 hover:border-gray-400 focus:border-launch-blue"
            )}
          />
        )}
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
              <Briefcase className="w-5 h-5 text-launch-blue" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mission-text">Work Experience</h3>
              <p className="text-sm text-gray-600">Your professional work history and achievements</p>
            </div>
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

        {/* Experience Entries */}
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
                      {watchedData.experiences[index]?.title || `Experience ${index + 1}`}
                    </h4>
                  </div>
                  {fields.length > 1 && (
                    <LaunchButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </LaunchButton>
                  )}
                </div>

                {/* Main Fields Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {renderField(
                    `experiences.${index}.title`,
                    'Job Title',
                    'text',
                    <Briefcase className="w-4 h-4" />,
                    'Software Engineer',
                    true
                  )}
                  {renderField(
                    `experiences.${index}.company`,
                    'Company',
                    'text',
                    <Building className="w-4 h-4" />,
                    'Tech Corp Inc.',
                    true
                  )}
                  {renderField(
                    `experiences.${index}.location`,
                    'Location',
                    'text',
                    <MapPin className="w-4 h-4" />,
                    'San Francisco, CA'
                  )}
                  {renderField(
                    `experiences.${index}.startDate`,
                    'Start Date',
                    'text',
                    <Calendar className="w-4 h-4" />,
                    'January 2022'
                  )}
                </div>

                {/* Current Position Toggle */}
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      {...register(`experiences.${index}.current`)}
                      className="rounded border-gray-300 text-launch-blue focus:ring-launch-blue-200"
                    />
                    <Clock className="w-4 h-4 text-gray-500" />
                    This is my current position
                  </label>
                </div>

                {/* End Date (conditional) */}
                {!watchedData.experiences[index]?.current && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div></div> {/* Spacer */}
                    {renderField(
                      `experiences.${index}.endDate`,
                      'End Date',
                      'text',
                      <Calendar className="w-4 h-4" />,
                      'Present'
                    )}
                  </div>
                )}

                {/* Description */}
                {renderField(
                  `experiences.${index}.description`,
                  'Job Description & Achievements',
                  'textarea',
                  undefined,
                  'Describe your key responsibilities, achievements, and impact. Use bullet points and quantify results where possible (e.g., "Increased sales by 25%", "Led a team of 8 developers")...',
                  false,
                  4
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <span>💡</span>
            Experience Section Tips
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Start with your most recent experience first</li>
            <li>• Use action verbs and quantify your achievements</li>
            <li>• Focus on results and impact, not just responsibilities</li>
            <li>• Tailor your descriptions to match your target role</li>
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