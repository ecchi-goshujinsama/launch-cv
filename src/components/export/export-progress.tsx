'use client';

import React, { useEffect, useState } from 'react';
import { Rocket, Loader2, CheckCircle, Zap, FileText, Download } from 'lucide-react';

interface ExportProgressProps {
  progress: number;
  isGenerating: boolean;
  templateName: string;
}

type LaunchPhase = 
  | 'pre-flight-check'
  | 'engine-ignition'
  | 'template-rendering'
  | 'pdf-generation'
  | 'final-assembly'
  | 'launch-ready';

export const ExportProgress: React.FC<ExportProgressProps> = ({
  progress,
  isGenerating,
  templateName,
}) => {
  const [currentPhase, setCurrentPhase] = useState<LaunchPhase>('pre-flight-check');
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (progress < 20) {
      setCurrentPhase('pre-flight-check');
    } else if (progress < 40) {
      setCurrentPhase('engine-ignition');
    } else if (progress < 60) {
      setCurrentPhase('template-rendering');
    } else if (progress < 80) {
      setCurrentPhase('pdf-generation');
    } else if (progress < 95) {
      setCurrentPhase('final-assembly');
    } else {
      setCurrentPhase('launch-ready');
    }

    // Trigger animation refresh
    setAnimationKey(prev => prev + 1);
  }, [progress]);

  const getPhaseInfo = (phase: LaunchPhase) => {
    switch (phase) {
      case 'pre-flight-check':
        return {
          icon: <FileText className="w-6 h-6" />,
          title: 'Pre-flight Check',
          description: 'Validating resume data and structure...',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
        };
      case 'engine-ignition':
        return {
          icon: <Zap className="w-6 h-6" />,
          title: 'Engine Ignition',
          description: 'Initializing PDF generation engine...',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
        };
      case 'template-rendering':
        return {
          icon: <FileText className="w-6 h-6" />,
          title: 'Template Rendering',
          description: `Applying ${templateName} template...`,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
        };
      case 'pdf-generation':
        return {
          icon: <Download className="w-6 h-6" />,
          title: 'PDF Generation',
          description: 'Generating high-quality PDF output...',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
        };
      case 'final-assembly':
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          title: 'Final Assembly',
          description: 'Finalizing document structure...',
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-100',
        };
      case 'launch-ready':
        return {
          icon: <Rocket className="w-6 h-6" />,
          title: 'Launch Ready',
          description: 'Preparing for career launch...',
          color: 'text-launch-blue',
          bgColor: 'bg-blue-100',
        };
      default:
        return {
          icon: <Loader2 className="w-6 h-6" />,
          title: 'Processing',
          description: 'Working on your resume...',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
        };
    }
  };

  const phaseInfo = getPhaseInfo(currentPhase);

  return (
    <div className="text-center py-8 space-y-6">
      {/* Mission Control Header */}
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">Mission Control</h3>
        <p className="text-gray-600">Launch sequence in progress</p>
      </div>

      {/* Rocket Animation */}
      <div className="relative mx-auto w-32 h-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full animate-pulse" />
        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
          <div className={`${phaseInfo.bgColor} rounded-full p-4 animate-bounce`}>
            <div className={phaseInfo.color}>
              {phaseInfo.icon}
            </div>
          </div>
        </div>
        
        {/* Orbital rings */}
        <div 
          key={`ring-1-${animationKey}`}
          className="absolute inset-0 border-2 border-blue-200 rounded-full animate-spin"
          style={{ animationDuration: '3s' }}
        />
        <div 
          key={`ring-2-${animationKey}`}
          className="absolute inset-4 border border-blue-100 rounded-full animate-spin"
          style={{ animationDuration: '2s', animationDirection: 'reverse' }}
        />
      </div>

      {/* Progress Bar with Countdown Aesthetics */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm font-medium">
          <span className={phaseInfo.color}>{phaseInfo.title}</span>
          <span className="text-gray-600">{Math.round(progress)}%</span>
        </div>
        
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-launch-blue to-rocket-orange rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>
          
          {/* Progress markers */}
          <div className="absolute top-0 w-full h-3 flex justify-between items-center px-1">
            {[20, 40, 60, 80].map(marker => (
              <div
                key={marker}
                className={`w-1 h-full ${progress >= marker ? 'bg-white/50' : 'bg-gray-400/50'} rounded`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Status Text */}
      <div className="space-y-2">
        <p className="text-lg font-medium text-gray-900">
          {phaseInfo.description}
        </p>
        
        {/* Countdown timer effect */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Estimated completion: {Math.max(1, Math.ceil((100 - progress) / 10))} seconds</span>
        </div>
      </div>

      {/* Mission Progress Indicators */}
      <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-2 bg-launch-blue/10 rounded-full flex items-center justify-center">
            <FileText className="w-4 h-4 text-launch-blue" />
          </div>
          <p className="text-xs text-gray-600">Data Processing</p>
          <div className={`w-full h-1 mt-1 rounded ${progress > 0 ? 'bg-launch-blue' : 'bg-gray-200'}`} />
        </div>
        
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-2 bg-rocket-orange/10 rounded-full flex items-center justify-center">
            <Zap className="w-4 h-4 text-rocket-orange" />
          </div>
          <p className="text-xs text-gray-600">PDF Generation</p>
          <div className={`w-full h-1 mt-1 rounded ${progress > 40 ? 'bg-rocket-orange' : 'bg-gray-200'}`} />
        </div>
        
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-2 bg-green-500/10 rounded-full flex items-center justify-center">
            <Rocket className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-xs text-gray-600">Launch Ready</p>
          <div className={`w-full h-1 mt-1 rounded ${progress > 90 ? 'bg-green-500' : 'bg-gray-200'}`} />
        </div>
      </div>

      {/* Terminal-style output */}
      <div className="bg-gray-900 rounded-lg p-4 text-left font-mono text-sm">
        <div className="text-green-400 mb-2">LaunchCV Mission Control v2.0.1</div>
        <div className="space-y-1 text-gray-300">
          <div className="flex items-center">
            <span className="text-green-400 mr-2">✓</span>
            <span>Resume data validated</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-400 mr-2">✓</span>
            <span>Template "{templateName}" loaded</span>
          </div>
          <div className="flex items-center">
            <span className={`${progress > 50 ? 'text-green-400' : 'text-yellow-400'} mr-2`}>
              {progress > 50 ? "✓" : "○"}
            </span>
            <span>PDF engine initialized</span>
          </div>
          <div className="flex items-center">
            <span className={`${progress > 80 ? 'text-green-400' : 'text-gray-500'} mr-2`}>
              {progress > 80 ? "✓" : "○"}
            </span>
            <span>Document compilation complete</span>
          </div>
          <div className="flex items-center">
            <span className="text-yellow-400 mr-2 animate-pulse">⚡</span>
            <span className="animate-pulse">{phaseInfo.description}</span>
          </div>
        </div>
      </div>
    </div>
  );
};