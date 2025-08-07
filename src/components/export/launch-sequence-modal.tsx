'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { LaunchButton } from '../ui/launch-button';
import { MissionProgress } from '../ui/mission-progress';
import { TemplateSelector } from './template-selector';
import { ExportProgress } from './export-progress';
import { CareerLaunchedSuccess } from './career-launched-success';
import { usePDFExport } from '../../lib/hooks/use-pdf-export';
import { useResumeStore } from '../../lib/stores/resume-store';
import { useTemplateStore } from '../../lib/stores/template-store';
import type { PDFExportOptions } from '../../lib/pdf/types';
import { Rocket, Download, Eye, Settings, AlertTriangle } from 'lucide-react';

interface LaunchSequenceModalProps {
  children?: React.ReactNode;
  defaultOpen?: boolean;
}

type ExportStep = 'template-selection' | 'export-options' | 'launching' | 'success' | 'error';

export const LaunchSequenceModal: React.FC<LaunchSequenceModalProps> = ({
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [currentStep, setCurrentStep] = useState<ExportStep>('template-selection');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [exportOptions, setExportOptions] = useState<Partial<PDFExportOptions>>({});

  const { currentResume } = useResumeStore();
  const { getTemplate, templates } = useTemplateStore();
  const pdfExport = usePDFExport();

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setCurrentStep('export-options');
  };

  const handleExportOptionsConfirm = (options: Partial<PDFExportOptions>) => {
    setExportOptions(options);
    startLaunchSequence();
  };

  const startLaunchSequence = async () => {
    if (!currentResume || !selectedTemplateId) return;

    const template = getTemplate(selectedTemplateId);
    if (!template) return;

    setCurrentStep('launching');

    try {
      await pdfExport.downloadPDF(currentResume, template, exportOptions);
      setCurrentStep('success');
    } catch (error) {
      console.error('Launch sequence failed:', error);
      setCurrentStep('error');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentStep('template-selection');
    setSelectedTemplateId('');
    setExportOptions({});
    pdfExport.reset();
  };

  const handleSuccessComplete = () => {
    handleClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'template-selection':
        return (
          <TemplateSelector
            templates={templates}
            selectedTemplateId={selectedTemplateId}
            onTemplateSelect={handleTemplateSelect}
            currentResume={currentResume}
          />
        );
      case 'export-options':
        return (
          <ExportOptions
            selectedTemplate={getTemplate(selectedTemplateId)}
            onConfirm={handleExportOptionsConfirm}
            onBack={() => setCurrentStep('template-selection')}
          />
        );
      case 'launching':
        return (
          <ExportProgress
            progress={pdfExport.progress}
            isGenerating={pdfExport.isGenerating}
            templateName={getTemplate(selectedTemplateId)?.name || ''}
          />
        );
      case 'success':
        return (
          <CareerLaunchedSuccess
            resumeName={currentResume?.title || 'Resume'}
            templateName={getTemplate(selectedTemplateId)?.name || ''}
            onComplete={handleSuccessComplete}
          />
        );
      case 'error':
        return (
          <div className="text-center p-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Mission Control Alert
            </h3>
            <p className="text-gray-600 mb-4">
              {pdfExport.error || 'Launch sequence encountered an error. Please try again.'}
            </p>
            <LaunchButton
              onClick={() => setCurrentStep('template-selection')}
              variant="outline"
            >
              Retry Launch
            </LaunchButton>
          </div>
        );
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (currentStep) {
      case 'template-selection':
        return 'Launch Sequence: Template Selection';
      case 'export-options':
        return 'Launch Sequence: Export Configuration';
      case 'launching':
        return 'Launch Sequence: Initiating';
      case 'success':
        return 'Career Launched Successfully!';
      case 'error':
        return 'Mission Control Alert';
      default:
        return 'Launch Sequence';
    }
  };

  const getModalDescription = () => {
    switch (currentStep) {
      case 'template-selection':
        return 'Choose your resume template for the launch sequence';
      case 'export-options':
        return 'Configure your export settings';
      case 'launching':
        return 'Generating your professional resume...';
      case 'success':
        return 'Your resume has been successfully generated and downloaded';
      case 'error':
        return 'There was an issue with the launch sequence';
      default:
        return 'Prepare your resume for launch';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <LaunchButton className="gap-2">
            <Rocket className="w-4 h-4" />
            Launch Resume
          </LaunchButton>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-launch-blue flex items-center gap-2">
            <Rocket className="w-6 h-6" />
            {getModalTitle()}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {getModalDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Progress indicator */}
          {currentStep !== 'success' && currentStep !== 'error' && (
            <MissionProgress
              currentStep={
                currentStep === 'template-selection' ? 1 :
                currentStep === 'export-options' ? 2 :
                currentStep === 'launching' ? 3 : 1
              }
              totalSteps={3}
              className="mb-6"
            />
          )}

          {/* Step content */}
          {renderStepContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Export Options Component
interface ExportOptionsProps {
  selectedTemplate: any;
  onConfirm: (options: Partial<PDFExportOptions>) => void;
  onBack: () => void;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({
  selectedTemplate,
  onConfirm,
  onBack,
}) => {
  const [options, setOptions] = useState<Partial<PDFExportOptions>>({
    quality: 'high',
    format: 'A4',
    fileName: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(options);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Selected Template</h4>
        <p className="text-blue-700">{selectedTemplate?.name}</p>
        <p className="text-sm text-blue-600">{selectedTemplate?.description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quality
            </label>
            <select
              value={options.quality}
              onChange={(e) => setOptions(prev => ({ 
                ...prev, 
                quality: e.target.value as 'draft' | 'standard' | 'high' 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-launch-blue"
            >
              <option value="high">High Quality</option>
              <option value="standard">Standard</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paper Size
            </label>
            <select
              value={options.format}
              onChange={(e) => setOptions(prev => ({ 
                ...prev, 
                format: e.target.value as 'A4' | 'Letter' 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-launch-blue"
            >
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            File Name (Optional)
          </label>
          <input
            type="text"
            value={options.fileName || ''}
            onChange={(e) => setOptions(prev => ({ ...prev, fileName: e.target.value }))}
            placeholder="Leave empty for auto-generated name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-launch-blue"
          />
        </div>

        <div className="flex justify-between pt-4">
          <LaunchButton type="button" onClick={onBack} variant="outline">
            Back
          </LaunchButton>
          <LaunchButton type="submit" className="gap-2">
            <Rocket className="w-4 h-4" />
            Initiate Launch
          </LaunchButton>
        </div>
      </form>
    </div>
  );
};