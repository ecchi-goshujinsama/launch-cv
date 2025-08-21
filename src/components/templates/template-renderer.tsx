'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { Resume } from '@/lib/types';
import type { Template, TemplateCustomizations } from '@/lib/types/template';
import { getTemplateRenderer } from './renderers';
import { MissionCard } from '@/components/layout';
import { Loader2 } from 'lucide-react';

interface TemplateRendererProps {
  resume: Resume;
  templateId: string;
  template?: Template;
  customizations?: TemplateCustomizations;
  scale?: number;
  isPrintMode?: boolean;
  className?: string;
  isLoading?: boolean;
}

export function TemplateRenderer({
  resume,
  templateId,
  template,
  customizations,
  scale = 1,
  isPrintMode = false,
  className,
  isLoading = false
}: TemplateRendererProps) {
  const TemplateComponent = getTemplateRenderer(templateId);

  if (isLoading) {
    return (
      <div className={cn('w-full h-full flex items-center justify-center', className)}>
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-launch-blue mx-auto" />
          <p className="text-sm text-gray-600">Loading template preview...</p>
        </div>
      </div>
    );
  }

  if (!template || !TemplateComponent) {
    return (
      <div className={cn('w-full h-full flex items-center justify-center', className)}>
        <MissionCard className="p-8 text-center">
          <div className="space-y-4">
            <div className="text-gray-400">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Template Not Found</h3>
              <p className="text-sm text-gray-600">The selected template could not be loaded.</p>
            </div>
          </div>
        </MissionCard>
      </div>
    );
  }

  return (
    <div className={cn('w-full h-full', className)}>
      <TemplateComponent
        resume={resume}
        template={template}
        customizations={customizations}
        scale={scale}
        isPrintMode={isPrintMode}
      />
    </div>
  );
}

export default TemplateRenderer;