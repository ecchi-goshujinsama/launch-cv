// Template Renderer Components Export
export { ClassicProfessionalRenderer } from './classic-professional';
export { ModernMinimalRenderer } from './modern-minimal';
export { ExecutiveRenderer } from './executive';

// Template renderer mapping
import { ClassicProfessionalRenderer } from './classic-professional';
import { ModernMinimalRenderer } from './modern-minimal';
import { ExecutiveRenderer } from './executive';

export const templateRenderers = {
  'classic-professional': ClassicProfessionalRenderer,
  'modern-minimal': ModernMinimalRenderer,
  'executive': ExecutiveRenderer
} as const;

export type TemplateRendererKey = keyof typeof templateRenderers;

// Utility function to get renderer by template ID
export const getTemplateRenderer = (templateId: string) => {
  return templateRenderers[templateId as TemplateRendererKey] || ClassicProfessionalRenderer;
};

export default templateRenderers;