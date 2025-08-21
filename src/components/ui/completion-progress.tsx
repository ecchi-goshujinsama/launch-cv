'use client';

import * as React from 'react';
import { Clock, Target, TrendingUp, Trophy, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCompletionTimer } from '@/lib/hooks/use-completion-timer';
import { useResumeStore } from '@/lib/stores/resume-store';

interface CompletionProgressProps {
  className?: string;
  showDetailed?: boolean;
  showEstimate?: boolean;
}

export function CompletionProgress({ 
  className, 
  showDetailed = false,
  showEstimate = true 
}: CompletionProgressProps) {
  const timer = useCompletionTimer();
  const { currentResume } = useResumeStore();

  // Calculate progress based on completed sections
  const getCompletionProgress = () => {
    if (!currentResume) return 0;

    let completed = 0;
    let total = 4; // Personal info + 3 main sections (experience, education, skills)

    // Check personal info completion
    const personalInfo = currentResume.personalInfo;
    const personalInfoFields = [personalInfo.fullName, personalInfo.email, personalInfo.phone, personalInfo.summary];
    const completedPersonalFields = personalInfoFields.filter(field => field && field.trim().length > 0).length;
    if (completedPersonalFields >= 2) completed += 1; // At least name and email

    // Check section completion
    const requiredSections = ['experience', 'education', 'skills'];
    requiredSections.forEach(sectionType => {
      const section = currentResume.sections.find(s => s.type === sectionType);
      if (section && section.items.length > 0) {
        completed += 1;
      }
    });

    return Math.round((completed / total) * 100);
  };

  const progress = getCompletionProgress();
  const estimatedTotal = timer.getEstimatedCompletion();
  const targetTime = 10 * 60; // 10 minutes
  
  const getEfficiencyStatus = () => {
    if (timer.elapsedSeconds === 0) return 'ready';
    if (timer.elapsedSeconds <= targetTime * 0.5) return 'fast';
    if (timer.elapsedSeconds <= targetTime) return 'on-track';
    if (timer.elapsedSeconds <= targetTime * 1.5) return 'slow';
    return 'needs-focus';
  };

  const getEfficiencyIcon = () => {
    const status = getEfficiencyStatus();
    switch (status) {
      case 'fast': return <Zap className="w-4 h-4 text-green-500" />;
      case 'on-track': return <Target className="w-4 h-4 text-blue-500" />;
      case 'slow': return <TrendingUp className="w-4 h-4 text-amber-500" />;
      case 'needs-focus': return <Clock className="w-4 h-4 text-red-500" />;
      default: return <Trophy className="w-4 h-4 text-launch-blue" />;
    }
  };

  const getEfficiencyMessage = () => {
    const status = getEfficiencyStatus();
    switch (status) {
      case 'fast': return 'Great pace! You\'re ahead of schedule.';
      case 'on-track': return 'Perfect timing for your career launch.';
      case 'slow': return 'Still on track, keep up the momentum!';
      case 'needs-focus': return 'Focus mode: Let\'s complete this launch!';
      default: return 'Ready to launch your career?';
    }
  };

  if (!timer.startTime && !showDetailed) {
    return null;
  }

  return (
    <div className={cn(
      'bg-slate-800/50 border border-slate-600 rounded-lg p-4',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getEfficiencyIcon()}
          <span className="text-sm font-medium text-slate-200">
            Mission Progress
          </span>
        </div>
        {timer.isTracking && (
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Active
          </div>
        )}
      </div>

      {/* Time Display */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <div className="text-lg font-mono text-launch-blue">
            {timer.getFormattedTime()}
          </div>
          {showEstimate && progress > 0 && progress < 100 && estimatedTotal > timer.elapsedSeconds && (
            <div className="text-xs text-slate-400">
              Est. {Math.max(1, Math.ceil((estimatedTotal - timer.elapsedSeconds) / 60))}m remaining
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-slate-400">Completion</span>
          <span className="text-xs font-medium text-slate-300">{progress}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className={cn(
              'h-2 rounded-full transition-all duration-500',
              progress < 25 ? 'bg-red-500' :
              progress < 50 ? 'bg-amber-500' :
              progress < 75 ? 'bg-blue-500' :
              progress < 100 ? 'bg-launch-blue' :
              'bg-green-500'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Efficiency Message */}
      <div className="text-xs text-slate-400 text-center">
        {getEfficiencyMessage()}
      </div>

      {/* Detailed Progress */}
      {showDetailed && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="space-y-2">
            <div className="text-xs font-medium text-slate-300 mb-2">Milestones</div>
            {timer.milestones && timer.milestones.length > 0 ? (
              timer.milestones.slice(-3).map((milestone, index) => (
                <div key={`${milestone.id ?? milestone.name}-${milestone.elapsedSeconds}-${index}`} className="flex justify-between text-xs">
                  <span className="text-slate-400">{milestone.name}</span>
                  <span className="text-slate-500 font-mono">
                    {Math.floor(milestone.elapsedSeconds / 60)}:{(milestone.elapsedSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 italic">No milestones yet</div>
            )}
          </div>
        </div>
      )}

      {/* Target Time Indicator */}
      {timer.elapsedSeconds > 0 && (
        <div className="mt-2 pt-2 border-t border-slate-700">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Target: 10:00</span>
            <span className={cn(
              'font-medium',
              timer.elapsedSeconds <= targetTime ? 'text-green-400' : 'text-amber-400'
            )}>
              {timer.elapsedSeconds <= targetTime ? '✓ On Track' : '⏱ Focus Mode'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact version for headers/toolbars
export function CompactCompletionProgress({ className }: { className?: string }) {
  const timer = useCompletionTimer();
  
  if (!timer.startTime) return null;

  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-1 bg-slate-800/50 border border-slate-600 rounded-full text-xs',
      className
    )}>
      <Clock className="w-3 h-3 text-launch-blue" />
      <span className="font-mono text-slate-200">{timer.getFormattedTime()}</span>
      {timer.isTracking && (
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
      )}
    </div>
  );
}