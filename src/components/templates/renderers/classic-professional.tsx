'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { 
  Resume, 
  ExperienceItem, 
  EducationItem, 
  SkillsItem, 
  ProjectItem, 
  CertificationItem, 
  CustomSectionItem 
} from '@/lib/types';
import type { Template, TemplateCustomizations } from '@/lib/types/template';

// Union type for all possible section items
type SectionItemUnion = ExperienceItem | EducationItem | SkillsItem | ProjectItem | CertificationItem | CustomSectionItem;

// Type guards for discriminating between section item types
function isExperienceItem(item: SectionItemUnion): item is ExperienceItem {
  return 'company' in item && 'position' in item;
}

function isEducationItem(item: SectionItemUnion): item is EducationItem {
  return 'institution' in item && 'degree' in item;
}

function isSkillsItem(item: SectionItemUnion): item is SkillsItem {
  return 'category' in item && 'skills' in item && Array.isArray((item as SkillsItem).skills);
}

function isProjectItem(item: SectionItemUnion): item is ProjectItem {
  return 'name' in item && 'technologies' in item;
}

function isCertificationItem(item: SectionItemUnion): item is CertificationItem {
  return 'name' in item && 'issuer' in item && !('technologies' in item);
}

function isCustomSectionItem(item: SectionItemUnion): item is CustomSectionItem {
  return 'title' in item && !('company' in item) && !('institution' in item) && !('category' in item) && !('technologies' in item) && !('issuer' in item);
}

interface ClassicProfessionalRendererProps {
  resume: Resume;
  template: Template;
  customizations?: TemplateCustomizations;
  className?: string;
  scale?: number;
  isPrintMode?: boolean;
}

