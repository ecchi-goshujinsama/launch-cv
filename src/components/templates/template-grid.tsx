'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionContainer } from '@/components/layout';
import { TemplateCard } from './template-preview';
import type { TemplateGridProps, Template } from '@/lib/types/template';
import { 
  Search,
  SortAsc,
  Grid3X3,
  Grid2X2,
  List,
  Star,
  Award,
  CheckCircle,
  Smartphone,
  Printer,
  TrendingUp,
  Clock
} from 'lucide-react';

interface TemplateFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: Template['category'] | null;
  onCategoryChange: (category: Template['category'] | null) => void;
  sortBy: 'name' | 'popularity' | 'rating' | 'recent';
  onSortChange: (sortBy: 'name' | 'popularity' | 'rating' | 'recent') => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

function TemplateFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange
}: TemplateFiltersProps) {
  const categories: { value: Template['category']; label: string; icon: React.ReactNode }[] = [
    { value: 'professional', label: 'Professional', icon: <CheckCircle className="w-4 h-4" /> },
    { value: 'modern', label: 'Modern', icon: <Smartphone className="w-4 h-4" /> },
    { value: 'creative', label: 'Creative', icon: <Star className="w-4 h-4" /> },
    { value: 'technical', label: 'Technical', icon: <Grid3X3 className="w-4 h-4" /> },
    { value: 'executive', label: 'Executive', icon: <Award className="w-4 h-4" /> }
  ];

  const sortOptions: { value: typeof sortBy; label: string; icon: React.ReactNode }[] = [
    { value: 'popularity', label: 'Popular', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'rating', label: 'Rating', icon: <Star className="w-4 h-4" /> },
    { value: 'name', label: 'Name', icon: <SortAsc className="w-4 h-4" /> },
    { value: 'recent', label: 'Recent', icon: <Clock className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-launch-blue-200 focus:border-launch-blue"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn(
              'p-2 rounded-md transition-colors',
              viewMode === 'grid'
                ? 'bg-white text-launch-blue shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            )}
          >
            <Grid2X2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={cn(
              'p-2 rounded-md transition-colors',
              viewMode === 'list'
                ? 'bg-white text-launch-blue shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <LaunchButton
            variant={selectedCategory === null ? 'mission' : 'ghost'}
            size="sm"
            onClick={() => onCategoryChange(null)}
            icon="none"
          >
            All Templates
          </LaunchButton>
          {categories.map(category => (
            <LaunchButton
              key={category.value}
              variant={selectedCategory === category.value ? 'mission' : 'ghost'}
              size="sm"
              onClick={() => onCategoryChange(category.value)}
              icon="none"
            >
              {category.icon}
              <span className="ml-1">{category.label}</span>
            </LaunchButton>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-600">Sort by:</span>
          <div className="flex gap-1">
            {sortOptions.map(option => (
              <LaunchButton
                key={option.value}
                variant={sortBy === option.value ? 'mission' : 'ghost'}
                size="sm"
                onClick={() => onSortChange(option.value)}
                icon="none"
              >
                {option.icon}
                <span className="ml-1 hidden sm:inline">{option.label}</span>
              </LaunchButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TemplateStatsProps {
  totalTemplates: number;
  filteredCount: number;
  selectedCategory: Template['category'] | null;
}

function TemplateStats({ totalTemplates, filteredCount, selectedCategory }: TemplateStatsProps) {
  return (
    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
      <div>
        Showing <span className="font-medium text-gray-900">{filteredCount}</span> of{' '}
        <span className="font-medium text-gray-900">{totalTemplates}</span> templates
        {selectedCategory && (
          <span> in <span className="font-medium capitalize">{selectedCategory}</span></span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-green-600" />
          <span className="text-xs">ATS Compatible</span>
        </div>
        <div className="flex items-center gap-1">
          <Smartphone className="w-3 h-3 text-blue-600" />
          <span className="text-xs">Mobile Ready</span>
        </div>
        <div className="flex items-center gap-1">
          <Printer className="w-3 h-3 text-purple-600" />
          <span className="text-xs">Print Friendly</span>
        </div>
      </div>
    </div>
  );
}

export function TemplateGrid({
  templates,
  selectedTemplate,
  onTemplateSelect,
  category,
  searchTerm = '',
  sortBy = 'popularity'
}: TemplateGridProps) {
  const [localSearchTerm, setLocalSearchTerm] = React.useState(searchTerm);
  const [selectedCategory, setSelectedCategory] = React.useState<Template['category'] | null>(category || null);
  const [localSortBy, setLocalSortBy] = React.useState(sortBy);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [showPreview, setShowPreview] = React.useState<string | null>(null);

  // Filter and sort templates
  const filteredTemplates = React.useMemo(() => {
    let filtered = templates;

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Apply search filter
    if (localSearchTerm) {
      const term = localSearchTerm.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(term) ||
        template.description.toLowerCase().includes(term) ||
        template.metadata.tags.some(tag => tag.toLowerCase().includes(term)) ||
        template.metadata.industry.some(industry => industry.toLowerCase().includes(term))
      );
    }

    // Sort templates
    const sorted = [...filtered].sort((a, b) => {
      switch (localSortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popularity':
          return b.metadata.popularity - a.metadata.popularity;
        case 'rating':
          return b.metadata.rating - a.metadata.rating;
        case 'recent':
          return new Date(b.metadata.updatedAt).getTime() - new Date(a.metadata.updatedAt).getTime();
        default:
          return 0;
      }
    });

    return sorted;
  }, [templates, selectedCategory, localSearchTerm, localSortBy]);

  if (templates.length === 0) {
    return (
      <MissionContainer className="text-center py-12">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Grid3X3 className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">No Templates Available</h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              Templates are being loaded. Please check back in a moment.
            </p>
          </div>
        </div>
      </MissionContainer>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <TemplateFilters
        searchTerm={localSearchTerm}
        onSearchChange={setLocalSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={localSortBy}
        onSortChange={setLocalSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Stats */}
      <TemplateStats
        totalTemplates={templates.length}
        filteredCount={filteredTemplates.length}
        selectedCategory={selectedCategory}
      />

      {/* Template Grid/List */}
      {filteredTemplates.length === 0 ? (
        <MissionContainer className="text-center py-12">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">No Templates Found</h3>
              <p className="text-gray-600 max-w-sm mx-auto">
                Try adjusting your search or filter criteria to find more templates.
              </p>
            </div>
            <LaunchButton
              variant="outline"
              onClick={() => {
                setLocalSearchTerm('');
                setSelectedCategory(null);
              }}
              icon="none"
            >
              Clear Filters
            </LaunchButton>
          </div>
        </MissionContainer>
      ) : (
        <div className={cn(
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        )}>
          {filteredTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              onSelect={() => onTemplateSelect(template.id)}
              onPreview={() => setShowPreview(template.id)}
              size={viewMode === 'list' ? 'small' : 'medium'}
              showInfo={true}
              className={viewMode === 'list' ? 'flex-row w-full h-32' : ''}
            />
          ))}
        </div>
      )}

      {/* Preview Modal - TODO: Implement modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Template Preview</h3>
              <LaunchButton
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(null)}
                icon="none"
              >
                ✕
              </LaunchButton>
            </div>
            <div className="text-center text-gray-500">
              Preview functionality coming soon...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TemplateGrid;