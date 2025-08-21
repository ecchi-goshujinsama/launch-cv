'use client';

import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Wrench, 
  Plus, 
  X,
  Hash,
  Lightbulb,
  Code,
  Users,
  Briefcase,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionCard } from '@/components/layout';

const skillsFormSchema = z.object({
  skills: z.array(z.string().min(1, 'Skill cannot be empty')),
  newSkill: z.string().optional()
});

type SkillsFormData = z.infer<typeof skillsFormSchema>;

interface SkillsFormProps {
  initialData?: string[];
  onSave: (skills: string[]) => void;
  onCancel?: () => void;
  className?: string;
  autoSave?: boolean;
}

// Skill categories for suggestions
const skillSuggestions = {
  technical: [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 
    'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Azure', 'Docker', 'Kubernetes',
    'Git', 'HTML', 'CSS', 'Vue.js', 'Angular', 'Express.js', 'Django'
  ],
  soft: [
    'Leadership', 'Communication', 'Problem Solving', 'Team Collaboration',
    'Project Management', 'Critical Thinking', 'Time Management', 'Adaptability',
    'Creativity', 'Negotiation', 'Public Speaking', 'Mentoring'
  ],
  tools: [
    'Figma', 'Adobe Creative Suite', 'Slack', 'Jira', 'Trello', 'Asana',
    'Microsoft Office', 'Google Workspace', 'Salesforce', 'HubSpot',
    'Tableau', 'Power BI', 'Sketch', 'InVision'
  ]
};

export function SkillsForm({
  initialData = [],
  onSave,
  onCancel,
  className,
  autoSave = true
}: SkillsFormProps) {
  const [skills, setSkills] = useState<string[]>(initialData);
  const [newSkill, setNewSkill] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<'technical' | 'soft' | 'tools' | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const {
    // register,
    handleSubmit,
    // formState: { errors }
  } = useForm<SkillsFormData>({
    resolver: zodResolver(skillsFormSchema) as any,
    defaultValues: {
      skills: initialData,
      newSkill: ''
    }
  });

  // Auto-save functionality
  React.useEffect(() => {
    if (autoSave && isDirty) {
      const timeoutId = setTimeout(() => {
        onSave(skills);
        setIsDirty(false);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [skills, isDirty, autoSave, onSave]);

  // Generate suggestions based on input
  React.useEffect(() => {
    if (newSkill.length >= 2) {
      const allSkills = [
        ...skillSuggestions.technical,
        ...skillSuggestions.soft,
        ...skillSuggestions.tools
      ];
      
      const filtered = allSkills
        .filter(skill => 
          skill.toLowerCase().includes(newSkill.toLowerCase()) &&
          !skills.includes(skill)
        )
        .slice(0, 6);
      
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [newSkill, skills]);

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setNewSkill('');
      setSuggestions([]);
      setIsDirty(true);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
    setIsDirty(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(newSkill);
    }
  };

  const addSuggestionCategory = (category: 'technical' | 'soft' | 'tools') => {
    // const categorySkills = skillSuggestions[category].filter(skill => !skills.includes(skill));
    setActiveCategory(activeCategory === category ? null : category);
  };

  const handleFormSubmit = () => {
    onSave(skills);
    setIsDirty(false);
  };

  const getCategoryIcon = (category: 'technical' | 'soft' | 'tools') => {
    switch (category) {
      case 'technical': return <Code className="w-4 h-4" />;
      case 'soft': return <Users className="w-4 h-4" />;
      case 'tools': return <Briefcase className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: 'technical' | 'soft' | 'tools') => {
    switch (category) {
      case 'technical': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'soft': return 'bg-green-100 text-green-800 border-green-200';
      case 'tools': return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  return (
    <MissionCard variant="elevated" className={cn('', className)}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Section Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="w-10 h-10 bg-launch-blue/10 rounded-lg flex items-center justify-center">
            <Wrench className="w-5 h-5 text-launch-blue" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mission-text">Skills & Expertise</h3>
            <p className="text-sm text-gray-600">Showcase your technical and professional skills</p>
          </div>
        </div>

        {/* Add New Skill */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Hash className="w-4 h-4" />
            Add Skills
          </label>
          <div className="relative">
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a skill and press Enter..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-launch-blue-200"
              />
              <LaunchButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSkill(newSkill)}
                disabled={!newSkill.trim()}
                icon="none"
              >
                <Plus className="w-4 h-4" />
              </LaunchButton>
            </div>
            
            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                <div className="p-2 text-xs text-gray-500 bg-gray-50 border-b">
                  <Search className="w-3 h-3 inline mr-1" />
                  Suggestions
                </div>
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => addSkill(suggestion)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 focus:bg-gray-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Add Categories */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Quick Add by Category
          </h4>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(skillSuggestions) as Array<'technical' | 'soft' | 'tools'>).map((category) => (
              <LaunchButton
                key={category}
                type="button"
                variant={activeCategory === category ? 'mission' : 'outline'}
                size="sm"
                onClick={() => addSuggestionCategory(category)}
                icon="none"
                className="capitalize"
              >
                {getCategoryIcon(category)}
                <span className="ml-2">{category}</span>
              </LaunchButton>
            ))}
          </div>
          
          {/* Category Skills */}
          {activeCategory && (
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex flex-wrap gap-2">
                {skillSuggestions[activeCategory]
                  .filter(skill => !skills.includes(skill))
                  .slice(0, 12)
                  .map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      className="px-2 py-1 text-xs bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      + {skill}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Current Skills */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Your Skills ({skills.length})
            </h4>
            {skills.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSkills([]);
                  setIsDirty(true);
                }}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Clear All
              </button>
            )}
          </div>
          
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className={cn(
                    "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border",
                    // Categorize skills for styling
                    skillSuggestions.technical.includes(skill)
                      ? getCategoryColor('technical')
                      : skillSuggestions.soft.includes(skill)
                        ? getCategoryColor('soft')
                        : skillSuggestions.tools.includes(skill)
                          ? getCategoryColor('tools')
                          : "bg-gray-100 text-gray-800 border-gray-200"
                  )}
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Wrench className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No skills added yet. Start by typing a skill above.</p>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <span>💡</span>
            Skills Section Tips
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Mix technical skills (programming languages, tools) with soft skills</li>
            <li>• Include skills mentioned in job descriptions you&apos;re targeting</li>
            <li>• Be honest - only include skills you&apos;re comfortable discussing</li>
            <li>• Prioritize skills most relevant to your target role</li>
          </ul>
        </div>

        {/* Auto-save Status */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {autoSave ? (
              isDirty ? (
                <>
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                  Auto-saving changes...
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  All changes saved
                </>
              )
            ) : (
              <>
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
                Auto-save disabled
              </>
            )}
          </div>

          {/* Manual Save Buttons */}
          {!autoSave && (
            <div className="flex gap-3">
              {onCancel && (
                <LaunchButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                >
                  Cancel
                </LaunchButton>
              )}
              <LaunchButton
                type="submit"
                variant="mission"
                size="sm"
                disabled={!isDirty}
                icon="rocket"
                iconPosition="right"
              >
                Save Changes
              </LaunchButton>
            </div>
          )}
        </div>
      </form>
    </MissionCard>
  );
}