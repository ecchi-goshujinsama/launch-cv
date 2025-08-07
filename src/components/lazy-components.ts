import { lazy } from 'react';
import { createLazyComponent } from '../lib/utils/performance';

// Lazy load heavy components to improve initial bundle size
export const LazyExportProgress = lazy(() => import('./export/export-progress'));
export const LazyExportHistory = lazy(() => import('./export/export-history'));

// PDF components (heavy dependencies)
export const LazyPDFViewer = lazy(() => 
  import('./pdf/pdf-viewer').catch(() => ({
    default: () => <div>PDF Viewer not available</div>
  }))
);

// Template renderers (can be lazy loaded per template)
export const LazyClassicProfessional = lazy(() => 
  import('./templates/renderers/classic-professional')
);

export const LazyModernMinimal = lazy(() => 
  import('./templates/renderers/modern-minimal')
);

export const LazyExecutive = lazy(() => 
  import('./templates/renderers/executive')
);

export const LazyTechnical = lazy(() => 
  import('./templates/renderers/technical')
);

export const LazyCreative = lazy(() => 
  import('./templates/renderers/creative')
);

// Builder components (conditionally loaded)
export const LazyBulkEditModal = lazy(() => 
  import('./builder/bulk-edit-modal')
);

export const LazyImportWizard = lazy(() => 
  import('./import/import-wizard')
);

// Advanced form components
export const LazyRichTextEditor = lazy(() => 
  import('./forms/rich-text-editor')
);

export const LazyDatePicker = lazy(() => 
  import('./forms/date-picker')
);

// Template management
export const LazyTemplateCustomizer = lazy(() => 
  import('./templates/template-customizer')
);

// Chart/analytics components (if any)
export const LazyAnalyticsDashboard = lazy(() => 
  import('./analytics/analytics-dashboard').catch(() => ({
    default: () => <div>Analytics not available</div>
  }))
);

// Map of template components for dynamic loading
export const LAZY_TEMPLATE_MAP = {
  'classic-professional': LazyClassicProfessional,
  'modern-minimal': LazyModernMinimal,
  'executive': LazyExecutive,
  'technical': LazyTechnical,
  'creative': LazyCreative,
} as const;

// Utility to get lazy template component
export const getLazyTemplateComponent = (templateId: string) => {
  return LAZY_TEMPLATE_MAP[templateId as keyof typeof LAZY_TEMPLATE_MAP];
};

// Pre-configured lazy loading with custom fallbacks
export const createOptimizedLazyComponent = <T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  componentName: string
) => {
  return lazy(async () => {
    try {
      return await factory();
    } catch (error) {
      console.warn(`Failed to load ${componentName}:`, error);
      // Return a fallback component
      return {
        default: (() => (
          <div className="p-4 text-center text-gray-500">
            <p>Component temporarily unavailable</p>
            <p className="text-sm">Please refresh the page</p>
          </div>
        )) as T
      };
    }
  });
};