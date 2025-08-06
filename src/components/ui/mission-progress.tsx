'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckCircle, Circle, Rocket, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const missionProgressVariants = cva(
  'w-full',
  {
    variants: {
      variant: {
        default: 'bg-white border border-gray-200 rounded-lg p-6',
        minimal: 'bg-transparent',
        card: 'bg-gradient-to-r from-launch-blue-50 to-rocket-orange-50 border border-launch-blue-200 rounded-lg p-6',
        compact: 'bg-white border border-gray-200 rounded-md p-4'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

interface MissionStep {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  icon?: React.ReactNode;
  estimatedTime?: string;
}

export interface MissionProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof missionProgressVariants> {
  steps: MissionStep[];
  currentStep?: string;
  showIcons?: boolean;
  showDescriptions?: boolean;
  showEstimatedTime?: boolean;
  orientation?: 'horizontal' | 'vertical';
  animate?: boolean;
  missionTitle?: string;
  completedMessage?: string;
}

const MissionProgress = React.forwardRef<HTMLDivElement, MissionProgressProps>(
  (
    {
      className,
      variant,
      steps,
      currentStep,
      showIcons = true,
      showDescriptions = true,
      showEstimatedTime = true,
      orientation = 'vertical',
      animate = true,
      missionTitle = 'Mission Progress',
      completedMessage = 'Mission Complete! 🚀',
      ...props
    },
    ref
  ) => {
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    const totalSteps = steps.length;
    const progressPercentage = (completedSteps / totalSteps) * 100;
    const isComplete = completedSteps === totalSteps;

    const getStepIcon = (step: MissionStep) => {
      if (step.icon) return step.icon;
      
      switch (step.status) {
        case 'completed':
          return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'in_progress':
          return (
            <div className="relative">
              <Circle className="w-5 h-5 text-launch-blue animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-launch-blue rounded-full animate-ping" />
              </div>
            </div>
          );
        default:
          return <Circle className="w-5 h-5 text-gray-300" />;
      }
    };


    return (
      <div
        className={cn(missionProgressVariants({ variant }), className)}
        ref={ref}
        {...props}
      >
        {/* Mission Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold mission-text">
              {isComplete ? completedMessage : missionTitle}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{completedSteps}/{totalSteps}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-700 ease-out",
                isComplete 
                  ? "bg-gradient-to-r from-green-500 to-rocket-orange animate-pulse" 
                  : "bg-gradient-to-r from-launch-blue to-rocket-orange"
              )}
              style={{ width: `${progressPercentage}%` }}
            />
            {animate && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
            )}
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Mission Started</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
            <span>Launch Ready</span>
          </div>
        </div>

        {/* Steps */}
        <div className={cn(
          orientation === 'horizontal' 
            ? 'flex gap-4 overflow-x-auto pb-2' 
            : 'space-y-4'
        )}>
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                'flex gap-3 transition-all duration-300',
                orientation === 'horizontal' && 'flex-col items-center min-w-0 flex-1',
                step.status === 'in_progress' && animate && 'scale-105',
                currentStep === step.id && 'ring-2 ring-launch-blue ring-opacity-50 rounded-md p-2'
              )}
            >
              {/* Step Icon */}
              {showIcons && (
                <div className={cn(
                  'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                  step.status === 'completed' && 'bg-green-100',
                  step.status === 'in_progress' && 'bg-launch-blue-100',
                  step.status === 'pending' && 'bg-gray-100'
                )}>
                  {getStepIcon(step)}
                </div>
              )}

              {/* Step Content */}
              <div className={cn(
                'flex-1 min-w-0',
                orientation === 'horizontal' && 'text-center'
              )}>
                <h4 className={cn(
                  'font-medium transition-colors duration-300',
                  step.status === 'completed' && 'text-green-700',
                  step.status === 'in_progress' && 'text-launch-blue',
                  step.status === 'pending' && 'text-gray-500'
                )}>
                  {step.title}
                </h4>
                
                {showDescriptions && step.description && (
                  <p className={cn(
                    'text-sm mt-1 transition-colors duration-300',
                    step.status === 'completed' && 'text-green-600',
                    step.status === 'in_progress' && 'text-launch-blue-600',
                    step.status === 'pending' && 'text-gray-400'
                  )}>
                    {step.description}
                  </p>
                )}

                {showEstimatedTime && step.estimatedTime && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{step.estimatedTime}</span>
                  </div>
                )}
              </div>

              {/* Connection Line (for vertical layout) */}
              {orientation === 'vertical' && index < steps.length - 1 && (
                <div className="absolute left-5 mt-10 w-0.5 h-6 bg-gray-200" />
              )}
            </div>
          ))}
        </div>

        {/* Mission Status Footer */}
        {isComplete && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-rocket-orange-50 rounded-md border border-green-200">
            <div className="flex items-center gap-2 text-green-700">
              <Rocket className="w-5 h-5 animate-bounce" />
              <span className="font-medium">Career launch sequence initiated! Ready for takeoff! 🚀</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);
MissionProgress.displayName = 'MissionProgress';

export { MissionProgress, missionProgressVariants };
export type { MissionStep };