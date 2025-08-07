'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionCard } from '@/components/layout';
import { TemplatePreview } from './template-preview';
import { TemplateGrid } from './template-grid';
import useTemplateStore, { useSelectedTemplate, useFilteredTemplates } from '@/lib/stores/template-store';
import { useResumeStore } from '@/lib/stores/resume-store';
import type { Template } from '@/lib/types/template';
import { 
  Palette, 
  Layout, 
  Eye, 
  Wand2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';

interface TemplateSwitcherProps {
  className?: string;
  onTemplateSelected?: (templateId: string) => void;
  compact?: boolean;
}

export function TemplateSwitcher({ 
  className,
  onTemplateSelected,
  compact = false
}: TemplateSwitcherProps) {
  const [showGrid, setShowGrid] = React.useState(false);
  const [isApplying, setIsApplying] = React.useState(false);
  
  // Template store
  const {
    templates,
    isLoading,
    loadTemplates,
    selectTemplate
  } = useTemplateStore();
  
  const selectedTemplate = useSelectedTemplate();
  const filteredTemplates = useFilteredTemplates();

  // Resume store
  const { currentResume, setTemplate } = useResumeStore();

  // Load templates on mount
  React.useEffect(() => {
    if (templates.length === 0 && !isLoading) {
      loadTemplates();
    }
  }, [templates.length, isLoading, loadTemplates]);

  const handleTemplateSelect = async (templateId: string) => {
    if (!currentResume) return;

    setIsApplying(true);
    try {
      // Update template store selection
      selectTemplate(templateId);
      
      // Update resume template
      setTemplate(templateId);
      
      // Call callback if provided
      onTemplateSelected?.(templateId);
      
      // Close grid after selection
      if (showGrid) {
        setTimeout(() => setShowGrid(false), 500);
      }
    } catch (error) {
      console.error('Failed to apply template:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const getCurrentTemplate = (): Template | null => {
    if (currentResume?.templateId) {
      return templates.find(t => t.id === currentResume.templateId) || null;
    }
    return selectedTemplate;
  };

  const currentTemplate = getCurrentTemplate();

  if (isLoading) {
    return (
      <MissionCard className={cn('p-6', className)}>
        <div className="flex items-center justify-center space-x-3">
          <Loader className="w-5 h-5 animate-spin text-launch-blue" />
          <span className="text-sm text-gray-600">Loading templates...</span>
        </div>
      </MissionCard>
    );
  }

  if (showGrid) {
    return (
      <div className={cn('space-y-4', className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LaunchButton
              variant="ghost"
              size="sm"
              onClick={() => setShowGrid(false)}
              icon="none"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </LaunchButton>
            <div>
              <h3 className="text-lg font-semibold mission-text">Choose Template</h3>
              <p className="text-sm text-gray-600">Select a template that fits your style</p>
            </div>
          </div>
          
          {currentTemplate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Current:</span>
              <span className="font-medium">{currentTemplate.name}</span>
            </div>
          )}
        </div>

        {/* Template Grid */}
        <TemplateGrid
          templates={filteredTemplates}
          {...(currentTemplate?.id && { selectedTemplate: currentTemplate.id })}
          onTemplateSelect={handleTemplateSelect}
        />
      </div>
    );
  }

  if (compact) {
    return (
      <MissionCard className={cn('p-4', className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-launch-blue/10 rounded-lg flex items-center justify-center">
              <Layout className="w-5 h-5 text-launch-blue" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                {currentTemplate?.name || 'No Template Selected'}
              </h4>
              <p className="text-sm text-gray-600 capitalize">
                {currentTemplate?.category || 'Select a template'}
              </p>
            </div>
          </div>
          
          <LaunchButton
            variant="outline"
            size="sm"
            onClick={() => setShowGrid(true)}
            disabled={isApplying}
            icon={isApplying ? "none" : "rocket"}
          >
            {isApplying ? (
              <>
                <Loader className="w-4 h-4 mr-1 animate-spin" />
                Applying...
              </>
            ) : (
              'Change Template'
            )}
          </LaunchButton>
        </div>
      </MissionCard>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Current Template Display */}
      <MissionCard>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mission-text flex items-center gap-2">
                <Layout className="w-5 h-5" />
                Current Template
              </h3>
              <p className="text-sm text-gray-600">
                Your resume is using the template below
              </p>
            </div>
            
            <LaunchButton
              variant="mission"
              onClick={() => setShowGrid(true)}
              disabled={isApplying || templates.length === 0}
              icon="rocket"
            >
              Browse Templates
            </LaunchButton>
          </div>

          {currentTemplate ? (
            <div className="flex gap-6">
              {/* Template Preview */}
              <div className="flex-shrink-0">
                <TemplatePreview
                  template={currentTemplate}
                  size="large"
                  interactive={false}
                  showInfo={false}
                />
              </div>

              {/* Template Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    {currentTemplate.name}
                  </h4>
                  <p className="text-sm text-gray-600 capitalize">
                    {currentTemplate.category} • {currentTemplate.difficulty} level
                  </p>
                </div>

                <p className="text-gray-700">
                  {currentTemplate.description}
                </p>

                {/* Template Features */}
                <div className="flex flex-wrap gap-3">
                  {currentTemplate.isAtsCompatible && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-md text-sm">
                      <CheckCircle className="w-4 h-4" />
                      ATS Compatible
                    </div>
                  )}
                  {currentTemplate.isMobileResponsive && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Mobile Responsive
                    </div>
                  )}
                  {currentTemplate.isPrintFriendly && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Print Friendly
                    </div>
                  )}
                </div>

                {/* Template Tags */}
                <div className="flex flex-wrap gap-2">
                  {currentTemplate.metadata.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3 pt-2">
                  <LaunchButton
                    variant="outline"
                    size="sm"
                    icon="none"
                    onClick={() => {
                      // TODO: Implement template customization
                      console.log('Customize template');
                    }}
                  >
                    <Palette className="w-4 h-4 mr-1" />
                    Customize
                  </LaunchButton>
                  
                  <LaunchButton
                    variant="outline"
                    size="sm"
                    icon="none"
                    onClick={() => {
                      // TODO: Implement template preview
                      console.log('Preview template');
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Full Preview
                  </LaunchButton>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">No Template Selected</h4>
                <p className="text-gray-600">
                  Choose a template to get started with your resume design.
                </p>
              </div>
              <LaunchButton
                variant="mission"
                onClick={() => setShowGrid(true)}
                icon="rocket"
              >
                Browse Templates
              </LaunchButton>
            </div>
          )}
        </div>
      </MissionCard>

      {/* Template Suggestions */}
      {currentTemplate && filteredTemplates.length > 1 && (
        <MissionCard>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Wand2 className="w-5 h-5 text-launch-blue" />
              <h4 className="font-semibold text-gray-900">Similar Templates</h4>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredTemplates
                .filter(t => t.id !== currentTemplate.id)
                .slice(0, 4)
                .map(template => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className="cursor-pointer"
                  >
                    <TemplatePreview
                      template={template}
                      size="small"
                      interactive={true}
                      showInfo={true}
                    />
                  </div>
                ))}
            </div>
          </div>
        </MissionCard>
      )}
    </div>
  );
}

export default TemplateSwitcher;