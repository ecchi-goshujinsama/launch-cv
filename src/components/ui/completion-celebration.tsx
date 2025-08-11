'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Rocket, Trophy, Star, Sparkles, Download, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from './launch-button';
import type { CompletionSummary } from '@/lib/hooks/use-completion-timer';

interface CompletionCelebrationProps {
  isVisible: boolean;
  summary: CompletionSummary;
  onContinue: () => void;
  onExport: () => void;
  className?: string;
}

export function CompletionCelebration({
  isVisible,
  summary,
  onContinue,
  onExport,
  className
}: CompletionCelebrationProps) {
  const [animationPhase, setAnimationPhase] = useState(0);

  // Animation sequence
  useEffect(() => {
    if (!isVisible) {
      setAnimationPhase(0);
      return;
    }

    const timeouts: NodeJS.Timeout[] = [];

    // Phase 1: Rocket launch animation (0.5s delay)
    timeouts.push(setTimeout(() => setAnimationPhase(1), 500));
    
    // Phase 2: Stats reveal (1.5s delay)
    timeouts.push(setTimeout(() => setAnimationPhase(2), 1500));
    
    // Phase 3: Action buttons (2.5s delay)
    timeouts.push(setTimeout(() => setAnimationPhase(3), 2500));

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [isVisible]);

  const getEfficiencyMessage = () => {
    const minutes = Math.floor(summary.totalSeconds / 60);
    
    switch (summary.efficiency) {
      case 'fast':
        return {
          title: 'Lightning Fast! ⚡',
          message: `Career launched in just ${minutes} minutes! You're a resume rockstar!`,
          color: 'text-green-400',
          bgColor: 'bg-green-500/20'
        };
      case 'normal':
        return {
          title: 'Mission Accomplished! 🚀',
          message: `Resume completed in ${minutes} minutes. Ready for launch sequence!`,
          color: 'text-launch-blue',
          bgColor: 'bg-launch-blue/20'
        };
      case 'slow':
        return {
          title: 'Steady Progress! 🏁',
          message: `Great job completing your resume! Quality over speed.`,
          color: 'text-amber-400',
          bgColor: 'bg-amber-500/20'
        };
      default:
        return {
          title: 'Mission Complete! 🎯',
          message: `Your career is ready to launch!`,
          color: 'text-launch-blue',
          bgColor: 'bg-launch-blue/20'
        };
    }
  };

  const efficiency = getEfficiencyMessage();

  if (!isVisible) return null;

  return (
    <div className={cn(
      'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4',
      'animate-in fade-in duration-500',
      className
    )}>
      <div className="bg-slate-800 border border-slate-600 rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden">
        
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'absolute w-1 h-1 bg-launch-blue rounded-full animate-ping',
                animationPhase >= 1 ? 'opacity-40' : 'opacity-0'
              )}
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 2) * 20}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>

        {/* Main rocket animation */}
        <div className="relative mb-6">
          <div className={cn(
            'mx-auto w-20 h-20 flex items-center justify-center rounded-full transition-all duration-1000',
            efficiency.bgColor,
            animationPhase >= 1 ? 'transform scale-110' : 'scale-75 opacity-50'
          )}>
            <Rocket 
              className={cn(
                'w-12 h-12 transition-all duration-1000',
                efficiency.color,
                animationPhase >= 1 ? 'animate-bounce' : ''
              )}
            />
          </div>
          
          {/* Sparkles around rocket */}
          {animationPhase >= 1 && (
            <>
              <Sparkles className="absolute top-2 right-2 w-4 h-4 text-amber-400 animate-pulse" />
              <Star className="absolute bottom-2 left-2 w-3 h-3 text-blue-400 animate-ping" />
              <Sparkles className="absolute top-4 left-0 w-3 h-3 text-green-400 animate-pulse delay-300" />
            </>
          )}
        </div>

        {/* Title and message */}
        <div className={cn(
          'mb-6 transition-all duration-700',
          animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}>
          <h2 className={cn('text-2xl font-bold mb-2', efficiency.color)}>
            {efficiency.title}
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            {efficiency.message}
          </p>
        </div>

        {/* Stats */}
        <div className={cn(
          'grid grid-cols-2 gap-4 mb-6 transition-all duration-700',
          animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}>
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="text-xl font-bold text-launch-blue">
              {Math.floor(summary.totalSeconds / 60)}m
            </div>
            <div className="text-xs text-slate-400">Total Time</div>
          </div>
          
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="text-xl font-bold text-rocket-orange">
              {summary.completedSections.length}
            </div>
            <div className="text-xs text-slate-400">Sections</div>
          </div>
        </div>

        {/* Milestones */}
        {animationPhase >= 2 && summary.milestones.length > 2 && (
          <div className="mb-6 text-left">
            <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Key Milestones
            </h4>
            <div className="space-y-1 text-xs text-slate-400 max-h-20 overflow-y-auto">
              {summary.milestones.slice(0, 4).map((milestone, index) => (
                <div key={milestone.id} className="flex justify-between">
                  <span className="truncate">{milestone.name}</span>
                  <span className="font-mono ml-2">
                    {Math.floor(milestone.elapsedSeconds / 60)}:{(milestone.elapsedSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className={cn(
          'space-y-3 transition-all duration-700',
          animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}>
          <LaunchButton
            variant="mission"
            size="lg"
            onClick={onExport}
            icon="rocket"
            iconPosition="right"
            animation="rocket"
            className="w-full"
          >
            Launch Resume
            <Download className="w-4 h-4 ml-2" />
          </LaunchButton>
          
          <LaunchButton
            variant="outline"
            onClick={onContinue}
            className="w-full"
          >
            Continue Editing
            <ArrowRight className="w-4 h-4 ml-2" />
          </LaunchButton>
        </div>

        {/* Fun fact */}
        <div className={cn(
          'mt-4 pt-4 border-t border-slate-600 text-xs text-slate-500 transition-all duration-700',
          animationPhase >= 3 ? 'opacity-100' : 'opacity-0'
        )}>
          {summary.efficiency === 'fast' && '🚀 You completed this faster than 80% of users!'}
          {summary.efficiency === 'normal' && '📈 Perfect timing for a professional resume!'}
          {summary.efficiency === 'slow' && '🎯 Thorough preparation leads to better results!'}
        </div>
      </div>
    </div>
  );
}

// Hook to manage celebration state
export const useCompletionCelebration = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [summary, setSummary] = useState<CompletionSummary | null>(null);

  const showCelebration = (completionSummary: CompletionSummary) => {
    setSummary(completionSummary);
    setIsVisible(true);
  };

  const hideCelebration = () => {
    setIsVisible(false);
    setTimeout(() => setSummary(null), 500); // Clear after animation
  };

  return {
    isVisible,
    summary,
    showCelebration,
    hideCelebration
  };
};