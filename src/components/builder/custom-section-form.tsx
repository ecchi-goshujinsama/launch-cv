'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Plus, 
  Trash2, 
  GripVertical,
  Type,
  Calendar,
  MapPin,
  FileText,
  Edit3,
  Save,
  X,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionCard } from '@/components/layout';
import { customSectionItemSchema } from '@/lib/validations/resume-schemas';
import { useResumeStore } from '@/lib/stores/resume-store';

const customSectionSchema = z.object({
  title: z.string().min(1, 'Section title is required').max(50, 'Section title is too long'),
  items: z.array(customSectionItemSchema.extend({
    id: z.string().optional()
  }))
});

type CustomSectionData = z.infer<typeof customSectionSchema>;
type CustomSectionItem = CustomSectionData['items'][0];

interface CustomSectionFormProps {
  sectionId?: string;
  initialTitle?: string;
  initialData?: CustomSectionItem[];
  onSave: (title: string, data: CustomSectionItem[]) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  className?: string;
  autoSave?: boolean;
}

export function CustomSectionForm({
  sectionId,
  initialTitle = '',
  initialData = [],
  onSave,
  onCancel,
  onDelete,
  className,
  autoSave = true
}: CustomSectionFormProps) {
  const { addResumeSection, updateResumeSection, removeResumeSection } = useResumeStore();
  const [isEditingTitle, setIsEditingTitle] = React.useState(!initialTitle);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty, isValid }
  } = useForm<CustomSectionData>({
    resolver: zodResolver(customSectionSchema) as any,
    defaultValues: {
      title: initialTitle,
      items: initialData.length > 0 ? initialData : [{
        id: crypto.randomUUID(),
        title: '',
        subtitle: '',
        date: '',
        location: '',
        description: ['']
      }]
    },
    mode: 'onBlur'
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const watchedData = watch();

  // Auto-save functionality
  React.useEffect(() => {
    if (autoSave && isDirty && isValid && watchedData.title) {
      const timeoutId = setTimeout(() => {
        const processedItems = watchedData.items.map(item => ({
          ...item,
          description: item.description.filter(desc => desc.trim() !== '')
        }));

        if (sectionId) {
          updateResumeSection(sectionId, watchedData.title, processedItems);
        } else {
          addResumeSection('custom', watchedData.title, processedItems);
        }
        
        onSave(watchedData.title, processedItems);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [watchedData, isDirty, isValid, autoSave, onSave, sectionId, updateResumeSection, addResumeSection]);

  const handleFormSubmit = (data: CustomSectionData) => {
    const processedItems = data.items.map(item => ({
      ...item,
      description: item.description.filter(desc => desc.trim() !== '')
    }));

    if (sectionId) {
      updateResumeSection(sectionId, data.title, processedItems);
    } else {
      addResumeSection('custom', data.title, processedItems);
    }
    
    onSave(data.title, processedItems);
  };

  const addItem = () => {
    append({
      id: crypto.randomUUID(),
      title: '',
      subtitle: '',
      date: '',
      location: '',
      description: ['']
    });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const addDescription = (itemIndex: number) => {
    const currentDescriptions = watchedData.items[itemIndex]?.description || [];
    const newDescriptions = [...currentDescriptions, ''];
    
    // Update form manually for dynamic arrays
    const updatedItems = [...watchedData.items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      title: updatedItems[itemIndex]?.title || '',
      description: newDescriptions
    };
  };

  const removeDescription = (itemIndex: number, descIndex: number) => {
    const currentDescriptions = watchedData.items[itemIndex]?.description || [];
    if (currentDescriptions.length > 1) {
      const newDescriptions = currentDescriptions.filter((_, i) => i !== descIndex);
      
      const updatedItems = [...watchedData.items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        title: updatedItems[itemIndex]?.title || '',
        description: newDescriptions
      };
    }
  };

  const handleDeleteSection = () => {
    if (sectionId && onDelete) {
      removeResumeSection(sectionId);
      onDelete();
    }
  };

  const renderField = (
    name: string,
    label: string,
    type: 'text' | 'textarea' = 'text',
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
        {type === 'textarea' ? (
          <textarea
            {...register(name as any)}
            rows={3}
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
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-launch-blue/10 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-launch-blue" />
            </div>
            <div className="flex-1">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    {...register('title')}
                    placeholder="Enter section title (e.g., Volunteer Experience, Awards, Publications)"
                    className={cn(
                      "text-lg font-semibold px-2 py-1 border rounded-md flex-1",
                      "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-launch-blue-200",
                      errors.title
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-gray-400 focus:border-launch-blue"
                    )}
                    autoFocus
                  />
                  <LaunchButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingTitle(false)}
                    icon="none"
                  >
                    <Save className="w-4 h-4" />
                  </LaunchButton>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold mission-text">
                    {watchedData.title || 'Custom Section'}
                  </h3>
                  <LaunchButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingTitle(true)}
                    icon="none"
                  >
                    <Edit3 className="w-4 h-4" />
                  </LaunchButton>
                </div>
              )}
              <p className="text-sm text-gray-600">Create a custom section for additional information</p>
              {errors.title && (
                <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <LaunchButton
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
              icon="none"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </LaunchButton>
            
            {sectionId && onDelete && (
              <LaunchButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDeleteSection}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </LaunchButton>
            )}
          </div>
        </div>

        {/* Section Items */}
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="relative">
              <div className="p-4 border border-gray-200 rounded-lg space-y-4 bg-white">
                {/* Item Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <GripVertical className="w-4 h-4" />
                    </button>
                    <h4 className="font-medium text-gray-900">
                      {watchedData.items[index]?.title || `Item ${index + 1}`}
                    </h4>
                  </div>
                  {fields.length > 1 && (
                    <LaunchButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </LaunchButton>
                  )}
                </div>

                {/* Main Fields Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {renderField(
                    `items.${index}.title`,
                    'Title',
                    'text',
                    <Type className="w-4 h-4" />,
                    'Award Name, Volunteer Role, Publication Title, etc.',
                    true
                  )}
                  {renderField(
                    `items.${index}.subtitle`,
                    'Subtitle',
                    'text',
                    <Type className="w-4 h-4" />,
                    'Organization, Company, Journal, etc.'
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {renderField(
                    `items.${index}.date`,
                    'Date',
                    'text',
                    <Calendar className="w-4 h-4" />,
                    'March 2023'
                  )}
                  {renderField(
                    `items.${index}.location`,
                    'Location',
                    'text',
                    <MapPin className="w-4 h-4" />,
                    'New York, NY'
                  )}
                </div>

                {/* Description Points */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FileText className="w-4 h-4" />
                      Description Points
                    </label>
                    <LaunchButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => addDescription(index)}
                      icon="none"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Point
                    </LaunchButton>
                  </div>
                  
                  <div className="space-y-2">
                    {(watchedData.items[index]?.description || ['']).map((_, descIndex) => (
                      <div key={descIndex} className="flex gap-2">
                        <input
                          {...register(`items.${index}.description.${descIndex}` as any)}
                          type="text"
                          placeholder="Describe your role, achievements, or key details"
                          className={cn(
                            "flex-1 px-3 py-2 border rounded-md text-sm transition-colors",
                            "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-launch-blue-200",
                            "border-gray-300 hover:border-gray-400 focus:border-launch-blue"
                          )}
                        />
                        {(watchedData.items[index]?.description || []).length > 1 && (
                          <LaunchButton
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDescription(index, descIndex)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2"
                          >
                            <X className="w-3 h-3" />
                          </LaunchButton>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <span>💡</span>
            Custom Section Tips
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use custom sections for: Awards, Volunteer Work, Publications, Speaking, etc.</li>
            <li>• Keep section titles clear and professional</li>
            <li>• Include dates and locations when relevant</li>
            <li>• Focus on achievements that add value to your target role</li>
            <li>• Maintain consistency with your overall resume format</li>
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