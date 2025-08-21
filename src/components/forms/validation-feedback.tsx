'use client';

import * as React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Info,
  Lightbulb,
  Shield,
  Target,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MissionCard } from '@/components/layout';

// Validation message types
export type ValidationLevel = 'error' | 'warning' | 'info' | 'success' | 'tip';

export interface ValidationMessage {
  level: ValidationLevel;
  message: string;
  field?: string;
  code?: string;
}

// Form validation feedback props
interface ValidationFeedbackProps {
  messages: ValidationMessage[];
  showIcons?: boolean;
  compact?: boolean;
  className?: string;
}

export function ValidationFeedback({
  messages,
  showIcons = true,
  compact = false,
  className
}: ValidationFeedbackProps) {
  if (messages.length === 0) return null;

  const getIcon = (level: ValidationLevel) => {
    switch (level) {
      case 'error': return <XCircle className="w-4 h-4 text-red-500" aria-hidden="true" focusable={false} />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" aria-hidden="true" focusable={false} />;
      case 'info': return <Info className="w-4 h-4 text-blue-500" aria-hidden="true" focusable={false} />;
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green-500" aria-hidden="true" focusable={false} />;
      case 'tip': return <Lightbulb className="w-4 h-4 text-purple-500" aria-hidden="true" focusable={false} />;
      default: return <Info className="w-4 h-4 text-gray-500" aria-hidden="true" focusable={false} />;
    }
  };

  const getStyles = (level: ValidationLevel) => {
    switch (level) {
      case 'error': return 'text-red-700 bg-red-50 border-red-200';
      case 'warning': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'info': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'success': return 'text-green-700 bg-green-50 border-green-200';
      case 'tip': return 'text-purple-700 bg-purple-50 border-purple-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  if (compact) {
    return (
      <div className={cn("space-y-1", className)} role="status" aria-live="polite" aria-atomic="true">
        {messages.map((msg, index) => (
          <div key={index} className={cn(
            "flex items-start gap-2 text-sm p-2 rounded border",
            getStyles(msg.level)
          )}>
            {showIcons && getIcon(msg.level)}
            <span className="flex-1">{msg.message}</span>
          </div>
        ))}
      </div>
    );
  }

  // Group messages by level
  const groupedMessages = messages.reduce((acc, msg) => {
    acc[msg.level] = acc[msg.level] || [];
    acc[msg.level].push(msg);
    return acc;
  }, {} as Record<ValidationLevel, ValidationMessage[]>);

  return (
    <div className={cn("space-y-3", className)}>
      {Object.entries(groupedMessages).map(([level, msgs]) => (
        <div key={level} className={cn(
          "p-4 rounded-lg border",
          getStyles(level as ValidationLevel)
        )}>
          <div className="flex items-start gap-3">
            {showIcons && (
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(level as ValidationLevel)}
              </div>
            )}
            <div className="flex-1 space-y-2">
              {msgs.map((msg, index) => (
                <div key={index}>
                  {msg.field && (
                    <div className="text-xs font-medium uppercase tracking-wide opacity-75 mb-1">
                      {msg.field}
                    </div>
                  )}
                  <div className="text-sm">{msg.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Form validation summary component
interface ValidationSummaryProps {
  errorCount: number;
  warningCount: number;
  successCount: number;
  totalFields: number;
  completionScore?: number;
  className?: string;
  compact?: boolean;
  showProgress?: boolean;
}

export function ValidationSummary({
  errorCount,
  warningCount,
  successCount,
  totalFields,
  completionScore = 0,
  className,
  compact = false,
  showProgress = true
}: ValidationSummaryProps) {
  const completionPercentage = totalFields > 0 ? Math.round((successCount / totalFields) * 100) : 0;
  
  if (compact) {
    return (
      <div className={cn("flex items-center gap-4 p-3 bg-gray-50 rounded-lg", className)}>
        <div className="flex items-center gap-2 text-sm">
          {errorCount > 0 && (
            <span className="flex items-center gap-1 text-red-600">
              <XCircle className="w-4 h-4" aria-hidden="true" focusable={false} />
              {errorCount}
            </span>
          )}
          {warningCount > 0 && (
            <span className="flex items-center gap-1 text-amber-600">
              <AlertTriangle className="w-4 h-4" aria-hidden="true" focusable={false} />
              {warningCount}
            </span>
          )}
          <span className="flex items-center gap-1 text-green-600">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" focusable={false} />
            {successCount}
          </span>
        </div>
        
        {showProgress && (
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-2" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={completionPercentage}>
              <div 
                className="bg-launch-blue rounded-full h-2 transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        )}
        
        <div className="text-sm font-medium text-gray-700">
          {completionPercentage}%
        </div>
      </div>
    );
  }

  return (
    <MissionCard variant="elevated" className={cn("", className)}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-launch-blue/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-launch-blue" aria-hidden="true" focusable={false} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mission-text">Form Validation</h3>
              <p className="text-sm text-gray-600">Mission Control status check</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{completionPercentage}%</div>
            <div className="text-xs text-gray-500">Complete</div>
          </div>
        </div>

        {/* Progress bar */}
        {showProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Form Completion</span>
              <span>{successCount}/{totalFields} fields</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={completionPercentage}>
              <div 
                className="bg-gradient-to-r from-launch-blue to-rocket-orange rounded-full h-3 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Validation counts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={cn(
            "text-center p-3 border rounded-lg",
            errorCount > 0 ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"
          )}>
            <div className={cn(
              "text-2xl font-bold",
              errorCount > 0 ? "text-red-700" : "text-gray-500"
            )}>
              {errorCount}
            </div>
            <div className={cn(
              "text-xs uppercase font-medium",
              errorCount > 0 ? "text-red-600" : "text-gray-500"
            )}>
              Errors
            </div>
          </div>
          
          <div className={cn(
            "text-center p-3 border rounded-lg",
            warningCount > 0 ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-200"
          )}>
            <div className={cn(
              "text-2xl font-bold",
              warningCount > 0 ? "text-amber-700" : "text-gray-500"
            )}>
              {warningCount}
            </div>
            <div className={cn(
              "text-xs uppercase font-medium",
              warningCount > 0 ? "text-amber-600" : "text-gray-500"
            )}>
              Warnings
            </div>
          </div>

          <div className={cn(
            "text-center p-3 border rounded-lg",
            successCount > 0 ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
          )}>
            <div className={cn(
              "text-2xl font-bold",
              successCount > 0 ? "text-green-700" : "text-gray-500"
            )}>
              {successCount}
            </div>
            <div className={cn(
              "text-xs uppercase font-medium",
              successCount > 0 ? "text-green-600" : "text-gray-500"
            )}>
              Complete
            </div>
          </div>
          
          <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">{completionScore}/100</div>
            <div className="text-xs text-blue-600 uppercase font-medium">Score</div>
          </div>
        </div>

        {/* Mission status */}
        <div className="p-4 bg-gradient-to-r from-launch-blue/5 to-rocket-orange/5 rounded-lg border border-launch-blue/20" role="status" aria-live="polite">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-launch-blue" aria-hidden="true" focusable={false} />
            <h4 className="font-medium text-launch-blue">Mission Status</h4>
          </div>
          <div className="text-sm text-gray-700">
            {errorCount > 0 ? (
              `⚠️ Mission Alert: ${errorCount} critical issue${errorCount > 1 ? 's' : ''} detected. Resolve before launch.`
            ) : warningCount > 0 ? (
              `🎯 Mission Advisory: ${warningCount} recommendation${warningCount > 1 ? 's' : ''} for optimization.`
            ) : completionPercentage < 80 ? (
              `🚧 Mission Progress: ${100 - completionPercentage}% more completion needed for launch readiness.`
            ) : (
              `🚀 Mission Ready: All systems green! Your form is ready for launch.`
            )}
          </div>
        </div>
      </div>
    </MissionCard>
  );
}

// Live validation indicator for individual fields
interface FieldValidationIndicatorProps {
  status: 'idle' | 'validating' | 'valid' | 'invalid';
  message?: string;
  className?: string;
}

export function FieldValidationIndicator({
  status,
  message,
  className
}: FieldValidationIndicatorProps) {
  const getIcon = () => {
    switch (status) {
      case 'validating': 
        return <div className="w-4 h-4 border-2 border-launch-blue border-t-transparent rounded-full animate-spin" aria-hidden="true" />;
      case 'valid': 
        return <CheckCircle2 className="w-4 h-4 text-green-500" aria-hidden="true" focusable={false} />;
      case 'invalid': 
        return <XCircle className="w-4 h-4 text-red-500" aria-hidden="true" focusable={false} />;
      default: 
        return null;
    }
  };

  const getColor = () => {
    switch (status) {
      case 'validating': return 'text-launch-blue';
      case 'valid': return 'text-green-600';
      case 'invalid': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  if (status === 'idle') return null;

  return (
    <div className={cn("flex items-center gap-2 text-sm", getColor(), className)} role="status" aria-live="polite">
      {getIcon()}
      {message && <span>{message}</span>}
    </div>
  );
}

// Validation progress tracker
interface ValidationProgressProps {
  sections: Array<{
    name: string;
    completed: boolean;
    errors: number;
    warnings: number;
  }>;
  className?: string;
}

export function ValidationProgress({
  sections,
  className
}: ValidationProgressProps) {
  const totalSections = sections.length;
  const completedSections = sections.filter(s => s.completed && s.errors === 0).length;
  const totalErrors = sections.reduce((sum, s) => sum + s.errors, 0);
  const totalWarnings = sections.reduce((sum, s) => sum + s.warnings, 0);
  const progressPct = totalSections === 0 ? 0 : Math.round((completedSections / totalSections) * 100);
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Overall progress */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-launch-blue" aria-hidden="true" focusable={false} />
          <span className="font-medium">Overall Progress</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {completedSections}/{totalSections} sections
          </div>
          <div className="w-24 bg-gray-200 rounded-full h-2" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progressPct}>
            <div 
              className="bg-launch-blue rounded-full h-2 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Section breakdown */}
      <div className="space-y-2">
        {sections.map((section, index) => (
          <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                section.completed && section.errors === 0 
                  ? "bg-green-500" 
                  : section.errors > 0 
                    ? "bg-red-500" 
                    : "bg-gray-300"
              )} />
              <span className="text-sm font-medium">{section.name}</span>
            </div>
            
            <div className="flex items-center gap-3 text-xs">
              {section.errors > 0 && (
                <span className="text-red-600">{section.errors} error{section.errors > 1 ? 's' : ''}</span>
              )}
              {section.warnings > 0 && (
                <span className="text-amber-600">{section.warnings} warning{section.warnings > 1 ? 's' : ''}</span>
              )}
              {section.completed && section.errors === 0 && (
                <span className="text-green-600">Complete</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {(totalErrors > 0 || totalWarnings > 0) && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <BarChart3 className="w-4 h-4 text-amber-600" aria-hidden="true" focusable={false} />
            <span className="font-medium text-amber-800">
              {totalErrors} error{totalErrors !== 1 ? 's' : ''} and {totalWarnings} warning{totalWarnings !== 1 ? 's' : ''} across all sections
            </span>
          </div>
        </div>
      )}
    </div>
  );
}