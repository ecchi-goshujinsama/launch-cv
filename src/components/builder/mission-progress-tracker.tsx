'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { 
  Rocket, 
  CheckCircle2, 
  XCircle,
  Clock,
  Target,
  Zap,
  TrendingUp,
  Award,
  Timer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionCard } from '@/components/layout';

interface ProgressItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  weight: number; // 1-10 for calculating overall progress
  required: boolean;
  estimatedTime?: number; // in minutes
}

interface MissionProgressTrackerProps {
  progressItems: ProgressItem[];
  onItemClick?: (itemId: string) => void;
  showDetails?: boolean;
  compact?: boolean;
  animateProgress?: boolean;
  className?: string;
}

// Default progress items for resume building
const defaultProgressItems: ProgressItem[] = [
  {
    id: 'personal-info',
    title: 'Personal Information',
    description: 'Name, contact details, and location',
    status: 'pending',
    weight: 8,
    required: true,
    estimatedTime: 3
  },
  {
    id: 'professional-summary',
    title: 'Professional Summary',
    description: 'Brief overview of your career',
    status: 'pending',
    weight: 6,
    required: false,
    estimatedTime: 5
  },
  {
    id: 'work-experience',
    title: 'Work Experience',
    description: 'Employment history and achievements',
    status: 'pending',
    weight: 10,
    required: true,
    estimatedTime: 15
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Academic background and qualifications',
    status: 'pending',
    weight: 7,
    required: true,
    estimatedTime: 5
  },
  {
    id: 'skills',
    title: 'Skills & Expertise',
    description: 'Technical and soft skills',
    status: 'pending',
    weight: 6,
    required: true,
    estimatedTime: 8
  },
  {
    id: 'additional-sections',
    title: 'Additional Sections',
    description: 'Projects, certifications, awards',
    status: 'pending',
    weight: 4,
    required: false,
    estimatedTime: 10
  }
];

