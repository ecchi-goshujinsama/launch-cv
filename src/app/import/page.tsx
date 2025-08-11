'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MissionHeader, MissionFooter } from '@/components/layout';
import { ImportFlow } from '@/components/import/import-flow';
import { useResumeStore } from '@/lib/stores/resume-store';

export default function ImportPage() {
  const router = useRouter();
  const { createResume } = useResumeStore();

  const handleImportComplete = (resumeId: string) => {
    console.log('Import completed, resume ID:', resumeId);
    router.push('/builder');
  };

  const handleManualEntry = () => {
    console.log('Manual entry selected');
    // Create a blank resume for manual entry
    createResume('New Resume', 'classic-professional');
    router.push('/builder');
  };

  return (
    <div className="min-h-screen">
      <MissionHeader 
        title="LaunchCV"
        subtitle="Pre-flight Data Import"
        showSave={false}
        showExport={false}
      />
      
      <main className="py-12">
        <ImportFlow
          onComplete={handleImportComplete}
          className="max-w-4xl mx-auto px-4"
        />
        
        <div className="flex justify-center mt-8">
          <button
            onClick={handleManualEntry}
            className="px-6 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 hover:bg-slate-700 transition-colors"
          >
            Skip to Manual Entry
          </button>
        </div>
      </main>
      
      <MissionFooter />
    </div>
  );
}