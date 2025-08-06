'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, MapPin, Linkedin, Globe, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionCard } from '@/components/layout';
import { personalInfoSchema } from '@/lib/validations/resume-schemas';

const personalFormSchema = personalInfoSchema.extend({
  summary: z.string().optional()
});

type PersonalInfoFormData = z.infer<typeof personalFormSchema>;

interface PersonalInfoFormProps {
  initialData?: Partial<PersonalInfoFormData>;
  onSave: (data: PersonalInfoFormData) => void;
  onCancel?: () => void;
  className?: string;
  autoSave?: boolean;
}

export function PersonalInfoForm({
  initialData,
  onSave,
  onCancel,
  className,
  autoSave = true
}: PersonalInfoFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isValid }
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalFormSchema) as any,
    defaultValues: {
      fullName: initialData?.fullName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      location: initialData?.location || '',
      linkedin: initialData?.linkedin || '',
      website: initialData?.website || '',
      summary: initialData?.summary || ''
    },
    mode: 'onBlur'
  });

  const watchedData = watch();

  // Auto-save functionality
  React.useEffect(() => {
    if (autoSave && isDirty && isValid) {
      const timeoutId = setTimeout(() => {
        onSave(watchedData);
      }, 1000); // Auto-save after 1 second of inactivity

      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [watchedData, isDirty, isValid, autoSave, onSave]);

  const handleFormSubmit = (data: PersonalInfoFormData) => {
    onSave(data);
  };

  const renderField = (
    name: keyof PersonalInfoFormData,
    label: string,
    type: 'text' | 'email' | 'url' = 'text',
    icon?: React.ReactNode,
    placeholder?: string,
    required = false
  ) => {
    const error = errors[name];
    
    return (
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {icon}
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        <input
          {...register(name)}
          type={type}
          placeholder={placeholder}
          className={cn(
            "w-full px-3 py-2 border rounded-md text-sm transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-launch-blue-200",
            error
              ? "border-red-300 bg-red-50"
              : "border-gray-300 hover:border-gray-400 focus:border-launch-blue"
          )}
        />
        {error && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <span>⚠️</span>
            {error.message}
          </p>
        )}
      </div>
    );
  };

  return (
    <MissionCard variant="elevated" className={cn('', className)}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Section Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="w-10 h-10 bg-launch-blue/10 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-launch-blue" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mission-text">Personal Information</h3>
            <p className="text-sm text-gray-600">Your basic contact information and professional summary</p>
          </div>
        </div>

        {/* Basic Information Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {renderField('fullName', 'Full Name', 'text', <User className="w-4 h-4" />, 'John Doe', true)}
          {renderField('email', 'Email Address', 'email', <Mail className="w-4 h-4" />, 'john@example.com', true)}
          {renderField('phone', 'Phone Number', 'text', <Phone className="w-4 h-4" />, '+1 (555) 123-4567')}
          {renderField('location', 'Location', 'text', <MapPin className="w-4 h-4" />, 'New York, NY')}
          {renderField('linkedin', 'LinkedIn Profile', 'url', <Linkedin className="w-4 h-4" />, 'https://linkedin.com/in/johndoe')}
          {renderField('website', 'Website/Portfolio', 'url', <Globe className="w-4 h-4" />, 'https://johndoe.com')}
        </div>

        {/* Professional Summary */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="w-4 h-4" />
            Professional Summary
          </label>
          <textarea
            {...register('summary')}
            rows={4}
            placeholder="Write a compelling professional summary that highlights your key achievements, skills, and career objectives. This is your elevator pitch to potential employers..."
            className={cn(
              "w-full px-3 py-2 border rounded-md text-sm transition-colors resize-y",
              "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-launch-blue-200",
              errors.summary
                ? "border-red-300 bg-red-50"
                : "border-gray-300 hover:border-gray-400 focus:border-launch-blue"
            )}
          />
          {errors.summary && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <span>⚠️</span>
              {errors.summary.message}
            </p>
          )}
          <div className="flex justify-between text-xs text-gray-500">
            <span>💡 Tip: Keep it concise but impactful (2-3 sentences)</span>
            <span>{watchedData.summary?.length || 0}/500</span>
          </div>
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