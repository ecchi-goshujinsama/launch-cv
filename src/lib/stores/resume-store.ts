import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { 
  Resume, 
  ResumeState, 
  PersonalInfo, 
  ResumeSection,
  ExperienceItem,
  EducationItem,
  SkillsItem
} from '../types';
import type { ParsedResumeData } from '../parsers';

interface ResumeActions {
  // Resume management
  createResume: (title: string, templateId: string) => void;
  createResumeFromParsedData: (parsedData: ParsedResumeData, title?: string) => string;
  loadResume: (resume: Resume) => void;
  saveResume: () => void;
  deleteResume: (id: string) => void;
  duplicateResume: (id: string) => void;
  
  // Personal information
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  
  // Section management
  addSection: (section: Omit<ResumeSection, 'id' | 'order'>) => void;
  updateSection: (sectionId: string, updates: Partial<ResumeSection>) => void;
  deleteSection: (sectionId: string) => void;
  reorderSections: (startIndex: number, endIndex: number) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  
  // Section items
  addSectionItem: (sectionId: string, item: any) => void;
  updateSectionItem: (sectionId: string, itemId: string, updates: any) => void;
  deleteSectionItem: (sectionId: string, itemId: string) => void;
  reorderSectionItems: (sectionId: string, startIndex: number, endIndex: number) => void;
  
  // Template management
  setTemplate: (templateId: string) => void;
  
  // State management
  setLoading: (loading: boolean) => void;
  markDirty: () => void;
  markClean: () => void;
  
  // Utility functions
  generateId: () => string;
  updateWordCount: () => void;
}

