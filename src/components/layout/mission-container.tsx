'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface MissionContainerProps {
  children: React.ReactNode;
  variant?: 'default' | 'centered' | 'full-width' | 'split';
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'default' | 'mission-control' | 'launch-pad' | 'transparent';
}

export function MissionContainer({
  children,
  variant = 'default',
  className,
  maxWidth = '7xl',
  padding = 'md',
  background = 'default'
}: MissionContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  };

  const backgroundClasses = {
    default: 'bg-white',
    'mission-control': 'mission-control-panel',
    'launch-pad': 'bg-gradient-to-br from-launch-blue-50 to-rocket-orange-50',
    transparent: 'bg-transparent'
  };

  const variantClasses = {
    default: 'mx-auto',
    centered: 'mx-auto flex flex-col items-center justify-center min-h-[50vh]',
    'full-width': 'w-full',
    split: 'grid grid-cols-1 lg:grid-cols-2 gap-8'
  };

  return (
    <div className={cn(
      'w-full',
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      backgroundClasses[background],
      variantClasses[variant],
      className
    )}>
      {children}
    </div>
  );
}

interface MissionSectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  showDivider?: boolean;
}

export function MissionSection({
  children,
  title,
  subtitle,
  icon,
  className,
  headerClassName,
  contentClassName,
  showDivider = false
}: MissionSectionProps) {
  return (
    <section className={cn('space-y-6', className)}>
      {(title || subtitle || icon) && (
        <div className={cn('space-y-2', headerClassName)}>
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-8 h-8 rounded-md bg-launch-blue-100 flex items-center justify-center">
                {icon}
              </div>
            )}
            {title && (
              <h2 className="text-2xl font-bold mission-text">
                {title}
              </h2>
            )}
          </div>
          {subtitle && (
            <p className="text-gray-600 leading-relaxed">
              {subtitle}
            </p>
          )}
          {showDivider && (
            <div className="h-px bg-gradient-to-r from-launch-blue to-rocket-orange opacity-30" />
          )}
        </div>
      )}
      
      <div className={cn('space-y-4', contentClassName)}>
        {children}
      </div>
    </section>
  );
}

interface MissionCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'bordered' | 'mission';
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function MissionCard({
  children,
  title,
  subtitle,
  icon,
  variant = 'default',
  className,
  onClick,
  hover = false
}: MissionCardProps) {
  const variantClasses = {
    default: 'bg-white border border-gray-200 rounded-lg p-6',
    elevated: 'bg-white shadow-lg rounded-lg p-6 border border-gray-100',
    bordered: 'bg-white border-2 border-launch-blue-200 rounded-lg p-6',
    mission: 'mission-control-panel'
  };

  return (
    <div
      className={cn(
        variantClasses[variant],
        hover && 'hover:shadow-md hover:scale-[1.02] transition-all duration-200',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {(title || subtitle || icon) && (
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            {icon && (
              <div className="w-6 h-6 text-launch-blue">
                {icon}
              </div>
            )}
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div>
        {children}
      </div>
    </div>
  );
}

// Layout grid for organized content
interface MissionGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MissionGrid({
  children,
  cols = 2,
  gap = 'md',
  className
}: MissionGridProps) {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  };

  return (
    <div className={cn(
      'grid',
      colsClasses[cols],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
}