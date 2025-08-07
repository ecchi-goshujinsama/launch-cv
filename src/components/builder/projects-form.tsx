'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  FolderOpen, 
  Plus, 
  Github, 
  Globe, 
  Calendar, 
  GripVertical,
  Trash2,
  Code,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionCard } from '@/components/layout';
import { projectItemSchema } from '@/lib/validations/resume-schemas';
import { useResumeStore } from '@/lib/stores/resume-store';

const projectsFormSchema = z.object({
  projects: z.array(projectItemSchema.extend({
    id: z.string().optional()
  }))
});

type ProjectsFormData = z.infer<typeof projectsFormSchema>;
type ProjectEntry = ProjectsFormData['projects'][0];

interface ProjectsFormProps {
  initialData?: ProjectEntry[];
  onSave: (data: ProjectEntry[]) => void;
  onCancel?: () => void;
  className?: string;
  autoSave?: boolean;
}

export function ProjectsForm({
  initialData = [],
  onSave,
  onCancel,
  className,
  autoSave = true
}: ProjectsFormProps) {
  const { updateResumeSection } = useResumeStore();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty, isValid }
  } = useForm<ProjectsFormData>({
    resolver: zodResolver(projectsFormSchema) as any,
    defaultValues: {
      projects: initialData.length > 0 ? initialData : [{
        id: crypto.randomUUID(),
        name: '',
        description: '',
        technologies: [],
        startDate: '',
        endDate: null,
        url: '',
        github: '',
        highlights: ['']
      }]
    },
    mode: 'onBlur'
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'projects'
  });

  const watchedData = watch();

  // Auto-save functionality
  React.useEffect(() => {
    if (autoSave && isDirty && isValid) {
      const timeoutId = setTimeout(() => {
        const transformedData = watchedData.projects.map(project => ({
          ...project,
          technologies: Array.isArray(project.technologies) 
            ? project.technologies 
            : (project.technologies as string)?.split(',')?.map(t => t.trim())?.filter(Boolean) || [],
          highlights: project.highlights.filter(h => h.trim() !== '')
        }));
        
        // Update store directly
        updateResumeSection('projects', 'Projects', transformedData);
        onSave(transformedData);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [watchedData.projects, isDirty, isValid, autoSave, onSave, updateResumeSection]);

  const handleFormSubmit = (data: ProjectsFormData) => {
    const transformedData = data.projects.map(project => ({
      ...project,
      technologies: Array.isArray(project.technologies) 
        ? project.technologies 
        : (project.technologies as string)?.split(',')?.map(t => t.trim())?.filter(Boolean) || [],
      highlights: project.highlights.filter(h => h.trim() !== '')
    }));
    
    updateResumeSection('projects', 'Projects', transformedData);
    onSave(transformedData);
  };

  const addProject = () => {
    append({
      id: crypto.randomUUID(),
      name: '',
      description: '',
      technologies: [],
      startDate: '',
      endDate: null,
      url: '',
      github: '',
      highlights: ['']
    });
  };

  const removeProject = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const addHighlight = (projectIndex: number) => {
    const currentHighlights = watchedData.projects[projectIndex]?.highlights || [];
    const newHighlights = [...currentHighlights, ''];
    
    // Update the form manually for dynamic arrays
    const updatedProjects = [...watchedData.projects];
    const currentProject = updatedProjects[projectIndex];
    updatedProjects[projectIndex] = {
      ...currentProject,
      name: currentProject?.name || '',
      description: currentProject?.description || '',
      technologies: currentProject?.technologies || [],
      startDate: currentProject?.startDate || '',
      endDate: currentProject?.endDate || null,
      highlights: newHighlights
    };
  };

  const removeHighlight = (projectIndex: number, highlightIndex: number) => {
    const currentHighlights = watchedData.projects[projectIndex]?.highlights || [];
    if (currentHighlights.length > 1) {
      const newHighlights = currentHighlights.filter((_, i) => i !== highlightIndex);
      
      // Update the form manually
      const updatedProjects = [...watchedData.projects];
      const currentProject = updatedProjects[projectIndex];
      updatedProjects[projectIndex] = {
        ...currentProject,
        name: currentProject?.name || '',
        description: currentProject?.description || '',
        technologies: currentProject?.technologies || [],
        startDate: currentProject?.startDate || '',
        endDate: currentProject?.endDate || null,
        highlights: newHighlights
      };
    }
  };

  const renderField = (
    name: string,
    label: string,
    type: 'text' | 'textarea' | 'url' = 'text',
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
              <FolderOpen className="w-5 h-5 text-launch-blue" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mission-text">Projects</h3>
              <p className="text-sm text-gray-600">Showcase your personal and professional projects</p>
            </div>
          </div>
          <LaunchButton
            type="button"
            variant="outline"
            size="sm"
            onClick={addProject}
            icon="none"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </LaunchButton>
        </div>

        {/* Project Entries */}
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
                        e.preventDefault();
                      }}
                    >
                      <GripVertical className="w-4 h-4" />
                    </button>
                    <h4 className="font-medium text-gray-900">
                      {watchedData.projects[index]?.name || `Project ${index + 1}`}
                    </h4>
                  </div>
                  {fields.length > 1 && (
                    <LaunchButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProject(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </LaunchButton>
                  )}
                </div>

                {/* Main Fields Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {renderField(
                    `projects.${index}.name`,
                    'Project Name',
                    'text',
                    <FolderOpen className="w-4 h-4" />,
                    'My Awesome Project',
                    true
                  )}
                  {renderField(
                    `projects.${index}.startDate`,
                    'Start Date',
                    'text',
                    <Calendar className="w-4 h-4" />,
                    'January 2023'
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {renderField(
                    `projects.${index}.url`,
                    'Project URL',
                    'url',
                    <Globe className="w-4 h-4" />,
                    'https://myproject.com'
                  )}
                  {renderField(
                    `projects.${index}.github`,
                    'GitHub Repository',
                    'url',
                    <Github className="w-4 h-4" />,
                    'https://github.com/user/repo'
                  )}
                </div>

                {/* End Date */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div></div> {/* Spacer */}
                  {renderField(
                    `projects.${index}.endDate`,
                    'End Date',
                    'text',
                    <Calendar className="w-4 h-4" />,
                    'Present or December 2023'
                  )}
                </div>

                {/* Description */}
                {renderField(
                  `projects.${index}.description`,
                  'Project Description',
                  'textarea',
                  undefined,
                  'Describe what this project does, its purpose, and your role in creating it...',
                  true,
                  4
                )}

                {/* Technologies */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Code className="w-4 h-4" />
                    Technologies Used
                  </label>
                  <input
                    {...register(`projects.${index}.technologies` as any)}
                    type="text"
                    placeholder="React, Node.js, PostgreSQL, AWS (separate with commas)"
                    className={cn(
                      "w-full px-3 py-2 border rounded-md text-sm transition-colors",
                      "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-launch-blue-200",
                      "border-gray-300 hover:border-gray-400 focus:border-launch-blue"
                    )}
                  />
                  <p className="text-xs text-gray-500">
                    Enter technologies separated by commas
                  </p>
                </div>

                {/* Highlights */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Zap className="w-4 h-4" />
                      Key Highlights & Achievements
                    </label>
                    <LaunchButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => addHighlight(index)}
                      icon="none"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Highlight
                    </LaunchButton>
                  </div>
                  
                  <div className="space-y-2">
                    {(watchedData.projects[index]?.highlights || ['']).map((_, highlightIndex) => (
                      <div key={highlightIndex} className="flex gap-2">
                        <input
                          {...register(`projects.${index}.highlights.${highlightIndex}` as any)}
                          type="text"
                          placeholder="Increased user engagement by 40% through improved UI/UX design"
                          className={cn(
                            "flex-1 px-3 py-2 border rounded-md text-sm transition-colors",
                            "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-launch-blue-200",
                            "border-gray-300 hover:border-gray-400 focus:border-launch-blue"
                          )}
                        />
                        {(watchedData.projects[index]?.highlights || []).length > 1 && (
                          <LaunchButton
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeHighlight(index, highlightIndex)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2"
                          >
                            <Trash2 className="w-3 h-3" />
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
            Project Section Tips
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Include both personal and professional projects that showcase your skills</li>
            <li>• Focus on projects that are relevant to your target role</li>
            <li>• Quantify your achievements and impact where possible</li>
            <li>• Include live demos or GitHub links when available</li>
            <li>• Highlight the technologies and tools you used</li>
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