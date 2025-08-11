import { useState, useEffect, useCallback, useRef } from 'react';
import { useResumeStore } from '../stores/resume-store';

export interface CompletionTimerState {
  startTime: Date | null;
  currentTime: Date;
  elapsedSeconds: number;
  isTracking: boolean;
  milestones: TimerMilestone[];
}

export interface TimerMilestone {
  id: string;
  name: string;
  timestamp: Date;
  elapsedSeconds: number;
}

export interface CompletionTimerActions {
  startTracking: () => void;
  pauseTracking: () => void;
  resumeTracking: () => void;
  stopTracking: () => CompletionSummary;
  addMilestone: (name: string) => void;
  reset: () => void;
  getFormattedTime: () => string;
  getEstimatedCompletion: () => number;
}

export interface CompletionSummary {
  totalSeconds: number;
  milestones: TimerMilestone[];
  completedSections: string[];
  averageTimePerSection: number;
  efficiency: 'fast' | 'normal' | 'slow';
}

export type CompletionTimerHook = CompletionTimerState & CompletionTimerActions;

const TARGET_COMPLETION_TIME = 10 * 60; // 10 minutes in seconds

export const useCompletionTimer = (): CompletionTimerHook => {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isTracking, setIsTracking] = useState(false);
  const [milestones, setMilestones] = useState<TimerMilestone[]>([]);
  const [pausedTime, setPausedTime] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const pauseStartRef = useRef<Date | null>(null);
  
  const { currentResume } = useResumeStore();

  // Update current time every second when tracking
  useEffect(() => {
    if (isTracking && startTime) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isTracking, startTime]);

  const elapsedSeconds = startTime && !pauseStartRef.current
    ? Math.floor((currentTime.getTime() - startTime.getTime()) / 1000) - pausedTime
    : 0;

  const startTracking = useCallback(() => {
    const now = new Date();
    setStartTime(now);
    setCurrentTime(now);
    setIsTracking(true);
    setPausedTime(0);
    setMilestones([
      {
        id: 'start',
        name: 'Resume Creation Started',
        timestamp: now,
        elapsedSeconds: 0
      }
    ]);
  }, []);

  const pauseTracking = useCallback(() => {
    if (isTracking && !pauseStartRef.current) {
      pauseStartRef.current = new Date();
      setIsTracking(false);
    }
  }, [isTracking]);

  const resumeTracking = useCallback(() => {
    if (!isTracking && pauseStartRef.current) {
      const pauseDuration = (new Date().getTime() - pauseStartRef.current.getTime()) / 1000;
      setPausedTime(prev => prev + pauseDuration);
      pauseStartRef.current = null;
      setIsTracking(true);
    }
  }, [isTracking]);

  const stopTracking = useCallback((): CompletionSummary => {
    const endTime = new Date();
    const totalSeconds = startTime 
      ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) - pausedTime
      : 0;

    // Add completion milestone
    const finalMilestones = [
      ...milestones,
      {
        id: 'complete',
        name: 'Resume Creation Completed',
        timestamp: endTime,
        elapsedSeconds: totalSeconds
      }
    ];

    setMilestones(finalMilestones);
    setIsTracking(false);

    // Calculate completion stats
    const completedSections = currentResume?.sections.filter(s => s.items.length > 0).map(s => s.type) || [];
    const averageTimePerSection = completedSections.length > 0 ? totalSeconds / completedSections.length : 0;
    
    let efficiency: CompletionSummary['efficiency'] = 'normal';
    if (totalSeconds <= TARGET_COMPLETION_TIME * 0.7) efficiency = 'fast';
    else if (totalSeconds > TARGET_COMPLETION_TIME) efficiency = 'slow';

    return {
      totalSeconds,
      milestones: finalMilestones,
      completedSections,
      averageTimePerSection,
      efficiency
    };
  }, [startTime, pausedTime, milestones, currentResume]);

  const addMilestone = useCallback((name: string) => {
    if (startTime) {
      const now = new Date();
      const milestone: TimerMilestone = {
        id: Date.now().toString(),
        name,
        timestamp: now,
        elapsedSeconds: Math.floor((now.getTime() - startTime.getTime()) / 1000) - pausedTime
      };
      
      setMilestones(prev => [...prev, milestone]);
    }
  }, [startTime, pausedTime]);

  const reset = useCallback(() => {
    setStartTime(null);
    setCurrentTime(new Date());
    setIsTracking(false);
    setMilestones([]);
    setPausedTime(0);
    pauseStartRef.current = null;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const getFormattedTime = useCallback(() => {
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [elapsedSeconds]);

  const getEstimatedCompletion = useCallback(() => {
    if (!currentResume || elapsedSeconds < 60) return TARGET_COMPLETION_TIME;

    const completedSections = currentResume.sections.filter(s => s.items.length > 0).length;
    const totalSections = currentResume.sections.length + 1; // +1 for personal info
    const hasPersonalInfo = currentResume.personalInfo.fullName.length > 0;
    
    const actualCompletedSections = completedSections + (hasPersonalInfo ? 1 : 0);
    
    if (actualCompletedSections === 0) return TARGET_COMPLETION_TIME;
    
    const averageTimePerSection = elapsedSeconds / actualCompletedSections;
    const estimatedTotal = averageTimePerSection * totalSections;
    
    return Math.max(elapsedSeconds, Math.min(estimatedTotal, TARGET_COMPLETION_TIME * 2));
  }, [currentResume, elapsedSeconds]);

  // Auto-start tracking when a resume is created
  useEffect(() => {
    if (currentResume && !startTime && !isTracking) {
      // Only auto-start if resume is very new (created in last 30 seconds)
      const resumeAge = (Date.now() - new Date(currentResume.createdAt).getTime()) / 1000;
      if (resumeAge < 30) {
        startTracking();
      }
    }
  }, [currentResume, startTime, isTracking, startTracking]);

  return {
    startTime,
    currentTime,
    elapsedSeconds,
    isTracking,
    milestones,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
    addMilestone,
    reset,
    getFormattedTime,
    getEstimatedCompletion
  };
};

// Helper hook for milestone tracking in components
export const useMilestoneTracker = () => {
  const timer = useCompletionTimer();
  
  const trackImportComplete = useCallback(() => {
    timer.addMilestone('Resume Import Completed');
  }, [timer]);
  
  const trackPersonalInfoComplete = useCallback(() => {
    timer.addMilestone('Personal Information Completed');
  }, [timer]);
  
  const trackExperienceComplete = useCallback(() => {
    timer.addMilestone('Work Experience Completed');
  }, [timer]);
  
  const trackEducationComplete = useCallback(() => {
    timer.addMilestone('Education Completed');
  }, [timer]);
  
  const trackSkillsComplete = useCallback(() => {
    timer.addMilestone('Skills Completed');
  }, [timer]);
  
  const trackTemplateSelected = useCallback(() => {
    timer.addMilestone('Template Selected');
  }, [timer]);
  
  const trackExportReady = useCallback(() => {
    timer.addMilestone('Ready for Export');
  }, [timer]);

  return {
    ...timer,
    trackImportComplete,
    trackPersonalInfoComplete,
    trackExperienceComplete,
    trackEducationComplete,
    trackSkillsComplete,
    trackTemplateSelected,
    trackExportReady
  };
};