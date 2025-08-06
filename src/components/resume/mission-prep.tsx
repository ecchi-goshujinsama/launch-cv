'use client';

import * as React from 'react';
import { useState } from 'react';
import { Rocket, FileText, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionProgress, type MissionStep } from '@/components/ui/mission-progress';
import { MissionContainer, MissionSection, MissionCard } from '@/components/layout';
import { FileUpload } from './file-upload';

interface MissionPrepProps {
  onFileProcessed: (file: File) => void;
  onManualEntry: () => void;
  onContinue: () => void;
  className?: string;
}

const missionSteps: MissionStep[] = [
  {
    id: 'upload',
    title: 'Upload Resume',
    description: 'Import your existing resume file',
    status: 'pending',
    estimatedTime: '1-2 minutes'
  },
  {
    id: 'review',
    title: 'Pre-flight Check',
    description: 'Review and correct extracted data',
    status: 'pending',
    estimatedTime: '3-5 minutes'
  },
  {
    id: 'enhance',
    title: 'Mission Control',
    description: 'Enhance and customize your resume',
    status: 'pending',
    estimatedTime: '10-15 minutes'
  },
  {
    id: 'launch',
    title: 'Launch Sequence',
    description: 'Export your professional resume',
    status: 'pending',
    estimatedTime: '1-2 minutes'
  }
];

