import type { ResumeData } from '@/lib/types';

export const TEST_RESUME_DATA: ResumeData = {
  id: 'test-resume-1',
  personalInfo: {
    fullName: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    summary: 'Experienced software engineer with 5+ years developing scalable web applications. Passionate about clean code, user experience, and building products that make a difference.'
  },
  sections: {
    experience: [
      {
        id: '1',
        title: 'Senior Software Engineer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        startDate: '2022-03',
        endDate: null,
        isCurrent: true,
        description: 'Lead development of customer-facing web applications serving 100K+ users. Built scalable APIs and improved performance by 40%. Mentored junior developers and led code reviews.',
        achievements: [
          'Reduced page load times by 40% through optimization',
          'Led team of 4 developers on major product redesign',
          'Implemented CI/CD pipeline reducing deployment time by 60%'
        ]
      },
      {
        id: '2',
        title: 'Software Engineer',
        company: 'StartupXYZ',
        location: 'Palo Alto, CA',
        startDate: '2020-01',
        endDate: '2022-02',
        isCurrent: false,
        description: 'Developed full-stack web applications using React, Node.js, and PostgreSQL. Worked closely with design and product teams to deliver user-focused features.',
        achievements: [
          'Built responsive web application from scratch',
          'Integrated third-party APIs and payment systems',
          'Collaborated with cross-functional teams'
        ]
      }
    ],
    education: [
      {
        id: '1',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        institution: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        startDate: '2016-09',
        endDate: '2020-05',
        gpa: '3.7',
        honors: ['Magna Cum Laude', "Dean's List"]
      }
    ],
    skills: [
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'Python',
      'PostgreSQL',
      'MongoDB',
      'AWS',
      'Docker',
      'Git',
      'REST APIs',
      'GraphQL'
    ],
    projects: [
      {
        id: '1',
        name: 'TaskFlow - Project Management Tool',
        description: 'Built a collaborative project management web application with real-time updates, file sharing, and team communication features.',
        technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
        url: 'https://github.com/johnsmith/taskflow',
        startDate: '2023-01',
        endDate: '2023-03'
      },
      {
        id: '2',
        name: 'WeatherApp - iOS Mobile App',
        description: 'Developed a weather forecasting mobile app with location-based services, push notifications, and offline capability.',
        technologies: ['Swift', 'CoreData', 'MapKit', 'REST API'],
        url: 'https://github.com/johnsmith/weatherapp',
        startDate: '2022-06',
        endDate: '2022-08'
      }
    ]
  },
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: '1.0.0',
    source: 'manual'
  }
};

// Helper function to inject test data into browser
export const injectTestData = () => {
  if (typeof window !== 'undefined') {
    // This will add the test data to the window object for easy access in browser console
    (window as any).setTestResumeData = (data: ResumeData) => {
      // Access Zustand store directly
      const resumeStore = (window as any).useResumeStore;
      if (resumeStore) {
        resumeStore.getState().setCurrentResume(data);
        console.log('Test resume data injected successfully!');
      } else {
        console.warn('Resume store not found on window object');
      }
    };
    
    (window as any).TEST_RESUME_DATA = TEST_RESUME_DATA;
    
    console.log('Test data utilities loaded. Use window.setTestResumeData(window.TEST_RESUME_DATA) to inject test data.');
  }
};

export default TEST_RESUME_DATA;
