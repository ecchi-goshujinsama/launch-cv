'use client';

import * as React from 'react';
import { useResumeStore } from '@/lib/stores/resume-store';
import useTemplateStore from '@/lib/stores/template-store';
import { usePDFExport } from '@/lib/hooks/use-pdf-export';
import { LaunchButton } from '@/components/ui/launch-button';
// import { div className="bg-slate-800 border border-slate-600 rounded-lg" } from '@/components/layout/mission-card';
import { 
  Download, 
  FileText, 
  Printer, 
  Eye,
  AlertCircle,
  CheckCircle,
  Rocket,
  Loader
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExportSectionProps {
  onExport?: () => void;
  className?: string;
}

export function ExportSection({ onExport, className }: ExportSectionProps) {
  const { currentResume } = useResumeStore();
  const { templates, selectedTemplateId } = useTemplateStore();
  const { downloadPDF, previewPDF, isGenerating, progress, error, isComplete } = usePDFExport();

  const currentTemplate = templates.find(t => t.id === (currentResume?.templateId || selectedTemplateId));

  const handleDownload = async () => {
    if (!currentResume || !currentTemplate) {
      console.error('Missing resume or template for export');
      return;
    }

    try {
      await downloadPDF(currentResume, currentTemplate);
      onExport?.();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handlePreview = async () => {
    if (!currentResume || !currentTemplate) {
      console.error('Missing resume or template for preview');
      return;
    }

    try {
      const previewUrl = await previewPDF(currentResume, currentTemplate);
      if (previewUrl) {
        window.open(previewUrl, '_blank');
      }
    } catch (error) {
      console.error('Preview failed:', error);
    }
  };

  const canExport = currentResume && currentTemplate && !isGenerating;
  const hasContent = currentResume?.personalInfo?.fullName && 
    currentResume.sections.some(section => section.items.length > 0);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Export Status */}
      {isGenerating && (
        <div className="bg-slate-800 border border-slate-600 rounded-lg">
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-launch-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader className="w-6 h-6 text-launch-blue animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">
              Generating PDF...
            </h3>
            <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
              <div 
                className="bg-launch-blue h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-slate-400">{progress}% complete</p>
          </div>
        </div>
      )}

      {isComplete && (
        <div className="bg-slate-800 border border-slate-600 rounded-lg">
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">
              🚀 Resume Launched Successfully!
            </h3>
            <p className="text-sm text-slate-400">Your PDF has been downloaded</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-slate-800 border border-slate-600 rounded-lg">
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Export Failed</h3>
            <p className="text-sm text-slate-400 mb-4">{error}</p>
            <LaunchButton
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!canExport}
              icon="rocket"
            >
              Try Again
            </LaunchButton>
          </div>
        </div>
      )}

      {/* Export Options */}
      {!isGenerating && !isComplete && (
        <>
          {/* Resume Readiness Check */}
          <div className="bg-slate-800 border border-slate-600 rounded-lg">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-launch-blue" />
                <h3 className="text-lg font-semibold text-slate-100">Resume Status</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {currentResume?.personalInfo?.fullName ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  )}
                  <span className="text-sm text-slate-300">
                    Personal information completed
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  {currentResume?.sections.some(s => s.items.length > 0) ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  )}
                  <span className="text-sm text-slate-300">
                    At least one section has content
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  {currentTemplate ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  )}
                  <span className="text-sm text-slate-300">
                    Template selected: {currentTemplate?.name || 'None'}
                  </span>
                </div>
              </div>

              {!hasContent && (
                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-sm text-amber-400">
                    Add some content to your resume before exporting
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Export Actions */}
          <div className="bg-slate-800 border border-slate-600 rounded-lg">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Rocket className="w-5 h-5 text-launch-blue" />
                <h3 className="text-lg font-semibold text-slate-100">Launch Your Resume</h3>
              </div>
              
              <div className="space-y-4">
                {/* Primary Download Button */}
                <LaunchButton
                  variant="mission"
                  size="lg"
                  onClick={handleDownload}
                  disabled={!canExport || !hasContent}
                  icon="rocket"
                  iconPosition="right"
                  animation="rocket"
                  className="w-full"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF Resume
                </LaunchButton>

                {/* Secondary Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <LaunchButton
                    variant="outline"
                    onClick={handlePreview}
                    disabled={!canExport || !hasContent}
                    icon="none"
                    className="w-full"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview PDF
                  </LaunchButton>

                  <LaunchButton
                    variant="outline"
                    onClick={() => {
                      // TODO: Implement print functionality
                      console.log('Print resume');
                    }}
                    disabled={!canExport || !hasContent}
                    icon="none"
                    className="w-full"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print Resume
                  </LaunchButton>
                </div>
              </div>

              {/* Export Tips */}
              <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
                <h4 className="text-sm font-semibold text-slate-200 mb-2">💡 Export Tips</h4>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• PDFs are optimized for ATS (Applicant Tracking Systems)</li>
                  <li>• Use high-quality paper (24lb or higher) for printing</li>
                  <li>• Preview your resume before important applications</li>
                  <li>• Keep a copy in your cloud storage for easy access</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ExportSection;