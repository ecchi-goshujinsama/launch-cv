'use client';

import React, { useEffect, useState } from 'react';
import { LaunchButton } from '../ui/launch-button';
import { 
  Rocket, 
  CheckCircle2, 
  Star, 
  Sparkles, 
  Download, 
  Share, 
  RefreshCw,
  Target,
  TrendingUp,
  Award,
} from 'lucide-react';

interface CareerLaunchedSuccessProps {
  resumeName: string;
  templateName: string;
  onComplete: () => void;
}

export const CareerLaunchedSuccess: React.FC<CareerLaunchedSuccessProps> = ({
  resumeName,
  templateName,
  onComplete,
}) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [animationPhase, setAnimationPhase] = useState<'launching' | 'orbiting' | 'success'>('launching');

  useEffect(() => {
    // Animation sequence
    const timer1 = setTimeout(() => setAnimationPhase('orbiting'), 1000);
    const timer2 = setTimeout(() => setAnimationPhase('success'), 2000);
    const timer3 = setTimeout(() => setShowConfetti(false), 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const achievements = [
    {
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      title: 'Professional PDF Generated',
      description: 'High-quality, ATS-compatible resume ready',
    },
    {
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      title: 'Template Applied Successfully',
      description: `${templateName} design implemented perfectly`,
    },
    {
      icon: <Target className="w-5 h-5 text-blue-500" />,
      title: 'Career Launch Ready',
      description: 'Your professional brand is ready for takeoff',
    },
  ];

  const nextSteps = [
    {
      icon: <Download className="w-5 h-5 text-launch-blue" />,
      title: 'Review Your Resume',
      description: 'Check your downloads folder for the PDF',
      action: 'Downloaded',
    },
    {
      icon: <Share className="w-5 h-5 text-green-600" />,
      title: 'Share with Networks',
      description: 'Start applying to your dream positions',
      action: 'Share',
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
      title: 'Track Success',
      description: 'Monitor your application progress',
      action: 'Track',
    },
  ];

  return (
    <div className="text-center py-8 space-y-8 relative overflow-hidden">
      {/* Confetti and background effects */}
      {showConfetti && (
        <>
          {/* Animated background particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => {
              // Use predictable values based on index to prevent hydration issues
              const positions = [
                { left: 10, top: 20 }, { left: 85, top: 15 }, { left: 45, top: 80 },
                { left: 70, top: 35 }, { left: 25, top: 60 }, { left: 90, top: 70 },
                { left: 15, top: 45 }, { left: 60, top: 10 }, { left: 35, top: 85 },
                { left: 80, top: 55 }, { left: 5, top: 75 }, { left: 95, top: 25 },
                { left: 50, top: 40 }, { left: 20, top: 90 }, { left: 75, top: 5 },
                { left: 40, top: 65 }, { left: 65, top: 30 }, { left: 30, top: 50 },
                { left: 85, top: 85 }, { left: 55, top: 95 }
              ];
              const pos = positions[i] || { left: 50, top: 50 };
              const delay = (i * 0.1) % 2;
              const duration = 2 + (i % 3) * 0.5;
              
              return (
                <div
                  key={i}
                  className="absolute animate-bounce"
                  style={{
                    left: `${pos.left}%`,
                    top: `${pos.top}%`,
                    animationDelay: `${delay}s`,
                    animationDuration: `${duration}s`,
                  }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-400 opacity-70" />
                </div>
              );
            })}
          </div>
          
          {/* Success glow effect */}
          <div className="absolute inset-0 bg-gradient-radial from-green-100/30 via-transparent to-transparent animate-pulse" />
        </>
      )}

      {/* Main success animation */}
      <div className="relative z-10 space-y-6">
        <div className="relative mx-auto w-40 h-40">
          {/* Success circle */}
          <div className={`
            absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full
            ${animationPhase === 'launching' ? 'animate-bounce' :
              animationPhase === 'orbiting' ? 'animate-spin' : 'animate-pulse'}
          `} />
          
          {/* Inner success icon */}
          <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
            <div className="relative">
              {animationPhase === 'success' ? (
                <Award className="w-16 h-16 text-green-600 animate-bounce" />
              ) : (
                <Rocket className={`
                  w-16 h-16 text-green-600
                  ${animationPhase === 'launching' ? 'animate-pulse' : 'animate-spin'}
                `} />
              )}
            </div>
          </div>

          {/* Orbiting success indicators */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
            <CheckCircle2 className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 text-green-500" />
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}>
            <Star className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-6 h-6 text-yellow-500" />
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '5s' }}>
            <Sparkles className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 text-purple-500" />
          </div>
        </div>

        {/* Success message */}
        <div className="space-y-3">
          <h2 className="text-4xl font-bold text-green-600 animate-fadeIn">
            Career Launched! 🚀
          </h2>
          <p className="text-xl text-gray-700 animate-fadeIn animation-delay-200">
            Your professional resume is ready to soar
          </p>
          <p className="text-gray-600 animate-fadeIn animation-delay-400">
            "{resumeName}" has been successfully generated and downloaded
          </p>
        </div>
      </div>

      {/* Mission Achievements */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Mission Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 text-center animate-slideUp"
              style={{ animationDelay: `${index * 200 + 600}ms` }}
            >
              <div className="mx-auto w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                {achievement.icon}
              </div>
              <h4 className="font-semibold text-gray-900 text-sm mb-2">
                {achievement.title}
              </h4>
              <p className="text-xs text-gray-600">
                {achievement.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-center gap-2">
          <TrendingUp className="w-5 h-5 text-launch-blue" />
          Next Steps for Career Success
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nextSteps.map((step, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow animate-slideUp"
              style={{ animationDelay: `${index * 100 + 1000}ms` }}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-3">
                    {step.description}
                  </p>
                  <button className="text-xs font-medium text-launch-blue hover:text-launch-blue/80 transition-colors">
                    {step.action} →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Statistics */}
      <div className="bg-gradient-to-r from-launch-blue/5 to-rocket-orange/5 rounded-lg p-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-launch-blue">100%</div>
            <div className="text-sm text-gray-600">Mission Complete</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">ATS</div>
            <div className="text-sm text-gray-600">Compatible</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-rocket-orange">Ready</div>
            <div className="text-sm text-gray-600">For Launch</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <LaunchButton
          onClick={onComplete}
          className="gap-2 bg-green-600 hover:bg-green-700 text-white animate-fadeIn"
          style={{ animationDelay: '1.5s' }}
        >
          <CheckCircle2 className="w-4 h-4" />
          Mission Complete
        </LaunchButton>
        
        <LaunchButton
// at the top of src/components/export/career-launched-success.tsx
import { useRouter } from 'next/navigation';

export const CareerLaunchedSuccess: React.FC<CareerLaunchedSuccessProps> = ({
  resumeName,
  templateName,
  onComplete,
}) => {
  const router = useRouter();

  return (
    <LaunchButton
      onClick={() => router.refresh()}
      variant="outline"
      className="gap-2 animate-fadeIn"
      style={{ animationDelay: '1.7s' }}
    >
      Launch Another
    </LaunchButton>
  );
};
          variant="outline"
          className="gap-2 animate-fadeIn"
          style={{ animationDelay: '1.7s' }}
        >
          <RefreshCw className="w-4 h-4" />
          Launch Another
        </LaunchButton>
      </div>

      {/* Celebration message */}
      <div className="text-center animate-fadeIn" style={{ animationDelay: '2s' }}>
        <p className="text-sm text-gray-500 italic">
          "Every expert was once a beginner. Every pro was once an amateur. Every icon was once an unknown." 
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Your career journey starts now. Good luck! 🌟
        </p>
      </div>
    </div>
  );
};