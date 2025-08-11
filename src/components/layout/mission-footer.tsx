'use client';

import * as React from 'react';
import { Heart, Rocket, Github, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MissionFooterProps {
  showBranding?: boolean;
  showLinks?: boolean;
  showVersion?: boolean;
  version?: string;
  className?: string;
}

export function MissionFooter({
  showBranding = true,
  showLinks = true,
  showVersion = true,
  version = '1.0.0',
  className
}: MissionFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn(
      'bg-slate-800 border-t border-slate-700 py-8 px-6',
      className
    )}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding Section */}
          {showBranding && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-launch-blue to-rocket-orange rounded-md flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg brand-text-gradient">LaunchCV</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Launch your career with precision-crafted, tailored resumes. 
                Every professional deserves a resume that opens doors to new opportunities.
              </p>
              <div className="flex items-center gap-1 text-sm text-slate-400">
                Made with <Heart className="w-4 h-4 text-rocket-orange mx-1" /> for career launchers
              </div>
            </div>
          )}

          {/* Mission Stats/Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-100">Mission Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Careers Launched:</span>
                <span className="mission-text font-medium">∞</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Success Rate:</span>
                <span className="text-green-600 font-medium">100%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Mission Status:</span>
                <span className="accent-text font-medium">Active</span>
              </div>
            </div>
          </div>

          {/* Links and Version */}
          <div className="space-y-4">
            {showLinks && (
              <div>
                <h3 className="font-semibold text-slate-100 mb-3">Mission Control</h3>
                <div className="flex gap-4">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-launch-blue transition-colors duration-200"
                    aria-label="GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-launch-blue transition-colors duration-200"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>
            )}

            {showVersion && (
              <div className="space-y-2 text-sm text-slate-400">
                <div>Version {version}</div>
                <div>© {currentYear} LaunchCV</div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-4">
            <span>Ready for launch? Your next career move starts here.</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="mission-status-indicator" />
            <span>Mission Control Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}