'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Rocket, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const launchButtonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-launch-blue text-white hover:bg-launch-blue-700 hover:scale-[1.02] hover:shadow-lg',
        destructive: 'bg-red-500 text-red-50 hover:bg-red-600',
        outline: 'border border-launch-blue text-launch-blue hover:bg-launch-blue hover:text-white',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        ghost: 'hover:bg-launch-blue-50 hover:text-launch-blue',
        link: 'text-launch-blue underline-offset-4 hover:underline',
        rocket: 'bg-gradient-to-r from-launch-blue to-rocket-orange text-white hover:scale-[1.05] hover:shadow-xl transform',
        mission: 'bg-rocket-orange text-white hover:bg-rocket-orange-600 hover:scale-[1.02] hover:shadow-lg'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        xl: 'h-14 rounded-lg px-10 text-lg',
        icon: 'h-10 w-10'
      },
      animation: {
        none: '',
        subtle: 'hover:animate-pulse',
        launch: 'hover:animate-bounce',
        rocket: 'group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      animation: 'none'
    }
  }
);

export interface LaunchButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof launchButtonVariants> {
  asChild?: boolean;
  icon?: 'rocket' | 'arrow' | 'none';
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  loadingText?: string;
  successText?: string;
  showSuccess?: boolean;
}

const LaunchButton = React.forwardRef<HTMLButtonElement, LaunchButtonProps>(
  (
    {
      className,
      variant,
      size,
      animation,
      asChild = false,
      icon = 'none',
      iconPosition = 'right',
      isLoading = false,
      loadingText = 'Preparing launch...',
      successText = 'Launched!',
      showSuccess = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    const getIcon = () => {
      if (showSuccess) {
        return <ArrowUp className="w-4 h-4 text-green-400 animate-bounce" />;
      }
      
      if (isLoading) {
        return (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        );
      }

      switch (icon) {
        case 'rocket':
          return (
            <Rocket 
              className={cn(
                "w-4 h-4 transition-transform duration-300",
                animation === 'rocket' && "group-hover:translate-x-1 group-hover:-translate-y-1"
              )} 
            />
          );
        case 'arrow':
          return <ArrowUp className="w-4 h-4" />;
        default:
          return null;
      }
    };

    const getButtonText = () => {
      if (showSuccess && successText) return successText;
      if (isLoading && loadingText) return loadingText;
      return children;
    };

    return (
      <Comp
        className={cn(launchButtonVariants({ variant, size, animation }), className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Background animation for rocket variant */}
        {variant === 'rocket' && (
          <div className="absolute inset-0 bg-gradient-to-r from-launch-blue-600 to-rocket-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
        
        {/* Left icon */}
        {iconPosition === 'left' && getIcon()}
        
        {/* Button text */}
        <span className="relative z-10">
          {getButtonText()}
        </span>
        
        {/* Right icon */}
        {iconPosition === 'right' && getIcon()}
        
        {/* Launch trail effect */}
        {(variant === 'rocket' || variant === 'mission') && (
          <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping" />
          </div>
        )}
      </Comp>
    );
  }
);
LaunchButton.displayName = 'LaunchButton';

export { LaunchButton, launchButtonVariants };