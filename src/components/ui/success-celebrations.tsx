'use client';

import React, { useEffect, useState } from 'react';
import { Rocket, Star, Trophy, Zap, Target, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LaunchCelebrationProps {
  type: 'resume-completed' | 'first-export' | 'multiple-exports' | 'perfect-score' | 'speed-record' | 'section-completed';
  onComplete?: () => void;
  duration?: number;
  showConfetti?: boolean;
}

export const LaunchCelebration: React.FC<LaunchCelebrationProps> = ({
  type,
  onComplete,
  duration = 4000,
  showConfetti = true,
}) => {
  const [visible, setVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState<'entering' | 'celebrating' | 'exiting'>('entering');

  useEffect(() => {
    const timeline = [
      { phase: 'celebrating', delay: 500 },
      { phase: 'exiting', delay: duration - 500 },
    ] as const;

    timeline.forEach(({ phase, delay }) => {
      setTimeout(() => setAnimationPhase(phase), delay);
    });

    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  const getCelebrationConfig = () => {
    switch (type) {
      case 'resume-completed':
        return {
          icon: Trophy,
          title: '🎉 Mission Accomplished!',
          subtitle: 'Your resume is ready for launch!',
          color: 'from-yellow-400 to-orange-500',
          message: 'Outstanding work! Your professional resume is complete and ready to propel your career into orbit.',
        };
      case 'first-export':
        return {
          icon: Rocket,
          title: '🚀 First Launch Success!',
          subtitle: 'Welcome to Mission Control!',
          color: 'from-launch-blue to-rocket-orange',
          message: 'Congratulations on your first successful resume export! Your career journey begins now.',
        };
      case 'multiple-exports':
        return {
          icon: Star,
          title: '⭐ Veteran Commander!',
          subtitle: 'Multiple successful launches!',
          color: 'from-purple-500 to-pink-500',
          message: 'Multiple successful launches completed! You are becoming a resume export expert.',
        };
      case 'perfect-score':
        return {
          icon: Target,
          title: '🏆 Perfect Mission!',
          subtitle: 'Flawless execution achieved!',
          color: 'from-green-400 to-blue-500',
          message: 'Perfect resume score! Mission Control is impressed with your attention to detail.',
        };
      case 'speed-record':
        return {
          icon: Zap,
          title: '⚡ Speed Record!',
          subtitle: 'Lightning-fast completion!',
          color: 'from-yellow-300 to-red-500',
          message: 'Impressive! You have completed your resume in record time. Efficiency at its finest!',
        };
      case 'section-completed':
        return {
          icon: CheckCircle,
          title: '✅ Section Complete!',
          subtitle: 'Progress milestone achieved!',
          color: 'from-green-400 to-teal-500',
          message: 'Great progress! Another section successfully completed.',
        };
      default:
        return {
          icon: Rocket,
          title: '🎉 Success!',
          subtitle: 'Mission accomplished!',
          color: 'from-launch-blue to-rocket-orange',
          message: 'Great job! Keep up the excellent work.',
        };
    }
  };

  if (!visible) return null;

  const config = getCelebrationConfig();
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-bounce"
              style={{
                backgroundColor: ['#2563eb', '#f97316', '#10b981', '#f59e0b', '#8b5cf6'][i % 5],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1.5 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main celebration modal */}
      <div 
        className={cn(
          'relative bg-white rounded-3xl shadow-2xl p-8 mx-4 max-w-md w-full text-center transform transition-all duration-500',
          animationPhase === 'entering' && 'scale-75 opacity-0',
          animationPhase === 'celebrating' && 'scale-100 opacity-100',
          animationPhase === 'exiting' && 'scale-90 opacity-0'
        )}
      >
        {/* Animated background gradient */}
        <div className={cn(
          'absolute inset-0 rounded-3xl opacity-10 animate-pulse',
          `bg-gradient-to-br ${config.color}`
        )} />

        {/* Main icon with animation */}
        <div className="relative mb-6">
          <div className={cn(
            'w-24 h-24 mx-auto rounded-full flex items-center justify-center relative',
            `bg-gradient-to-br ${config.color}`,
            animationPhase === 'celebrating' && 'animate-bounce'
          )}>
            <Icon className="w-12 h-12 text-white" />
            
            {/* Pulsing rings */}
            <div className="absolute inset-0 border-4 border-white/30 rounded-full animate-ping" />
            <div 
              className="absolute inset-0 border-2 border-white/20 rounded-full animate-ping"
              style={{ animationDelay: '0.5s' }}
            />
          </div>

          {/* Floating elements */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 text-yellow-400 animate-bounce"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 60}deg) translateY(-50px)`,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <Star className="w-full h-full fill-current" />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {config.title}
          </h2>
          
          <h3 className="text-lg font-medium text-gray-700">
            {config.subtitle}
          </h3>
          
          <p className="text-gray-600 leading-relaxed">
            {config.message}
          </p>

          {/* Progress indicator */}
          <div className="mt-6">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className={cn(
                'w-2 h-2 rounded-full animate-pulse',
                `bg-gradient-to-r ${config.color}`
              )} />
              <span>Mission Control</span>
            </div>
          </div>
        </div>

        {/* Animated mission control display */}
        <div className="mt-6 p-4 bg-gray-900 rounded-lg text-left font-mono text-xs text-green-400">
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
            <span>MISSION_CONTROL_ACTIVE</span>
          </div>
          <div className="space-y-1 text-green-300">
            <div>STATUS: SUCCESS</div>
            <div>COMMANDER: EXCELLENT</div>
            <div>NEXT: CONTINUE_MISSION</div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MissionProgressCelebrationProps {
  progress: number;
  milestones?: number[];
  onMilestoneReached?: (milestone: number) => void;
}

export const MissionProgressCelebration: React.FC<MissionProgressCelebrationProps> = ({
  progress,
  milestones = [25, 50, 75, 100],
  onMilestoneReached,
}) => {
  const [celebratedMilestones, setCelebratedMilestones] = useState<Set<number>>(new Set());
  const [currentCelebration, setCurrentCelebration] = useState<number | null>(null);

  useEffect(() => {
    const newMilestone = milestones.find(
      milestone => progress >= milestone && !celebratedMilestones.has(milestone)
    );

    if (newMilestone) {
      setCelebratedMilestones(prev => new Set([...prev, newMilestone]));
      setCurrentCelebration(newMilestone);
      onMilestoneReached?.(newMilestone);
    }
  }, [progress, milestones, celebratedMilestones, onMilestoneReached]);


  if (!currentCelebration) return null;

  return (
    <LaunchCelebration
      type={currentCelebration === 100 ? 'resume-completed' : 'section-completed'}
      onComplete={() => setCurrentCelebration(null)}
      duration={currentCelebration === 100 ? 5000 : 3000}
      showConfetti={currentCelebration === 100}
    />
  );
};

interface QuickSuccessToastProps {
  message: string;
  type?: 'success' | 'achievement' | 'milestone';
  duration?: number;
}

export const QuickSuccessToast: React.FC<QuickSuccessToastProps> = ({
  message,
  type = 'success',
  duration = 2000,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  const getTypeConfig = () => {
    switch (type) {
      case 'achievement':
        return { icon: Trophy, color: 'bg-yellow-500', textColor: 'text-yellow-50' };
      case 'milestone':
        return { icon: Target, color: 'bg-blue-500', textColor: 'text-blue-50' };
      default:
        return { icon: CheckCircle, color: 'bg-green-500', textColor: 'text-green-50' };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in-right">
      <div className={cn(
        'flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg',
        config.color,
        config.textColor
      )}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};