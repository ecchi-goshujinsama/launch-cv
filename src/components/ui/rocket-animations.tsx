'use client';

import React, { useState, useEffect } from 'react';
import { Rocket, Zap, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RocketButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'launch';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const RocketButton: React.FC<RocketButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className,
}) => {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleClick = async () => {
    if (disabled || isLoading) return;
    
    setIsLaunching(true);
    onClick?.();
    
    // Reset animation state
    setTimeout(() => setIsLaunching(false), 600);
  };

  const baseClasses = 'relative inline-flex items-center justify-center font-medium transition-all duration-200 ease-out rounded-lg overflow-hidden group';
  
  const variantClasses = {
    primary: 'bg-launch-blue hover:bg-launch-blue-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-rocket-orange hover:bg-rocket-orange-700 text-white shadow-lg hover:shadow-xl',
    launch: 'bg-gradient-to-r from-launch-blue to-rocket-orange hover:from-launch-blue-700 hover:to-rocket-orange-700 text-white shadow-lg hover:shadow-2xl',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        {
          'transform hover:-translate-y-1 active:translate-y-0': !disabled && !isLoading,
          'opacity-50 cursor-not-allowed': disabled || isLoading,
          'animate-pulse': isLoading,
        },
        className
      )}
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      {/* Launch trail effect */}
      <div className={cn(
        'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        isLaunching && 'opacity-100 animate-pulse'
      )}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700" />
      </div>

      {/* Rocket icon for launch variant */}
      {variant === 'launch' && (
        <Rocket 
          className={cn(
            'mr-2 transition-transform duration-300',
            isLaunching && 'animate-bounce transform -rotate-12'
          )}
          size={size === 'lg' ? 20 : size === 'md' ? 16 : 14}
        />
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="mr-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      <span className="relative z-10">{children}</span>
    </button>
  );
};

interface LaunchSuccessProps {
  message?: string;
  onComplete?: () => void;
  duration?: number;
}

export const LaunchSuccess: React.FC<LaunchSuccessProps> = ({
  message = 'Launch Successful!',
  onComplete,
  duration = 3000,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4 max-w-md w-full text-center">
        {/* Animated rocket */}
        <div className="relative mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-launch-blue to-rocket-orange rounded-full flex items-center justify-center">
            <Rocket className="w-12 h-12 text-white animate-bounce" />
          </div>
          
          {/* Success particles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-rocket-orange rounded-full animate-ping"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 60}deg) translateY(-40px)`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2">{message}</h3>
        <p className="text-gray-600 mb-4">Your career is ready for launch! 🚀</p>
        
        <div className="flex items-center justify-center space-x-2 text-launch-blue">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Mission accomplished</span>
        </div>
      </div>
    </div>
  );
};

interface MissionAlertProps {
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const MissionAlert: React.FC<MissionAlertProps> = ({
  type,
  title,
  message,
  onClose,
  action,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  const typeConfig = {
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-rocket-orange/10',
      borderColor: 'border-rocket-orange/30',
      iconColor: 'text-rocket-orange',
      titleColor: 'text-rocket-orange-800',
    },
    error: {
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-500',
      titleColor: 'text-red-800',
    },
    info: {
      icon: Star,
      bgColor: 'bg-launch-blue/10',
      borderColor: 'border-launch-blue/30',
      iconColor: 'text-launch-blue',
      titleColor: 'text-launch-blue-800',
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn(
      'p-4 rounded-lg border-l-4 relative',
      config.bgColor,
      config.borderColor
    )}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={cn('w-5 h-5', config.iconColor)} />
        </div>
        
        <div className="ml-3 flex-1">
          <h4 className={cn('text-sm font-medium', config.titleColor)}>
            {title}
          </h4>
          <p className="mt-1 text-sm text-gray-600">{message}</p>
          
          {action && (
            <div className="mt-3">
              <button
                onClick={action.onClick}
                className={cn(
                  'text-sm font-medium underline hover:no-underline',
                  config.iconColor
                )}
              >
                {action.label}
              </button>
            </div>
          )}
        </div>

        {onClose && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600"
          >
            <span className="sr-only">Close</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

interface CountdownTimerProps {
  seconds: number;
  onComplete?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  seconds: initialSeconds,
  onComplete,
  size = 'md',
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds === 0) {
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds, onComplete]);

  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-24 h-24 text-4xl',
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className={cn(
        'rounded-full bg-gradient-to-br from-launch-blue to-rocket-orange flex items-center justify-center text-white font-bold shadow-lg',
        sizeClasses[size],
        seconds <= 3 && 'animate-pulse'
      )}>
        {seconds}
      </div>
      
      <div className="flex items-center space-x-1 text-sm text-gray-600">
        <Zap className="w-4 h-4" />
        <span>Launch in {seconds}...</span>
      </div>
    </div>
  );
};

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  delay = 0,
  duration = 3,
  className,
}) => {
  return (
    <div 
      className={cn('animate-bounce', className)}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  );
};