'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, Info, CheckCircle2, Eye, EyeOff } from 'lucide-react';

interface FormFieldProps {
  children: React.ReactNode;
  label?: string;
  description?: string;
  error?: string;
  warning?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  containerClassName?: string;
}

export function FormField({
  children,
  label,
  description,
  error,
  warning,
  required,
  className,
  labelClassName,
  containerClassName
}: FormFieldProps) {
  const id = React.useId();
  
  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <label 
          htmlFor={id}
          className={cn(
            "text-sm font-medium text-gray-700 flex items-center gap-1",
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className={cn("relative", className)}>
        {React.isValidElement(children) && 
          React.cloneElement(children as React.ReactElement<any>, { id })
        }
      </div>
      
      {description && !error && !warning && (
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{description}</span>
        </div>
      )}
      
      {warning && !error && (
        <div className="flex items-start gap-2 text-sm text-amber-700">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{warning}</span>
        </div>
      )}
      
      {error && (
        <div className="flex items-start gap-2 text-sm text-red-600">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// Input component with validation states
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  warning?: boolean;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, warning, success, leftIcon, rightIcon, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          type={inputType}
          className={cn(
            "flex w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon && "pl-10",
            leftIcon && "pl-10",
            (rightIcon || isPassword) && "pr-10",
            isPassword && (error || warning || success) && "pr-16",
            error && "border-red-300 focus:ring-red-200 focus:border-red-500",
            warning && "border-amber-300 focus:ring-amber-200 focus:border-amber-500",
            success && "border-green-300 focus:ring-green-200 focus:border-green-500",
            !error && !warning && !success && "border-gray-300 focus:ring-launch-blue-200 focus:border-launch-blue",
            className
          )}
          ref={ref}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600",
              (error || warning || success) ? "right-9" : "right-3"
            )}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        
        {rightIcon && !isPassword && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
        
        {/* Status indicator */}
        {(error || warning || success) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {error && <AlertTriangle className="w-4 h-4 text-red-500" />}
            {warning && <AlertTriangle className="w-4 h-4 text-amber-500" />}
            {success && <CheckCircle2 className="w-4 h-4 text-green-500" />}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea component with validation states
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  warning?: boolean;
  success?: boolean;
  resize?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, warning, success, resize = true, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white",
          "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          !resize && "resize-none",
          error && "border-red-300 focus:ring-red-200 focus:border-red-500",
          warning && "border-amber-300 focus:ring-amber-200 focus:border-amber-500", 
          success && "border-green-300 focus:ring-green-200 focus:border-green-500",
          !error && !warning && !success && "border-gray-300 focus:ring-launch-blue-200 focus:border-launch-blue",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

// Select component with validation states
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  warning?: boolean;
  success?: boolean;
  placeholder?: string;
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, warning, success, placeholder, options, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-300 focus:ring-red-200 focus:border-red-500",
          warning && "border-amber-300 focus:ring-amber-200 focus:border-amber-500",
          success && "border-green-300 focus:ring-green-200 focus:border-green-500", 
          !error && !warning && !success && "border-gray-300 focus:ring-launch-blue-200 focus:border-launch-blue",
          className
        )}
        ref={ref}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = 'Select';

// Checkbox component
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, ...props }, ref) => {
    const id = React.useId();
    
    return (
      <div className="flex items-start space-x-3">
        <input
          id={id}
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border border-gray-300 text-launch-blue",
            "focus:ring-launch-blue-200 focus:ring-2 focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-300 focus:ring-red-200",
            className
          )}
          ref={ref}
          {...props}
        />
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label
                htmlFor={id}
                className={cn(
                  "text-sm font-medium leading-none cursor-pointer",
                  error ? "text-red-600" : "text-gray-700"
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className={cn(
                "text-xs mt-1",
                error ? "text-red-600" : "text-gray-500"
              )}>
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// Radio group component
interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: RadioOption[];
  error?: boolean;
  className?: string;
}

export function RadioGroup({
  name,
  value,
  defaultValue,
  onValueChange,
  options,
  error,
  className
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');
  const currentValue = value ?? internalValue;

  const handleChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {options.map((option) => {
        const id = `${name}-${option.value}`;
        return (
          <div key={option.value} className="flex items-start space-x-3">
            <input
              id={id}
              name={name}
              type="radio"
              value={option.value}
              checked={currentValue === option.value}
              onChange={(e) => handleChange(e.target.value)}
              disabled={option.disabled}
              className={cn(
                "h-4 w-4 border border-gray-300 text-launch-blue",
                "focus:ring-launch-blue-200 focus:ring-2 focus:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                error && "border-red-300 focus:ring-red-200"
              )}
            />
            <div className="flex-1">
              <label
                htmlFor={id}
                className={cn(
                  "text-sm font-medium leading-none cursor-pointer",
                  error ? "text-red-600" : "text-gray-700",
                  option.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {option.label}
              </label>
              {option.description && (
                <p className={cn(
                  "text-xs mt-1",
                  error ? "text-red-600" : "text-gray-500",
                  option.disabled && "opacity-50"
                )}>
                  {option.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Form validation feedback component
interface ValidationFeedbackProps {
  errors?: string[];
  warnings?: string[];
  success?: string[];
  className?: string;
}

export function ValidationFeedback({
  errors = [],
  warnings = [],
  success = [],
  className
}: ValidationFeedbackProps) {
  if (errors.length === 0 && warnings.length === 0 && success.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      {errors.map((error, index) => (
        <div key={`error-${index}`} className="flex items-start gap-2 text-sm text-red-600">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      ))}
      
      {warnings.map((warning, index) => (
        <div key={`warning-${index}`} className="flex items-start gap-2 text-sm text-amber-600">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{warning}</span>
        </div>
      ))}
      
      {success.map((successMsg, index) => (
        <div key={`success-${index}`} className="flex items-start gap-2 text-sm text-green-600">
          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      ))}
    </div>
  );
}