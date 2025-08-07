'use client';

import React from 'react';
import { Rocket, Zap, Target, Gauge } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LaunchLoadingProps {
  variant?: 'rocket' | 'mission' | 'countdown' | 'orbit';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  showProgress?: boolean;
  progress?: number;
  className?: string;
}

export const LaunchLoading: React.FC<LaunchLoadingProps> = ({
  variant = 'rocket',
  size = 'md',
  message,
  showProgress = false,
  progress = 0,
  className,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const containerClasses = {
    sm: 'gap-2 text-sm',
    md: 'gap-3 text-base',
    lg: 'gap-4 text-lg',
    xl: 'gap-6 text-xl',
  };

  const renderRocketLoading = () => (
    <div className={cn('relative', sizeClasses[size])}>
      {/* Main rocket */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Rocket 
          className={cn(
            'text-launch-blue animate-bounce',
            sizeClasses[size]
          )} 
        />
      </div>
      
      {/* Exhaust trail */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
        <div className="w-2 h-6 bg-gradient-to-b from-rocket-orange to-transparent rounded-full animate-pulse opacity-80" />
      </div>
      
      {/* Orbital rings */}
      <div className="absolute inset-0 border-2 border-launch-blue/20 rounded-full animate-spin" 
           style={{ animationDuration: '3s' }} />
      <div className="absolute inset-2 border border-rocket-orange/20 rounded-full animate-spin" 
           style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
    </div>
  );

  const renderMissionLoading = () => (
    <div className={cn('relative', sizeClasses[size])}>
      {/* Mission control center */}
      <div className="absolute inset-0 bg-gradient-to-br from-launch-blue to-rocket-orange rounded-full animate-pulse">
        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
          <Target className="w-1/2 h-1/2 text-launch-blue animate-spin" />
        </div>
      </div>
      
      {/* Data streams */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-3 bg-launch-blue/60 rounded-full animate-pulse"
          style={{
            top: '50%',
            left: '50%',
            transform: `rotate(${i * 90}deg) translateY(-${size === 'xl' ? '40px' : size === 'lg' ? '32px' : size === 'md' ? '24px' : '16px'})`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );

  const renderCountdownLoading = () => (
    <div className={cn('relative', sizeClasses[size])}>
      {/* Countdown display */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-launch-blue to-rocket-orange rounded-full">
        <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
          <Gauge className="w-1/2 h-1/2 text-launch-blue animate-spin" 
                 style={{ animationDuration: '0.8s' }} />
        </div>
      </div>
      
      {/* Progress indicators */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={cn(
              'absolute w-1 h-2 rounded-full',
              progress > (i * 12.5) ? 'bg-rocket-orange' : 'bg-gray-200'
            )}
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 45}deg) translateY(-${size === 'xl' ? '48px' : size === 'lg' ? '36px' : size === 'md' ? '28px' : '20px'})`,
              transformOrigin: '50% 50%',
            }}
          />
        ))}
      </div>
    </div>
  );

  const renderOrbitLoading = () => (
    <div className={cn('relative', sizeClasses[size])}>
      {/* Central star/planet */}
      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-rocket-orange rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      
      {/* Orbiting elements */}
      {[1, 2, 3].map((orbit) => (
        <div
          key={orbit}
          className={`absolute inset-0 border border-launch-blue/30 rounded-full animate-spin`}
          style={{
            padding: `${orbit * 6}px`,
            animationDuration: `${orbit * 1.5}s`,
            animationDirection: orbit % 2 === 0 ? 'reverse' : 'normal',
          }}
        >
          <div className="relative w-full h-full">
            <Zap 
              className={cn(
                'absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-launch-blue',
                size === 'xl' ? 'w-3 h-3' : size === 'lg' ? 'w-2.5 h-2.5' : 'w-2 h-2'
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case 'rocket':
        return renderRocketLoading();
      case 'mission':
        return renderMissionLoading();
      case 'countdown':
        return renderCountdownLoading();
      case 'orbit':
        return renderOrbitLoading();
      default:
        return renderRocketLoading();
    }
  };

  return (
    <div className={cn(
      'flex flex-col items-center justify-center',
      containerClasses[size],
      className
    )}>
      {renderVariant()}
      
      {message && (
        <div className="text-center space-y-1">
          <p className="font-medium text-gray-900">{message}</p>
          {showProgress && (
            <div className="w-32 bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-launch-blue to-rocket-orange h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Pre-configured loading states for common use cases
export const RocketLaunchLoading: React.FC<Omit<LaunchLoadingProps, 'variant'>> = (props) => (
  <LaunchLoading variant="rocket" message="Preparing for launch..." {...props} />
);

export const MissionControlLoading: React.FC<Omit<LaunchLoadingProps, 'variant'>> = (props) => (
  <LaunchLoading variant="mission" message="Mission Control active..." {...props} />
);

export const CountdownLoading: React.FC<Omit<LaunchLoadingProps, 'variant'>> = (props) => (
  <LaunchLoading variant="countdown" message="Countdown initiated..." showProgress {...props} />
);

export const OrbitLoading: React.FC<Omit<LaunchLoadingProps, 'variant'>> = (props) => (
  <LaunchLoading variant="orbit" message="Systems in orbit..." {...props} />
);