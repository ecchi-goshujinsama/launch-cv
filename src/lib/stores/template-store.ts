import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { TemplateStore, Template, TemplateCustomizations } from '../types/template';
import { templates } from '../templates';

const useTemplateStore = create<TemplateStore>()(
  devtools(
    immer((set, get) => ({
      // State
      templates: [],
      selectedTemplateId: null,
      templateCategories: ['professional', 'modern', 'creative', 'technical', 'executive'],
      isLoading: false,
      searchTerm: '',
      selectedCategory: null,
      sortBy: 'popularity',

      // Actions
      loadTemplates: async () => {
        set(state => {
          state.isLoading = true;
        });

        try {
          // In a real app, this would fetch from an API
          // For now, we'll use the local templates
          set(state => {
            state.templates = templates;
            state.isLoading = false;
            
            // Set default template if none selected
            if (!state.selectedTemplateId && templates.length > 0) {
              const firstTemplate = templates[0];
              if (firstTemplate) {
                state.selectedTemplateId = firstTemplate.id;
              }
            }
          });
        } catch (error) {
          console.error('Failed to load templates:', error);
          set(state => {
            state.isLoading = false;
          });
        }
      },

      selectTemplate: (templateId: string) => {
        set(state => {
          state.selectedTemplateId = templateId;
        });
      },

      getTemplate: (templateId: string) => {
        const { templates } = get();
        return templates.find(template => template.id === templateId) || null;
      },

      getTemplatesByCategory: (category: Template['category']) => {
        const { templates } = get();
        return templates.filter(template => template.category === category);
      },

      setSearchTerm: (term: string) => {
        set(state => {
          state.searchTerm = term;
        });
      },

      setSelectedCategory: (category: Template['category'] | null) => {
        set(state => {
          state.selectedCategory = category;
        });
      },

      setSortBy: (sortBy: TemplateStore['sortBy']) => {
        set(state => {
          state.sortBy = sortBy;
        });
      },

      applyCustomizations: (templateId: string, customizations: TemplateCustomizations) => {
        // This would typically be handled by the resume store
        // For now, we'll just log the action
        console.log('Applying customizations to template:', templateId, customizations);
      },

      resetCustomizations: (templateId: string) => {
        // This would typically be handled by the resume store
        // For now, we'll just log the action
        console.log('Resetting customizations for template:', templateId);
      }
    })),
    {
      name: 'template-store'
    }
  )
);

export default useTemplateStore;

// Selector hooks for optimized re-renders
export const useSelectedTemplate = () => {
  const selectedTemplateId = useTemplateStore(state => state.selectedTemplateId);
  const getTemplate = useTemplateStore(state => state.getTemplate);
  return selectedTemplateId ? getTemplate(selectedTemplateId) : null;
};

export const useFilteredTemplates = () => {
  const templates = useTemplateStore(state => state.templates);
  const searchTerm = useTemplateStore(state => state.searchTerm);
  const selectedCategory = useTemplateStore(state => state.selectedCategory);
  const sortBy = useTemplateStore(state => state.sortBy);

  // Filter templates
  let filteredTemplates = templates;

  // Apply category filter
  if (selectedCategory) {
    filteredTemplates = filteredTemplates.filter(
      template => template.category === selectedCategory
    );
  }

  // Apply search filter
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredTemplates = filteredTemplates.filter(
      template =>
        template.name.toLowerCase().includes(term) ||
        template.description.toLowerCase().includes(term) ||
        template.metadata.tags.some(tag => tag.toLowerCase().includes(term)) ||
        template.metadata.industry.some(industry => industry.toLowerCase().includes(term))
    );
  }

  // Sort templates
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'popularity':
        return b.metadata.popularity - a.metadata.popularity;
      case 'rating':
        return b.metadata.rating - a.metadata.rating;
      case 'recent':
        return new Date(b.metadata.updatedAt).getTime() - new Date(a.metadata.updatedAt).getTime();
      default:
        return 0;
    }
  });

  return sortedTemplates;
};

export const useTemplateCategories = () => {
  return useTemplateStore(state => state.templateCategories);
};