export function MissionProgressTracker({
  progressItems = defaultProgressItems,
  onItemClick,
  showDetails = true,
  compact = false,
  animateProgress = true,
  className
}: MissionProgressTrackerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime] = useState(Date.now());

  // Update timer every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Math.floor((Date.now() - startTime) / 60000));
    }, 60000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Calculate progress metrics
  const metrics = React.useMemo(() => {
    const totalWeight = progressItems.reduce((sum, item) => sum + item.weight, 0);
    const completedWeight = progressItems
      .filter(item => item.status === 'completed')
      .reduce((sum, item) => sum + item.weight, 0);
    
    const requiredItems = progressItems.filter(item => item.required);
    const completedRequired = requiredItems.filter(item => item.status === 'completed');
    
    const totalItems = progressItems.length;
    const completedItems = progressItems.filter(item => item.status === 'completed').length;
    const inProgressItems = progressItems.filter(item => item.status === 'in_progress').length;
    const errorItems = progressItems.filter(item => item.status === 'error').length;
    
    const overallProgress =
      totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
    const requiredProgress =
      requiredItems.length > 0
        ? Math.round((completedRequired.length / requiredItems.length) * 100)
        : 0;
    const estimatedTotalTime = progressItems.reduce((sum, item) => sum + (item.estimatedTime || 0), 0);
    const estimatedRemainingTime = progressItems
      .filter(item => item.status === 'pending')
      .reduce((sum, item) => sum + (item.estimatedTime || 0), 0);

    return {
      overallProgress,
      requiredProgress,
      completedItems,
      totalItems,
      inProgressItems,
      errorItems,
      requiredItems: requiredItems.length,
      completedRequired: completedRequired.length,
      estimatedTotalTime,
      estimatedRemainingTime
    };
  }, [progressItems]);

  const getStatusIcon = (status: ProgressItem['status'], size: 'sm' | 'md' = 'sm') => {
    const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    
    switch (status) {
      case 'completed':
        return <CheckCircle2 className={`${iconSize} text-green-500`} />;
      case 'in_progress':
        return <Clock className={`${iconSize} text-blue-500 animate-pulse`} />;
      case 'error':
        return <XCircle className={`${iconSize} text-red-500`} />;
      case 'pending':
      default:
        return <div className={`${iconSize === 'w-4 h-4' ? 'w-4 h-4' : 'w-5 h-5'} border-2 border-gray-300 rounded-full`} />;
    }
  };

  const getMissionLevel = () => {
    if (metrics.overallProgress >= 90) return { level: 'Launch Ready', color: 'text-green-600', icon: <Rocket className="w-5 h-5" /> };
    if (metrics.overallProgress >= 75) return { level: 'Final Checks', color: 'text-blue-600', icon: <Target className="w-5 h-5" /> };
    if (metrics.overallProgress >= 50) return { level: 'Building Momentum', color: 'text-amber-600', icon: <Zap className="w-5 h-5" /> };
    if (metrics.overallProgress >= 25) return { level: 'Getting Started', color: 'text-purple-600', icon: <TrendingUp className="w-5 h-5" /> };
    return { level: 'Mission Prep', color: 'text-gray-600', icon: <Clock className="w-5 h-5" /> };
  };

  const missionLevel = getMissionLevel();

  if (compact) {
    return (
      <div className={cn("flex items-center gap-4 p-3 bg-gradient-to-r from-launch-blue/5 to-rocket-orange/5 rounded-lg border border-launch-blue/20", className)}>
        <div className="flex items-center gap-2">
          <div className={missionLevel.color}>
            {missionLevel.icon}
          </div>
          <span className={`font-medium ${missionLevel.color}`}>
            {missionLevel.level}
          </span>
        </div>
        
        <div className="flex-1">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={cn(
                "bg-gradient-to-r from-launch-blue to-rocket-orange rounded-full h-2 transition-all duration-700",
                animateProgress && "ease-out"
              )}
              style={{ width: `${metrics.overallProgress}%` }}
            />
          </div>
        </div>
        
        <div className="text-sm font-semibold text-gray-700">
          {metrics.overallProgress}%
        </div>
      </div>
    );
  }

  return (
    <MissionCard variant="elevated" className={cn("", className)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-r from-launch-blue/10 to-rocket-orange/10 rounded-lg flex items-center justify-center ${missionLevel.color}`}>
              {missionLevel.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold mission-text">Mission Progress</h3>
              <p className={`text-sm ${missionLevel.color} font-medium`}>
                {missionLevel.level} • {metrics.completedItems}/{metrics.totalItems} Complete
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{metrics.overallProgress}%</div>
            <div className="text-xs text-gray-500">Overall Progress</div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm text-gray-600">{metrics.overallProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={cn(
                  "bg-gradient-to-r from-launch-blue to-rocket-orange rounded-full h-3 transition-all duration-700",
                  animateProgress && "ease-out"
                )}
                style={{ width: `${metrics.overallProgress}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Required Sections</span>
              <span className="text-sm text-gray-600">
                {metrics.completedRequired}/{metrics.requiredItems}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={cn(
                  "bg-green-500 rounded-full h-2 transition-all duration-500",
                  animateProgress && "ease-out"
                )}
                style={{ width: `${metrics.requiredProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-2xl font-bold text-green-700">{metrics.completedItems}</div>
            <div className="text-xs text-green-600 uppercase font-medium">Completed</div>
          </div>
          <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">{metrics.inProgressItems}</div>
            <div className="text-xs text-blue-600 uppercase font-medium">In Progress</div>
          </div>
          <div className="text-center p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="text-2xl font-bold text-amber-700">{metrics.estimatedRemainingTime}</div>
            <div className="text-xs text-amber-600 uppercase font-medium">Min Left</div>
          </div>
          <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-gray-700">{currentTime}</div>
            <div className="text-xs text-gray-600 uppercase font-medium">Time Spent</div>
          </div>
        </div>

        {/* Progress Items */}
        {showDetails && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Section Progress</h4>
            <div className="space-y-2">
              {progressItems.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                    item.status === 'completed' ? "bg-green-50 border-green-200" :
                    item.status === 'in_progress' ? "bg-blue-50 border-blue-200" :
                    item.status === 'error' ? "bg-red-50 border-red-200" :
                    "bg-gray-50 border-gray-200",
                    onItemClick && "cursor-pointer hover:bg-opacity-75"
                  )}
                  onClick={() => onItemClick?.(item.id)}
                >
                  {getStatusIcon(item.status)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{item.title}</span>
                      {item.required && (
                        <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xs text-gray-500">
                      {item.estimatedTime}m
                    </div>
                    {item.status === 'completed' && (
                      <Award className="w-4 h-4 text-green-500 mx-auto mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mission Status */}
        <div className="p-4 bg-gradient-to-r from-launch-blue/5 to-rocket-orange/5 rounded-lg border border-launch-blue/20">
          <div className="flex items-center gap-3 mb-2">
            <Timer className="w-5 h-5 text-launch-blue" />
            <h4 className="font-medium text-launch-blue">Mission Status</h4>
          </div>
          <div className="text-sm text-gray-700">
            {metrics.overallProgress === 100 ? (
              "🚀 Mission Complete! Your resume is ready for launch."
            ) : metrics.errorItems > 0 ? (
              `⚠️ Mission Alert: ${metrics.errorItems} section${metrics.errorItems > 1 ? 's' : ''} need${metrics.errorItems === 1 ? 's' : ''} attention before launch.`
            ) : metrics.requiredProgress < 100 ? (
              `🎯 Mission Focus: Complete ${metrics.requiredItems - metrics.completedRequired} more required section${metrics.requiredItems - metrics.completedRequired > 1 ? 's' : ''}.`
            ) : (
              `⭐ Mission Progress: You're doing great! ${metrics.estimatedRemainingTime} minutes estimated to completion.`
            )}
          </div>
          
          {metrics.overallProgress >= 75 && (
            <div className="mt-3">
              <LaunchButton
                variant="mission"
                size="sm"
                icon="rocket"
                iconPosition="right"
                animation="rocket"
                className="w-full"
              >
                Prepare for Launch
              </LaunchButton>
            </div>
          )}
        </div>
      </div>
    </MissionCard>
  );
}