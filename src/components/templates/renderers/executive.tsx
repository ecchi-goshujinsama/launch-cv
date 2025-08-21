'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { Resume } from '@/lib/types';
import type { Template, TemplateCustomizations } from '@/lib/types/template';

interface ExecutiveRendererProps {
  resume: Resume;
  template: Template;
  customizations?: TemplateCustomizations;
  className?: string;
  scale?: number;
  isPrintMode?: boolean;
}

export function ExecutiveRenderer({
  resume,
  template,
  customizations = {},
  className,
  scale = 1,
  isPrintMode = false
}: ExecutiveRendererProps) {
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

  return (
    <div 
      className={cn(
        'executive-template bg-white text-slate-900',
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
      {/* Bold Header Section */}
      <header 
        className="relative mb-10 p-8 -mx-8"
        style={{ 
          background: `linear-gradient(135deg, ${appliedColorScheme.primary} 0%, ${appliedColorScheme.secondary} 100%)`,
          color: 'white'
        }}
      >
        <div className="relative z-10">
          <h1 
            className="text-5xl font-bold mb-2 tracking-tight"
            style={{ 
              fontFamily: appliedTypography.headings.fontFamily,
              fontWeight: appliedTypography.headings.fontWeight
            }}
          >
            {resume.personalInfo.fullName}
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              {resume.personalInfo.email && (
                {resume.personalInfo.email && (
                  <div className="flex items-center text-white/90">
                    <a
                      href={`mailto:${resume.personalInfo.email}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {resume.personalInfo.email}
                    </a>
                  </div>
                )}
                {resume.personalInfo.phone && (
                  <div className="flex items-center text-white/90">
                    <a
                      href={`tel:${resume.personalInfo.phone}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {resume.personalInfo.phone}
                    </a>
                  </div>
                )}
                {resume.personalInfo.location && (
                  <div className="flex items-center text-white/90">
                    <span className="text-sm font-medium">
                      {resume.personalInfo.location}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                {resume.personalInfo.linkedin && (
                  <div className="flex items-center">
                    <a
                      href={
                        resume.personalInfo.linkedin.startsWith('http')
                          ? resume.personalInfo.linkedin
                          : `https://linkedin.com/in/${resume.personalInfo.linkedin}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-white/90 hover:underline"
                    >
                      {resume.personalInfo.linkedin}
                    </a>
                  </div>
                )}
                {resume.personalInfo.website && (
                  <div className="flex items-center">
                    <a
                      href={
                        resume.personalInfo.website.startsWith('http')
                          ? resume.personalInfo.website
                          : `https://${resume.personalInfo.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-white/90 hover:underline"
                    >
                      {resume.personalInfo.website}
                    </a>
                  </div>
                )}
              </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div 
          className="absolute top-0 right-0 w-32 h-32 opacity-10"
          style={{
            background: `radial-gradient(circle, ${appliedColorScheme.accent} 0%, transparent 70%)`
          }}
        />
      </header>

      {/* Executive Summary */}
      {resume.personalInfo.summary && (
        <section className="mb-10">
          <div 
            className="border-l-4 pl-6 py-4"
            style={{ 
              borderColor: appliedColorScheme.accent,
              backgroundColor: appliedColorScheme.background.secondary
            }}
          >
            <h2 
              className="text-lg font-bold mb-3 uppercase tracking-wider"
              style={{ 
                color: appliedColorScheme.primary,
                fontFamily: appliedTypography.headings.fontFamily
              }}
            >
              Executive Summary
            </h2>
            <p 
              className="text-base leading-relaxed font-medium"
              style={{ color: appliedColorScheme.text.primary }}
            >
              {resume.personalInfo.summary}
            </p>
          </div>
        </section>
      )}

      {/* Sections */}
      <div className="space-y-10">
        {visibleSections.map(section => (
          <section key={section.id}>
            <div className="mb-6">
              <div className="flex items-center">
                <div 
                  className="w-1 h-8 mr-4"
                  style={{ backgroundColor: appliedColorScheme.accent }}
                />
                <h2 
                  className="text-2xl font-bold uppercase tracking-wider"
                  style={{ 
                    color: appliedColorScheme.primary,
                    fontFamily: appliedTypography.headings.fontFamily
                  }}
                >
                  {section.title}
                </h2>
              </div>
              <div 
                className="w-full h-px mt-3"
                style={{ backgroundColor: appliedColorScheme.borders }}
              />
            </div>
            
            {section.type === 'experience' && (
              <div className="space-y-8">
                {section.items?.map((item: any, index: number) => (
                  <div 
                    key={index}
                    className="p-6 rounded-lg border-l-4"
                    style={{ 
                      backgroundColor: appliedColorScheme.background.secondary,
                      borderColor: appliedColorScheme.accent
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-1" style={{ color: appliedColorScheme.text.primary }}>
                          {item.position}
                        </h3>
                        <h4 
                          className="text-lg font-semibold"
                          style={{ color: appliedColorScheme.accent }}
                        >
                          {item.company}
                        </h4>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold" style={{ color: appliedColorScheme.text.secondary }}>
                          {item.startDate} – {item.endDate || 'Present'}
                        </div>
                        {item.location && (
                          <div className="text-sm" style={{ color: appliedColorScheme.text.muted }}>
                            {item.location}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {item.description && Array.isArray(item.description) && (
                      <ul className="space-y-3 mb-4" style={{ color: appliedColorScheme.text.primary }}>
                        {item.description.map((desc: string, descIndex: number) => (
                          <li key={descIndex} className="flex items-start">
                            <div 
                              className="w-2 h-2 rounded-full mt-2 mr-4 flex-shrink-0"
                              style={{ backgroundColor: appliedColorScheme.accent }}
                            />
                            <span className="text-sm font-medium leading-relaxed">{desc}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {item.skills && Array.isArray(item.skills) && (
                      <div className="flex flex-wrap gap-2">
                        {item.skills.map((skill: string, skillIndex: number) => (
                          <span 
                            key={skillIndex}
                            className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border-2"
                            style={{ 
                              borderColor: appliedColorScheme.accent,
                              color: appliedColorScheme.accent
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

            {section.type === 'education' && (
              <div className="space-y-6">
                {section.items?.map((item: any, index: number) => (
                  <div 
                    key={index}
                    className="p-6 rounded-lg"
                    style={{ backgroundColor: appliedColorScheme.background.secondary }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold" style={{ color: appliedColorScheme.text.primary }}>
                          {item.degree} {item.field && `in ${item.field}`}
                        </h3>
                        <h4 className="text-base font-semibold" style={{ color: appliedColorScheme.accent }}>
                          {item.institution}
                        </h4>
                        {item.gpa && (
                          <p className="text-sm mt-2 font-medium" style={{ color: appliedColorScheme.text.muted }}>
                            GPA: {item.gpa}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold" style={{ color: appliedColorScheme.text.secondary }}>
                          {item.startDate} – {item.endDate}
                        </div>
                        {item.location && (
                          <div className="text-sm" style={{ color: appliedColorScheme.text.muted }}>
                            {item.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'skills' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items?.map((item: any, index: number) => (
                  <div 
                    key={index}
                    className="p-6 rounded-lg"
                    style={{ backgroundColor: appliedColorScheme.background.secondary }}
                  >
                    <h3 
                      className="text-lg font-bold mb-4 uppercase tracking-wider"
                      style={{ color: appliedColorScheme.accent }}
                    >
                      {item.category}
                    </h3>
                    <div className="space-y-2">
                         {item.url && (
                           <a 
                             href={item.url} 
                             target="_blank"
                             rel="noopener noreferrer"
                             className="text-sm font-semibold hover:underline"
                             style={{ color: appliedColorScheme.accent }}
                           >
                             {item.url}
                           </a>
                         )}
                          <span className="text-sm font-medium" style={{ color: appliedColorScheme.text.primary }}>
                            {skill}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'projects' && (
              <div className="space-y-8">
                {section.items?.map((item: any, index: number) => (
                  <div 
                    key={index}
                    className="p-6 rounded-lg border"
                    style={{ 
                      backgroundColor: appliedColorScheme.background.secondary,
                      borderColor: appliedColorScheme.borders
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2" style={{ color: appliedColorScheme.text.primary }}>
                          {item.name}
                        </h3>
                        {item.url && (
                          <a 
                            href={item.url} 
                            className="text-sm font-semibold hover:underline"
                            style={{ color: appliedColorScheme.accent }}
                          >
                            {item.url}
                          </a>
                        )}
                      </div>
                      {item.startDate && (
                        <div className="text-sm font-bold" style={{ color: appliedColorScheme.text.secondary }}>
                          {item.startDate} – {item.endDate || 'Present'}
                        </div>
                      )}
                    </div>
                    
                    {item.description && (
                      <p className="text-sm mb-4 leading-relaxed font-medium" style={{ color: appliedColorScheme.text.primary }}>
                        {item.description}
                      </p>
                    )}
                    
                    {item.technologies && Array.isArray(item.technologies) && (
                      <div className="flex flex-wrap gap-2">
                        {item.technologies.map((tech: string, techIndex: number) => (
                          <span 
                            key={techIndex}
                            className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded border-2"
                            style={{ 
                              borderColor: appliedColorScheme.accent,
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

            {section.type === 'certifications' && (
              <div className="space-y-4">
                {section.items?.map((item: any, index: number) => (
                  <div 
                    key={index}
                    className="p-6 rounded-lg flex items-center justify-between"
                    style={{ backgroundColor: appliedColorScheme.background.secondary }}
                  >
                    <div>
                      <h3 className="text-lg font-bold" style={{ color: appliedColorScheme.text.primary }}>
                        {item.name}
                      </h3>
                      <h4 className="text-base font-semibold" style={{ color: appliedColorScheme.accent }}>
                        {item.issuer}
                      </h4>
                      {item.credentialId && (
                        <p className="text-xs mt-1 font-medium" style={{ color: appliedColorScheme.text.muted }}>
                          Credential ID: {item.credentialId}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {item.date && (
                        <div className="text-sm font-bold" style={{ color: appliedColorScheme.text.secondary }}>
                          {item.date}
                        </div>
                      )}
                      {item.expires && (
                        <div className="text-xs" style={{ color: appliedColorScheme.text.muted }}>
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
              <div className="space-y-4">
                {section.items?.map((item: any, index: number) => (
                  <div 
                    key={index}
                    className="p-6 rounded-lg"
                    style={{ backgroundColor: appliedColorScheme.background.secondary }}
                  >
                    <h3 className="text-lg font-bold mb-2" style={{ color: appliedColorScheme.text.primary }}>
                      {item.title || item.name}
                    </h3>
                    {item.description && (
                      <p className="text-sm leading-relaxed font-medium" style={{ color: appliedColorScheme.text.primary }}>
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
  );
}

export default ExecutiveRenderer;