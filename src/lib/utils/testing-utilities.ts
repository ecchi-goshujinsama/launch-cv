// Testing Utilities for Cross-browser and Mobile Testing
import type { Resume, Template } from '../types';

export interface TestResult {
  browser: string;
  device?: string;
  testName: string;
  success: boolean;
  duration: number;
  error?: string;
  screenshot?: string;
}

export interface TestSuite {
  name: string;
  tests: TestFunction[];
  beforeEach?: () => Promise<void>;
  afterEach?: () => Promise<void>;
}

export type TestFunction = () => Promise<TestResult>;

// Mock data for testing
export const createMockResume = (): Resume => ({
  id: 'test-resume-1',
  title: 'Test Resume - Software Engineer',
  templateId: 'classic-professional',
  personalInfo: {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/johndoe',
    website: 'https://johndoe.dev',
    summary: 'Experienced software engineer with expertise in full-stack development and a passion for creating innovative solutions.',
  },
  sections: [
    {
      id: 'experience-1',
      type: 'experience',
      title: 'Work Experience',
      items: [
        {
          id: 'exp-1',
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          location: 'San Francisco, CA',
          startDate: '2022-01-01',
          endDate: '',
          current: true,
          description: 'Led development of scalable web applications using React and Node.js.',
        },
        {
          id: 'exp-2',
          title: 'Software Engineer',
          company: 'Startup Inc',
          location: 'Remote',
          startDate: '2020-06-01',
          endDate: '2021-12-31',
          current: false,
          description: 'Developed and maintained multiple web applications using modern technologies.',
        },
      ],
    },
    {
      id: 'education-1',
      type: 'education',
      title: 'Education',
      items: [
        {
          id: 'edu-1',
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          location: 'Berkeley, CA',
          startDate: '2016-08-01',
          endDate: '2020-05-31',
          gpa: '3.8',
        },
      ],
    },
    {
      id: 'skills-1',
      type: 'skills',
      title: 'Skills',
      items: [
        {
          id: 'skill-1',
          category: 'Programming Languages',
          skills: ['JavaScript', 'TypeScript', 'Python', 'Java'],
        },
        {
          id: 'skill-2',
          category: 'Frameworks & Libraries',
          skills: ['React', 'Next.js', 'Node.js', 'Express'],
        },
      ],
    },
  ],
  metadata: {
    createdAt: new Date(),
    updatedAt: new Date(),
    version: '1.0',
  },
});

export const createMockTemplate = (): Template => ({
  id: 'classic-professional',
  name: 'Classic Professional',
  description: 'A clean, traditional resume template perfect for most industries',
  category: 'professional',
  isPremium: false,
  previewImage: '/templates/classic-professional.png',
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#f97316',
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  layout: {
    columns: 1,
    spacing: 'normal',
    margins: 'normal',
  },
  sections: ['personalInfo', 'summary', 'experience', 'education', 'skills'],
  customization: {
    colors: true,
    fonts: true,
    layout: false,
  },
});

// Browser testing utilities
export const BROWSER_CONFIGS = {
  chrome: {
    name: 'Chrome',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
  },
  firefox: {
    name: 'Firefox',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
    viewport: { width: 1920, height: 1080 },
  },
  safari: {
    name: 'Safari',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    viewport: { width: 1920, height: 1080 },
  },
  edge: {
    name: 'Edge',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
    viewport: { width: 1920, height: 1080 },
  },
} as const;

