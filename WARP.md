# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

LaunchCV is a modern resume builder web application built with Next.js 15, TypeScript, and a "rocket launch" theme. The application follows a core workflow: Import → Edit → Tailor → Launch (export). It transforms any resume into a targeted career launcher with precision-crafted, tailored resumes.

## Common Development Commands

### Development
```bash
# Start development server with Turbopack (fastest)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# TypeScript type checking (not in package.json but useful)
npx tsc --noEmit
```

### Testing and Quality
```bash
# Run ESLint with auto-fix
npx eslint . --fix

# Check Prettier formatting
npx prettier --check .

# Format all files with Prettier
npx prettier --write .
```

## Architecture Overview

### Core Technologies
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode configuration
- **State Management**: Zustand stores with immer and persistence middleware
- **Styling**: Tailwind CSS v4 with custom CSS variables for brand colors
- **UI Components**: shadcn/ui + custom launch-themed components
- **Forms**: React Hook Form + Zod validation schemas
- **PDF Export**: React-PDF for high-quality resume generation
- **File Parsing**: pdf-parse + mammoth.js for resume import

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css         # Global styles and brand theme variables
│   ├── layout.tsx          # Root layout with metadata and fonts
│   ├── page.tsx            # Landing page
│   ├── import/             # Resume import flow
│   ├── builder/            # Resume builder interface
│   └── export/             # PDF export interface
├── components/
│   ├── ui/                 # Reusable UI components (buttons, dialogs, etc.)
│   ├── resume/             # Resume-specific components (file upload, forms)
│   ├── forms/              # Form components (date picker, rich text editor)
│   ├── layout/             # Layout components (headers, footers, containers)
│   ├── builder/            # Builder-specific components (forms, drag-drop)
│   ├── export/             # Export-specific components (progress, templates)
│   ├── pdf/                # PDF template components for React-PDF
│   ├── templates/          # Template renderers and management
│   └── lazy-components.ts  # Performance-optimized lazy loading
├── lib/
│   ├── stores/             # Zustand stores (resume, template, export)
│   ├── types/              # TypeScript type definitions
│   ├── hooks/              # Custom React hooks
│   ├── parsers/            # File parsing utilities (PDF, DOCX, text)
│   ├── pdf/                # PDF generation utilities
│   ├── utils/              # Helper functions and utilities
│   └── validations/        # Zod validation schemas
```

### Key State Management

The application uses Zustand for state management with three main stores:

1. **Resume Store** (`resume-store.ts`): Manages current resume data, CRUD operations, and section management
2. **Template Store** (`template-store.ts`): Handles template selection and customization
3. **Export Store** (`export-store.ts`): Manages PDF export process and history

All stores use:
- `immer` middleware for immutable updates
- `persist` middleware for localStorage persistence
- `devtools` middleware for Redux DevTools integration

### Component Architecture

- **Lazy Loading**: Heavy components (PDF viewers, template renderers) are lazy-loaded via `lazy-components.ts`
- **Type Safety**: Strict TypeScript with discriminated unions for section items
- **Form Validation**: Zod schemas in `validations/resume-schemas.ts`
- **Performance**: Custom hooks for auto-save, keyboard shortcuts, and touch interactions

### Brand Identity & Theme

LaunchCV uses a rocket launch theme with specific brand colors:
- **Primary Blue**: `#2563eb` (Launch Blue)
- **Accent Orange**: `#f97316` (Rocket Orange)
- **Background**: Dark theme with slate colors

Brand elements include:
- Launch-themed animations (rocket-launch, mission-pulse, countdown)
- Mission control aesthetics and terminology
- Gradient text effects for headings
- Custom button styles with hover animations

## Development Guidelines

### Code Standards
- **TypeScript**: Strict mode enabled with `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`
- **Components**: Functional components with hooks, PascalCase naming
- **Files**: kebab-case for component files, camelCase for variables
- **Styling**: Tailwind classes preferred, minimal custom CSS

### Type Safety Best Practices
- Use type guards when working with discriminated unions (see `builder/page.tsx`)
- Leverage the comprehensive type system in `lib/types/index.ts`
- All form data validated with Zod schemas before processing

### Performance Considerations
- Bundle size target: < 200KB (gzipped)
- Lazy load heavy components (PDF generation, template renderers)
- Use performance monitoring utilities in `lib/utils/performance.ts`
- Auto-save functionality to prevent data loss

### Mobile Experience
- Responsive design with touch-optimized interactions
- Swipe navigation between sections on mobile devices
- WCAG-compliant touch targets (44px minimum)
- Mobile-specific UI adaptations

## Common Development Patterns

### Adding New Resume Sections
1. Define the section type in `lib/types/index.ts`
2. Add Zod validation schema in `lib/validations/resume-schemas.ts`
3. Create form component in `components/builder/`
4. Update type guards and helpers in relevant pages
5. Add template rendering support

### Creating New Templates
1. Add template definition to `lib/templates/`
2. Create PDF renderer in `components/pdf/templates/`
3. Add preview renderer in `components/templates/renderers/`
4. Update lazy loading in `components/lazy-components.ts`
5. Add template to selection grid

### File Parsing Integration
- Extend parsers in `lib/parsers/` for new file formats
- Update `ParsedResumeData` type for new data structures
- Add validation in resume schemas
- Handle parsing errors gracefully with fallbacks

## Performance and Bundle Management

The project includes comprehensive performance monitoring:
- Performance metrics logging in development
- Bundle size analysis tools
- Memory usage monitoring
- Lazy loading for optimal initial load times

Key performance files:
- `lib/utils/performance.ts`: Performance monitoring utilities
- `components/lazy-components.ts`: Lazy loading configuration
- Bundle splitting automatically handled by Next.js

## Environment and Configuration

### Environment Variables
```bash
NEXT_PUBLIC_APP_NAME=LaunchCV
NEXT_PUBLIC_APP_ENV=development
DATABASE_URL="file:./dev.db"  # For future database integration
```

### ESLint Configuration
- Extends Next.js core web vitals and Prettier
- TypeScript-specific rules for unused variables and explicit any
- Custom rules for code consistency

### Prettier Configuration
- Semi-colons enabled
- Double quotes preferred
- 80 character print width
- 2 space tabs

## Integration Points

### PDF Export System
- React-PDF based with custom document components
- Template-specific PDF renderers in `components/pdf/templates/`
- Export progress tracking and history
- Print-optimized layouts

### File Import System
- Multi-format support: PDF, DOCX, plain text
- Intelligent parsing with confidence scoring
- Manual review interface for parsed data
- Graceful fallback to manual entry

### Auto-save System
- Automatic saving every few seconds
- Manual save capability with keyboard shortcuts
- Visual save status indicators
- Conflict resolution for concurrent edits

This codebase emphasizes type safety, performance, and user experience with a cohesive rocket launch theme throughout the application.
