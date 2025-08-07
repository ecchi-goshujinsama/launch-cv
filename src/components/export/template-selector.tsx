'use client';

import React, { useState } from 'react';
import { LaunchButton } from '../ui/launch-button';
import { PDFGenerator } from '../../lib/pdf/generator';
import type { Template, Resume } from '../../lib/types';
import { Check, Rocket, Eye, FileText, Zap, Star } from 'lucide-react';

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplateId: string;
  onTemplateSelect: (templateId: string) => void;
  currentResume: Resume | null;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplateId,
  onTemplateSelect,
  currentResume,
}) => {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const supportedTemplates = templates.filter(template =>
    PDFGenerator.isTemplateSupported(template.id)
  );

  const handleTemplateClick = (templateId: string) => {
    onTemplateSelect(templateId);
  };

  const getTemplateIcon = (category: string) => {
    switch (category) {
      case 'professional':
        return <FileText className="w-5 h-5" />;
      case 'modern':
        return <Zap className="w-5 h-5" />;
      case 'executive':
        return <Star className="w-5 h-5" />;
      case 'technical':
        return <Rocket className="w-5 h-5" />;
      case 'creative':
        return <Eye className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTemplateDescription = (template: Template) => {
    const features = [];
    if (template.isAtsCompatible) features.push('ATS-Friendly');
    if (template.isPrintFriendly) features.push('Print-Ready');
    if (template.isMobileResponsive) features.push('Mobile-Responsive');
    
    return features.join(' • ');
  };

  if (supportedTemplates.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Templates Available
        </h3>
        <p className="text-gray-600">
          No PDF-compatible templates are currently available for export.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Choose Your Launch Template
        </h3>
        <p className="text-gray-600">
          Select the template that best represents your professional brand
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {supportedTemplates.map(template => (
          <div
            key={template.id}
            className={`
              relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg
              ${selectedTemplateId === template.id
                ? 'border-launch-blue bg-blue-50 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
            onClick={() => handleTemplateClick(template.id)}
          >
            {/* Selection indicator */}
            {selectedTemplateId === template.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-launch-blue rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Template preview placeholder */}
            <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
              <div className="relative z-10 flex flex-col items-center text-gray-400">
                {getTemplateIcon(template.category)}
                <span className="text-xs mt-1 font-medium">{template.name}</span>
              </div>
              
              {/* Template style preview bars */}
              <div className="absolute bottom-2 left-2 right-2 space-y-1">
                <div className="h-1 bg-gray-300 rounded" />
                <div className="h-1 bg-gray-200 rounded w-3/4" />
                <div className="h-1 bg-gray-200 rounded w-1/2" />
              </div>
            </div>

            {/* Template info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">{template.name}</h4>
                <span className={`
                  text-xs px-2 py-1 rounded-full font-medium
                  ${template.category === 'professional' ? 'bg-blue-100 text-blue-800' :
                    template.category === 'modern' ? 'bg-green-100 text-green-800' :
                    template.category === 'executive' ? 'bg-purple-100 text-purple-800' :
                    template.category === 'technical' ? 'bg-orange-100 text-orange-800' :
                    template.category === 'creative' ? 'bg-pink-100 text-pink-800' :
                    'bg-gray-100 text-gray-800'
                  }
                `}>
                  {template.category}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-2">
                {template.description}
              </p>
              
              <div className="text-xs text-gray-500">
                {getTemplateDescription(template)}
              </div>

              {/* Template features */}
              <div className="flex flex-wrap gap-1 mt-2">
                {template.isAtsCompatible && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    ATS
                  </span>
                )}
                {template.isPrintFriendly && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    Print
                  </span>
                )}
                {template.isMobileResponsive && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    Mobile
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue button */}
      <div className="flex justify-center pt-4">
        <LaunchButton
          disabled={!selectedTemplateId}
          onClick={() => selectedTemplateId && onTemplateSelect(selectedTemplateId)}
          className="gap-2"
        >
          <Rocket className="w-4 h-4" />
          Continue Launch Sequence
        </LaunchButton>
      </div>

      {/* Template count info */}
      <div className="text-center text-sm text-gray-500">
        {supportedTemplates.length} template{supportedTemplates.length !== 1 ? 's' : ''} available for PDF export
      </div>
    </div>
  );
};