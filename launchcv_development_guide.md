# LaunchCV - Claude Code Development Guide

## 🚀 Project Mission
**LaunchCV** is a modern resume builder designed to help professionals launch their careers with precision-crafted, tailored resumes. The core workflow is: **Import → Edit → Tailor → Launch** (export).

## 📋 MVP Requirements (1 Week Sprint)

### Core Features
- **Resume Import System** - Import from PDF, Word, or manual text input
- **Resume Builder Interface** - Clean, intuitive form-based editor with pre-populated data
- **3-5 Professional Templates** - Modern, ATS-friendly designs
- **PDF Export** - High-quality output for applications
- **Basic Job Tailoring** - Manual keyword highlighting and content suggestions
- **Local Data Storage** - Browser-based persistence
- **Responsive Design** - Works on desktop and mobile

### Success Criteria
- [ ] Can create a complete resume in < 10 minutes
- [ ] Generate professional PDF output
- [ ] Responsive design works on mobile
- [ ] 3+ professional templates available
- [ ] Data persists between sessions

## 🏗️ Technical Architecture

### Technology Stack
- **Framework:** Next.js 14 (App Router)
- **UI Library:** Tailwind CSS + shadcn/ui components
- **State Management:** Zustand (lightweight, perfect for MVP)
- **Form Handling:** React Hook Form + Zod validation
- **PDF Generation:** Puppeteer or React-PDF
- **Icons:** Lucide React
- **Animations:** Framer Motion (minimal use)
- **Database:** SQLite with Prisma ORM (local development)
- **Package Manager:** pnpm
- **Code Quality:** ESLint + Prettier
- **Type Safety:** TypeScript

### Project Structure
```
launch-cv/
├── src/
│   ├── app/                    # Next.js 14 app directory
│   │   ├── (dashboard)/        # Dashboard routes
│   │   ├── builder/            # Resume builder
│   │   ├── templates/          # Template preview
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── resume/             # Resume-specific components
│   │   ├── forms/              # Form components
│   │   └── layout/             # Layout components
│   ├── lib/
│   │   ├── stores/             # Zustand stores
│   │   ├── types/              # TypeScript definitions
│   │   ├── utils/              # Helper functions
│   │   └── templates/          # Template definitions
│   ├── styles/
│   │   └── globals.css
│   └── data/
│       └── templates/          # Template configurations
├── prisma/
│   └── schema.prisma
├── public/
│   └── templates/              # Template assets
└── docs/
    └── api.md
```

## 🎨 Brand Identity & Design System

### Brand Mission
**"Launch Your Career"** - Transform any resume into a targeted career launcher with speed, precision, and personalization.