type ResumeStore = ResumeState & ResumeActions;

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const createDefaultResume = (title: string, templateId: string): Resume => ({
  id: generateId(),
  title,
  templateId,
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: ''
  },
  sections: [
    {
      id: generateId(),
      type: 'experience',
      title: 'Work Experience',
      items: [],
      order: 0,
      visible: true
    },
    {
      id: generateId(),
      type: 'education',
      title: 'Education',
      items: [],
      order: 1,
      visible: true
    },
    {
      id: generateId(),
      type: 'skills',
      title: 'Skills',
      items: [],
      order: 2,
      visible: true
    }
  ],
  metadata: {
    lastEdited: new Date(),
    version: 1,
    exportCount: 0,
    importSource: 'manual',
    wordCount: 0
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

export const useResumeStore = create<ResumeStore>()(
  devtools(
    persist(
      immer((set) => ({
        // Initial state
        currentResume: null,
        resumes: [],
        selectedTemplate: 'classic-professional',
        isLoading: false,
        isDirty: false,
        lastSaved: null,

        // Resume management actions
        createResume: (title: string, templateId: string) => {
          set((state) => {
            const newResume = createDefaultResume(title, templateId);
            state.currentResume = newResume;
            state.resumes.push(newResume);
            state.selectedTemplate = templateId;
            state.isDirty = true;
          });
        },

        createResumeFromParsedData: (parsedData: ParsedResumeData, title?: string) => {
          let resumeId = '';
          set((state) => {
            const resumeTitle = title || 
              `${parsedData.personalInfo.fullName || 'New Resume'} - ${new Date().toLocaleDateString()}`;
            
            resumeId = generateId();
            const newResume: Resume = {
              id: resumeId,
              title: resumeTitle,
              templateId: 'classic-professional',
              personalInfo: {
                fullName: parsedData.personalInfo.fullName || '',
                email: parsedData.personalInfo.email || '',
                phone: parsedData.personalInfo.phone || '',
                location: parsedData.personalInfo.location || '',
                linkedin: parsedData.personalInfo.linkedin || '',
                website: parsedData.personalInfo.website || '',
                summary: parsedData.personalInfo.summary || ''
              },
              sections: [],
              metadata: {
                lastEdited: new Date(),
                version: 1,
                exportCount: 0,
                importSource: 'upload',
                wordCount: 0
              },
              createdAt: new Date(),
              updatedAt: new Date()
            };

            // Add experience section if data exists
            if (parsedData.sections.experience && parsedData.sections.experience.length > 0) {
              const experienceItems: ExperienceItem[] = parsedData.sections.experience.map(exp => ({
                id: generateId(),
                company: exp.company || '',
                position: exp.title || '',
                startDate: exp.startDate || '',
                endDate: exp.current ? null : exp.endDate || '',
                location: exp.location || '',
                description: exp.description ? [exp.description] : [],
                skills: []
              }));

              newResume.sections.push({
                id: generateId(),
                type: 'experience',
                title: 'Work Experience',
                items: experienceItems,
                order: 0,
                visible: true
              });
            }

            // Add education section if data exists
            if (parsedData.sections.education && parsedData.sections.education.length > 0) {
              const educationItems: EducationItem[] = parsedData.sections.education.map(edu => ({
                id: generateId(),
                institution: edu.institution || '',
                degree: edu.degree || '',
                field: edu.field || '',
                startDate: edu.startDate || '',
                endDate: edu.endDate || null,
                location: edu.location || '',
                gpa: edu.gpa || '',
                honors: [],
                coursework: []
              }));

              newResume.sections.push({
                id: generateId(),
                type: 'education',
                title: 'Education',
                items: educationItems,
                order: 1,
                visible: true
              });
            }

            // Add skills section if data exists
            if (parsedData.sections.skills && parsedData.sections.skills.length > 0) {
              const skillsItem: SkillsItem = {
                id: generateId(),
                category: 'General',
                skills: parsedData.sections.skills,
                proficiency: 'intermediate'
              };

              newResume.sections.push({
                id: generateId(),
                type: 'skills',
                title: 'Skills',
                items: [skillsItem],
                order: 2,
                visible: true
              });
            }

            state.currentResume = newResume;
            state.resumes.push(newResume);
            state.selectedTemplate = 'classic-professional';
            state.isDirty = true;
          });
          return resumeId;
        },

        loadResume: (resume: Resume) => {
          set((state) => {
            state.currentResume = resume;
            state.selectedTemplate = resume.templateId;
            state.isDirty = false;
          });
        },

        saveResume: () => {
          set((state) => {
            if (state.currentResume) {
              state.currentResume.updatedAt = new Date();
              state.currentResume.metadata.lastEdited = new Date();
              state.currentResume.metadata.version += 1;
              
              // Update in resumes array
              const index = state.resumes.findIndex(r => r.id === state.currentResume!.id);
              if (index !== -1) {
                state.resumes[index] = state.currentResume;
              }
              
              state.isDirty = false;
              state.lastSaved = new Date();
            }
          });
        },

        deleteResume: (id: string) => {
          set((state) => {
            state.resumes = state.resumes.filter(resume => resume.id !== id);
            if (state.currentResume?.id === id) {
              state.currentResume = null;
            }
          });
        },

        duplicateResume: (id: string) => {
          set((state) => {
            const original = state.resumes.find(resume => resume.id === id);
            if (original) {
              const duplicate = {
                ...original,
                id: generateId(),
                title: `${original.title} (Copy)`,
                createdAt: new Date(),
                updatedAt: new Date(),
                metadata: {
                  ...original.metadata,
                  lastEdited: new Date(),
                  version: 1,
                  exportCount: 0
                }
              };
              state.resumes.push(duplicate);
            }
          });
        },

        // Personal information actions
        updatePersonalInfo: (info: Partial<PersonalInfo>) => {
          set((state) => {
            if (state.currentResume) {
              Object.assign(state.currentResume.personalInfo, info);
              state.isDirty = true;
            }
          });
        },

        // Section management actions
        addSection: (section: Omit<ResumeSection, 'id' | 'order'>) => {
          set((state) => {
            if (state.currentResume) {
              const newSection: ResumeSection = {
                ...section,
                id: generateId(),
                order: state.currentResume.sections.length
              };
              state.currentResume.sections.push(newSection);
              state.isDirty = true;
            }
          });
        },

        updateSection: (sectionId: string, updates: Partial<ResumeSection>) => {
          set((state) => {
            if (state.currentResume) {
              const section = state.currentResume.sections.find(s => s.id === sectionId);
              if (section) {
                Object.assign(section, updates);
                state.isDirty = true;
              }
            }
          });
        },

        deleteSection: (sectionId: string) => {
          set((state) => {
            if (state.currentResume) {
              state.currentResume.sections = state.currentResume.sections.filter(
                section => section.id !== sectionId
              );
              state.isDirty = true;
            }
          });
        },

        reorderSections: (startIndex: number, endIndex: number) => {
          set((state) => {
            if (state.currentResume) {
              const sections = state.currentResume.sections;
              const [removed] = sections.splice(startIndex, 1);
              if (removed) {
                sections.splice(endIndex, 0, removed);
                
                // Update order values
                sections.forEach((section, index) => {
                  section.order = index;
                });
                
                state.isDirty = true;
              }
            }
          });
        },

        toggleSectionVisibility: (sectionId: string) => {
          set((state) => {
            if (state.currentResume) {
              const section = state.currentResume.sections.find(s => s.id === sectionId);
              if (section) {
                section.visible = !section.visible;
                state.isDirty = true;
              }
            }
          });
        },

        // Section item actions
        addSectionItem: (sectionId: string, item: any) => {
          set((state) => {
            if (state.currentResume) {
              const section = state.currentResume.sections.find(s => s.id === sectionId);
              if (section) {
                const newItem = {
                  ...item,
                  id: generateId()
                };
                section.items.push(newItem);
                state.isDirty = true;
              }
            }
          });
        },

        updateSectionItem: (sectionId: string, itemId: string, updates: any) => {
          set((state) => {
            if (state.currentResume) {
              const section = state.currentResume.sections.find(s => s.id === sectionId);
              if (section) {
                const item = section.items.find(i => i.id === itemId);
                if (item) {
                  Object.assign(item, updates);
                  state.isDirty = true;
                }
              }
            }
          });
        },

        deleteSectionItem: (sectionId: string, itemId: string) => {
          set((state) => {
            if (state.currentResume) {
              const section = state.currentResume.sections.find(s => s.id === sectionId);
              if (section) {
                section.items = section.items.filter(item => item.id !== itemId);
                state.isDirty = true;
              }
            }
          });
        },

        reorderSectionItems: (sectionId: string, startIndex: number, endIndex: number) => {
          set((state) => {
            if (state.currentResume) {
              const section = state.currentResume.sections.find(s => s.id === sectionId);
              if (section) {
                const items = section.items;
                const [removed] = items.splice(startIndex, 1);
                if (removed) {
                  items.splice(endIndex, 0, removed);
                  state.isDirty = true;
                }
              }
            }
          });
        },

        // Template management
        setTemplate: (templateId: string) => {
          set((state) => {
            state.selectedTemplate = templateId;
            if (state.currentResume) {
              state.currentResume.templateId = templateId;
              state.isDirty = true;
            }
          });
        },

        // State management
        setLoading: (loading: boolean) => {
          set((state) => {
            state.isLoading = loading;
          });
        },

        markDirty: () => {
          set((state) => {
            state.isDirty = true;
          });
        },

        markClean: () => {
          set((state) => {
            state.isDirty = false;
          });
        },

        // Utility functions
        generateId,

        updateWordCount: () => {
          set((state) => {
            if (state.currentResume) {
              let wordCount = 0;
              
              // Count words in personal info summary
              wordCount += state.currentResume.personalInfo.summary.split(/\s+/).filter(Boolean).length;
              
              // Count words in all section items
              state.currentResume.sections.forEach(section => {
                section.items.forEach(item => {
                  // This is a simplified word count - would need to be more sophisticated for different item types
                  const itemText = JSON.stringify(item).replace(/[{}",]/g, ' ');
                  wordCount += itemText.split(/\s+/).filter(Boolean).length;
                });
              });
              
              state.currentResume.metadata.wordCount = wordCount;
            }
          });
        }
      })),
      {
        name: 'launchcv-resume-storage',
        partialize: (state) => ({
          resumes: state.resumes,
          selectedTemplate: state.selectedTemplate
        })
      }
    ),
    {
      name: 'resume-store'
    }
  )
);