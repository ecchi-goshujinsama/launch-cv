'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { Resume } from '@/lib/types';
import type { Template, TemplateCustomizations } from '@/lib/types/template';
import { Github, ExternalLink, Code, Star, GitFork } from 'lucide-react';

interface TechnicalRendererProps {
  resume: Resume;
  template: Template;
  customizations?: TemplateCustomizations;
  className?: string;
  scale?: number;
  isPrintMode?: boolean;
}

export function TechnicalRenderer({
  resume,
  template,
  customizations = {},
  className,
  scale = 1,
  isPrintMode = false
}: TechnicalRendererProps) {
  // Apply customizations to template
  const appliedColorScheme = {
    ...template.colorScheme,
    ...customizations.colorScheme
  };

  const appliedTypography = {
    ...template.typography,
    ...customizations.typography
  };

  const appliedLayout = {
    ...template.layout,
    ...customizations.layout
  };

  // Get visible sections in order
  const visibleSections = resume.sections
    .filter(section => section.visible)
    .sort((a, b) => a.order - b.order);

  // Helper function to render GitHub links
  const renderGitHubLink = (url: string) => {
    if (url.includes('github.com')) {
      return (
        <div className="flex items-center gap-1 text-sm" style={{ color: appliedColorScheme.links }}>
          <Github className="w-4 h-4" />
          <span>{url}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-sm" style={{ color: appliedColorScheme.links }}>
        <ExternalLink className="w-4 h-4" />
        <span>{url}</span>
      </div>
    );
  };

  // Helper function to render skill proficiency
  const renderSkillLevel = (skill: string, level?: string) => {
    const proficiency = level || 'intermediate';
    const getSkillColor = () => {
      switch (proficiency) {
        case 'expert': case 'advanced': return appliedColorScheme.primary;
        case 'intermediate': return appliedColorScheme.secondary;
        case 'beginner': return appliedColorScheme.text.muted;
        default: return appliedColorScheme.secondary;
      }
    };

    return (
      <div className="flex items-center justify-between p-3 rounded border" 
           style={{ borderColor: appliedColorScheme.borders, backgroundColor: appliedColorScheme.background.secondary }}>
        <span className="font-medium" style={{ color: appliedColorScheme.text.primary }}>
          {skill}
        </span>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: i < (proficiency === 'expert' ? 5 : proficiency === 'advanced' ? 4 : proficiency === 'intermediate' ? 3 : 2)
                    ? getSkillColor()
                    : appliedColorScheme.borders
                }}
              />
            ))}
          </div>
          <span className="text-xs font-medium capitalize" style={{ color: appliedColorScheme.text.secondary }}>
            {proficiency}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div 
      className={cn(
        'technical-template bg-white font-mono text-slate-900',
        'w-full max-w-[8.5in] mx-auto',
        isPrintMode ? 'min-h-[11in]' : 'min-h-[600px]',
        className
      )}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        fontFamily: appliedTypography.body.fontFamily,
        fontSize: appliedTypography.body.fontSize,
        lineHeight: appliedTypography.body.lineHeight,
        padding: `${appliedLayout.margins.top} ${appliedLayout.margins.right} ${appliedLayout.margins.bottom} ${appliedLayout.margins.left}`,
        backgroundColor: appliedColorScheme.background.primary
      }}
    >
      {/* Technical Header Section */}
      <header className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 
              className="text-3xl font-bold mb-2 flex items-center gap-3"
              style={{ 
                color: appliedColorScheme.text.primary,
                fontFamily: appliedTypography.headings.fontFamily,
                fontWeight: appliedTypography.headings.fontWeight
              }}
            >
              <Code className="w-8 h-8" style={{ color: appliedColorScheme.primary }} />
              {resume.personalInfo.fullName}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="space-y-1 text-sm" style={{ color: appliedColorScheme.text.secondary }}>
                {resume.personalInfo.email && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: appliedColorScheme.accent }} />
                    <span>{resume.personalInfo.email}</span>
                  </div>
                )}
                {resume.personalInfo.phone && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: appliedColorScheme.accent }} />
                    <span>{resume.personalInfo.phone}</span>
                  </div>
                )}
                {resume.personalInfo.location && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: appliedColorScheme.accent }} />
                    <span>{resume.personalInfo.location}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                {resume.personalInfo.website && (
                  renderGitHubLink(resume.personalInfo.website)
                )}
                {resume.personalInfo.linkedin && (
                  <div className="flex items-center gap-1 text-sm" style={{ color: appliedColorScheme.links }}>
                    <ExternalLink className="w-4 h-4" />
                    <span>{resume.personalInfo.linkedin}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Technical Badge */}
          <div 
            className="px-4 py-2 rounded-full border-2 flex items-center gap-2"
            style={{ 
              borderColor: appliedColorScheme.primary,
              backgroundColor: appliedColorScheme.background.secondary
            }}
          >
            <Star className="w-4 h-4" style={{ color: appliedColorScheme.primary }} />
            <span className="text-sm font-bold" style={{ color: appliedColorScheme.primary }}>
              DEVELOPER
            </span>
          </div>
        </div>
        
        {resume.personalInfo.summary && (
          <div 
            className="border-l-4 pl-4 py-2"
            style={{ 
              borderColor: appliedColorScheme.primary,
              backgroundColor: appliedColorScheme.background.secondary
            }}
          >
            <p className="text-sm leading-relaxed font-medium" style={{ color: appliedColorScheme.text.primary }}>
              {resume.personalInfo.summary}
            </p>
          </div>
        )}
      </header>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Skills & Tech Stack */}
        <div className="lg:col-span-1 space-y-6">
          {/* Skills Section */}
          {visibleSections.find(s => s.type === 'skills') && (
            <section>
              <h2 
                className="text-lg font-bold mb-4 flex items-center gap-2"
                style={{ 
                  color: appliedColorScheme.primary,
                  fontFamily: appliedTypography.headings.fontFamily
                }}
              >
                <div 
                  className="w-6 h-6 rounded border flex items-center justify-center"
                  style={{ borderColor: appliedColorScheme.primary }}
                >
                  <Code className="w-4 h-4" />
                </div>
                TECH STACK
              </h2>
              
              <div className="space-y-3">
                {visibleSections.find(s => s.type === 'skills')?.items?.map((item: any, index: number) => (
                  <div key={index}>
                    <h3 
                      className="text-xs font-bold uppercase tracking-wider mb-2 px-2 py-1 rounded"
                      style={{ 
                        color: appliedColorScheme.text.primary,
                        backgroundColor: appliedColorScheme.background.secondary
                      }}
                    >
                      {item.category}
                    </h3>
                    <div className="space-y-2">
                      {item.skills?.slice(0, 5).map((skill: string, skillIdx: number) => (
                        <div key={skillIdx}>
                          {renderSkillLevel(skill, 'intermediate')}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Quick Stats */}
          <section 
            className="p-4 rounded border"
            style={{ 
              borderColor: appliedColorScheme.borders,
              backgroundColor: appliedColorScheme.background.secondary
            }}
          >
            <h3 
              className="text-sm font-bold mb-3 flex items-center gap-2"
              style={{ color: appliedColorScheme.primary }}
            >
              <GitFork className="w-4 h-4" />
              QUICK STATS
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span style={{ color: appliedColorScheme.text.secondary }}>Projects:</span>
                <span className="font-mono font-bold" style={{ color: appliedColorScheme.text.primary }}>
                  {visibleSections.find(s => s.type === 'projects')?.items?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: appliedColorScheme.text.secondary }}>Experience:</span>
                <span className="font-mono font-bold" style={{ color: appliedColorScheme.text.primary }}>
                  {visibleSections.find(s => s.type === 'experience')?.items?.length || 0}+ roles
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: appliedColorScheme.text.secondary }}>Skills:</span>
                <span className="font-mono font-bold" style={{ color: appliedColorScheme.text.primary }}>
                  {visibleSections.find(s => s.type === 'skills')?.items?.reduce((acc: number, item: any) => acc + (item.skills?.length || 0), 0) || 0}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Experience & Projects */}
        <div className="lg:col-span-2 space-y-8">
          {visibleSections.filter(s => s.type !== 'skills').map(section => (
            <section key={section.id}>
              <h2 
                className="text-xl font-bold mb-4 flex items-center gap-2"
                style={{ 
                  color: appliedColorScheme.primary,
                  fontFamily: appliedTypography.headings.fontFamily
                }}
              >
                <div 
                  className="w-6 h-6 rounded border flex items-center justify-center"
                  style={{ borderColor: appliedColorScheme.primary }}
                >
                  <span className="text-xs font-bold">{section.title.charAt(0)}</span>
                </div>
                {section.title.toUpperCase()}
              </h2>
              
              {section.type === 'experience' && (
                <div className="space-y-6">
                  {section.items?.map((item: any, index: number) => (
                    <div 
                      key={index}
                      className="p-4 rounded border-l-4"
                      style={{ 
                        borderColor: appliedColorScheme.accent,
                        backgroundColor: appliedColorScheme.background.secondary
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold" style={{ color: appliedColorScheme.text.primary }}>
                            {item.position}
                          </h3>
                          <h4 className="text-base font-semibold" style={{ color: appliedColorScheme.accent }}>
                            {item.company}
                          </h4>
                        </div>
                        <div className="text-right text-xs font-mono">
                          <div className="font-bold" style={{ color: appliedColorScheme.text.secondary }}>
                            {item.startDate} → {item.endDate || 'CURRENT'}
                          </div>
                          {item.location && (
                            <div style={{ color: appliedColorScheme.text.muted }}>
                              {item.location}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {item.description && Array.isArray(item.description) && (
                        <ul className="space-y-1 mb-3 text-sm" style={{ color: appliedColorScheme.text.primary }}>
                          {item.description.map((desc: string, descIndex: number) => (
                            <li key={descIndex} className="flex items-start gap-2">
                              <span 
                                className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                                style={{ backgroundColor: appliedColorScheme.accent }}
                              />
                              <span>{desc}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      {item.skills && Array.isArray(item.skills) && (
                        <div className="flex flex-wrap gap-1">
                          {item.skills.map((skill: string, skillIndex: number) => (
                            <span 
                              key={skillIndex}
                              className="inline-block px-2 py-1 text-xs font-mono font-bold rounded border"
                              style={{ 
                                borderColor: appliedColorScheme.primary,
                                backgroundColor: appliedColorScheme.background.primary,
                                color: appliedColorScheme.primary
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {section.type === 'projects' && (
                <div className="space-y-6">
                  {section.items?.map((item: any, index: number) => (
                    <div 
                      key={index}
                      className="p-4 rounded border"
                      style={{ 
                        borderColor: appliedColorScheme.borders,
                        backgroundColor: appliedColorScheme.background.secondary
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold" style={{ color: appliedColorScheme.text.primary }}>
                            {item.name}
                          </h3>
                          {item.url && renderGitHubLink(item.url)}
                        </div>
                        {item.startDate && (
                          <div className="text-xs font-mono font-bold" style={{ color: appliedColorScheme.text.secondary }}>
                            {item.startDate} → {item.endDate || 'ONGOING'}
                          </div>
                        )}
                      </div>
                      
                      {item.description && (
                        <p className="text-sm mb-3 leading-relaxed" style={{ color: appliedColorScheme.text.primary }}>
                          {item.description}
                        </p>
                      )}
                      
                      {item.technologies && Array.isArray(item.technologies) && (
                        <div className="flex flex-wrap gap-1">
                          {item.technologies.map((tech: string, techIndex: number) => (
                            <span 
                              key={techIndex}
                              className="inline-block px-2 py-1 text-xs font-mono rounded border"
                              style={{ 
                                borderColor: appliedColorScheme.accent,
                                backgroundColor: appliedColorScheme.background.primary,
                                color: appliedColorScheme.accent
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {section.type === 'education' && (
                <div className="space-y-4">
                  {section.items?.map((item: any, index: number) => (
                    <div 
                      key={index}
                      className="p-4 rounded border"
                      style={{ 
                        borderColor: appliedColorScheme.borders,
                        backgroundColor: appliedColorScheme.background.secondary
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold" style={{ color: appliedColorScheme.text.primary }}>
                            {item.degree} {item.field && `in ${item.field}`}
                          </h3>
                          <h4 className="font-semibold" style={{ color: appliedColorScheme.accent }}>
                            {item.institution}
                          </h4>
                          {item.gpa && (
                            <p className="text-sm mt-1" style={{ color: appliedColorScheme.text.muted }}>
                              GPA: {item.gpa}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-xs font-mono">
                          <div className="font-bold" style={{ color: appliedColorScheme.text.secondary }}>
                            {item.startDate} → {item.endDate}
                          </div>
                          {item.location && (
                            <div style={{ color: appliedColorScheme.text.muted }}>
                              {item.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section.type === 'certifications' && (
                <div className="space-y-3">
                  {section.items?.map((item: any, index: number) => (
                    <div 
                      key={index}
                      className="p-3 rounded border flex items-center justify-between"
                      style={{ 
                        borderColor: appliedColorScheme.borders,
                        backgroundColor: appliedColorScheme.background.secondary
                      }}
                    >
                      <div>
                        <h3 className="font-bold" style={{ color: appliedColorScheme.text.primary }}>
                          {item.name}
                        </h3>
                        <h4 className="text-sm font-semibold" style={{ color: appliedColorScheme.accent }}>
                          {item.issuer}
                        </h4>
                        {item.credentialId && (
                          <p className="text-xs mt-1 font-mono" style={{ color: appliedColorScheme.text.muted }}>
                            ID: {item.credentialId}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-xs font-mono">
                        {item.date && (
                          <div className="font-bold" style={{ color: appliedColorScheme.text.secondary }}>
                            {item.date}
                          </div>
                        )}
                        {item.expires && (
                          <div style={{ color: appliedColorScheme.text.muted }}>
                            Expires: {item.expires}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Handle custom sections */}
              {!['experience', 'education', 'skills', 'projects', 'certifications'].includes(section.type) && (
                <div className="space-y-3">
                  {section.items?.map((item: any, index: number) => (
                    <div 
                      key={index}
                      className="p-4 rounded border"
                      style={{ 
                        borderColor: appliedColorScheme.borders,
                        backgroundColor: appliedColorScheme.background.secondary
                      }}
                    >
                      <h3 className="font-bold mb-2" style={{ color: appliedColorScheme.text.primary }}>
                        {item.title || item.name}
                      </h3>
                      {item.description && (
                        <p className="text-sm leading-relaxed" style={{ color: appliedColorScheme.text.primary }}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TechnicalRenderer;