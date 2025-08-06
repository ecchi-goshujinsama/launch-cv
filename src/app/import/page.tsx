'use client';

import { MissionHeader, MissionFooter } from '@/components/layout';
import { MissionPrep } from '@/components/resume';

export default function ImportPage() {
  const handleFileProcessed = (file: File) => {
    console.log('File processed:', file.name);
  };

  const handleManualEntry = () => {
    console.log('Manual entry selected');
    // TODO: Navigate to manual entry flow
  };

  const handleContinue = () => {
    console.log('Continue to pre-flight check');
    // TODO: Navigate to pre-flight check
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MissionHeader 
        title="LaunchCV"
        subtitle="Pre-flight Data Import"
        showSave={false}
        showExport={false}
      />
      
      <main className="py-12">
        <MissionPrep
          onFileProcessed={handleFileProcessed}
          onManualEntry={handleManualEntry}
          onContinue={handleContinue}
        />
      </main>
      
      <MissionFooter />
    </div>
  );
}