### Visual Identity
- **Primary Colors:** Launch Blue (#2563eb), Rocket Orange (#f97316)
- **Icon Theme:** Upward arrows, rocket ships, trajectory lines, launch sequences
- **Typography:** Modern, clean, with subtle technological edge
- **Imagery:** Upward motion, professional growth, technological precision

### Color Palette
```css
/* Launch Blue - Professional yet energetic */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-500: #2563eb;  /* Main brand blue */
--primary-600: #1d4ed8;
--primary-900: #1e3a8a;

/* Rocket Orange - Action and energy */
--accent-50: #fff7ed;
--accent-100: #ffedd5;
--accent-500: #f97316;  /* Launch accent */
--accent-600: #ea580c;
--accent-900: #9a3412;

/* Professional Grays */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-500: #6b7280;
--gray-700: #374151;
--gray-900: #111827;

/* Status Colors */
--success: #10b981;    /* Resume ready to launch */
--warning: #f59e0b;    /* Needs optimization */
--error: #ef4444;      /* Import/export errors */
```

### Brand-Aligned Terminology
- **Import** = "Pre-flight Data Import" / "Mission Prep"
- **Building** = "Mission Control" / "Command Center"
- **Export** = "Launch Sequence" / "Career Launch"
- **Success** = "Launch Successful!" / "Career Launched!"
- **Error** = "Mission Control Alert" / "Pre-flight Check Failed"

## 🧩 Component Architecture Guidelines

### Naming Conventions
- **Components:** PascalCase with descriptive names
- **Files:** kebab-case for consistency
- **Variables:** camelCase, descriptive
- **CSS Classes:** Follow Tailwind conventions
- **API Routes:** RESTful, lowercase with hyphens

### Component Patterns
```typescript
// Example component structure
interface ComponentProps {
  // Props with clear TypeScript definitions
}

export function ComponentName({ prop }: ComponentProps) {
  // Component logic
  return (
    <div className="launch-themed-classes">
      {/* Component JSX */}
    </div>
  );
}
```

### Launch-Themed Component Examples
- `<LaunchButton />` - Primary action buttons with rocket animations
- `<MissionProgress />` - Progress indicators with countdown aesthetics
- `<PreFlightCheck />` - Validation and error handling components
- `<CareerTrajectory />` - Navigation and user flow components
- `<LaunchSequence />` - Export and completion flows

## 📊 Data Models

### Core Entities
```typescript
interface Resume {
  id: string;
  title: string;
  templateId: string;
  personalInfo: PersonalInfo;
  sections: ResumeSection[];
  metadata: ResumeMetadata;
  createdAt: Date;
  updatedAt: Date;
}

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  summary: string;
}

interface ResumeSection {
  id: string;
  type: 'experience' | 'education' | 'skills' | 'projects' | 'certifications';
  title: string;
  items: SectionItem[];
  order: number;
  visible: boolean;
}

interface ExperienceItem extends SectionItem {
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  location: string;
  description: string[];
  skills: string[];
}
```

## 🔄 Development Phases & Prompts

### Phase 1: Project Setup (Day 1)
**System Prompt:**
```
You are building LaunchCV, a modern resume builder with rocket ship branding. 
Focus on creating a solid foundation with Next.js 14, TypeScript, and the launch-themed brand identity.

Key priorities:
- Set up Next.js 14 with App Router
- Configure Tailwind CSS with launch-themed color palette
- Install and configure shadcn/ui components
- Create basic project structure
- Implement brand colors and typography
- Set up Zustand for state management
```

### Phase 2: Resume Import System (Day 2)
**System Prompt:**
```
Build the "Pre-flight Data Import" system for LaunchCV. This should feel like preparing for a mission launch.

Requirements:
- File upload interface for PDF/Word documents
- Text parsing and extraction engine
- Review/correction interface for extracted data
- Manual text input fallback
- Store data in Zustand store

Use rocket ship metaphors in the UI:
- "Preparing for launch..."
- "Mission data extracted"
- "Pre-flight check complete"
```

### Phase 3: Builder Interface (Days 3-4)
**System Prompt:**
```
Create the "Mission Control" resume builder interface for LaunchCV. This is the command center where users craft their resume.

Features needed:
- Form-based editor with sections (Personal, Experience, Education, Skills)
- Live preview panel
- Template switching
- Section management (add/remove/reorder)
- Data validation with Zod
- Auto-save functionality

Design should feel like a spacecraft control panel - clean, functional, with launch-themed elements.
```

### Phase 4: Templates & Export (Days 5-6)
**System Prompt:**
```
Build the template system and "Launch Sequence" export functionality for LaunchCV.

Requirements:
- 3-5 professional resume templates (Classic, Modern, Executive, Technical, Creative)
- PDF generation with high quality output
- Template preview and switching
- Export progress with launch countdown aesthetics
- Success celebration with "Career Launched!" messaging

Each template should be ATS-friendly and professionally designed.
```

### Phase 5: Polish & Deployment (Day 7)
**System Prompt:**
```
Final polish for LaunchCV MVP launch. Focus on user experience, performance, and brand consistency.

Tasks:
- UI/UX refinements with launch theme
- Mobile responsiveness testing
- Performance optimization
- Error handling with mission control terminology
- Launch animations and micro-interactions
- Deployment preparation
```

## 🎯 Key Features Implementation

### Resume Import Flow
1. **Upload Interface** - Drag & drop with rocket ship animations
2. **Processing** - "Preparing for launch..." with progress indicators
3. **Review** - "Pre-flight check" validation interface
4. **Confirmation** - "Mission data ready" success state

### Builder Interface
- **Sidebar:** Form controls and section management
- **Main Area:** Live preview with template switching
- **Progress:** Mission control-style progress tracking
- **Actions:** Launch-themed buttons and CTAs

### Export System
- **Template Selection** - Visual preview cards
- **Generate PDF** - "Initiating launch sequence..."
- **Download** - "Career launched successfully!"
- **Share Options** - Links and social sharing

## 🚨 Development Best Practices

### Code Quality
- Use TypeScript strictly for type safety
- Implement proper error boundaries
- Follow React best practices and hooks rules
- Use Zod for runtime validation
- Implement proper loading states

### Performance
- Optimize bundle size (target < 200KB gzipped)
- Implement lazy loading for heavy components
- Use React.memo for expensive components
- Optimize images and assets

### Accessibility
- WCAG 2.1 compliant
- Proper ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast compliance

### Brand Consistency
- Use launch-themed terminology throughout
- Implement rocket ship iconography
- Apply consistent color palette
- Create smooth animations that feel like launches
- Success states should celebrate achievements

## 🔧 Common Component Patterns

### Launch Button Component
```typescript
interface LaunchButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'launch';
  loading?: boolean;
  onClick?: () => void;
}

export function LaunchButton({ 
  children, 
  variant = 'primary', 
  loading = false,
  onClick 
}: LaunchButtonProps) {
  return (
    <button
      className={cn(
        "launch-button-base",
        variant === 'launch' && "bg-accent-500 hover:bg-accent-600",
        loading && "launch-loading-animation"
      )}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? <RocketIcon className="animate-pulse" /> : children}
    </button>
  );
}
```

### Mission Progress Component
```typescript
interface MissionProgressProps {
  step: number;
  totalSteps: number;
  currentStepLabel: string;
}

export function MissionProgress({ step, totalSteps, currentStepLabel }: MissionProgressProps) {
  const progress = (step / totalSteps) * 100;
  
  return (
    <div className="mission-progress">
      <div className="progress-bar">
        <div 
          className="progress-fill bg-accent-500" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-gray-600">
        Mission Progress: {currentStepLabel} ({step}/{totalSteps})
      </p>
    </div>
  );
}
```

## 📝 Development Reminders

### Critical Success Factors
1. **Speed First** - Users should be able to create a resume in < 10 minutes
2. **Mobile Ready** - Responsive design is non-negotiable
3. **Brand Consistency** - Every interaction should feel like a launch sequence
4. **Data Persistence** - Never lose user data
5. **Professional Output** - PDF quality must be print-ready

### Launch Day Checklist
- [ ] All core features working end-to-end
- [ ] Mobile responsive on common devices
- [ ] PDF export generating high-quality output
- [ ] Data persistence working locally
- [ ] Basic error handling implemented
- [ ] Launch animations and branding complete
- [ ] Performance targets met (< 3s load time)

## 🚀 Launch Sequence Complete!

Remember: Every component, every interaction, every piece of copy should reinforce the "Launch Your Career" mission. Users should feel excited and empowered when using LaunchCV - like they're preparing for their next career launch!

Good luck building something that helps people soar! 🚀