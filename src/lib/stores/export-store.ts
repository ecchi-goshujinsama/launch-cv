import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ExportHistoryEntry {
  id: string;
  resumeId: string;
  resumeTitle: string;
  templateId: string;
  templateName: string;
  fileName: string;
  exportedAt: Date;
  fileSize?: number;
  success: boolean;
  error?: string;
}

export interface ExportPreferences {
  defaultFileName: string;
  autoDownload: boolean;
  compressionLevel: 'low' | 'medium' | 'high';
  paperSize: 'a4' | 'letter' | 'legal';
  margins: 'narrow' | 'normal' | 'wide';
  colorMode: 'color' | 'grayscale';
}

interface ExportState {
  history: ExportHistoryEntry[];
  preferences: ExportPreferences;
  isExporting: boolean;
  currentExportId: string | null;
}

interface ExportActions {
  addExportEntry: (entry: Omit<ExportHistoryEntry, 'id'>) => string;
  updateExportEntry: (id: string, updates: Partial<ExportHistoryEntry>) => void;
  removeExportEntry: (id: string) => void;
  clearHistory: () => void;
  setPreferences: (preferences: Partial<ExportPreferences>) => void;
  setExporting: (isExporting: boolean, exportId?: string) => void;
  getExportsByResumeId: (resumeId: string) => ExportHistoryEntry[];
  getExportsByTemplate: (templateId: string) => ExportHistoryEntry[];
  getRecentExports: (limit?: number) => ExportHistoryEntry[];
  generateFileName: (resumeTitle: string, templateName: string, customName?: string) => string;
}

const defaultPreferences: ExportPreferences = {
  defaultFileName: '{resume_title}_{template_name}_{date}',
  autoDownload: true,
  compressionLevel: 'medium',
  paperSize: 'a4',
  margins: 'normal',
  colorMode: 'color',
};

export const useExportStore = create<ExportState & ExportActions>()(
  persist(
    (set, get) => ({
      // State
      history: [],
      preferences: defaultPreferences,
      isExporting: false,
      currentExportId: null,

      // Actions
      addExportEntry: (entry) => {
        const id = `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newEntry: ExportHistoryEntry = {
          ...entry,
          id,
          exportedAt: new Date(entry.exportedAt),
        };

        set((state) => ({
          history: [newEntry, ...state.history].slice(0, 100), // Keep only last 100 exports
        }));

        return id;
      },

      updateExportEntry: (id, updates) => {
        set((state) => ({
          history: state.history.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          ),
        }));
      },

      removeExportEntry: (id) => {
        set((state) => ({
          history: state.history.filter((entry) => entry.id !== id),
        }));
      },

      clearHistory: () => {
        set({ history: [] });
      },

      setPreferences: (preferences) => {
        set((state) => ({
          preferences: { ...state.preferences, ...preferences },
        }));
      },

      setExporting: (isExporting, exportId) => {
        set({ isExporting, currentExportId: exportId || null });
      },

      getExportsByResumeId: (resumeId) => {
        return get().history.filter((entry) => entry.resumeId === resumeId);
      },

      getExportsByTemplate: (templateId) => {
        return get().history.filter((entry) => entry.templateId === templateId);
      },

      getRecentExports: (limit = 10) => {
        return get().history
          .sort((a, b) => new Date(b.exportedAt).getTime() - new Date(a.exportedAt).getTime())
          .slice(0, limit);
      },

      generateFileName: (resumeTitle, templateName, customName) => {
        const { preferences } = get();
        const template = customName || preferences.defaultFileName;
        
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
        const timeStr = today.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
        
        // Sanitize strings for filename use
        const sanitize = (str: string) =>
          str
            .replace(/[^a-zA-Z0-9\s-_]/g, '')
            .replace(/\s+/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');

        const cleanResumeTitle = sanitize(resumeTitle);
        const cleanTemplateName = sanitize(templateName);

        return template
          .replace('{resume_title}', cleanResumeTitle)
          .replace('{template_name}', cleanTemplateName)
          .replace('{date}', dateStr)
          .replace('{datetime}', `${dateStr}_${timeStr}`)
          .replace('{timestamp}', Date.now().toString())
          + '.pdf';
      },
    }),
    {
      name: 'launch-cv-export-store',
      // Only persist preferences and history, not runtime state
      partialize: (state) => ({
        history: state.history,
        preferences: state.preferences,
      }),
    }
  )
);