export function MissionPrep({
  onFileProcessed,
  onManualEntry,
  onContinue,
  className
}: MissionPrepProps) {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [missionPhase, setMissionPhase] = useState<'briefing' | 'upload' | 'ready'>('briefing');
  const [currentSteps, setCurrentSteps] = useState<MissionStep[]>(missionSteps);

  const handleFileSelect = (file: File) => {
    setCurrentFile(file);
    setMissionPhase('ready');
    
    // Update mission steps
    const updatedSteps = currentSteps.map(step => 
      step.id === 'upload' 
        ? { ...step, status: 'completed' as const }
        : step.id === 'review'
        ? { ...step, status: 'in_progress' as const }
        : step
    );
    setCurrentSteps(updatedSteps);
    
    onFileProcessed(file);
  };

  const handleFileRemove = () => {
    setCurrentFile(null);
    setMissionPhase('upload');
    
    // Reset mission steps
    const resetSteps = currentSteps.map(step => 
      step.id === 'upload' || step.id === 'review'
        ? { ...step, status: 'pending' as const }
        : step
    );
    setCurrentSteps(resetSteps);
  };

  const handleStartUpload = () => {
    setMissionPhase('upload');
  };

  const handleContinue = () => {
    if (currentFile) {
      onContinue();
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <MissionContainer maxWidth="4xl" padding="lg" background="transparent">
        {/* Mission Briefing */}
        {missionPhase === 'briefing' && (
          <div className="space-y-8">
            {/* Header */}
            <MissionSection
              title="Pre-flight Data Import"
              subtitle="Mission Control is ready to analyze your existing resume and prepare it for launch optimization."
              icon={<Rocket className="w-6 h-6 text-launch-blue" />}
              showDivider
            />

            {/* Mission Steps Overview */}
            <MissionCard variant="elevated">
              <MissionProgress
                steps={currentSteps}
                currentStep="upload"
                missionTitle="Career Launch Mission"
                variant="minimal"
                orientation="horizontal"
                showEstimatedTime
              />
            </MissionCard>

            {/* Options */}
            <div className="grid md:grid-cols-2 gap-6">
              <MissionCard
                title="Import Existing Resume"
                subtitle="Upload your current resume for analysis and enhancement"
                icon={<FileText className="w-5 h-5" />}
                variant="mission"
                hover
                onClick={handleStartUpload}
              >
                <div className="space-y-3">
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>• Supports PDF, DOCX, and TXT formats</div>
                    <div>• Intelligent text extraction and parsing</div>
                    <div>• Automatic data structure recognition</div>
                  </div>
                  <LaunchButton
                    variant="rocket"
                    icon="rocket"
                    iconPosition="left"
                    animation="rocket"
                    className="w-full"
                    onClick={handleStartUpload}
                  >
                    Start Import Mission
                  </LaunchButton>
                </div>
              </MissionCard>

              <MissionCard
                title="Manual Mission Entry"
                subtitle="Start from scratch with a clean slate"
                icon={<Rocket className="w-5 h-5" />}
                variant="bordered"
                hover
                onClick={onManualEntry}
              >
                <div className="space-y-3">
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>• Fresh start with guided forms</div>
                    <div>• Step-by-step mission planning</div>
                    <div>• Professional templates included</div>
                  </div>
                  <LaunchButton
                    variant="outline"
                    icon="arrow"
                    iconPosition="right"
                    className="w-full"
                    onClick={onManualEntry}
                  >
                    Manual Entry
                  </LaunchButton>
                </div>
              </MissionCard>
            </div>

            {/* Mission Tips */}
            <MissionCard variant="card">
              <div className="space-y-3">
                <h3 className="font-semibold text-launch-blue">
                  🚀 Mission Control Tips
                </h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <div>• <strong>PDF files</strong> provide the best text extraction accuracy</div>
                  <div>• <strong>DOCX files</strong> maintain formatting and structure information</div>
                  <div>• <strong>TXT files</strong> work best for simple, clean resume content</div>
                  <div>• File size limit is 10MB for optimal processing speed</div>
                </div>
              </div>
            </MissionCard>
          </div>
        )}

        {/* File Upload Phase */}
        {missionPhase === 'upload' && (
          <div className="space-y-8">
            <MissionSection
              title="Mission Data Upload"
              subtitle="Upload your resume file to begin the pre-flight analysis"
              icon={<FileText className="w-6 h-6 text-launch-blue" />}
            />

            <MissionCard variant="elevated">
              <FileUpload
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                currentFile={currentFile}
                accept={['pdf', 'docx', 'txt']}
                maxSize={10}
              />
            </MissionCard>

            <div className="flex justify-between">
              <LaunchButton
                variant="ghost"
                onClick={() => setMissionPhase('briefing')}
                icon="none"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Back to Briefing
              </LaunchButton>
              
              <LaunchButton
                variant="outline"
                onClick={onManualEntry}
              >
                Skip to Manual Entry
              </LaunchButton>
            </div>
          </div>
        )}

        {/* Ready for Next Phase */}
        {missionPhase === 'ready' && currentFile && (
          <div className="space-y-8">
            <MissionSection
              title="Mission Data Imported Successfully!"
              subtitle="Your resume has been analyzed and is ready for pre-flight review."
              icon={<Rocket className="w-6 h-6 text-green-500" />}
            />

            {/* Updated Progress */}
            <MissionCard variant="elevated">
              <MissionProgress
                steps={currentSteps}
                currentStep="review"
                missionTitle="Career Launch Mission"
                variant="minimal"
                orientation="horizontal"
              />
            </MissionCard>

            {/* File Summary */}
            <MissionCard variant="mission">
              <div className="space-y-4">
                <h3 className="font-semibold mission-text">Import Summary</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">File Name</div>
                    <div className="font-medium">{currentFile.name}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">File Size</div>
                    <div className="font-medium">
                      {(currentFile.size / (1024 * 1024)).toFixed(1)} MB
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Status</div>
                    <div className="font-medium text-green-600">Ready for Review</div>
                  </div>
                </div>
              </div>
            </MissionCard>

            {/* Next Steps */}
            <div className="flex justify-between items-center">
              <LaunchButton
                variant="ghost"
                onClick={handleFileRemove}
                icon="none"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Upload Different File
              </LaunchButton>
              
              <LaunchButton
                variant="mission"
                onClick={handleContinue}
                icon="rocket"
                iconPosition="right"
                animation="rocket"
                size="lg"
              >
                Proceed to Pre-flight Check
              </LaunchButton>
            </div>
          </div>
        )}
      </MissionContainer>
    </div>
  );
}