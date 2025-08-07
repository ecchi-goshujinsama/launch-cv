'use client';

import * as React from 'react';
import { 
  X, 
  Trash2, 
  Copy, 
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { useResumeStore } from '@/lib/stores/resume-store';
import type { SectionItem } from '@/lib/types';

interface BulkEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}


export function BulkEditModal({ isOpen, onClose, className }: BulkEditModalProps) {
  const { currentResume, updateResumeSection, toggleSectionVisibility } = useResumeStore();
  const [selectedSections, setSelectedSections] = React.useState<string[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<{[sectionId: string]: string[]}>({});
  const [expandedSections, setExpandedSections] = React.useState<string[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');

  if (!isOpen || !currentResume) return null;

  const filteredSections = currentResume.sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.items.some(item => 
      JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSectionSelect = (sectionId: string, checked: boolean) => {
    if (checked) {
      setSelectedSections(prev => [...prev, sectionId]);
    } else {
      setSelectedSections(prev => prev.filter(id => id !== sectionId));
      setSelectedItems(prev => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [sectionId]: _removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleItemSelect = (sectionId: string, itemId: string, checked: boolean) => {
    setSelectedItems(prev => {
      const currentItems = prev[sectionId] || [];
      if (checked) {
        return {
          ...prev,
          [sectionId]: [...currentItems, itemId]
        };
      } else {
        return {
          ...prev,
          [sectionId]: currentItems.filter(id => id !== itemId)
        };
      }
    });
  };

  const handleSelectAll = () => {
    const allSectionIds = filteredSections.map(s => s.id);
    const allItemIds: {[sectionId: string]: string[]} = {};
    
    filteredSections.forEach(section => {
      allItemIds[section.id] = section.items.map(item => item.id);
    });
    
    setSelectedSections(allSectionIds);
    setSelectedItems(allItemIds);
  };

  const handleDeselectAll = () => {
    setSelectedSections([]);
    setSelectedItems({});
  };

  const handleBulkVisibilityToggle = (visible: boolean) => {
    selectedSections.forEach(sectionId => {
      const section = currentResume.sections.find(s => s.id === sectionId);
      if (section && section.visible !== visible) {
        toggleSectionVisibility(sectionId);
      }
    });
  };

  const handleBulkDelete = () => {
    if (window.confirm('Are you sure you want to delete the selected sections? This action cannot be undone.')) {
      selectedSections.forEach(sectionId => {
        // Remove section entirely
        // Note: This would need a removeSection method in the store
        console.log('Delete section:', sectionId);
      });

      // Delete selected items within sections
      Object.entries(selectedItems).forEach(([sectionId, itemIds]) => {
        const section = currentResume.sections.find(s => s.id === sectionId);
        if (section) {
          const updatedItems = section.items.filter(item => !itemIds.includes(item.id));
          updateResumeSection(sectionId, section.title, updatedItems);
        }
      });

      handleDeselectAll();
    }
  };

  const handleBulkDuplicate = () => {
    Object.entries(selectedItems).forEach(([sectionId, itemIds]) => {
      const section = currentResume.sections.find(s => s.id === sectionId);
      if (section) {
        const itemsToDuplicate = section.items.filter(item => itemIds.includes(item.id));
        const duplicatedItems = itemsToDuplicate.map(item => ({
          ...item,
          id: crypto.randomUUID()
        }));
        
        updateResumeSection(sectionId, section.title, [...section.items, ...duplicatedItems]);
      }
    });
    
    handleDeselectAll();
  };

  const toggleSectionExpansion = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getItemDisplayText = (item: SectionItem, sectionType: string): string => {
    switch (sectionType) {
      case 'experience':
        return `${(item as any).position || 'Position'} at ${(item as any).company || 'Company'}`;
      case 'education':
        return `${(item as any).degree || 'Degree'} from ${(item as any).institution || 'Institution'}`;
      case 'skills':
        return `${(item as any).category || 'Category'}: ${(item as any).skills?.slice(0, 3)?.join(', ') || 'Skills'}`;
      case 'projects':
        return (item as any).name || 'Project';
      case 'certifications':
        return `${(item as any).name || 'Certification'} - ${(item as any).issuer || 'Issuer'}`;
      default:
        return (item as any).title || (item as any).name || 'Item';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={cn(
        "bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col",
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold mission-text">Bulk Edit Resume Sections</h2>
            <p className="text-sm text-gray-600 mt-1">
              Select sections and items to perform bulk operations
            </p>
          </div>
          <LaunchButton
            variant="ghost"
            size="sm"
            onClick={onClose}
            icon="none"
          >
            <X className="w-5 h-5" />
          </LaunchButton>
        </div>

        {/* Search and Selection Controls */}
        <div className="p-6 border-b border-gray-200 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search sections and items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-launch-blue-200 focus:border-launch-blue"
            />
          </div>

          {/* Selection Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{selectedSections.length} sections selected</span>
              <span>•</span>
              <span>{Object.values(selectedItems).flat().length} items selected</span>
            </div>
            <div className="flex items-center gap-2">
              <LaunchButton
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                icon="none"
              >
                Select All
              </LaunchButton>
              <LaunchButton
                variant="ghost"
                size="sm"
                onClick={handleDeselectAll}
                icon="none"
              >
                Deselect All
              </LaunchButton>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-4">
            {filteredSections.map((section) => (
              <div key={section.id} className="border border-gray-200 rounded-lg">
                {/* Section Header */}
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedSections.includes(section.id)}
                      onChange={(e) => handleSectionSelect(section.id, e.target.checked)}
                      className="rounded border-gray-300 text-launch-blue focus:ring-launch-blue-200"
                    />
                    
                    <button
                      onClick={() => toggleSectionExpansion(section.id)}
                      className="flex items-center gap-2 text-left flex-1 hover:text-launch-blue transition-colors"
                    >
                      {expandedSections.includes(section.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      
                      <div className="flex items-center gap-3 flex-1">
                        <h3 className="font-medium text-gray-900">{section.title}</h3>
                        <div className="flex items-center gap-2">
                          {section.visible ? (
                            <div className="flex items-center gap-1 text-green-600 text-xs">
                              <Eye className="w-3 h-3" />
                              Visible
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-gray-400 text-xs">
                              <EyeOff className="w-3 h-3" />
                              Hidden
                            </div>
                          )}
                          <span className="text-xs text-gray-500">
                            {section.items.length} item{section.items.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Section Items */}
                {expandedSections.includes(section.id) && (
                  <div className="p-4 space-y-2">
                    {section.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={(selectedItems[section.id] || []).includes(item.id)}
                          onChange={(e) => handleItemSelect(section.id, item.id, e.target.checked)}
                          className="rounded border-gray-300 text-launch-blue focus:ring-launch-blue-200"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {getItemDisplayText(item, section.type)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Select sections and items to enable bulk actions
            </div>
            
            <div className="flex items-center gap-2">
              {/* Visibility Actions */}
              <LaunchButton
                variant="outline"
                size="sm"
                onClick={() => handleBulkVisibilityToggle(true)}
                disabled={selectedSections.length === 0}
                icon="none"
              >
                <Eye className="w-4 h-4 mr-2" />
                Show
              </LaunchButton>
              
              <LaunchButton
                variant="outline"
                size="sm"
                onClick={() => handleBulkVisibilityToggle(false)}
                disabled={selectedSections.length === 0}
                icon="none"
              >
                <EyeOff className="w-4 h-4 mr-2" />
                Hide
              </LaunchButton>

              {/* Item Actions */}
              <LaunchButton
                variant="outline"
                size="sm"
                onClick={handleBulkDuplicate}
                disabled={Object.values(selectedItems).flat().length === 0}
                icon="none"
              >
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </LaunchButton>

              <LaunchButton
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                disabled={selectedSections.length === 0 && Object.values(selectedItems).flat().length === 0}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                icon="none"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </LaunchButton>

              <LaunchButton
                variant="mission"
                size="sm"
                onClick={onClose}
                icon="rocket"
                iconPosition="right"
              >
                Done
              </LaunchButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook to manage bulk edit modal
export function useBulkEditModal() {
  const [isOpen, setIsOpen] = React.useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return {
    isOpen,
    openModal,
    closeModal,
    BulkEditModal: (props: Omit<BulkEditModalProps, 'isOpen' | 'onClose'>) => (
      <BulkEditModal {...props} isOpen={isOpen} onClose={closeModal} />
    )
  };
}