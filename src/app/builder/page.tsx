'use client';

import * as React from 'react';
import { useResumeStore } from '@/lib/stores/resume-store';
import { BuilderLayout } from '@/components/builder/builder-layout';
import { PreviewContainer } from '@/components/preview/preview-container';
import { 
  PersonalInfoForm, 
  ExperienceForm, 
  EducationForm, 
  SkillsForm,
  ProjectsForm,
  CertificationsForm,
  useBulkEditModal
} from '@/components/builder';
// import { SectionManager } from '@/components/builder/section-manager';
// import { MissionProgressTracker } from '@/components/builder/mission-progress-tracker';
// import { AutoSaveProvider } from '@/components/builder/auto-save-provider';

export default function BuilderPage() {
  const { currentResume, createResume } = useResumeStore();
  const [activeSection, setActiveSection] = React.useState<string>('personal');
  const { BulkEditModal, openModal: openBulkEdit } = useBulkEditModal();

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
      <div className="space-y-6 p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Resume Builder - Mission Control</h2>
          <p className="text-gray-600">Live Preview System Active</p>
        </div>

        {/* Section Navigation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg flex-wrap">
              {['personal', 'experience', 'education', 'skills', 'projects', 'certifications'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                    activeSection === section 
                      ? 'bg-white text-launch-blue shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
            
            {/* Bulk Edit Button */}
            <button
              onClick={openBulkEdit}
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-launch-blue transition-colors border border-gray-300 rounded-md hover:border-launch-blue"
            >
              Bulk Edit
            </button>
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
    </div>
  );
}