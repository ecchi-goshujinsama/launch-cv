'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { Resume } from '@/lib/types';
import type { Template, TemplateCustomizations } from '@/lib/types/template';
import { 
  Palette, 
  Sparkles, 
  Heart, 
  Zap, 
  Star, 
  Award,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Globe,
  ExternalLink
} from 'lucide-react';

interface CreativeRendererProps {
  resume: Resume;
  template: Template;
  customizations?: TemplateCustomizations;
  className?: string;
  scale?: number;
  isPrintMode?: boolean;
}

export function CreativeRenderer({
  resume,
  template,
  customizations = {},
  className,
  scale = 1,
  isPrintMode = false
}: CreativeRendererProps) {
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

  // Helper function to render decorative elements
  const renderDecorative = (type: 'star' | 'sparkle' | 'heart' | 'zap' | 'award', size = 4) => {
    const icons = {
      star: Star,
      sparkle: Sparkles,
      heart: Heart,
      zap: Zap,
      award: Award
    };
    
    // Map size to Tailwind classes to avoid dynamic class generation issues
    const sizeClasses = {
      3: 'w-3 h-3',
      4: 'w-4 h-4',
      5: 'w-5 h-5',
      6: 'w-6 h-6',
      8: 'w-8 h-8'
    };
    
    const Icon = icons[type];
    const className = sizeClasses[size as keyof typeof sizeClasses] || 'w-4 h-4';
    
    // Defensive check to ensure Icon exists
    if (!Icon) {
      console.warn(`Icon not found for type: ${type}`);
      return null;
    }
    
    return <Icon className={className} style={{ color: appliedColorScheme.accent }} />;
  };

  // Helper function to render gradient backgrounds
  const getGradientStyle = (direction = '135deg', opacity = 0.1) => ({
    background: `linear-gradient(${direction}, ${appliedColorScheme.primary}${Math.round(opacity * 255)
      .toString(16)
      .padStart(2, '0')}, ${appliedColorScheme.secondary}${Math.round(opacity * 255)
      .toString(16)
      .padStart(2, '0')}, ${appliedColorScheme.accent}${Math.round(opacity * 255)
      .toString(16)
      .padStart(2, '0')})`
  });

  return (
    <div 
      className={cn(
        'creative-template bg-white text-gray-900 relative overflow-hidden',
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
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient shapes */}
        <div 
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-5"
          style={getGradientStyle('45deg', 0.1)}
        />
        <div 
          className="absolute -bottom-20 -left-20 w-32 h-32 rounded-full opacity-5"
          style={getGradientStyle('225deg', 0.1)}
        />
        
        {/* Scattered decorative icons */}
        <div className="absolute top-1/4 right-1/4 opacity-10">
          {renderDecorative('sparkle', 6)}
        </div>
        <div className="absolute top-3/4 left-1/4 opacity-10">
          {renderDecorative('star', 4)}
        </div>
      </div>

      {/* Creative Header Section */}
      <header className="relative mb-8">
        <div className="flex items-center justify-between mb-6">
          {/* Main Header */}
          <div className="flex-1">
            <div className="relative">
              <h1 
                className="text-4xl font-black mb-3 relative inline-block"
                style={{ 
                  color: appliedColorScheme.text.primary,
                  fontFamily: appliedTypography.headings.fontFamily,
                  fontWeight: appliedTypography.headings.fontWeight,
                  letterSpacing: appliedTypography.headings.letterSpacing
                }}
              >
                {resume.personalInfo.fullName}
                
                {/* Creative underline */}
                <div 
                  className="absolute -bottom-1 left-0 h-2 rounded-full"
                  style={{ 
                    background: `linear-gradient(90deg, ${appliedColorScheme.primary}, ${appliedColorScheme.accent})`,
                    width: '60%'
                  }}
                />
              </h1>
              
              {/* Floating decorative element */}
              <div className="absolute -top-2 -right-8">
                {renderDecorative('sparkle', 8)}
              </div>
            </div>
            
            {resume.personalInfo.summary && (
              <div 
                className="relative p-4 rounded-xl border-l-4 mb-4"
                style={{ 
                  borderColor: appliedColorScheme.primary,
                  backgroundColor: appliedColorScheme.background.secondary
                }}
              >
                <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white"
                    style={{ backgroundColor: appliedColorScheme.primary }}
                  />
                </div>
                <p 
                  className="text-base leading-relaxed font-medium italic"
                  style={{ color: appliedColorScheme.text.primary }}
                >
                  "{resume.personalInfo.summary}"
                </p>
              </div>
            )}
          </div>
          
          {/* Creative Contact Card */}
          <div 
            className="ml-8 p-6 rounded-2xl shadow-lg relative overflow-hidden"
            style={{ 
              backgroundColor: appliedColorScheme.background.secondary,
              border: `2px solid ${appliedColorScheme.borders}`
            }}
          >
            {/* Card background gradient */}
            <div 
              className="absolute inset-0 opacity-5"
              style={getGradientStyle('135deg', 0.1)}
            />
            
            <div className="relative space-y-3">
              <div className="flex items-center justify-center mb-4">
                <div 
                  className="p-3 rounded-full"
                  style={{ backgroundColor: appliedColorScheme.primary }}
                >
                  <Palette className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                {resume.personalInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" style={{ color: appliedColorScheme.accent }} />
                    <span style={{ color: appliedColorScheme.text.secondary }}>
                      {resume.personalInfo.email}
                    </span>
                  </div>
                )}
                {resume.personalInfo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" style={{ color: appliedColorScheme.accent }} />
                    <span style={{ color: appliedColorScheme.text.secondary }}>
                      {resume.personalInfo.phone}
                    </span>
                  </div>
                )}
                {resume.personalInfo.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" style={{ color: appliedColorScheme.accent }} />
                    <span style={{ color: appliedColorScheme.text.secondary }}>
                      {resume.personalInfo.location}
                    </span>
                  </div>
                )}
                {resume.personalInfo.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" style={{ color: appliedColorScheme.accent }} />
                    <span style={{ color: appliedColorScheme.text.secondary }}>
                      {resume.personalInfo.website}
                    </span>
                  </div>
                )}
                {resume.personalInfo.linkedin && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" style={{ color: appliedColorScheme.accent }} />
                    <span style={{ color: appliedColorScheme.text.secondary }}>
                      LinkedIn
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Creative Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Sidebar - Skills & Quick Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills Section with Creative Layout */}
          {visibleSections.find(s => s.type === 'skills') && (
            <section 
              className="p-6 rounded-2xl relative overflow-hidden"
              style={{ 
                backgroundColor: appliedColorScheme.background.secondary,
                border: `1px solid ${appliedColorScheme.borders}`
              }}
            >
              {/* Section background pattern */}
              <div 
                className="absolute inset-0 opacity-5"
                style={getGradientStyle('45deg', 0.05)}
              />
              
              <div className="relative">
                <h2 
                  className="text-xl font-bold mb-4 flex items-center gap-3"
                  style={{ 
                    color: appliedColorScheme.primary,
                    fontFamily: appliedTypography.headings.fontFamily
                  }}
                >
                  <div className="flex gap-1">
                    {renderDecorative('star', 5)}
                    {renderDecorative('sparkle', 4)}
                  </div>
                  Creative Skills
                </h2>
                
                <div className="space-y-4">
                  {(() => {
                    const skillsSection = visibleSections.find(s => s.type === 'skills');
                    if (!Array.isArray(skillsSection?.items)) return null;
                    
                    return skillsSection.items.map((item: any, index: number) => (
                      <div key={index}>
                        <h3 
                          className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                          style={{ color: appliedColorScheme.text.primary }}
                        >
                          {renderDecorative('heart', 4)}
                          {item.category}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {item.skills && Array.isArray(item.skills) 
                            ? item.skills.map((skill: string, skillIndex: number) => (
                                <span 
                                  key={skillIndex}
                                  className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium transition-all hover:scale-105"
                                  style={{ 
                                    backgroundColor: `${appliedColorScheme.primary}15`,
                                    color: appliedColorScheme.primary,
                                    border: `1px solid ${appliedColorScheme.primary}30`
                                  }}
                                >
                                  {renderDecorative('zap', 3)}
                                  {skill}
                                </span>
                              ))
                            : null
                          }
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </section>
          )}

          {/* Creative Stats Box */}
          <section 
            className="p-6 rounded-2xl relative overflow-hidden"
            style={{ 
              backgroundColor: appliedColorScheme.background.secondary,
              border: `1px solid ${appliedColorScheme.borders}`
            }}
          >
            <div 
              className="absolute inset-0 opacity-5"
              style={getGradientStyle('225deg', 0.05)}
            />
            
            <div className="relative">
              <h3 
                className="text-lg font-bold mb-4 flex items-center gap-2"
                style={{ color: appliedColorScheme.primary }}
              >
                {renderDecorative('award', 5)}
                Portfolio Stats
              </h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div 
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: appliedColorScheme.background.primary }}
                >
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: appliedColorScheme.primary }}
                  >
                    {visibleSections.find(s => s.type === 'projects')?.items?.length || 0}
                  </div>
                  <div className="text-xs" style={{ color: appliedColorScheme.text.muted }}>
                    Projects
                  </div>
                </div>
                <div 
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: appliedColorScheme.background.primary }}
                >
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: appliedColorScheme.secondary }}
                  >
                    {visibleSections.find(s => s.type === 'experience')?.items?.length || 0}+
                  </div>
                  <div className="text-xs" style={{ color: appliedColorScheme.text.muted }}>
                    Roles
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {visibleSections.filter(s => s.type !== 'skills').map(section => (
            <section key={section.id} className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="p-3 rounded-full"
                  style={{ backgroundColor: `${appliedColorScheme.primary}15` }}
                >
                  {renderDecorative('sparkle', 6)}
                </div>
                <h2 
                  className="text-2xl font-bold"
                  style={{ 
                    color: appliedColorScheme.primary,
                    fontFamily: appliedTypography.headings.fontFamily
                  }}
                >
                  {section.title}
                </h2>
                <div 
                  className="flex-1 h-1 rounded-full ml-4"
                  style={{ 
                    background: `linear-gradient(90deg, ${appliedColorScheme.primary}, transparent)`
                  }}
                />
              </div>
              
              {section.type === 'experience' && (
                <div className="space-y-6">
                  {section.items?.map((item: any, index: number) => (
                    <div 
                      key={index}
                      className="relative p-6 rounded-2xl border transition-all hover:shadow-lg"
                      style={{ 
                        borderColor: appliedColorScheme.borders,
                        backgroundColor: appliedColorScheme.background.secondary
                      }}
                    >
                      {/* Creative border element */}
                      <div 
                        className="absolute left-0 top-0 w-1 h-full rounded-r"
                        style={{ backgroundColor: appliedColorScheme.accent }}
                      />
                      
                      <div className="pl-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 
                              className="text-xl font-bold mb-1"
                              style={{ color: appliedColorScheme.text.primary }}
                            >
                              {item.position}
                            </h3>
                            <h4 
                              className="text-lg font-semibold flex items-center gap-2"
                              style={{ color: appliedColorScheme.primary }}
                            >
                              {renderDecorative('zap', 4)}
                              {item.company}
                            </h4>
                          </div>
                          <div className="text-right text-sm font-medium">
                            <div 
                              className="flex items-center gap-1 mb-1"
                              style={{ color: appliedColorScheme.text.secondary }}
                            >
                              <Calendar className="w-4 h-4" />
                              {item.startDate} - {item.endDate || 'Present'}
                            </div>
                            {item.location && (
                              <div 
                                className="flex items-center gap-1"
                                style={{ color: appliedColorScheme.text.muted }}
                              >
                                <MapPin className="w-4 h-4" />
                                {item.location}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {item.description && Array.isArray(item.description) && (
                          <ul className="space-y-2 mb-4 text-sm" style={{ color: appliedColorScheme.text.primary }}>
                            {item.description.map((desc: string, descIndex: number) => (
                              <li key={descIndex} className="flex items-start gap-3">
                                {renderDecorative('star', 4)}
                                <span>{desc}</span>
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
                                  backgroundColor: `${appliedColorScheme.accent}20`,
                                  color: appliedColorScheme.accent
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section.type === 'projects' && (
                <div className="space-y-6">
                  {section.items?.map((item: any, index: number) => (
                    <div 
                      key={index}
                      className="relative p-6 rounded-2xl border overflow-hidden"
                      style={{ 
                        borderColor: appliedColorScheme.borders,
                        backgroundColor: appliedColorScheme.background.secondary
                      }}
                    >
                      {/* Creative corner accent */}
                      <div 
                        className="absolute top-0 right-0 w-16 h-16 transform rotate-45 translate-x-8 -translate-y-8"
                        style={{ backgroundColor: `${appliedColorScheme.accent}10` }}
                      />
                      
                      <div className="relative">
                        <div className="flex justify-between items-start mb-3">
                          <h3 
                            className="text-lg font-bold flex items-center gap-2"
                            style={{ color: appliedColorScheme.text.primary }}
                          >
                            {renderDecorative('sparkle', 5)}
                            {item.name}
                          </h3>
                          {item.startDate && (
                            <div 
                              className="text-xs font-medium"
                              style={{ color: appliedColorScheme.text.secondary }}
                            >
                              {item.startDate} - {item.endDate || 'Ongoing'}
                            </div>
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
                                  borderColor: appliedColorScheme.primary,
                                  color: appliedColorScheme.primary,
                                  backgroundColor: `${appliedColorScheme.primary}10`
                                }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section.type === 'education' && (
                <div className="space-y-4">
                  {section.items?.map((item: any, index: number) => (
                    <div 
                      key={index}
                      className="p-6 rounded-2xl border"
                      style={{ 
                        borderColor: appliedColorScheme.borders,
                        backgroundColor: appliedColorScheme.background.secondary
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 
                            className="font-bold flex items-center gap-2"
                            style={{ color: appliedColorScheme.text.primary }}
                          >
                            {renderDecorative('award', 4)}
                            {item.degree} {item.field && `in ${item.field}`}
                          </h3>
                          <h4 className="font-semibold" style={{ color: appliedColorScheme.primary }}>
                            {item.institution}
                          </h4>
                          {item.gpa && (
                            <p className="text-sm mt-1" style={{ color: appliedColorScheme.text.muted }}>
                              GPA: {item.gpa}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-medium" style={{ color: appliedColorScheme.text.secondary }}>
                            {item.startDate} - {item.endDate}
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

              {/* Handle custom sections */}
              {!['experience', 'education', 'skills', 'projects'].includes(section.type) && (
                <div className="space-y-4">
                  {section.items?.map((item: any, index: number) => (
                    <div 
                      key={index}
                      className="p-6 rounded-2xl border"
                      style={{ 
                        borderColor: appliedColorScheme.borders,
                        backgroundColor: appliedColorScheme.background.secondary
                      }}
                    >
                      <h3 
                        className="font-bold mb-2 flex items-center gap-2"
                        style={{ color: appliedColorScheme.text.primary }}
                      >
                        {renderDecorative('sparkle', 4)}
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

export default CreativeRenderer;