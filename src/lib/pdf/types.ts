import type { Resume, Template } from '../types';

export interface PDFExportOptions {
  templateId: string;
  fileName?: string;
  quality?: 'draft' | 'standard' | 'high';
  format?: 'A4' | 'Letter';
  margins?: PDFMargins;
  colorProfile?: 'rgb' | 'cmyk';
}

export interface PDFMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface PDFRenderContext {
  resume: Resume;
  template: Template;
  options: PDFExportOptions;
}

export interface PDFSection {
  id: string;
  title: string;
  order: number;
  visible: boolean;
  content: React.ComponentType<{ resume: Resume; template: Template }>;
}

export const DEFAULT_PDF_OPTIONS: PDFExportOptions = {
  templateId: '',
  quality: 'high',
  format: 'A4',
  margins: {
    top: 72, // 1 inch in points
    right: 72,
    bottom: 72,
    left: 72,
  },
  colorProfile: 'rgb',
};

export const PDF_STYLES = {
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 11,
    lineHeight: 1.4,
    color: '#000000',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center' as const,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottom: '1 solid #000000',
    paddingBottom: 2,
  },
  text: {
    fontSize: 11,
    lineHeight: 1.4,
  },
  smallText: {
    fontSize: 9,
    color: '#666666',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
} as const;