# LaunchCV - Resume Builder MVP 🚀

**Transform any resume into a targeted career launcher. Your next professional opportunity starts here.**

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-000000?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

## 🎯 Project Overview

LaunchCV is a modern resume builder designed to help professionals launch their careers with precision-crafted, tailored resumes. Built with a "rocket launch" theme, every interaction feels empowering and forward-moving.

**Core Workflow:** Import → Edit → Tailor → Launch (export)

## ✨ Features

### 🚀 Pre-flight Data Import
- **PDF/DOCX/Text Import:** Intelligent parsing of existing resumes
- **Smart Data Extraction:** Automatic detection of contact info, experience, education
- **Manual Review Interface:** Validate and correct extracted data
- **Graceful Fallback:** Manual entry when parsing fails

### 🎛️ Mission Control Builder
- **Real-time Preview:** Live updates as you edit
- **Dynamic Sections:** Add/remove/reorder resume sections with drag & drop
- **Form Validation:** Zod-powered validation with helpful error messages
- **Auto-save:** Never lose your progress with automatic saving
- **Undo/Redo:** Full history management for confident editing

### 🎨 Professional Templates
- **Classic Professional** - Traditional ATS-friendly layout
- **Modern Minimal** - Clean contemporary design  
- **Executive** - Bold header with premium feel
- **Technical** - Skills-focused for developers
- **Creative** - Unique layout with personality

All templates are:
- ✅ ATS-compatible
- ✅ Print-friendly
- ✅ Mobile responsive
- ✅ Brand-consistent

### 📄 Launch Sequence (Export)
- **High-Quality PDF Generation:** React-PDF powered exports
- **Multiple Format Support:** Optimized for different use cases
- **Print Optimization:** Perfect formatting for physical copies
- **Export History:** Track all your career launches
- **Advanced Naming:** Smart file naming conventions

### 📱 Mobile Experience
- **Responsive Design:** Seamless experience on all devices
- **Touch Optimized:** WCAG-compliant touch targets
- **Swipe Navigation:** Intuitive mobile interactions
- **Performance Optimized:** Fast loading and smooth animations

### 💾 Data Management
- **Local Storage Persistence:** Your data stays safe between sessions
- **Auto-backup System:** Automatic backups with cleanup
- **Export/Import Settings:** Backup and restore your preferences
- **Privacy Focused:** All data stored locally on your device

## 🛠️ Technical Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + Custom CSS variables
- **UI Components:** shadcn/ui + Custom launch-themed components
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod validation
- **PDF Export:** React-PDF
- **File Parsing:** pdf-parse + mammoth.js
- **Icons:** Lucide React
- **Development:** ESLint + Prettier

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (recommended: latest LTS)
- npm (pnpm not available in this environment)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd launch-cv

# Install dependencies
npm install

# Start the development server
npm run dev
```
0- 
Open [http://localhost:3000](http://localhost:3000) to see LaunchCV in action.

### Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## 📁 Project Structure

```
launch-cv/
├── src/
│   ├── app/                    # Next.js 14 app router
│   │   ├── globals.css         # Global styles and brand theme
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Landing page
│   │   ├── import/             # Resume import flow
│   │   ├── builder/            # Resume builder interface
│   │   └── export/             # PDF export interface
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── resume/             # Resume-specific components  
│   │   ├── forms/              # Form components
│   │   ├── layout/             # Layout components
│   │   ├── builder/            # Builder-specific components
│   │   ├── export/             # Export-specific components
│   │   └── pdf/                # PDF template components
│   ├── lib/
│   │   ├── stores/             # Zustand stores
│   │   ├── types/              # TypeScript definitions
│   │   ├── utils/              # Helper functions
│   │   ├── hooks/              # Custom React hooks
│   │   ├── parsers/            # File parsing utilities
│   │   ├── pdf/                # PDF generation
│   │   ├── templates/          # Template definitions
│   │   └── validations/        # Zod schemas
├── public/                     # Static assets
├── prisma/                     # Database schema (future use)
└── docs/                       # Project documentation
```

## 🎨 Brand Identity

### Colors
- **Primary Blue:** `#2563eb` (Launch Blue)
- **Accent Orange:** `#f97316` (Rocket Orange)
- **Professional Grays:** Various shades for text and backgrounds

### Theme
- **Visual Elements:** Rocket ships, upward arrows, launch sequences
- **Terminology:** Mission control aesthetics throughout
- **Animations:** Launch-themed transitions and micro-interactions

### Typography
- **Headings:** Launch-themed gradients for impact
- **Body:** Professional, readable typography
- **UI:** Mission control inspired messaging

## 🚀 Core Features Implementation Status

### ✅ Completed Features
- [x] **Resume Import System** - PDF/Word/text import with intelligent parsing
- [x] **Resume Builder** - Comprehensive form-based editor with live preview
- [x] **Professional Templates** - 5 ATS-friendly, responsive designs
- [x] **PDF Export System** - High-quality PDF generation with React-PDF
- [x] **Data Persistence** - Robust local storage with auto-save and backup
- [x] **Mobile Responsive** - Optimized experience across all devices
- [x] **Launch Theming** - Complete brand identity with animations
- [x] **Performance Optimization** - Bundle size < 200KB, fast loading
- [x] **Accessibility** - WCAG-compliant design and interactions
- [x] **Error Handling** - Mission control themed error states

### 🎯 Success Metrics
- ✅ Complete resume creation in < 10 minutes
- ✅ Professional PDF output quality
- ✅ Mobile responsive design
- ✅ Data persistence between sessions
- ✅ Launch animations and branding
- ✅ 5+ working templates
- ✅ Cross-browser compatibility

## 🔧 Development

### Code Standards
- **TypeScript:** Strict mode with proper interfaces
- **Components:** Functional components with hooks
- **Styling:** Tailwind classes, minimal custom CSS
- **Naming:** PascalCase components, camelCase variables
- **Files:** kebab-case for component files

### Performance Targets
- **Bundle Size:** < 200KB (gzipped)
- **Time to Interactive:** < 3s
- **First Contentful Paint:** < 2s
- **PDF Generation:** < 2s

## 📋 Environment Variables

```bash
NEXT_PUBLIC_APP_NAME=LaunchCV
NEXT_PUBLIC_APP_ENV=development
DATABASE_URL="file:./dev.db"  # For future database integration
```

## 🤝 Contributing

This is currently a solo development project following a 7-day MVP timeline. The codebase follows React and Next.js best practices with comprehensive TypeScript typing.

### Development Workflow
1. All development happens on the `develop` branch
2. Feature branches are created for major features
3. Regular commits with descriptive messages
4. Code reviews before merging to `develop`

## 📄 License

This project is proprietary software developed as an MVP demonstration.

## 🚀 Deployment

The application is built with Next.js and can be deployed to various platforms:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **Self-hosted**

For production deployment:

```bash
npm run build
npm run start
```

## 📞 Support

For issues, questions, or feature requests, please refer to the project documentation or contact the development team.

---

**Mission Status: MVP Complete!** 🚀

*LaunchCV - Where careers take flight.*