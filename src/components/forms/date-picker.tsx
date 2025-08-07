'use client';

import * as React from 'react';
import { Calendar, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from './form-field';

// Date utilities
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_ABBR = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Format date for display
const formatDate = (date: Date, format: 'short' | 'long' | 'input' = 'short') => {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  switch (format) {
    case 'long':
      return `${MONTHS[month]} ${day}, ${year}`;
    case 'input':
      return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    case 'short':
    default:
      return `${MONTH_ABBR[month]} ${year}`;
  }
};

// Parse date string in various formats
const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
};

// Month/Year picker for simpler date selection
interface MonthYearPickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  warning?: boolean;
  success?: boolean;
  className?: string;
  allowFuture?: boolean;
  allowCurrent?: boolean;
}

export function MonthYearPicker({
  value,
  onChange,
  placeholder = "Select month and year",
  error,
  warning,
  success,
  className,
  allowFuture = false,
  allowCurrent = true
}: MonthYearPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(() => {
    return value ? parseDate(value) : null;
  });
  const [viewDate, setViewDate] = React.useState(() => {
    return selectedDate || new Date();
  });

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Generate years (10 years before current to 2 years after) - kept for future use
  // const years = React.useMemo(() => {
  //   const startYear = currentYear - 10;
  //   const endYear = allowFuture ? currentYear + 2 : currentYear;
  //   return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  // }, [currentYear, allowFuture]);

  const handleMonthYearSelect = (month: number, year: number) => {
    const newDate = new Date(year, month, 1);
    
    // Check if date is allowed
    if (!allowFuture && year > currentYear) return;
    if (!allowFuture && year === currentYear && month > currentMonth) return;
    if (!allowCurrent && year === currentYear && month === currentMonth) return;

    setSelectedDate(newDate);
    onChange?.(formatDate(newDate, 'input'));
    setIsOpen(false);
  };

  const displayValue = selectedDate ? formatDate(selectedDate, 'short') : '';

  return (
    <div className={cn("relative", className)}>
      <Input
        value={displayValue}
        placeholder={placeholder}
        readOnly
        onClick={() => setIsOpen(!isOpen)}
        {...(error && { error })}
        {...(warning && { warning })}
        {...(success && { success })}
        rightIcon={<Calendar className="w-4 h-4" />}
        className="cursor-pointer"
      />

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Calendar Dropdown */}
          <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-80">
            {/* Year Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth()))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <h3 className="font-semibold">{viewDate.getFullYear()}</h3>
              
              <button
                type="button"
                onClick={() => setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth()))}
                className="p-1 hover:bg-gray-100 rounded"
                disabled={!allowFuture && viewDate.getFullYear() >= currentYear}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Months Grid */}
            <div className="grid grid-cols-3 gap-2">
              {MONTH_ABBR.map((month, index) => {
                const isSelected = selectedDate && 
                  selectedDate.getFullYear() === viewDate.getFullYear() && 
                  selectedDate.getMonth() === index;
                
                const year = viewDate.getFullYear();
                const isDisabled = 
                  (!allowFuture && year > currentYear) ||
                  (!allowFuture && year === currentYear && index > currentMonth) ||
                  (!allowCurrent && year === currentYear && index === currentMonth);

                return (
                  <button
                    key={month}
                    type="button"
                    onClick={() => handleMonthYearSelect(index, year)}
                    disabled={isDisabled}
                    className={cn(
                      "p-2 text-sm rounded-md transition-colors",
                      "hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed",
                      isSelected && "bg-launch-blue text-white hover:bg-launch-blue/90"
                    )}
                  >
                    {month}
                  </button>
                );
              })}
            </div>

            {/* Clear Button */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(null);
                  onChange?.('');
                  setIsOpen(false);
                }}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear selection
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Full date picker with calendar
interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  warning?: boolean;
  success?: boolean;
  className?: string;
  allowFuture?: boolean;
  minDate?: string;
  maxDate?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  error,
  warning,
  success,
  className,
  allowFuture = true,
  minDate,
  maxDate
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(() => {
    return value ? parseDate(value) : null;
  });
  const [viewDate, setViewDate] = React.useState(() => {
    return selectedDate || new Date();
  });

  const minDateObj = minDate ? parseDate(minDate) : null;
  const maxDateObj = maxDate ? parseDate(maxDate) : null;

  // Generate calendar days
  const calendarDays = React.useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    // const lastDay = new Date(year, month + 1, 0); // kept for future use
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  }, [viewDate]);

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!allowFuture && date > today) return true;
    if (minDateObj && date < minDateObj) return true;
    if (maxDateObj && date > maxDateObj) return true;
    
    return false;
  };

  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return;
    
    setSelectedDate(date);
    onChange?.(formatDate(date, 'input'));
    setIsOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setViewDate(newDate);
  };

  const displayValue = selectedDate ? formatDate(selectedDate, 'long') : '';

  return (
    <div className={cn("relative", className)}>
      <Input
        value={displayValue}
        placeholder={placeholder}
        readOnly
        onClick={() => setIsOpen(!isOpen)}
        {...(error && { error })}
        {...(warning && { warning })}
        {...(success && { success })}
        rightIcon={<CalendarDays className="w-4 h-4" />}
        className="cursor-pointer"
      />

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Calendar Dropdown */}
          <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-80">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => navigateMonth('prev')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <h3 className="font-semibold">
                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
              </h3>
              
              <button
                type="button"
                onClick={() => navigateMonth('next')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map(day => (
                <div key={day} className="p-2 text-xs font-medium text-gray-500 text-center">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => {
                const isSelected = selectedDate && 
                  date.getTime() === selectedDate.getTime();
                const isCurrentMonth = date.getMonth() === viewDate.getMonth();
                const isToday = date.toDateString() === new Date().toDateString();
                const isDisabled = isDateDisabled(date);

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDateSelect(date)}
                    disabled={isDisabled}
                    className={cn(
                      "p-2 text-sm rounded-md transition-colors",
                      "hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed",
                      !isCurrentMonth && "text-gray-400",
                      isToday && "bg-gray-100 font-medium",
                      isSelected && "bg-launch-blue text-white hover:bg-launch-blue/90"
                    )}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(null);
                  onChange?.('');
                  setIsOpen(false);
                }}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
              
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  if (!isDateDisabled(today)) {
                    handleDateSelect(today);
                  }
                }}
                className="text-xs text-launch-blue hover:text-launch-blue/80"
              >
                Today
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Date range picker for employment periods
interface DateRangePickerProps {
  startValue?: string;
  endValue?: string;
  onStartChange?: (value: string) => void;
  onEndChange?: (value: string) => void;
  startPlaceholder?: string;
  endPlaceholder?: string;
  error?: boolean;
  warning?: boolean;
  success?: boolean;
  className?: string;
  allowCurrentEnd?: boolean;
  showCurrentToggle?: boolean;
  isCurrentRole?: boolean;
  onCurrentToggle?: (isCurrent: boolean) => void;
}

