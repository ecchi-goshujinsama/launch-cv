'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, MapPin, Linkedin, Globe, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { FieldTooltip } from '@/components/ui/tooltip';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { MissionCard } from '@/components/layout';
import { personalInfoSchema } from '@/lib/validations/resume-schemas';
import { useUndoRedo } from '@/lib/hooks/use-undo-redo';

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
    setValue,
    formState: { errors, isDirty, isValid }
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalFormSchema),
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
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSavedAt, setLastSavedAt] = React.useState<Date>();
  
  // Undo/Redo functionality
  const [, undoRedoActions] = useUndoRedo<PersonalInfoFormData>(watchedData, 20);

  // Auto-save functionality with progress indication
  React.useEffect(() => {
    if (autoSave && isDirty && isValid) {
      setSaveStatus('saving');
      const timeoutId = setTimeout(() => {
        try {
          onSave(watchedData);
          undoRedoActions.pushState(watchedData);
          setSaveStatus('saved');
          setLastSavedAt(new Date());
        } catch {
          setSaveStatus('error');
        }
      }, 1000); // Auto-save after 1 second of inactivity

      return () => {
        clearTimeout(timeoutId);
        setSaveStatus(prevStatus =>
          prevStatus === 'saving' ? 'idle' : prevStatus
        );
      };
    }
    return undefined;
  }, [watchedData, isDirty, isValid, autoSave, onSave, undoRedoActions, saveStatus]);

  const handleFormSubmit = (data: PersonalInfoFormData) => {
    onSave(data);
    undoRedoActions.pushState(data);
  };

  // Undo/Redo handlers
  const handleUndo = () => {
    const previousState = undoRedoActions.undo();
    if (previousState) {
      Object.keys(previousState).forEach(key => {
        setValue(key as keyof PersonalInfoFormData, previousState[key as keyof PersonalInfoFormData]);
      });
    }
  };

  const handleRedo = () => {
    const nextState = undoRedoActions.redo();
    if (nextState) {
      Object.keys(nextState).forEach(key => {
        setValue(key as keyof PersonalInfoFormData, nextState[key as keyof PersonalInfoFormData]);
      });
    }
  };

  const renderField = (
    name: keyof PersonalInfoFormData,
    label: string,
    type: 'text' | 'email' | 'url' = 'text',
    icon?: React.ReactNode,
    placeholder?: string,
    required = false,
    tooltip?: string
  ) => {
    const error = errors[name];
    
    return (
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-200">
          {icon}
          {label}
          {required && <span className="text-red-500">*</span>}
          {tooltip && <FieldTooltip content={tooltip} />}
        </label>
        <input
          {...register(name)}
          type={type}
          placeholder={placeholder}
          className={cn(
            "w-full px-3 py-2 border rounded-md text-sm transition-colors",
            "text-slate-100 bg-slate-800 placeholder-slate-400 border-slate-600",
            "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-launch-blue-200",
            "hover:border-slate-500 focus:border-launch-blue focus:bg-slate-700",
            error
              ? "border-red-400 bg-red-900/20"
              : ""
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
        <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
          <div className="w-10 h-10 bg-launch-blue/10 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-launch-blue" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mission-text">Personal Information</h3>
            <p className="text-sm text-slate-400">Your basic contact information and professional summary</p>
          </div>
        </div>

        {/* Basic Information Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {renderField(
            'fullName', 
            'Full Name', 
            'text', 
            <User className="w-4 h-4" />, 
            'John Doe', 
            true,
            'Your full name as you want it to appear on your resume'
          )}
          {renderField(
            'email', 
            'Email Address', 
            'email', 
            <Mail className="w-4 h-4" />, 
            'john@example.com', 
            true,
            'Professional email address that employers can use to contact you'
          )}
          {renderField(
            'phone', 
            'Phone Number', 
            'text', 
            <Phone className="w-4 h-4" />, 
            '+1 (555) 123-4567',
            false,
            'Phone number with area code. Include country code for international positions'
          )}
          {renderField(
            'location', 
            'Location', 
            'text', 
            <MapPin className="w-4 h-4" />, 
            'New York, NY',
            false,
            'City and state/country. This helps employers understand your location for remote/local opportunities'
          )}
          {renderField(
            'linkedin', 
            'LinkedIn Profile', 
            'url', 
            <Linkedin className="w-4 h-4" />, 
            'https://linkedin.com/in/johndoe',
            false,
            'Your LinkedIn profile URL. Make sure your profile is up-to-date and professional'
          )}
          {renderField(
            'website', 
            'Website/Portfolio', 
            'url', 
            <Globe className="w-4 h-4" />, 
            'https://johndoe.com',
            false,
            'Personal website, portfolio, or GitHub profile to showcase your work'
          )}
        </div>

        {/* Professional Summary */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-200">
            <FileText className="w-4 h-4" />
            Professional Summary
            <FieldTooltip content="A compelling 2-3 sentence overview of your professional background, key skills, and career objectives. This is your elevator pitch to employers." />
          </label>
          <textarea
            {...register('summary')}
            rows={4}
            placeholder="Write a compelling professional summary that highlights your key achievements, skills, and career objectives. This is your elevator pitch to potential employers..."
            className={cn(
              "w-full px-3 py-2 border rounded-md text-sm transition-colors resize-y",
              "text-slate-100 bg-slate-800 placeholder-slate-400 border-slate-600",
              "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-launch-blue-200",
              "hover:border-slate-500 focus:border-launch-blue focus:bg-slate-700",
              errors.summary
                ? "border-red-400 bg-red-900/20"
                : ""
            )}
          />
          {errors.summary && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <span>⚠️</span>
              {errors.summary.message}
            </p>
          )}
          <div className="flex justify-between text-xs text-slate-400">
 const personalFormSchema = personalInfoSchema.extend({
  summary: z.string().max(500, 'Summary must be 500 characters or less').optional()
 });
        </div>

        {/* Enhanced Progress and Undo/Redo Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
          <div className="flex items-center gap-4">
            {autoSave ? (
              <ProgressIndicator 
                status={saveStatus} 
                variant="mission"
                {...(lastSavedAt && { lastSavedAt })}
                className="text-sm"
              />
            ) : (
              <ProgressIndicator 
                status="idle" 
                message="Auto-save disabled"
                variant="detailed"
                className="text-sm text-gray-600"
              />
            )}
            
            {/* Undo/Redo Controls */}
            <div className="flex items-center gap-1">
              <LaunchButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                disabled={!undoRedoActions.canUndo}
                title="Undo (Ctrl+Z)"
                icon="none"
              >
                ↶
              </LaunchButton>
              <LaunchButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRedo}
                disabled={!undoRedoActions.canRedo}
                title="Redo (Ctrl+Y)"
                icon="none"
              >
                ↷
              </LaunchButton>
            </div>
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