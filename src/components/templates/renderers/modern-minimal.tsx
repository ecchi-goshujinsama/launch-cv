'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { Resume } from '@/lib/types';
import type { Template, TemplateCustomizations } from '@/lib/types/template';

interface ModernMinimalRendererProps {
  resume: Resume;
  template: Template;
  customizations?: TemplateCustomizations;
  className?: string;
  scale?: number;
  isPrintMode?: boolean;
}

export function ModernMinimalRenderer({
  resume,
  template,
  customizations = {},
  className,
  scale = 1,
  isPrintMode = false
}: ModernMinimalRendererProps) {
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
        'modern-minimal-template bg-white font-sans text-gray-900',
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
      {/* Header Section */}
      <header className="mb-12">
        <h1 
          className="text-4xl font-semibold mb-3 tracking-tight"
          style={{ 
            color: appliedColorScheme.text.primary,
            fontFamily: appliedTypography.headings.fontFamily,
            fontWeight: appliedTypography.headings.fontWeight,
            letterSpacing: appliedTypography.headings.letterSpacing
          }}
        >
          {resume.personalInfo.fullName}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-1 text-sm" style={{ color: appliedColorScheme.text.secondary }}>
            {resume.personalInfo.email && (
              <div>{resume.personalInfo.email}</div>
            )}
            {resume.personalInfo.phone && (
              <div>{resume.personalInfo.phone}</div>
            )}
            {resume.personalInfo.location && (
              <div>{resume.personalInfo.location}</div>
            )}
          </div>
          
          <div className="space-y-1 text-sm" style={{ color: appliedColorScheme.links }}>
            {resume.personalInfo.linkedin && (
              <div>{resume.personalInfo.linkedin}</div>
            )}
            {resume.personalInfo.website && (
              <div>{resume.personalInfo.website}</div>
            )}
          </div>
        </div>
        
        {resume.personalInfo.summary && (
          <div 
            className="border-l-4 pl-6 py-2"
            style={{ 
              borderColor: appliedColorScheme.accent,
              backgroundColor: appliedColorScheme.background.secondary
            }}
          >
            <p className="text-base leading-relaxed" style={{ color: appliedColorScheme.text.primary }}>
              {resume.personalInfo.summary}
            </p>
          </div>
        )}
      </header>

      {/* Sections */}
      <div className="space-y-10">
        {visibleSections.map(section => (
          <section key={section.id}>
            <div className="flex items-center mb-6">
              <h2 
                className="text-xl font-medium tracking-wide mr-4"
                style={{ 
                  color: appliedColorScheme.primary,
                  fontFamily: appliedTypography.headings.fontFamily
                }}
              >
                {section.title}
              </h2>
              <div 
                className="flex-1 h-px"
                style={{ backgroundColor: appliedColorScheme.borders }}
              />
            </div>
            
            {section.type === 'experience' && (
              <div className="space-y-8">
                {section.items?.map((item: any, index: number) => (
                  <div key={index} className="relative">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      <div className="lg:col-span-1">
                        <div className="text-sm font-medium mb-1" style={{ color: appliedColorScheme.text.secondary }}>
                          {item.startDate} – {item.endDate || 'Present'}
                        </div>
                        {item.location && (
                          <div className="text-sm" style={{ color: appliedColorScheme.text.muted }}>
                            {item.location}
                          </div>
                        )}
                      </div>
                      
                      <div className="lg:col-span-3">
                        <h3 className="text-lg font-medium mb-1" style={{ color: appliedColorScheme.text.primary }}>
                          {item.position}
                        </h3>
                        <h4 className="text-base font-medium mb-3" style={{ color: appliedColorScheme.accent }}>
                          {item.company}
                        </h4>
                        
                        {item.description && Array.isArray(item.description) && (
                          <ul className="space-y-2 mb-4" style={{ color: appliedColorScheme.text.primary }}>
                            {item.description.map((desc: string, descIndex: number) => (
                              <li key={descIndex} className="flex items-start">
                                <span 
                                  className="inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                                  style={{ backgroundColor: appliedColorScheme.accent }}
                                />
                                <span className="text-sm leading-relaxed">{desc}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        
                        {item.skills && Array.isArray(item.skills) && (
                          <div className="flex flex-wrap gap-2">
                            {item.skills.map((skill: string, skillIndex: number) => (
                              <span 
                                key={skillIndex}
                                className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                                style={{ 
                                  backgroundColor: appliedColorScheme.background.secondary,
                                  color: appliedColorScheme.text.secondary
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'education' && (
              <div className="space-y-6">
                {section.items?.map((item: any, index: number) => (
                  <div key={index} className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-1">
                      <div className="text-sm font-medium" style={{ color: appliedColorScheme.text.secondary }}>
                        {item.startDate} – {item.endDate}
                      </div>
                      {item.location && (
                        <div className="text-sm" style={{ color: appliedColorScheme.text.muted }}>
                          {item.location}
                        </div>
                      )}
                    </div>
                    
                    <div className="lg:col-span-3">
                      <h3 className="text-lg font-medium" style={{ color: appliedColorScheme.text.primary }}>
                        {item.degree} {item.field && `in ${item.field}`}
                      </h3>
                      <h4 className="text-base font-medium" style={{ color: appliedColorScheme.accent }}>
                        {item.institution}
                      </h4>
                      {item.gpa && (
                        <p className="text-sm mt-1" style={{ color: appliedColorScheme.text.muted }}>
                          GPA: {item.gpa}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'skills' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {section.items?.map((item: any, index: number) => (
                  <div key={index}>
                    <h3 className="text-base font-medium mb-3" style={{ color: appliedColorScheme.text.primary }}>
                      {item.category}
                    </h3>
                    <div className="space-y-2">
                      {item.skills?.map((skill: string, skillIndex: number) => (
                        <div key={skillIndex} className="flex items-center">
                          <div 
                            className="w-2 h-2 rounded-full mr-3"
                            style={{ backgroundColor: appliedColorScheme.accent }}
                          />
                          <span className="text-sm" style={{ color: appliedColorScheme.text.primary }}>
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
                  <div key={index}>
                    <div className="mb-3">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-medium" style={{ color: appliedColorScheme.text.primary }}>
                          {item.name}
                        </h3>
                        {item.startDate && (
                          <span className="text-sm font-medium" style={{ color: appliedColorScheme.text.secondary }}>
                            {item.startDate} – {item.endDate || 'Present'}
                          </span>
                        )}
                      </div>
                      {item.url && (
                        <a 
                          href={item.url} 
                          className="text-sm font-medium hover:underline"
                          style={{ color: appliedColorScheme.links }}
                        >
                          {item.url}
                        </a>
                      )}
                    </div>
                    
                    {item.description && (
                      <p className="text-sm mb-4 leading-relaxed" style={{ color: appliedColorScheme.text.primary }}>
                        {item.description}
                      </p>
                    )}
                    
                    {item.technologies && Array.isArray(item.technologies) && (
                      <div className="flex flex-wrap gap-2">
                        {item.technologies.map((tech: string, techIndex: number) => (
                          <span 
                            key={techIndex}
                            className="inline-block px-3 py-1 text-xs font-medium rounded-full border"
                            style={{ 
                              borderColor: appliedColorScheme.borders,
                              color: appliedColorScheme.text.secondary
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
                  <div key={index} className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-medium" style={{ color: appliedColorScheme.text.primary }}>
                        {item.name}
                      </h3>
                      <h4 className="text-sm font-medium" style={{ color: appliedColorScheme.accent }}>
                        {item.issuer}
                      </h4>
                      {item.credentialId && (
                        <p className="text-xs mt-1" style={{ color: appliedColorScheme.text.muted }}>
                          Credential ID: {item.credentialId}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm font-medium" style={{ color: appliedColorScheme.text.secondary }}>
                      {item.date && <div>{item.date}</div>}
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
                  <div key={index}>
                    <h3 className="text-base font-medium mb-2" style={{ color: appliedColorScheme.text.primary }}>
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
  );
}

export default ModernMinimalRenderer;