export const MOBILE_CONFIGS = {
  iphone13: {
    name: 'iPhone 13',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  },
  pixel7: {
    name: 'Google Pixel 7',
    userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2.625,
    isMobile: true,
    hasTouch: true,
  },
  ipad: {
    name: 'iPad Air',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    viewport: { width: 820, height: 1180 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
} as const;

// Test scenarios
export const TEST_SCENARIOS = {
  resumeImport: {
    name: 'Resume Import Workflow',
    description: 'Test file upload and parsing functionality',
    steps: [
      'Navigate to import page',
      'Upload PDF file',
      'Verify parsing results',
      'Review extracted data',
      'Save to builder',
    ],
  },
  resumeBuilder: {
    name: 'Resume Builder Workflow',
    description: 'Test form editing and validation',
    steps: [
      'Open resume builder',
      'Fill personal information',
      'Add work experience',
      'Add education',
      'Add skills section',
      'Validate form data',
    ],
  },
  templateSwitching: {
    name: 'Template Switching',
    description: 'Test template selection and preview',
    steps: [
      'Select different templates',
      'Verify preview updates',
      'Check responsive design',
      'Test customization options',
    ],
  },
  pdfExport: {
    name: 'PDF Export Workflow',
    description: 'Test PDF generation and download',
    steps: [
      'Complete resume data',
      'Select template',
      'Generate PDF preview',
      'Download PDF file',
      'Verify file quality',
    ],
  },
  mobileResponsiveness: {
    name: 'Mobile Responsiveness',
    description: 'Test mobile interface and interactions',
    steps: [
      'Test touch interactions',
      'Verify layout adaptation',
      'Test form inputs',
      'Check navigation',
      'Verify readability',
    ],
  },
} as const;

// Performance benchmarks
export const PERFORMANCE_BENCHMARKS = {
  pageLoad: {
    target: 3000, // 3 seconds
    critical: 5000, // 5 seconds
    metric: 'Time to Interactive',
  },
  firstContentfulPaint: {
    target: 2000, // 2 seconds
    critical: 4000, // 4 seconds
    metric: 'First Contentful Paint',
  },
  pdfGeneration: {
    target: 2000, // 2 seconds
    critical: 5000, // 5 seconds
    metric: 'PDF Generation Time',
  },
  bundleSize: {
    target: 200, // 200KB gzipped
    critical: 500, // 500KB gzipped
    metric: 'Bundle Size (gzipped)',
  },
} as const;

// Error scenarios for edge case testing
export const ERROR_SCENARIOS = [
  {
    name: 'Invalid File Upload',
    trigger: () => {
      // Simulate invalid file upload
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        const invalidFile = new File(['invalid content'], 'test.txt', { type: 'text/plain' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(invalidFile);
        fileInput.files = dataTransfer.files;
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    },
    expectedBehavior: 'Should show mission control alert about incompatible file format',
  },
  {
    name: 'Network Failure During Export',
    trigger: () => {
      // Simulate network failure
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          registration.active?.postMessage({ type: 'SIMULATE_NETWORK_ERROR' });
        });
      }
    },
    expectedBehavior: 'Should show mission control alert and offer retry option',
  },
  {
    name: 'Local Storage Unavailable',
    trigger: () => {
      // Simulate storage quota exceeded
      try {
        const largeDummyData = 'x'.repeat(10 * 1024 * 1024); // 10MB of data
        localStorage.setItem('test-overflow', largeDummyData);
      } catch {
        // This should trigger storage error handling
      }
    },
    expectedBehavior: 'Should gracefully handle storage errors and inform user',
  },
  {
    name: 'Corrupted Resume Data',
    trigger: () => {
      // Simulate corrupted data in localStorage
      localStorage.setItem('launch-cv-resume-data', 'invalid-json-data');
    },
    expectedBehavior: 'Should detect corrupted data and offer to start fresh',
  },
] as const;

// Accessibility testing checklist
export const ACCESSIBILITY_CHECKLIST = [
  {
    name: 'Keyboard Navigation',
    test: 'All interactive elements accessible via keyboard',
    criterion: 'WCAG 2.1 AA - 2.1.1',
  },
  {
    name: 'Screen Reader Compatibility',
    test: 'All content readable by screen readers',
    criterion: 'WCAG 2.1 AA - 1.3.1',
  },
  {
    name: 'Color Contrast',
    test: 'Text meets minimum contrast ratios',
    criterion: 'WCAG 2.1 AA - 1.4.3',
  },
  {
    name: 'Focus Indicators',
    test: 'Visible focus indicators on all interactive elements',
    criterion: 'WCAG 2.1 AA - 2.4.7',
  },
  {
    name: 'Alternative Text',
    test: 'All images have appropriate alt text',
    criterion: 'WCAG 2.1 AA - 1.1.1',
  },
  {
    name: 'Form Labels',
    test: 'All form inputs have associated labels',
    criterion: 'WCAG 2.1 AA - 1.3.1',
  },
] as const;

// Utility functions for testing
export const measurePerformance = async (operation: () => Promise<void>): Promise<number> => {
  const startTime = performance.now();
  await operation();
  return performance.now() - startTime;
};

export const simulateUserDelay = (min = 100, max = 300): Promise<void> => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

export const generateTestReport = (results: TestResult[]): string => {
  const totalTests = results.length;
  const passedTests = results.filter(r => r.success).length;
  const failedTests = totalTests - passedTests;
  const averageDuration = results.reduce((sum, r) => sum + r.duration, 0) / totalTests;

  return `
=== LaunchCV Test Report ===
Date: ${new Date().toISOString()}
Total Tests: ${totalTests}
Passed: ${passedTests}
Failed: ${failedTests}
Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%
Average Duration: ${averageDuration.toFixed(2)}ms

Failed Tests:
${results
  .filter(r => !r.success)
  .map(r => `- ${r.testName} (${r.browser}${r.device ? ` - ${r.device}` : ''}): ${r.error}`)
  .join('\n')}
`;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Export test configuration
export const getTestConfig = () => ({
  browsers: Object.keys(BROWSER_CONFIGS),
  mobileDevices: Object.keys(MOBILE_CONFIGS),
  scenarios: Object.keys(TEST_SCENARIOS),
  errorScenarios: ERROR_SCENARIOS.length,
  accessibilityChecks: ACCESSIBILITY_CHECKLIST.length,
  performanceBenchmarks: Object.keys(PERFORMANCE_BENCHMARKS).length,
});