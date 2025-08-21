'use client';

import * as React from 'react';
import { useState, useRef } from 'react';
import { GripVertical, Eye, EyeOff, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ResumeSection } from './section-manager';

interface DragDropSectionProps {
  sections: ResumeSection[];
  onReorder: (sections: ResumeSection[]) => void;
  onToggleVisibility: (id: string) => void;
  onRemove: (id: string) => void;
  children?: (section: ResumeSection, index: number) => React.ReactNode;
  className?: string;
}

export function DragDropSection({
  sections,
  onReorder,
  onToggleVisibility,
  onRemove,
  children,
  className
}: DragDropSectionProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const dragCounterRef = useRef(0);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    setIsDragging(true);
    
    // Set drag data
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
    
    // Add visual feedback
    (e.currentTarget as HTMLElement).style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsDragging(false);
    dragCounterRef.current = 0;
    
    // Reset visual feedback
    (e.currentTarget as HTMLElement).style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragCounterRef.current++;
    
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setDragOverIndex(null);
    }
  };

    const newSections = [...sections];
    const draggedSection = newSections[draggedIndex];
    
    if (!draggedSection) return;
    
    // Remove dragged section
    newSections.splice(draggedIndex, 1);
    
    // Insert at new position
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newSections.splice(insertIndex, 0, draggedSection);
    
    // Update order property
    const reorderedSections = newSections.map((section, index) => ({
      ...section,
      order: index
    }));
    
    onReorder(reorderedSections);

  const getSectionIcon = (type: ResumeSection['type']) => {
    switch (type) {
      case 'personalInfo': return '👤';
      case 'summary': return '📄';
      case 'experience': return '💼';
      case 'education': return '🎓';
      case 'skills': return '🔧';
      case 'projects': return '🚀';
      case 'certifications': return '🏆';
      case 'awards': return '🥇';
      case 'languages': return '🌍';
      case 'custom': return '📝';
      default: return '📋';
    }
  };

  const getDragDropIndicator = (index: number) => {
    if (!isDragging || draggedIndex === null) return null;
    
    if (dragOverIndex === index && draggedIndex !== index) {
      const isAbove = draggedIndex > index;
      return (
        <div 
          className={cn(
            "absolute left-0 right-0 h-1 bg-launch-blue rounded-full z-10 transition-opacity",
            isAbove ? "top-0 -translate-y-1" : "bottom-0 translate-y-1"
          )}
        />
      );
    }
    
    return null;
  };

  return (
    <div className={cn('space-y-2', className)}>
      {sections.map((section, index) => (
        <div key={section.id} className="relative">
          {getDragDropIndicator(index)}
          
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            className={cn(
              "group flex items-center gap-3 p-3 border rounded-lg transition-all duration-200",
              "hover:border-gray-300 hover:shadow-sm",
              section.visible 
                ? "border-gray-200 bg-white" 
                : "border-gray-200 bg-gray-50 opacity-75",
              draggedIndex === index && "opacity-50 scale-105 shadow-lg border-launch-blue",
              dragOverIndex === index && draggedIndex !== index && "border-launch-blue bg-launch-blue/5",
              isDragging && draggedIndex !== index && "transition-transform duration-200"
            )}
          >
            {/* Drag Handle */}
            <div 
              className={cn(
                "cursor-grab active:cursor-grabbing p-1 text-gray-400 transition-colors",
                "group-hover:text-gray-600",
                isDragging && draggedIndex === index && "cursor-grabbing text-launch-blue"
              )}
            >
              <GripVertical className="w-4 h-4" />
            </div>

            {/* Section Content */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-lg flex-shrink-0">{getSectionIcon(section.type)}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{section.title}</div>
                <div className="text-xs text-gray-500 truncate">
                  {section.type === 'personalInfo' && 'Contact information and basic details'}
                  {section.type === 'summary' && 'Professional summary and career objectives'}
                  {section.type === 'experience' && 'Work history and professional experience'}
                  {section.type === 'education' && 'Educational background and qualifications'}
                  {section.type === 'skills' && 'Technical and professional skills'}
                  {section.type === 'projects' && 'Personal and professional projects'}
                  {section.type === 'certifications' && 'Professional certifications and credentials'}
                  {section.type === 'awards' && 'Awards, honors, and recognition'}
                  {section.type === 'languages' && 'Spoken languages and proficiency levels'}
                  {section.type === 'custom' && 'Custom section content'}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Visibility Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility(section.id);
                }}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  section.visible 
                    ? "text-green-500 hover:text-green-600 hover:bg-green-50" 
                    : "text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                )}
                title={section.visible ? "Hide section" : "Show section"}
              >
                {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              {/* Remove Button (only for non-required sections) */}
              {!section.required && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(section.id);
                  }}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Remove section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Required Badge */}
            {section.required && (
              <div className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full flex-shrink-0">
                Required
              </div>
            )}
          </div>

          {/* Custom Content */}
          {children && children(section, index)}
        </div>
      ))}
      
      {/* Drop Zone Indicator at Bottom */}
      {isDragging && (
        <div 
          onDragOver={(e) => handleDragOver(e, sections.length)}
          onDragEnter={(e) => handleDragEnter(e, sections.length)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, sections.length)}
          className={cn(
            "h-12 border-2 border-dashed border-gray-300 rounded-lg",
            "flex items-center justify-center text-gray-500 text-sm transition-colors",
            dragOverIndex === sections.length && "border-launch-blue bg-launch-blue/5 text-launch-blue"
          )}
        >
          Drop here to move to bottom
        </div>
      )}
    </div>
  );
}

// Higher-order component for adding drag & drop to any section list
export function withDragDrop<T extends { id: string; order: number }, Props extends { items: T[]; onReorder: (items: T[]) => void }>(
  Component: React.ComponentType<Props>
) {
  return function DragDropWrapper(props: Omit<Props, 'items' | 'onReorder'> & Partial<Pick<Props, 'items' | 'onReorder'>>) {
    const { items, onReorder, ...restProps } = props;
    
    const handleReorder = (newItems: T[]) => {
      // Create new item objects without mutating originals
      const reorderedItems = newItems.map((item, index) => ({
        ...item,
        order: index
      }));
      
      // Only call onReorder if provided
      if (onReorder) {
        onReorder(reorderedItems);
      }
    };

    return (
      <Component
        {...(restProps as Props)}
        items={items || ([] as T[])}
        onReorder={handleReorder}
      />
    );
  };
}