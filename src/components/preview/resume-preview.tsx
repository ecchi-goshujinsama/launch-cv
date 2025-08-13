'use client';

import * as React from 'react';
import { useResumeStore } from '@/lib/stores/resume-store';
import { cn } from '@/lib/utils';
import { Briefcase } from 'lucide-react';
import type { Resume } from '@/lib/types';
import { TemplateRenderer } from '@/components/templates/template-renderer';
import { getTemplateById } from '@/lib/templates';

interface ResumePreviewProps {
  resume?: Resume | null;
  className?: string;
  scale?: number;
  templateId?: string;
}

export function ResumePreview({ 
  resume: providedResume, 
  className,
  scale = 1,
  templateId 
}: ResumePreviewProps) {
  const { currentResume, selectedTemplate } = useResumeStore();
  
  // Use provided resume or current resume from store
  const resume = providedResume || currentResume;
  const activeTemplate = templateId || selectedTemplate || 'classic-professional';

  if (!resume) {
    return (
      <div className={cn(
        "w-full h-full flex items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-lg",
        className
      )}>
        <div className="text-center text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No Resume Data</p>
          <p className="text-sm">Create or import a resume to see preview</p>
        </div>
      </div>
    );
  }

  // Get the template configuration
  const template = getTemplateById(activeTemplate);

  return (
    <div 
      className={cn("bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden", className)}
      style={{ transform: `scale(${scale})` }}
    >
      {/* Use the proper template renderer system */}
      <TemplateRenderer
        resume={resume}
        templateId={activeTemplate}
        template={template}
        scale={1} // Let the parent handle scaling
        isPrintMode={false}
      />
    </div>
  );
}

