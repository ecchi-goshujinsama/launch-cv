import { useForm, UseFormReturn, FieldPath, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useResumeStore } from '../stores/resume-store';
import { useCallback, useEffect } from 'react';

// Generic form hook with Zod validation
export function useZodForm<TSchema extends z.ZodType<any, any>>(
  schema: TSchema,
  defaultValues?: Partial<z.infer<TSchema>>
) {
  return useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as z.infer<TSchema>,
    mode: 'onBlur'
  });
}

// Auto-save form hook
export function useAutoSaveForm<TSchema extends z.ZodType<any, any>>(
  schema: TSchema,
  onSave: (data: z.infer<TSchema>) => void,
  defaultValues?: Partial<z.infer<TSchema>>,
  debounceMs: number = 1000
) {
  const form = useZodForm(schema, defaultValues);
  const { watch } = form;

  const debouncedSave = useCallback(
    debounce((data: z.infer<TSchema>) => {
      const isValid = schema.safeParse(data).success;
      if (isValid) {
        onSave(data);
      }
    }, debounceMs),
    [onSave, schema, debounceMs]
  );

  useEffect(() => {
    const subscription = watch((data) => {
      debouncedSave(data as z.infer<TSchema>);
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedSave]);

  return form;
}

// Resume section form hook with automatic store integration
export function useResumeForm<TSchema extends z.ZodType<any, any>>(
  schema: TSchema,
  sectionId?: string,
  itemId?: string,
  defaultValues?: Partial<z.infer<TSchema>>
) {
  const { updatePersonalInfo, updateSection, updateSectionItem, markDirty } = useResumeStore();

  const onSave = useCallback(
    (data: z.infer<TSchema>) => {
      if (sectionId && itemId) {
        // Updating a section item
        updateSectionItem(sectionId, itemId, data);
      } else if (sectionId) {
        // Updating a section
        updateSection(sectionId, data);
      } else {
        // Updating personal info
        updatePersonalInfo(data);
      }
      markDirty();
    },
    [sectionId, itemId, updatePersonalInfo, updateSection, updateSectionItem, markDirty]
  );

  return useAutoSaveForm(schema, onSave, defaultValues);
}

// Form field error helper
export function getFieldError<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  fieldName: FieldPath<TFieldValues>
): string | undefined {
  const error = form.formState.errors[fieldName];
  return error?.message as string | undefined;
}

// Form field props helper for consistent styling
export function getFieldProps<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  fieldName: FieldPath<TFieldValues>
) {
  const error = getFieldError(form, fieldName);
  const isInvalid = !!error;

  return {
    ...form.register(fieldName),
    'aria-invalid': isInvalid,
    'aria-describedby': isInvalid ? `${fieldName}-error` : undefined,
    className: isInvalid 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-launch-blue-500 focus:ring-launch-blue-500'
  };
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  waitFor: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

// Form validation helpers
export const formValidation = {
  required: (fieldName: string) => `${fieldName} is required`,
  minLength: (fieldName: string, min: number) => `${fieldName} must be at least ${min} characters`,
  maxLength: (fieldName: string, max: number) => `${fieldName} must be no more than ${max} characters`,
  email: 'Please enter a valid email address',
  url: 'Please enter a valid URL',
  phone: 'Please enter a valid phone number',
  date: 'Please enter a valid date',
  
  // Custom validators
  linkedin: (value: string) => {
    if (!value) return true;
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/.+/;
    return linkedinRegex.test(value) || 'Please enter a valid LinkedIn URL';
  },
  
  github: (value: string) => {
    if (!value) return true;
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/.+/;
    return githubRegex.test(value) || 'Please enter a valid GitHub URL';
  },
  
  dateRange: (startDate: string, endDate: string | null) => {
    if (!startDate || !endDate) return true;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end || 'End date must be after start date';
  },

  futureDate: (date: string) => {
    if (!date) return true;
    const inputDate = new Date(date);
    const today = new Date();
    return inputDate <= today || 'Date cannot be in the future';
  },

  arrayMinLength: (arr: any[], min: number, fieldName: string) => {
    return arr.length >= min || `Please add at least ${min} ${fieldName}`;
  },

  arrayMaxLength: (arr: any[], max: number, fieldName: string) => {
    return arr.length <= max || `You can only add up to ${max} ${fieldName}`;
  }
};

// Form state helpers
export const formState = {
  isDirty: <TFieldValues extends FieldValues>(form: UseFormReturn<TFieldValues>) => 
    form.formState.isDirty,
  
  isValid: <TFieldValues extends FieldValues>(form: UseFormReturn<TFieldValues>) => 
    form.formState.isValid,
  
  isSubmitting: <TFieldValues extends FieldValues>(form: UseFormReturn<TFieldValues>) => 
    form.formState.isSubmitting,
  
  hasErrors: <TFieldValues extends FieldValues>(form: UseFormReturn<TFieldValues>) => 
    Object.keys(form.formState.errors).length > 0,
  
  errorCount: <TFieldValues extends FieldValues>(form: UseFormReturn<TFieldValues>) => 
    Object.keys(form.formState.errors).length,
  
  touchedFields: <TFieldValues extends FieldValues>(form: UseFormReturn<TFieldValues>) => 
    Object.keys(form.formState.touchedFields)
};

// Mission Control themed form messages
export const missionControlMessages = {
  saving: "Mission data uploading...",
  saved: "Mission data secured! ✅",
  error: "Mission control alert! Please check your inputs.",
  required: "Mission critical field required",
  invalid: "Mission control validation failed",
  success: "Pre-flight check complete! 🚀",
  
  // Section specific messages
  personalInfo: {
    success: "Astronaut profile updated! 👨‍🚀",
    error: "Profile system malfunction detected"
  },
  
  experience: {
    success: "Mission experience logged! 🌟", 
    error: "Experience log corrupted"
  },
  
  education: {
    success: "Training records updated! 🎓",
    error: "Training data error"
  },
  
  skills: {
    success: "Skill matrix updated! ⚡",
    error: "Skill assessment failed"
  },
  
  projects: {
    success: "Project portfolio synchronized! 🛠️",
    error: "Project data transmission error"
  }
};

export default {
  useZodForm,
  useAutoSaveForm,
  useResumeForm,
  getFieldError,
  getFieldProps,
  formValidation,
  formState,
  missionControlMessages
};