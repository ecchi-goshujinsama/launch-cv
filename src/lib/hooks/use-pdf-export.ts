import { useState, useCallback } from 'react';
import { PDFGenerator } from '../pdf/generator';
import type { Resume, Template } from '../types';
import type { PDFExportOptions } from '../pdf/types';

export interface PDFExportState {
  isGenerating: boolean;
  progress: number;
  error: string | null;
  isComplete: boolean;
}

export interface PDFExportActions {
  generatePDF: (resume: Resume, template: Template, options?: Partial<PDFExportOptions>) => Promise<void>;
  downloadPDF: (resume: Resume, template: Template, options?: Partial<PDFExportOptions>) => Promise<void>;
  previewPDF: (resume: Resume, template: Template, options?: Partial<PDFExportOptions>) => Promise<string | null>;
  reset: () => void;
}

export type PDFExportHook = PDFExportState & PDFExportActions;

const initialState: PDFExportState = {
  isGenerating: false,
  progress: 0,
  error: null,
  isComplete: false,
};

export const usePDFExport = (): PDFExportHook => {
  const [state, setState] = useState<PDFExportState>(initialState);

  const updateState = useCallback((updates: Partial<PDFExportState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const simulateProgress = useCallback((callback: () => Promise<void>) => {
    return new Promise<void>((resolve, reject) => {
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 15 + 5; // Random progress between 5-20%
        if (progress >= 95) {
          progress = 95;
          clearInterval(progressInterval);
        }
        updateState({ progress: Math.min(progress, 95) });
      }, 200);

      callback()
        .then(() => {
          clearInterval(progressInterval);
          updateState({ progress: 100, isComplete: true, isGenerating: false });
          // Keep success state for 2 seconds then reset
          setTimeout(() => {
            setState(initialState);
          }, 2000);
          resolve();
        })
        .catch((error) => {
          clearInterval(progressInterval);
          updateState({ 
            error: error.message || 'PDF generation failed', 
            isGenerating: false,
            progress: 0,
          });
          reject(error);
        });
    });
  }, [updateState]);

  const generatePDF = useCallback(async (
    resume: Resume, 
    template: Template, 
    options: Partial<PDFExportOptions> = {}
  ): Promise<void> => {
    updateState({ isGenerating: true, error: null, progress: 0, isComplete: false });

    try {
      await simulateProgress(async () => {
        await PDFGenerator.generatePDF(resume, template, options);
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw error;
    }
  }, [simulateProgress, updateState]);

  const downloadPDF = useCallback(async (
    resume: Resume, 
    template: Template, 
    options: Partial<PDFExportOptions> = {}
  ): Promise<void> => {
    updateState({ isGenerating: true, error: null, progress: 0, isComplete: false });

    try {
      await simulateProgress(async () => {
        await PDFGenerator.downloadPDF(resume, template, options);
      });
    } catch (error) {
      console.error('PDF download failed:', error);
      throw error;
    }
  }, [simulateProgress, updateState]);

  const previewPDF = useCallback(async (
    resume: Resume, 
    template: Template, 
    options: Partial<PDFExportOptions> = {}
  ): Promise<string | null> => {
    updateState({ isGenerating: true, error: null, progress: 0, isComplete: false });

    try {
      let previewUrl: string | null = null;
      
      await simulateProgress(async () => {
        previewUrl = await PDFGenerator.generatePreviewBlob(resume, template, options);
      });

      return previewUrl;
    } catch (error) {
      console.error('PDF preview generation failed:', error);
      updateState({ 
        error: error.message || 'PDF preview generation failed', 
        isGenerating: false,
        progress: 0,
      });
      return null;
    }
  }, [simulateProgress, updateState]);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    generatePDF,
    downloadPDF,
    previewPDF,
    reset,
  };
};