export function ClassicProfessionalRenderer({
  resume,
  template,
  customizations = {},
  className,
  scale = 1,
  isPrintMode = false
}: ClassicProfessionalRendererProps) {
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
        'classic-professional-template bg-white font-serif text-slate-800',
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
      <header className="text-center mb-6 border-b-2 pb-4" style={{ borderColor: appliedColorScheme.borders }}>
        <h1 
          className="text-2xl font-bold mb-2"
          style={{ 
            color: appliedColorScheme.text.primary,
            fontFamily: appliedTypography.headings.fontFamily,
            fontWeight: appliedTypography.headings.fontWeight
          }}
        >
          {resume.personalInfo.fullName}
        </h1>
        
        <div className="flex flex-wrap justify-center gap-2 text-sm" style={{ color: appliedColorScheme.text.secondary }}>
          {resume.personalInfo.email && (
            <span>{resume.personalInfo.email}</span>
          )}
          {resume.personalInfo.phone && (
            <>
              <span>•</span>
              <span>{resume.personalInfo.phone}</span>
            </>
          )}
          {resume.personalInfo.location && (
            <>
              <span>•</span>
              <span>{resume.personalInfo.location}</span>
            </>
          )}
        </div>
        
        {(resume.personalInfo.linkedin || resume.personalInfo.website) && (
          <div className="flex flex-wrap justify-center gap-2 text-sm mt-1" style={{ color: appliedColorScheme.links }}>
            {resume.personalInfo.linkedin && (
              <span>{resume.personalInfo.linkedin}</span>
            )}
            {resume.personalInfo.website && resume.personalInfo.linkedin && <span>•</span>}
            {resume.personalInfo.website && (
              <span>{resume.personalInfo.website}</span>
            )}
          </div>
        )}
        
        {resume.personalInfo.summary && (
          <div className="mt-4 text-sm text-left" style={{ color: appliedColorScheme.text.primary }}>
            <p className="leading-relaxed">{resume.personalInfo.summary}</p>
          </div>
        )}
      </header>

      {/* Sections */}
      <div className="space-y-6">
        {visibleSections.map(section => (
          <section key={section.id} className="mb-6">
            <h2 
              className="text-lg font-bold mb-3 uppercase tracking-wide border-b pb-1"
              style={{ 
                color: appliedColorScheme.primary,
                fontFamily: appliedTypography.headings.fontFamily,
                borderColor: appliedColorScheme.borders
              }}
            >
              {section.title}
            </h2>
            
            {section.type === 'experience' && (
              <div className="space-y-4">
                {(section.items as SectionItemUnion[])?.map((item, index: number) => {
                  if (!isExperienceItem(item)) return null;
                  return (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold" style={{ color: appliedColorScheme.text.primary }}>
                        {item.position}
                      </h3>
                      <span className="text-sm" style={{ color: appliedColorScheme.text.secondary }}>
                        {item.startDate} - {item.endDate || 'Present'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium" style={{ color: appliedColorScheme.text.secondary }}>
                        {item.company}
                      </h4>
                      {item.location && (
                        <span className="text-sm" style={{ color: appliedColorScheme.text.muted }}>
                          {item.location}
                        </span>
                      )}
                    </div>
                    {item.description && Array.isArray(item.description) && (
                      <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: appliedColorScheme.text.primary }}>
                        {item.description.map((desc: string, descIndex: number) => (
                          <li key={descIndex}>{desc}</li>
                        ))}
                      </ul>
                    )}
                    {item.skills && Array.isArray(item.skills) && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.skills.map((skill: string, skillIndex: number) => (
                          <span 
                            key={skillIndex}
                            className="inline-block px-2 py-1 text-xs rounded"
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
                  );
                })}
              </div>
            )}

            {section.type === 'education' && (
              <div className="space-y-3">
                {(section.items as SectionItemUnion[])?.map((item, index: number) => {
                  if (!isEducationItem(item)) return null;
                  return (
                  <div key={index} className="mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold" style={{ color: appliedColorScheme.text.primary }}>
                          {item.degree} {item.field && `in ${item.field}`}
                        </h3>
                        <h4 className="font-medium" style={{ color: appliedColorScheme.text.secondary }}>
                          {item.institution}
                        </h4>
                      </div>
                      <div className="text-right text-sm" style={{ color: appliedColorScheme.text.secondary }}>
                        <div>{item.startDate} - {item.endDate}</div>
                        {item.location && <div>{item.location}</div>}
                      </div>
                    </div>
                    {item.gpa && (
                      <p className="text-sm mt-1" style={{ color: appliedColorScheme.text.muted }}>
                        GPA: {item.gpa}
                      </p>
                    )}
                  </div>
                  );
                })}
              </div>
            )}

            {section.type === 'skills' && (
              <div className="space-y-3">
                {(section.items as SectionItemUnion[])?.map((item, index: number) => {
                  if (!isSkillsItem(item)) return null;
                  return (
                  <div key={index}>
                    <h3 className="font-semibold mb-2" style={{ color: appliedColorScheme.text.primary }}>
                      {item.category}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {item.skills?.map((skill: string, skillIndex: number) => (
                        <span 
                          key={skillIndex}
                          className="inline-block px-2 py-1 text-sm border rounded"
                          style={{ 
                            borderColor: appliedColorScheme.borders,
                            color: appliedColorScheme.text.primary
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  );
                })}
              </div>
            )}

            {section.type === 'projects' && (
              <div className="space-y-4">
                {(section.items as SectionItemUnion[])?.map((item, index: number) => {
                  if (!isProjectItem(item)) return null;
                  return (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold" style={{ color: appliedColorScheme.text.primary }}>
                        {item.name}
                      </h3>
                      {item.startDate && (
                        <span className="text-sm" style={{ color: appliedColorScheme.text.secondary }}>
                          {item.startDate} - {item.endDate || 'Present'}
                        </span>
                      )}
                    </div>
                    {item.url && (
                      <p className="text-sm mb-2" style={{ color: appliedColorScheme.links }}>
                        {item.url}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-sm mb-2" style={{ color: appliedColorScheme.text.primary }}>
                        {item.description}
                      </p>
                    )}
                    {item.technologies && Array.isArray(item.technologies) && (
                      <div className="flex flex-wrap gap-1">
                        {item.technologies.map((tech: string, techIndex: number) => (
                          <span 
                            key={techIndex}
                            className="inline-block px-2 py-1 text-xs rounded"
                            style={{ 
                              backgroundColor: appliedColorScheme.background.secondary,
                              color: appliedColorScheme.text.secondary
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            )}

            {section.type === 'certifications' && (
              <div className="space-y-3">
                {(section.items as SectionItemUnion[])?.map((item, index: number) => {
                  if (!isCertificationItem(item)) return null;
                  return (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold" style={{ color: appliedColorScheme.text.primary }}>
                        {item.name}
                      </h3>
                      <h4 className="font-medium" style={{ color: appliedColorScheme.text.secondary }}>
                        {item.issuer}
                      </h4>
                    </div>
                    <div className="text-right text-sm" style={{ color: appliedColorScheme.text.secondary }}>
                      {item.issueDate && <div>{item.issueDate}</div>}
                      {item.expirationDate && <div>Expires: {item.expirationDate}</div>}
                    </div>
                  </div>
                  );
                })}
              </div>
            )}

            {/* Handle custom sections */}
            {!['experience', 'education', 'skills', 'projects', 'certifications'].includes(section.type) && (
              <div className="space-y-3">
                {(section.items as SectionItemUnion[])?.map((item, index: number) => {
                  if (!isCustomSectionItem(item)) return null;
                  return (
                  <div key={index}>
                    <h3 className="font-semibold" style={{ color: appliedColorScheme.text.primary }}>
                      {item.title}
                    </h3>
                    {item.description && Array.isArray(item.description) && (
                      <div className="text-sm mt-1" style={{ color: appliedColorScheme.text.primary }}>
                        {item.description.map((desc: string, descIndex: number) => (
                          <p key={descIndex}>{desc}</p>
                        ))}
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

export default ClassicProfessionalRenderer;