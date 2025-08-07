'use client';

import * as React from 'react';
import { useResumeStore } from '@/lib/stores/resume-store';
import { cn } from '@/lib/utils';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin,
  // Calendar,
  Building,
  GraduationCap,
  Code,
  Award,
  Briefcase
} from 'lucide-react';
import type { 
  Resume, 
  ExperienceItem, 
  EducationItem, 
  SkillsItem, 
  ProjectItem,
  CertificationItem 
} from '@/lib/types';

interface ResumePreviewProps {
  resume?: Resume | null;
  className?: string;
  scale?: number;
  templateId?: string;
}

export function ResumePreview({ 
  resume: providedResume, 
  className,
  scale = 1,
  templateId 
}: ResumePreviewProps) {
  const { currentResume, selectedTemplate } = useResumeStore();
  
  // Use provided resume or current resume from store
  const resume = providedResume || currentResume;
  const activeTemplate = templateId || selectedTemplate || 'classic-professional';

  if (!resume) {
    return (
      <div className={cn(
        "w-full h-full flex items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-lg",
        className
      )}>
        <div className="text-center text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No Resume Data</p>
          <p className="text-sm">Create or import a resume to see preview</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn("bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden", className)}
      style={{ transform: `scale(${scale})` }}
    >
      {/* Render template based on activeTemplate */}
      {activeTemplate === 'classic-professional' && <ClassicProfessionalTemplate resume={resume} />}
      {activeTemplate === 'modern-minimal' && <ModernMinimalTemplate resume={resume} />}
      {activeTemplate === 'executive' && <ExecutiveTemplate resume={resume} />}
      {activeTemplate === 'technical' && <TechnicalTemplate resume={resume} />}
      {activeTemplate === 'creative' && <CreativeTemplate resume={resume} />}
    </div>
  );
}

