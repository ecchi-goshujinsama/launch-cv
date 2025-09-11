import Link from 'next/link';
import { Rocket, Target, Zap, CheckCircle } from 'lucide-react';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionHeader, MissionFooter, MissionContainer, MissionSection, MissionCard, MissionGrid } from '@/components/layout';


export default function Home() {
  return (
    <div className="min-h-screen">
      <MissionHeader />
      
      <main className="py-12">
        <MissionContainer maxWidth="7xl" padding="lg">
          {/* Hero Section */}
          <MissionSection
            title="LaunchCV Mission Control"
            subtitle="Transform any resume into a targeted career launcher. Your next professional opportunity starts here."
            icon={<Rocket className="w-6 h-6 text-launch-blue" />}
            showDivider
          >
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center sm:justify-start">
              <Link href="/import">
                <LaunchButton
                  variant="rocket"
                  size="lg"
                  icon="rocket"
                  iconPosition="left"
                  animation="rocket"
                >
                  Start Mission
                </LaunchButton>
              </Link>
              
              <Link href="/import">
                <LaunchButton
                  variant="outline"
                  size="lg"
                  icon="arrow"
                  iconPosition="right"
                >
                  Import Resume
                </LaunchButton>
              </Link>
            </div>
          </MissionSection>


          {/* Feature Grid */}
          <MissionSection
            title="Mission Features"
            subtitle="Core capabilities for your career launch"
            className="mt-16"
          >
            <MissionGrid cols={3} gap="lg">
              <MissionCard
                title="Pre-flight Import"
                subtitle="Upload and parse PDF, DOCX, or text resumes"
                icon={<Target className="w-5 h-5" />}
                variant="mission"
                hover
              >
                <div className="space-y-2 text-sm text-slate-400">
                  <div>• Intelligent text extraction</div>
                  <div>• Automatic data parsing</div>
                  <div>• Manual review interface</div>
                </div>
              </MissionCard>
              
              <MissionCard
                title="Mission Control Builder"
                subtitle="Craft professional resumes with live preview"
                icon={<Zap className="w-5 h-5" />}
                variant="mission"
                hover
              >
                <div className="space-y-2 text-sm text-slate-400">
                  <div>• Real-time editing</div>
                  <div>• Multiple templates</div>
                  <div>• Auto-save functionality</div>
                </div>
              </MissionCard>
              
              <MissionCard
                title="Launch Sequence"
                subtitle="Export high-quality PDFs ready for launch"
                icon={<CheckCircle className="w-5 h-5" />}
                variant="mission"
                hover
              >
                <div className="space-y-2 text-sm text-slate-400">
                  <div>• Professional PDF output</div>
                  <div>• ATS-friendly formats</div>
                  <div>• Career launch tracking</div>
                </div>
              </MissionCard>
            </MissionGrid>
          </MissionSection>

          {/* Mission Status */}
          <MissionSection className="mt-16">
            <MissionCard variant="bordered" className="text-center">
              <div className="space-y-4">
                <div className="brand-text-gradient text-2xl font-bold">
                  Mission Status: Foundation Complete! 🚀
                </div>
                <p className="text-slate-400">
                  LaunchCV foundation systems are operational and ready for the next phase of development.
                </p>
                <div className="flex justify-center gap-4">
                  <LaunchButton variant="mission" icon="rocket" animation="launch">
                    Continue Mission
                  </LaunchButton>
                  <LaunchButton variant="outline">
                    View Progress
                  </LaunchButton>
                </div>
              </div>
            </MissionCard>
          </MissionSection>
        </MissionContainer>
      </main>
      
      <MissionFooter />
    </div>
  );
}
