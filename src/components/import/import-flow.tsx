'use client';

import * as React from 'react';
import { useState } from 'react';
import { FileText, Rocket, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionContainer, MissionSection, MissionCard } from '@/components/layout';
import { FileUpload } from '@/components/resume/file-upload';
import { PreFlightCheck } from '@/components/resume/pre-flight-check';
import { DataReviewForm } from '@/components/resume/data-review-form';
import { ManualEntryForm } from '@/components/resume/manual-entry-form';
import { useResumeStore } from '@/lib/stores/resume-store';
import { parseResumeFile } from '@/lib/parsers/resume-parser';
import type { ParsedResumeData } from '@/lib/parsers';

type ImportStep = 'upload' | 'parsing' | 'review' | 'manual' | 'complete';

interface ImportFlowProps {
  onComplete?: (resumeId: string) => void;
  className?: string;
}

export function ImportFlow({ onComplete, className }: ImportFlowProps) {
  const [currentStep, setCurrentStep] = useState<ImportStep>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedResumeId, setCompletedResumeId] = useState<string | null>(null);

  const { 
    createResumeFromParsedData,
    setLoading
  } = useResumeStore();

  // Handle file upload
  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setParseError(null);
    setIsProcessing(true);
    setCurrentStep('parsing');
    setLoading(true);

    try {
      // Parse the uploaded file
      const result = await parseResumeFile(file);
      
      if (result.success && result.data) {
        setParsedData(result.data);
        
        // Move to review step
        setTimeout(() => {
          setCurrentStep('review');
          setIsProcessing(false);
          setLoading(false);
        }, 1500); // Show parsing animation
      } else {
        throw new Error(result.error || 'Parsing failed');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown parsing error occurred';
      setParseError(`Mission Control Alert: ${errorMessage}`);
      setCurrentStep('upload');
      setIsProcessing(false);
      setLoading(false);
      setSelectedFile(null);
    }
  };

  // Handle file removal
  const handleFileRemove = () => {
    setSelectedFile(null);
    setParsedData(null);
    setParseError(null);
    setCurrentStep('upload');
    setIsProcessing(false);
    setLoading(false);
  };

  // Handle switching to manual entry
  const handleManualEntry = () => {
    setCurrentStep('manual');
    setSelectedFile(null);
    setParsedData(null);
    setParseError(null);
  };

  // Handle data validation completion
  const handleDataValidated = (validatedData: ParsedResumeData) => {
    // Create a new resume in the store from parsed data
    const resumeId = createResumeFromParsedData(validatedData);
    setCompletedResumeId(resumeId);
    
    setCurrentStep('complete');
    
    // Notify completion
    if (onComplete) {
      setTimeout(() => {
        onComplete(resumeId);
      }, 2000);
    }
  };

  // Handle edit mode (switch to data review form)
  const handleEditData = () => {
    if (parsedData) {
      setCurrentStep('review');
    }
  };

  // Handle re-parsing
  const handleReparse = () => {
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  // Handle manual form submission
  const handleManualSubmit = (data: ParsedResumeData) => {
    setParsedData(data);
    handleDataValidated(data);
  };

  // Handle manual form cancel
  const handleManualCancel = () => {
    setCurrentStep('upload');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <MissionCard variant="elevated">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mission-text mb-2">
                  Pre-flight Data Import
                </h2>
                <p className="text-slate-400">
                  Import your existing resume or start your mission from scratch
                </p>
              </div>

              <FileUpload
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                currentFile={selectedFile}
                disabled={isProcessing}
              />

              {parseError && (
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800 mb-1">Mission Control Alert</h4>
                      <p className="text-sm text-red-700">{parseError}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-center pt-4">
                <LaunchButton
                  variant="outline"
                  onClick={handleManualEntry}
                  icon="none"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Start Mission Manually
                </LaunchButton>
              </div>
            </div>
          </MissionCard>
        );

      case 'parsing':
        return (
          <MissionCard variant="mission">
            <div className="text-center space-y-6 py-12">
              <div className="flex justify-center">
                <div className="relative">
                  <Rocket className="w-16 h-16 text-launch-blue animate-bounce" />
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-2 bg-gradient-to-r from-rocket-orange to-yellow-400 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-semibold mission-text">
                  Mission Control Processing...
                </h3>
                <p className="text-slate-400">
                  Analyzing your resume data for launch readiness
                </p>
                <div className="flex justify-center space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-launch-blue rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </MissionCard>
        );

      case 'review':
        return parsedData ? (
          <PreFlightCheck
            parsedData={parsedData}
            onDataValidated={handleDataValidated}
            onEdit={handleEditData}
            onReparse={handleReparse}
          />
        ) : (
          <DataReviewForm
            initialData={parsedData!}
            onSave={handleDataValidated}
            onCancel={handleFileRemove}
          />
        );

      case 'manual':
        return (
          <ManualEntryForm
            onSubmit={handleManualSubmit}
            onCancel={handleManualCancel}
          />
        );

      case 'complete':
        return (
          <MissionCard variant="mission">
            <div className="text-center space-y-6 py-12">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Rocket className="w-8 h-8 text-rocket-orange animate-pulse" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-green-700">
                  Mission Data Ready! 🚀
                </h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  Your resume data has been successfully imported and is ready for Mission Control. 
                  Prepare for launch sequence!
                </p>
              </div>

              <div className="flex justify-center">
                <LaunchButton
                  variant="mission"
                  size="lg"
                  icon="rocket"
                  iconPosition="right"
                  animation="rocket"
                  onClick={() => onComplete && completedResumeId && onComplete(completedResumeId)}
                >
                  Launch Mission Control
                  <ArrowRight className="w-5 h-5 ml-2" />
                </LaunchButton>
              </div>
            </div>
          </MissionCard>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <MissionContainer maxWidth="2xl" padding="lg" background="transparent">
        <MissionSection
          title="Resume Import Mission"
          subtitle="Begin your career launch by importing your existing resume or creating one from scratch"
          icon={<FileText className="w-6 h-6 text-launch-blue" />}
        >
          <></> 
        </MissionSection>

        {/* Progress Indicator */}
        {currentStep !== 'complete' && (
          <MissionCard variant="bordered" className="mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-200">Import Progress</span>
              <div className="flex items-center gap-2">
                {['upload', 'parsing', 'review'].map((step, index) => (
                  <React.Fragment key={step}>
                    <div className={cn(
                      "w-3 h-3 rounded-full transition-colors",
                      currentStep === step ? "bg-launch-blue animate-pulse" :
                      ['upload', 'parsing', 'review'].indexOf(currentStep) > index ? "bg-green-500" : "bg-slate-600"
                    )} />
                    {index < 2 && <div className={cn(
                      "w-8 h-0.5 transition-colors",
                      ['upload', 'parsing', 'review'].indexOf(currentStep) > index ? "bg-green-500" : "bg-slate-600"
                    )} />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </MissionCard>
        )}

        {renderStepContent()}
      </MissionContainer>
    </div>
  );
}