// Classic Professional Template
function ClassicProfessionalTemplate({ resume }: { resume: Resume }) {
  const experienceSection = resume.sections.find(s => s.type === 'experience');
  const educationSection = resume.sections.find(s => s.type === 'education');
  const skillsSection = resume.sections.find(s => s.type === 'skills');
  const projectsSection = resume.sections.find(s => s.type === 'projects');
  const certificationsSection = resume.sections.find(s => s.type === 'certifications');

  return (
    <div className="w-full max-w-[8.5in] mx-auto bg-white p-8 text-sm leading-relaxed">
      {/* Header */}
      <div className="border-b-2 border-launch-blue pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {resume.personalInfo.fullName || 'Your Name'}
        </h1>
        
        {/* Contact Information */}
        <div className="flex flex-wrap items-center gap-4 text-gray-600">
          {resume.personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span>{resume.personalInfo.email}</span>
            </div>
          )}
          {resume.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>{resume.personalInfo.phone}</span>
            </div>
          )}
          {resume.personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{resume.personalInfo.location}</span>
            </div>
          )}
          {resume.personalInfo.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="w-4 h-4" />
              <span>{resume.personalInfo.linkedin}</span>
            </div>
          )}
          {resume.personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <span>{resume.personalInfo.website}</span>
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {resume.personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-launch-blue mb-3 uppercase tracking-wide">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {resume.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience Section */}
      {experienceSection && experienceSection.visible && experienceSection.items.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-launch-blue mb-3 uppercase tracking-wide">
            {experienceSection.title}
          </h2>
          <div className="space-y-4">
            {experienceSection.items.map((item) => {
              const experience = item as ExperienceItem;
              return (
                <div key={experience.id} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900">{experience.position}</h3>
                    <span className="text-gray-600 text-xs">
                      {experience.startDate} - {experience.endDate || 'Present'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2 text-gray-600">
                    <Building className="w-4 h-4" />
                    <span className="font-medium">{experience.company}</span>
                    {experience.location && (
                      <>
                        <span>•</span>
                        <span>{experience.location}</span>
                      </>
                    )}
                  </div>
                  {experience.description && experience.description.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                      {experience.description.map((desc, index) => (
                        <li key={index}>{desc}</li>
                      ))}
                    </ul>
                  )}
                  {experience.skills && experience.skills.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">Technologies: </span>
                      <span className="text-xs text-gray-600">
                        {experience.skills.join(' • ')}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Education Section */}
      {educationSection && educationSection.visible && educationSection.items.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-launch-blue mb-3 uppercase tracking-wide">
            {educationSection.title}
          </h2>
          <div className="space-y-3">
            {educationSection.items.map((item) => {
              const education = item as EducationItem;
              return (
                <div key={education.id} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {education.degree} {education.field && `in ${education.field}`}
                    </h3>
                    <span className="text-gray-600 text-xs">
                      {education.startDate} - {education.endDate || 'Present'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <GraduationCap className="w-4 h-4" />
                    <span className="font-medium">{education.institution}</span>
                    {education.location && (
                      <>
                        <span>•</span>
                        <span>{education.location}</span>
                      </>
                    )}
                  </div>
                  {education.gpa && (
                    <p className="text-gray-600 text-sm mt-1">GPA: {education.gpa}</p>
                  )}
                  {education.honors && education.honors.length > 0 && (
                    <p className="text-gray-600 text-sm mt-1">
                      Honors: {education.honors.join(', ')}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {skillsSection && skillsSection.visible && skillsSection.items.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-launch-blue mb-3 uppercase tracking-wide">
            {skillsSection.title}
          </h2>
          <div className="space-y-2">
            {skillsSection.items.map((item) => {
              const skillsItem = item as SkillsItem;
              return (
                <div key={skillsItem.id} className="flex items-start gap-3">
                  <Code className="w-4 h-4 mt-1 text-gray-500" />
                  <div>
                    <span className="font-medium text-gray-900">{skillsItem.category}: </span>
                    <span className="text-gray-700">{skillsItem.skills.join(' • ')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Projects Section */}
      {projectsSection && projectsSection.visible && projectsSection.items.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-launch-blue mb-3 uppercase tracking-wide">
            {projectsSection.title}
          </h2>
          <div className="space-y-4">
            {projectsSection.items.map((item) => {
              const project = item as ProjectItem;
              return (
                <div key={project.id} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <span className="text-gray-600 text-xs">
                      {project.startDate} - {project.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mb-2">
                      <span className="text-xs text-gray-500">Technologies: </span>
                      <span className="text-xs text-gray-600">
                        {project.technologies.join(' • ')}
                      </span>
                    </div>
                  )}
                  {project.highlights && project.highlights.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2 text-sm">
                      {project.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Certifications Section */}
      {certificationsSection && certificationsSection.visible && certificationsSection.items.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-launch-blue mb-3 uppercase tracking-wide">
            {certificationsSection.title}
          </h2>
          <div className="space-y-2">
            {certificationsSection.items.map((item) => {
              const cert = item as CertificationItem;
              return (
                <div key={cert.id} className="flex items-start gap-3">
                  <Award className="w-4 h-4 mt-1 text-gray-500" />
                  <div>
                    <span className="font-medium text-gray-900">{cert.name}</span>
                    <span className="text-gray-600"> - {cert.issuer}</span>
                    {cert.issueDate && (
                      <span className="text-gray-500 text-xs ml-2">
                        ({cert.issueDate})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Placeholder templates - will be expanded later
function ModernMinimalTemplate({ resume }: { resume: Resume }) {
  return (
    <div className="w-full max-w-[8.5in] mx-auto bg-white p-8">
      <div className="text-center text-gray-500 py-20">
        <h3 className="text-lg font-medium mb-2">Modern Minimal Template</h3>
        <p className="text-sm">Coming Soon - Template Development in Progress</p>
        <p className="text-xs mt-4 text-gray-400">Currently showing: {resume.personalInfo.fullName || 'New Resume'}</p>
      </div>
    </div>
  );
}

function ExecutiveTemplate({ resume }: { resume: Resume }) {
  return (
    <div className="w-full max-w-[8.5in] mx-auto bg-white p-8">
      <div className="text-center text-gray-500 py-20">
        <h3 className="text-lg font-medium mb-2">Executive Template</h3>
        <p className="text-sm">Coming Soon - Template Development in Progress</p>
        <p className="text-xs mt-4 text-gray-400">Currently showing: {resume.personalInfo.fullName || 'New Resume'}</p>
      </div>
    </div>
  );
}

function TechnicalTemplate({ resume }: { resume: Resume }) {
  return (
    <div className="w-full max-w-[8.5in] mx-auto bg-white p-8">
      <div className="text-center text-gray-500 py-20">
        <h3 className="text-lg font-medium mb-2">Technical Template</h3>
        <p className="text-sm">Coming Soon - Template Development in Progress</p>
        <p className="text-xs mt-4 text-gray-400">Currently showing: {resume.personalInfo.fullName || 'New Resume'}</p>
      </div>
    </div>
  );
}

function CreativeTemplate({ resume }: { resume: Resume }) {
  return (
    <div className="w-full max-w-[8.5in] mx-auto bg-white p-8">
      <div className="text-center text-gray-500 py-20">
        <h3 className="text-lg font-medium mb-2">Creative Template</h3>
        <p className="text-sm">Coming Soon - Template Development in Progress</p>
        <p className="text-xs mt-4 text-gray-400">Currently showing: {resume.personalInfo.fullName || 'New Resume'}</p>
      </div>
    </div>
  );
}