'use client';

import * as React from 'react';
import { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2, Rocket, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  accept?: string[];
  maxSize?: number; // in MB
  className?: string;
  disabled?: boolean;
  currentFile?: File | null;
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  ({
    onFileSelect,
    onFileRemove,
    accept = ['pdf', 'docx', 'txt'],
    maxSize = 10, // 10MB default
    className,
    disabled = false,
    currentFile = null
  }, ref) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Validate file type and size
    const validateFile = useCallback((file: File): string | null => {
      // Check file type
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !accept.includes(fileExtension)) {
        return `Mission Control Alert: Only ${accept.join(', ')} files are supported for pre-flight data import`;
      }

      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSize) {
        return `Mission Control Alert: File size exceeds ${maxSize}MB limit. Current size: ${fileSizeMB.toFixed(1)}MB`;
      }

      return null;
    }, [accept, maxSize]);

    // Handle file processing with mission-themed progress
    const processFile = useCallback(async (file: File) => {
      setIsProcessing(true);
      setUploadError(null);
      setUploadProgress(0);

      // Simulate upload progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 100);

      try {
        // Validate file
        const error = validateFile(file);
        if (error) {
          setUploadError(error);
          return;
        }

        // Complete progress
        setTimeout(() => {
          setUploadProgress(100);
          clearInterval(progressInterval);
          onFileSelect(file);
          setIsProcessing(false);
        }, 500);

      } catch {
        clearInterval(progressInterval);
        setUploadError('Mission Control Alert: File upload failed. Please try again.');
        setIsProcessing(false);
      }
    }, [validateFile, onFileSelect]);

    // Handle file selection
    const handleFileSelect = useCallback((file: File) => {
      processFile(file);
    }, [processFile]);

    // Handle drag events
    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragOver(true);
      }
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0 && files[0]) {
        handleFileSelect(files[0]);
      }
    }, [disabled, handleFileSelect]);

    // Handle click to select file
    const handleClick = useCallback(() => {
      if (!disabled && fileInputRef.current) {
        fileInputRef.current.click();
      }
    }, [disabled]);

    // Handle input change
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0 && files[0]) {
        handleFileSelect(files[0]);
      }
    }, [handleFileSelect]);

    // Handle file removal
    const handleRemoveFile = useCallback(() => {
      setUploadError(null);
      setUploadProgress(0);
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (onFileRemove) {
        onFileRemove();
      }
    }, [onFileRemove]);

    // Get file icon based on type
    const getFileIcon = () => {
      return <FileText className="w-8 h-8 text-launch-blue" />;
    };

    // Format file size
    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
      <div className={cn('w-full', className)} ref={ref}>
        {/* Upload Area */}
        {!currentFile && (
          <div
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer',
              'hover:border-launch-blue hover:bg-launch-blue-50',
              isDragOver && 'border-launch-blue bg-launch-blue-50 scale-105',
              disabled && 'opacity-50 cursor-not-allowed',
              uploadError && 'border-red-300 bg-red-50'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={accept.map(ext => `.${ext}`).join(',')}
              onChange={handleInputChange}
              disabled={disabled}
            />

            {isProcessing ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Rocket className="w-12 h-12 text-launch-blue animate-bounce" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold mission-text">
                    Pre-flight Data Processing...
                  </h3>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-launch-blue to-rocket-orange h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-slate-400">
                    Mission Control is analyzing your resume data...
                  </p>
                </div>
              </div>
            ) : uploadError ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <AlertCircle className="w-12 h-12 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-700 mb-2">
                    Mission Control Alert
                  </h3>
                  <p className="text-sm text-red-600 mb-4">{uploadError}</p>
                  <LaunchButton
                    variant="outline"
                    onClick={() => setUploadError(null)}
                    size="sm"
                  >
                    Try Again
                  </LaunchButton>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className={cn(
                    'w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300',
                    isDragOver ? 'bg-launch-blue text-white scale-110' : 'bg-launch-blue-100 text-launch-blue'
                  )}>
                    <Upload className="w-8 h-8" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mission-text mb-2">
                    {isDragOver ? 'Release to Start Mission!' : 'Pre-flight Data Import'}
                  </h3>
                  <p className="text-slate-400 mb-4">
                    Drag & drop your resume or{' '}
                    <span className="accent-text font-medium cursor-pointer">
                      click to browse
                    </span>
                  </p>
                  <div className="text-sm text-slate-400 space-y-1">
                    <div>Supported formats: {accept.map(ext => ext.toUpperCase()).join(', ')}</div>
                    <div>Maximum size: {maxSize}MB</div>
                  </div>
                </div>
                
                {isDragOver && (
                  <div className="text-launch-blue font-medium">
                    <Rocket className="w-5 h-5 inline mr-2 animate-pulse" />
                    Ready for launch sequence!
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* File Preview */}
        {currentFile && !isProcessing && (
          <div className="mission-control-panel">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-launch-blue-100 flex items-center justify-center">
                  {getFileIcon()}
                </div>
                <div>
                  <h4 className="font-medium text-slate-100">{currentFile.name}</h4>
                  <p className="text-sm text-slate-400">{formatFileSize(currentFile.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Mission Ready</span>
                </div>
                <LaunchButton
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                  className="text-slate-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </LaunchButton>
              </div>
            </div>
            
            <div className="text-sm text-slate-400">
              File successfully imported and ready for mission control processing.
            </div>
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export { FileUpload };