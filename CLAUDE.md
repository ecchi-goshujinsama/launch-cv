# LaunchCV - Resume Builder MVP

## Project Overview
LaunchCV is a modern resume builder designed to help professionals launch their careers with precision-crafted, tailored resumes. Core workflow: **Import → Edit → Tailor → Launch** (export).

**Timeline:** 1 week MVP  
**Brand Mission:** "Launch Your Career" - Transform any resume into a targeted career launcher.

## Technical Stack
- **Framework:** Next.js 14 (App Router)
- **UI:** Tailwind CSS + shadcn/ui components
- **State:** Zustand for lightweight state management
- **Forms:** React Hook Form + Zod validation
- **PDF Export:** React-PDF or Puppeteer
- **Database:** SQLite + Prisma (local development)
- **Package Manager:** pnpm
- **Language:** TypeScript (strict mode)

## Project Structure
```
launch-cv/
├── src/
│   ├── app/                    # Next.js 14 app router
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
│   └── styles/
├── prisma/
└── public/
```

## Brand Identity & Design
**Colors:**
- Primary Blue: `#2563eb` (Launch Blue)
- Accent Orange: `#f97316` (Rocket Orange)
- Use professional grays for text and backgrounds

**Visual Theme:** Rocket ships, upward arrows, launch sequences, mission control aesthetics

**Terminology:**
- Import = "Pre-flight Data Import"
- Building = "Mission Control"
- Export = "Launch Sequence"
- Success = "Career Launched!"
- Errors = "Mission Control Alert"

## MVP Features (Week 1)
1. **Resume Import System** - PDF/Word/text import with parsing
2. **Resume Builder** - Form-based editor with live preview
3. **Templates** - 3-5 professional, ATS-friendly designs
4. **PDF Export** - High-quality resume output
5. **Job Tailoring** - Basic keyword highlighting
6. **Local Storage** - Browser persistence
7. **Responsive Design** - Mobile-first approach

## Key Components to Build
- `LaunchButton` - Primary action buttons with rocket animations
- `MissionProgress` - Progress indicators with countdown aesthetics
- `PreFlightCheck` - Validation and error handling
- `ResumePreview` - Live preview with template switching
- `ImportWizard` - File upload and data extraction
- `ExportSequence` - PDF generation with launch animations

## Data Models
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
```

## Development Priorities
1. **Speed First** - Complete resume in < 10 minutes
2. **Mobile Ready** - Responsive on all devices
3. **Brand Consistency** - Every interaction feels like a launch
4. **Data Safety** - Never lose user progress
5. **Professional Output** - Print-ready PDF quality

## Code Standards
- Use TypeScript strictly with proper interfaces
- Follow React best practices and hooks rules
- Implement proper error boundaries
- Use Zod for runtime validation
- Apply consistent naming: PascalCase components, camelCase variables
- Prefer functional components with hooks
- Use Tailwind classes, avoid custom CSS where possible
- Component files should be kebab-case: `launch-button.tsx`

## Performance Targets
- Bundle size: < 200KB (gzipped)
- Time to Interactive: < 3s
- First Contentful Paint: < 2s
- PDF Generation: < 2s

## File Parsing Requirements
- **PDF:** Use pdf-parse or PDF-lib for text extraction
- **Word:** Use mammoth.js for .docx files
- **Text Processing:** Regex patterns for emails, phones, dates
- **Error Handling:** Graceful fallback to manual entry

## Template Requirements
1. **Classic Professional** - Traditional layout, ATS-friendly
2. **Modern Minimal** - Clean, contemporary design
3. **Executive** - Bold header, premium feel
4. **Technical** - Skills-focused, GitHub integration
5. **Creative** - Unique layout with personality

Each template must be:
- ATS-compatible
- Print-friendly
- Mobile responsive
- Brand-consistent

## Success Metrics
- [ ] Complete resume creation in < 10 minutes
- [ ] Professional PDF output quality
- [ ] Mobile responsive design
- [ ] Data persistence between sessions
- [ ] 3+ working templates
- [ ] Import success rate > 85%

## Development Notes
- Build with "launch" metaphors throughout the UI
- Use rocket ship icons and upward arrow imagery
- Success states should celebrate with launch animations
- Error states should feel like mission control alerts
- Progress indicators should have countdown aesthetics
- Every user interaction should reinforce the "career launch" theme

## Environment Variables
```
NEXT_PUBLIC_APP_NAME=LaunchCV
NEXT_PUBLIC_APP_ENV=development
DATABASE_URL="file:./dev.db"
```

Remember: This is about helping people launch their careers. Every component should feel empowering and forward-moving. 🚀