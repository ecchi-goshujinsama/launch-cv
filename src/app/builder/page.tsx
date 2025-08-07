'use client';

import * as React from 'react';
import { useResumeStore } from '@/lib/stores/resume-store';
import { BuilderLayout } from '@/components/builder/builder-layout';
import { PreviewContainer } from '@/components/preview/preview-container';
import { PersonalInfoForm, ExperienceForm, EducationForm, SkillsForm } from '@/components/builder';
// import { SectionManager } from '@/components/builder/section-manager';
// import { MissionProgressTracker } from '@/components/builder/mission-progress-tracker';
// import { AutoSaveProvider } from '@/components/builder/auto-save-provider';

export default function BuilderPage() {
  const { currentResume, createResume } = useResumeStore();
  const [activeSection, setActiveSection] = React.useState<string>('personal');

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

        {/* Simple Section Navigation */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          {['personal', 'experience', 'education', 'skills'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                activeSection === section 
                  ? 'bg-white text-launch-blue shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {section}
            </button>
          ))}
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
    </div>
  );
}