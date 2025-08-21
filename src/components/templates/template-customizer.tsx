'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionCard } from '@/components/layout';
import { TemplatePreview } from './template-preview';
import type { Template, TemplateCustomizations, TemplateColorScheme, TemplateTypography } from '@/lib/types/template';
import { 
  Palette, 
  Type, 
  Layout, 
  RotateCcw,
  Eye,
  Save,
  Settings,
  Sliders,
  Grid3X3,
  AlignLeft
} from 'lucide-react';

interface TemplateCustomizerProps {
  template: Template;
  customizations?: TemplateCustomizations;
  onCustomizationsChange: (customizations: TemplateCustomizations) => void;
  onSave?: () => void;
  onReset?: () => void;
  className?: string;
}

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  description?: string;
}

function ColorPicker({ label, color, onChange, description }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {description && (
          <span className="block text-xs text-gray-500 font-normal">{description}</span>
        )}
      </label>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 border border-gray-300 rounded-md cursor-pointer"
          />
        </div>
        <input
          type="text"
          value={color}
          onChange={(e) => {
            const value = e.target.value;
            // Allow partial input while typing, but validate complete hex colors
            if (value === '' || value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
              onChange(value);
            }
          }}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-launch-blue-200 focus:border-launch-blue"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

interface FontSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

function FontSelector({ label, value, onChange, options }: FontSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-launch-blue-200 focus:border-launch-blue"
      >
        {options.map(option => (
          <option key={option.value} value={option.value} style={{ fontFamily: option.value }}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface SpacingSliderProps {
  label: string;
  value: 'compact' | 'normal' | 'relaxed';
  onChange: (value: 'compact' | 'normal' | 'relaxed') => void;
  description?: string;
}

function SpacingSlider({ label, value, onChange, description }: SpacingSliderProps) {
  const options = [
    { value: 'compact', label: 'Compact' },
    { value: 'normal', label: 'Normal' },
    { value: 'relaxed', label: 'Relaxed' }
  ] as const;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {description && (
          <span className="block text-xs text-gray-500 font-normal">{description}</span>
        )}
      </label>
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex-1 px-3 py-2 text-sm rounded-md transition-colors',
              value === option.value
                ? 'bg-white text-launch-blue shadow-sm font-medium'
                : 'text-gray-600 hover:text-gray-800'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TemplateCustomizer({
  template,
  customizations = {},
  onCustomizationsChange,
  onSave,
  onReset,
  className
}: TemplateCustomizerProps) {
  const [activeTab, setActiveTab] = React.useState<'colors' | 'typography' | 'layout'>('colors');
  
  // Current applied values (template defaults + customizations)
  const currentColorScheme: TemplateColorScheme = {
    ...template.colorScheme,
    ...customizations.colorScheme
  };
  
  const currentTypography: TemplateTypography = {
    ...template.typography,
    ...customizations.typography
  };
  
  const currentLayout = {
    ...template.layout,
    ...customizations.layout
  };

  // Update functions
  const updateColorScheme = (updates: Partial<TemplateColorScheme>) => {
    onCustomizationsChange({
      ...customizations,
      colorScheme: { ...customizations.colorScheme, ...updates }
    });
  };

  const updateTypography = (updates: Partial<TemplateTypography>) => {
    onCustomizationsChange({
      ...customizations,
      typography: { ...customizations.typography, ...updates }
    });
  };

  const updateLayout = (updates: Partial<typeof currentLayout>) => {
    onCustomizationsChange({
      ...customizations,
      layout: { ...customizations.layout, ...updates }
    });
  };

  const fontOptions = [
    { value: 'system-ui, -apple-system, sans-serif', label: 'System Default' },
    { value: 'Inter, sans-serif', label: 'Inter' },
    { value: 'Helvetica Neue, sans-serif', label: 'Helvetica Neue' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'Times New Roman, serif', label: 'Times New Roman' },
    { value: 'Merriweather, serif', label: 'Merriweather' },
    { value: 'Roboto, sans-serif', label: 'Roboto' },
    { value: 'Open Sans, sans-serif', label: 'Open Sans' }
  ];

  const tabs = [
    {
      id: 'colors' as const,
      label: 'Colors',
      icon: <Palette className="w-4 h-4" />,
      enabled: template.customization.colors.canChangeColors
    },
    {
      id: 'typography' as const,
      label: 'Typography',
      icon: <Type className="w-4 h-4" />,
      enabled: template.customization.fonts.canChangeFonts
    },
    {
      id: 'layout' as const,
      label: 'Layout',
      icon: <Layout className="w-4 h-4" />,
      enabled: template.customization.layout.canChangeLayout
 const enabledTabs = React.useMemo(
   () => tabs.filter(tab => tab.enabled),
   [
     template.customization.colors.canChangeColors,
     template.customization.fonts.canChangeFonts,
     template.customization.layout.canChangeLayout
   ]
 );
      const firstTab = enabledTabs[0];
      if (firstTab) {
        setActiveTab(firstTab.id);
      }
    }
  }, [enabledTabs, activeTab]);

  const hasChanges = Object.keys(customizations).some(key => 
    customizations[key as keyof TemplateCustomizations] !== undefined &&
    Object.keys(customizations[key as keyof TemplateCustomizations] || {}).length > 0
  );

  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-3 gap-6', className)}>
      {/* Customization Controls */}
      <div className="lg:col-span-2 space-y-6">
        <MissionCard>
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mission-text flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Customize Template
                </h3>
                <p className="text-sm text-gray-600">
                  Personalize the {template.name} template to match your style
                </p>
              </div>
              
              <div className="flex gap-2">
                {hasChanges && (
                  <LaunchButton
                    variant="ghost"
                    size="sm"
                    onClick={() => onReset?.()}
                    icon="none"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </LaunchButton>
                )}
                
                {onSave && (
                  <LaunchButton
                    variant="mission"
                    size="sm"
                    onClick={onSave}
                    disabled={!hasChanges}
                    icon="rocket"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </LaunchButton>
                )}
              </div>
            </div>

            {/* Tabs */}
            {enabledTabs.length > 0 && (
              <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                {enabledTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors',
                      activeTab === tab.id
                        ? 'bg-white text-launch-blue shadow-sm font-medium'
                        : 'text-gray-600 hover:text-gray-800'
                    )}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {enabledTabs.length === 0 && (
              <div className="text-center py-8 space-y-3">
                <Sliders className="w-12 h-12 text-gray-300 mx-auto" />
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Limited Customization</h4>
                  <p className="text-gray-600">
                    This template has limited customization options to maintain its design integrity.
                  </p>
                </div>
              </div>
            )}

            {/* Color Customization */}
            {activeTab === 'colors' && template.customization.colors.canChangeColors && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ColorPicker
                    label="Primary Color"
                    color={currentColorScheme.primary}
                    onChange={(color) => updateColorScheme({ primary: color })}
                    description="Main brand color used for headings and accents"
                  />
                  
                  <ColorPicker
                    label="Secondary Color"
                    color={currentColorScheme.secondary}
                    onChange={(color) => updateColorScheme({ secondary: color })}
                    description="Supporting color for subheadings and details"
                  />
                  
                  <ColorPicker
                    label="Accent Color"
                    color={currentColorScheme.accent}
                    onChange={(color) => updateColorScheme({ accent: color })}
                    description="Highlight color for links and important elements"
                  />
                  
                  <ColorPicker
                    label="Text Color"
                    color={currentColorScheme.text.primary}
                    onChange={(color) => updateColorScheme(prev => ({ 
                      ...prev, 
                      text: { ...prev.text, primary: color }
                    }))}
                    description="Primary text color for body content"
                  />
                </div>
              </div>
            )}

            {/* Typography Customization */}
            {activeTab === 'typography' && template.customization.fonts.canChangeFonts && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FontSelector
                    label="Heading Font"
                    value={currentTypography.headings.fontFamily}
                    onChange={(font) => updateTypography({
                      headings: { ...currentTypography.headings, fontFamily: font }
                    })}
                    options={fontOptions}
                  />
                  
                  <FontSelector
                    label="Body Font"
                    value={currentTypography.body.fontFamily}
                    onChange={(font) => updateTypography({
                      body: { ...currentTypography.body, fontFamily: font }
                    })}
                    options={fontOptions}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Body Font Size
                    </label>
                    <select
                      value={currentTypography.body.fontSize}
                      onChange={(e) => updateTypography({
                        body: { ...currentTypography.body, fontSize: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-launch-blue-200 focus:border-launch-blue"
                    >
                      <option value="9pt">9pt (Small)</option>
                      <option value="10pt">10pt (Normal)</option>
                      <option value="11pt">11pt (Medium)</option>
                      <option value="12pt">12pt (Large)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Line Height
                    </label>
                    <select
                      value={currentTypography.body.lineHeight}
                      onChange={(e) => updateTypography({
                        body: { ...currentTypography.body, lineHeight: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-launch-blue-200 focus:border-launch-blue"
                    >
                      <option value="1.2">Tight (1.2)</option>
                      <option value="1.4">Normal (1.4)</option>
                      <option value="1.5">Relaxed (1.5)</option>
                      <option value="1.6">Loose (1.6)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Layout Customization */}
            {activeTab === 'layout' && template.customization.layout.canChangeLayout && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SpacingSlider
                    label="Spacing"
                    value={currentLayout.spacing}
                    onChange={(spacing) => updateLayout({ spacing })}
                    description="Overall spacing between sections and elements"
                  />
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Header Style
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['minimal', 'standard', 'prominent'] as const).map(style => (
                        <button
                          key={style}
                          onClick={() => updateLayout({ headerStyle: style })}
                          className={cn(
                            'p-3 border rounded-md text-sm transition-colors',
                            currentLayout.headerStyle === style
                              ? 'border-launch-blue bg-launch-blue/10 text-launch-blue'
                              : 'border-gray-300 text-gray-700 hover:border-gray-400'
                          )}
                        >
                          <div className="capitalize font-medium">{style}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Section Style
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {(['simple', 'divided', 'boxed', 'timeline'] as const).map(style => (
                      <button
                        key={style}
                        onClick={() => updateLayout({ sectionStyle: style })}
                        className={cn(
                          'p-3 border rounded-md text-sm transition-colors flex flex-col items-center gap-2',
                          currentLayout.sectionStyle === style
                            ? 'border-launch-blue bg-launch-blue/10 text-launch-blue'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        )}
                      >
                        {style === 'simple' && <AlignLeft className="w-4 h-4" />}
                        {style === 'divided' && <Grid3X3 className="w-4 h-4" />}
                        {style === 'boxed' && <Layout className="w-4 h-4" />}
                        {style === 'timeline' && <AlignLeft className="w-4 h-4" />}
                        <div className="capitalize font-medium">{style}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </MissionCard>
      </div>

      {/* Live Preview */}
      <div className="space-y-4">
        <div className="sticky top-4">
          <MissionCard>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Live Preview
                </h4>
                {hasChanges && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">
                    Modified
                  </span>
                )}
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <TemplatePreview
                  template={template}
                  customizations={customizations}
                  size="medium"
                  interactive={false}
                  showInfo={false}
                />
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                Changes will be reflected in real-time
              </div>
            </div>
          </MissionCard>
        </div>
      </div>
    </div>
  );
}

export default TemplateCustomizer;