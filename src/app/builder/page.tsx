'use client';

import * as React from 'react';
import { useResumeStore } from '@/lib/stores/resume-store';
import { BuilderLayout } from '@/components/builder/builder-layout';
import { PreviewContainer } from '@/components/preview/preview-container';
import { KeyboardShortcutsModal } from '@/components/ui/keyboard-shortcuts-modal';
import { LaunchButton } from '@/components/ui/launch-button';
import { useKeyboardShortcuts, createResumeBuilderShortcuts } from '@/lib/hooks/use-keyboard-shortcuts';
import { useSwipeNavigation, useIsMobile } from '@/lib/hooks/use-touch-interactions';
import { 
  PersonalInfoForm, 
  ExperienceForm, 
  EducationForm, 
  SkillsForm,
  ProjectsForm,
  CertificationsForm,
  useBulkEditModal
} from '@/components/builder';
import { Plus, Keyboard, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
// import { SectionManager } from '@/components/builder/section-manager';
// import { MissionProgressTracker } from '@/components/builder/mission-progress-tracker';
// import { AutoSaveProvider } from '@/components/builder/auto-save-provider';

export default function BuilderPage() {
  const { currentResume, createResume, updateResumeSection } = useResumeStore();
  const [activeSection, setActiveSection] = React.useState<string>('personal');
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showSearch, setShowSearch] = React.useState(false);
  const { BulkEditModal, openModal: openBulkEdit } = useBulkEditModal();
  
  // Mobile and touch detection
  const { isMobile, isTouchDevice } = useIsMobile();
  
  // Available sections for swipe navigation
  const sections = ['personal', 'experience', 'education', 'skills', 'projects', 'certifications'];
  
  // Swipe navigation between sections
  const { 
    touchProps, 
    canSwipeNext, 
    canSwipePrevious
  } = useSwipeNavigation(
    sections, 
    activeSection, 
    setActiveSection, 
    isMobile && isTouchDevice
  );
  
  // Keyboard shortcuts setup
  const keyboardActions = {
    save: () => {
      // Trigger form save - handled by individual forms
      console.log('Manual save triggered');
    },
    undo: () => {
      // Handled by individual forms
      console.log('Undo triggered');
    },
    redo: () => {
      // Handled by individual forms  
      console.log('Redo triggered');
    },
    newSection: () => {
      // Add a new custom section
      if (currentResume) {
        updateResumeSection(crypto.randomUUID(), 'New Section', []);
      }
    },
    search: () => {
      setShowSearch(true);
    },
    preview: () => {
      // Focus on preview area
      console.log('Focus preview');
    },
    help: () => {
      setShowKeyboardShortcuts(true);
    }
  };

  const shortcuts = createResumeBuilderShortcuts(keyboardActions);
  const { shortcuts: shortcutsWithDisplay } = useKeyboardShortcuts(shortcuts);

  // Create a default resume if none exists
  React.useEffect(() => {
    if (!currentResume) {
      createResume('New Resume', 'classic-professional');
    }
  }, [currentResume, createResume]);

  const renderFormSection = () => {
    if (!currentResume) {
      return (
        <div className="p-8 text-center">
          <p className="text-gray-600">Loading resume data...</p>
        </div>
      );
    }

    return (
      <div className="space-y-6 p-6" {...(isMobile ? touchProps : {})}>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Resume Builder - Mission Control</h2>
          <p className="text-gray-600">
            Live Preview System Active
            {isMobile && isTouchDevice && (
              <span className="block text-xs text-gray-500 mt-1">👈 Swipe to navigate sections</span>
            )}
          </p>
        </div>

        {/* Enhanced Section Navigation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Search functionality */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search sections... (Ctrl+F)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-launch-blue-200 focus:border-launch-blue"
                  style={{ width: showSearch ? '200px' : '160px' }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Keyboard shortcuts help */}
              <LaunchButton
                type="button"
                variant="ghost" 
                size="sm"
                onClick={() => setShowKeyboardShortcuts(true)}
                icon="none"
                title="Show keyboard shortcuts (F1)"
              >
                <Keyboard className="w-4 h-4 mr-2" />
                Shortcuts
              </LaunchButton>
              
              {/* New Section Button */}
              <LaunchButton
                type="button"
                variant="outline"
                size="sm"
                onClick={keyboardActions.newSection}
                icon="none"
                title="Add new section (Ctrl+N)"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Section
              </LaunchButton>
              
              {/* Bulk Edit Button */}
              <LaunchButton
                type="button"
                variant="outline"
                size="sm"
                onClick={openBulkEdit}
                icon="none"
              >
                Bulk Edit
              </LaunchButton>
            </div>
          </div>
          
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg flex-wrap">
            {sections
              .filter(section => 
                searchTerm === '' || 
                section.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((section) => {
                const isActive = activeSection === section;
                const activeIndex = sections.indexOf(activeSection);
                return (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 capitalize relative",
                      "touch-target",
                      isActive 
                        ? 'bg-white text-launch-blue shadow-sm scale-105'
                        : 'text-gray-600 hover:text-gray-800',
                      isMobile && 'min-w-[80px] text-center'
                    )}
                  >
                    {section}
                    {/* Mobile swipe indicators */}
                    {isMobile && isTouchDevice && isActive && (
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                        {canSwipePrevious && <span className="text-xs text-gray-400">←</span>}
                        <div className="flex gap-1">
                          {sections.map((_, dotIndex) => (
                            <div 
                              key={dotIndex}
                              className={cn(
                                "w-1.5 h-1.5 rounded-full transition-colors",
                                dotIndex === activeIndex ? 'bg-launch-blue' : 'bg-gray-300'
                              )}
                            />
                          ))}
                        </div>
                        {canSwipeNext && <span className="text-xs text-gray-400">→</span>}
                      </div>
                    )}
                  </button>
                );
              })}
          </div>
        </div>

        {/* Active Section Form */}
        <div className="space-y-6">
          {activeSection === 'personal' && (
            <PersonalInfoForm
              initialData={currentResume.personalInfo}
              onSave={() => {
                // The PersonalInfoForm should handle saving via store
              }}
            />
          )}

          {activeSection === 'experience' && (
            <ExperienceForm
              initialData={
                (currentResume.sections
                  .find(s => s.type === 'experience')?.items || []) as any[]
              }
              onSave={() => {
                // The ExperienceForm should handle saving via store
              }}
            />
          )}

          {activeSection === 'education' && (
            <EducationForm
              initialData={
                (currentResume.sections
                  .find(s => s.type === 'education')?.items || []) as any[]
              }
              onSave={() => {
                // The EducationForm should handle saving via store
              }}
            />
          )}

          {activeSection === 'skills' && (
            <SkillsForm
              initialData={
                (currentResume.sections
                  .find(s => s.type === 'skills')?.items || []) as any[]
              }
              onSave={() => {
                // The SkillsForm should handle saving via store
              }}
            />
          )}

          {activeSection === 'projects' && (
            <ProjectsForm
              initialData={
                (currentResume.sections
                  .find(s => s.type === 'projects')?.items || []) as any[]
              }
              onSave={() => {
                // The ProjectsForm should handle saving via store
              }}
            />
          )}

          {activeSection === 'certifications' && (
            <CertificationsForm
              initialData={
                (currentResume.sections
                  .find(s => s.type === 'certifications')?.items || []) as any[]
              }
              onSave={() => {
                // The CertificationsForm should handle saving via store
              }}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col">
      <BuilderLayout
        formSection={renderFormSection()}
        previewSection={
          <PreviewContainer 
            showControls={true}
            autoScale={true}
            initialPreviewMode="desktop"
          />
        }
        onLayoutChange={(layout) => {
          console.log('Layout changed to:', layout);
        }}
        onPreviewModeChange={(mode) => {
          console.log('Preview mode changed to:', mode);
        }}
      />
      
      {/* Bulk Edit Modal */}
      <BulkEditModal />
      
      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
        shortcuts={shortcutsWithDisplay}
      />
    </div>
  );
}