export function DateRangePicker({
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  startPlaceholder = "Start date",
  endPlaceholder = "End date",
  error,
  warning,
  success,
  className,
  allowCurrentEnd = true,
  showCurrentToggle = true,
  isCurrentRole = false,
  onCurrentToggle
}: DateRangePickerProps) {
  const handleCurrentToggle = (current: boolean) => {
    onCurrentToggle?.(current);
    if (current) {
      onEndChange?.('');
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MonthYearPicker
          {...(startValue && { value: startValue })}
          {...(onStartChange && { onChange: onStartChange })}
          placeholder={startPlaceholder}
          {...(error && { error })}
          {...(warning && { warning })}
          {...(success && { success })}
          allowFuture={false}
        />
        
        <MonthYearPicker
          value={isCurrentRole ? '' : (endValue || '')}
          {...(onEndChange && { onChange: onEndChange })}
          placeholder={isCurrentRole ? "Current" : endPlaceholder}
          {...(error && { error })}
          {...(warning && { warning })}
          {...(success && { success })}
          allowFuture={allowCurrentEnd}
          allowCurrent={allowCurrentEnd}
          className={isCurrentRole ? "opacity-50" : ""}
        />
      </div>
      
      {showCurrentToggle && (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="current-role"
            checked={isCurrentRole}
            onChange={(e) => handleCurrentToggle(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-launch-blue focus:ring-launch-blue-200"
          />
          <label htmlFor="current-role" className="text-sm text-gray-700">
            I currently work here
          </label>
        </div>
      )}
    </div>
  );
}