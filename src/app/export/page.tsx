'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Download, Eye, FileText, Settings, Rocket, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionContainer, MissionSection, MissionCard } from '@/components/layout';
import { useResumeStore } from '@/lib/stores/resume-store';
import useTemplateStore from '@/lib/stores/template-store';
import { PDFGenerator } from '@/lib/pdf/generator';
import type { Resume, Template as TemplateType } from '@/lib/types';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'creative' | 'technical';
  preview: string; // Preview image path
}

const AVAILABLE_TEMPLATES: Template[] = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean, modern design perfect for corporate roles',
    category: 'modern',
    preview: '/templates/modern-minimal.png'
  },
  {
    id: 'technical',
    name: 'Technical Developer',
    description: 'Tech-focused layout ideal for developers and engineers',
    category: 'technical',
    preview: '/templates/technical.png'
  },
  {
    id: 'classic-professional',
    name: 'Classic Professional',
    description: 'Traditional, elegant design for conservative industries',
    category: 'classic',
    preview: '/templates/classic-professional.png'
  },
  {
    id: 'creative',
    name: 'Creative Modern',
    description: 'Vibrant, creative design for design and marketing roles',
    category: 'creative',
    preview: '/templates/creative.png'
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Premium design for senior-level positions',
    category: 'modern',
    preview: '/templates/executive.png'
  }
];

export default function ExportPage() {
  const { currentResume } = useResumeStore();
  const { selectedTemplateId, selectTemplate } = useTemplateStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    // Find the current template or default to the first one
    const template = AVAILABLE_TEMPLATES.find(t => t.id === selectedTemplateId) || AVAILABLE_TEMPLATES[0];
    setSelectedTemplate(template);
  }, [selectedTemplateId]);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    selectTemplate(template.id);
  };

  const handleExportPDF = async () => {
    if (!currentResume || !selectedTemplate) {
      alert('Please select a resume and template first.');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          const next = prev + 10;
          if (next >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return next;
        });
      }, 200);

      // Create proper template object
      const templateObj: TemplateType = {
        id: selectedTemplate.id,
        name: selectedTemplate.name,
        description: selectedTemplate.description,
        category: selectedTemplate.category as 'professional' | 'modern' | 'creative' | 'technical' | 'executive',
        previewImage: selectedTemplate.preview,
        isAtsCompatible: true,
        colorScheme: {
          primary: '#2563eb',
          secondary: '#1e40af',
          accent: '#3b82f6'
        }
      };

      // Generate PDF using the proper React-PDF generator
      await PDFGenerator.downloadPDF(currentResume, templateObj, {
        format: 'a4',
        compression: true,
      });

      // Complete progress
      setExportProgress(100);
      clearInterval(progressInterval);

      // Reset progress after a delay
      setTimeout(() => {
        setExportProgress(0);
        setIsExporting(false);
      }, 1000);

    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export PDF. Please try again.');
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  if (!currentResume) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <MissionContainer maxWidth="2xl" padding="lg">
          <MissionCard variant="mission" className="text-center py-12">
            <div className="space-y-4">
              <FileText className="w-16 h-16 mx-auto text-launch-blue" />
              <h2 className="text-2xl font-bold mission-text">No Resume Found</h2>
              <p className="text-slate-400">
                You need to import or create a resume before you can export it.
              </p>
              <LaunchButton
                variant="mission"
                icon="rocket"
                animation="rocket"
                onClick={() => window.location.href = '/import'}
              >
                Import Resume
              </LaunchButton>
            </div>
          </MissionCard>
        </MissionContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <MissionContainer maxWidth="6xl" padding="lg">
        <MissionSection
          title="Launch Sequence"
          subtitle="Select your template and export your mission-ready resume"
          icon={<Rocket className="w-6 h-6 text-launch-blue" />}
        >
          <></>
        </MissionSection>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Template Selection */}
          <div className="lg:col-span-2 space-y-6">
            <MissionCard variant="elevated">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold mission-text">Template Selection</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Settings className="w-4 h-4" />
                    <span>Choose your launch vehicle</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {AVAILABLE_TEMPLATES.map((template) => (
                    <div
                      key={template.id}
                      className={cn(
                        "relative border-2 rounded-lg p-4 cursor-pointer transition-all",
                        selectedTemplate?.id === template.id
                          ? "border-launch-blue bg-launch-blue/5"
                          : "border-slate-700 hover:border-slate-600"
                      )}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      {/* Template Preview */}
                      <div className="aspect-[8.5/11] bg-slate-800 rounded border border-slate-600 mb-3 flex items-center justify-center">
                        <div className="text-center">
                          <FileText className="w-12 h-12 mx-auto text-slate-500 mb-2" />
                          <span className="text-xs text-slate-500">Preview</span>
                        </div>
                      </div>

                      {/* Template Info */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-slate-200">{template.name}</h4>
                          <span className={cn(
                            "px-2 py-1 text-xs rounded-full",
                            template.category === 'modern' && "bg-blue-100 text-blue-700",
                            template.category === 'technical' && "bg-purple-100 text-purple-700",
                            template.category === 'classic' && "bg-gray-100 text-gray-700",
                            template.category === 'creative' && "bg-pink-100 text-pink-700"
                          )}>
                            {template.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{template.description}</p>
                      </div>

                      {/* Selection Indicator */}
                      {selectedTemplate?.id === template.id && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-launch-blue rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">✓</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </MissionCard>
          </div>

          {/* Export Panel */}
          <div className="space-y-6">
            {/* Resume Summary */}
            <MissionCard variant="bordered">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mission-text">Mission Payload</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pilot:</span>
                    <span className="text-slate-200">{currentResume.personalInfo.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contact:</span>
                    <span className="text-slate-200">{currentResume.personalInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Experience:</span>
                    <span className="text-slate-200">
                      {currentResume.sections.find(s => s.type === 'experience')?.items?.length || 0} positions
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Skills:</span>
                    <span className="text-slate-200">
                      {currentResume.sections.find(s => s.type === 'skills')?.items?.length || 0} skills
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Template:</span>
                    <span className="text-launch-blue">{selectedTemplate?.name}</span>
                  </div>
                </div>
              </div>
            </MissionCard>

            {/* Export Actions */}
            <MissionCard variant="mission">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">Launch Controls</h3>

                {/* Preview Button */}
                <LaunchButton
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full"
                  icon="none"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </LaunchButton>

                {/* Export Progress */}
                {isExporting && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Launch Progress</span>
                      <span>{exportProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-launch-blue h-2 rounded-full transition-all duration-300"
                        style={{ width: `${exportProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Export Button */}
                <LaunchButton
                  variant="mission"
                  size="lg"
                  onClick={handleExportPDF}
                  disabled={isExporting || !selectedTemplate}
                  className="w-full"
                  icon="rocket"
                  animation="rocket"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {isExporting ? 'Launching...' : 'Launch PDF'}
                </LaunchButton>

                {/* Additional Actions */}
                <div className="pt-4 border-t border-slate-700 space-y-2">
                  <LaunchButton
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = '/builder'}
                    className="w-full"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Builder
                  </LaunchButton>
                </div>
              </div>
            </MissionCard>
          </div>
        </div>

        {/* Preview Modal/Panel - Optional for future implementation */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Resume Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  ✕
                </button>
              </div>
              
              <div className="aspect-[8.5/11] bg-white rounded shadow-lg flex items-center justify-center">
                <div className="text-gray-500 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4" />
                  <p>Resume preview would appear here</p>
                  <p className="text-sm">(Template: {selectedTemplate?.name})</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </MissionContainer>
    </div>
  );
}
