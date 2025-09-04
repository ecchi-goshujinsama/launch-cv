import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, pdf } from '@react-pdf/renderer';
import type { ResumeData } from '@/lib/types';

interface ExportOptions {
  template: string;
  settings?: {
    colorScheme?: 'blue' | 'green' | 'purple' | 'orange';
    fontSize?: 'small' | 'medium' | 'large';
    spacing?: 'compact' | 'normal' | 'spacious';
  };
}

// Define PDF styles for different templates
const getTemplateStyles = (template: string, colorScheme: string = 'blue') => {
  const colors = {
    blue: { primary: '#2563eb', secondary: '#3b82f6', accent: '#1d4ed8' },
    green: { primary: '#16a34a', secondary: '#22c55e', accent: '#15803d' },
    purple: { primary: '#7c3aed', secondary: '#8b5cf6', accent: '#6d28d9' },
    orange: { primary: '#ea580c', secondary: '#f97316', accent: '#c2410c' }
  };

  const baseStyles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      padding: 30,
      fontSize: 11,
      fontFamily: 'Helvetica',
    },
    header: {
      marginBottom: 20,
      borderBottom: `2px solid ${colors[colorScheme as keyof typeof colors].primary}`,
      paddingBottom: 10,
    },
    name: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors[colorScheme as keyof typeof colors].primary,
      marginBottom: 5,
    },
    contactInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: 10,
      color: '#4B5563',
    },
    section: {
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors[colorScheme as keyof typeof colors].primary,
      marginBottom: 8,
      borderBottom: `1px solid ${colors[colorScheme as keyof typeof colors].secondary}`,
      paddingBottom: 3,
    },
    subsection: {
      marginBottom: 10,
    },
    jobTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: 2,
    },
    company: {
      fontSize: 11,
      fontWeight: 'bold',
      color: colors[colorScheme as keyof typeof colors].secondary,
      marginBottom: 2,
    },
    dateLocation: {
      fontSize: 9,
      color: '#6B7280',
      marginBottom: 5,
    },
    description: {
      fontSize: 10,
      color: '#374151',
      lineHeight: 1.4,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 5,
    },
    skillTag: {
      backgroundColor: colors[colorScheme as keyof typeof colors].primary,
      color: 'white',
      padding: '2 6',
      borderRadius: 3,
      fontSize: 9,
      marginBottom: 3,
      marginRight: 3,
    },
  });

  // Template-specific style overrides
  if (template === 'technical') {
    return StyleSheet.create({
      ...baseStyles,
      name: {
        ...baseStyles.name,
        fontSize: 26,
        textTransform: 'uppercase',
        letterSpacing: 1,
      },
      sectionTitle: {
        ...baseStyles.sectionTitle,
        textTransform: 'uppercase',
        fontSize: 14,
        letterSpacing: 0.5,
      },
      jobTitle: {
        ...baseStyles.jobTitle,
        textTransform: 'uppercase',
        fontSize: 11,
      },
    });
  }

  if (template === 'classic-formal') {
    return StyleSheet.create({
      ...baseStyles,
      page: {
        ...baseStyles.page,
        fontFamily: 'Times-Roman',
      },
      name: {
        ...baseStyles.name,
        fontSize: 24,
        textAlign: 'center',
      },
      contactInfo: {
        ...baseStyles.contactInfo,
        justifyContent: 'center',
        textAlign: 'center',
      },
      sectionTitle: {
        ...baseStyles.sectionTitle,
        textAlign: 'center',
        fontSize: 14,
      },
    });
  }

  return baseStyles;
};

// PDF Document Component
const ResumePDFDocument = ({ resume, options }: { resume: ResumeData; options: ExportOptions }) => {
  const styles = getTemplateStyles(options.template, options.settings?.colorScheme);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{resume.personalInfo.fullName}</Text>
          <View style={styles.contactInfo}>
            <Text>{resume.personalInfo.email}</Text>
            {resume.personalInfo.phone && <Text>{resume.personalInfo.phone}</Text>}
            {resume.personalInfo.location && <Text>{resume.personalInfo.location}</Text>}
          </View>
        </View>

        {/* Professional Summary */}
        {resume.personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
            <Text style={styles.description}>{resume.personalInfo.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {resume.sections.experience && resume.sections.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EXPERIENCE</Text>
            {resume.sections.experience.map((exp, index) => (
              <View key={exp.id || index} style={styles.subsection}>
                <Text style={styles.jobTitle}>{exp.title}</Text>
                <Text style={styles.company}>{exp.company}</Text>
                <Text style={styles.dateLocation}>
                  {exp.startDate} - {exp.endDate || 'Present'}
                  {exp.location && ` • ${exp.location}`}
                </Text>
                {exp.description && (
                  <Text style={styles.description}>{exp.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {resume.sections.education && resume.sections.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EDUCATION</Text>
            {resume.sections.education.map((edu, index) => (
              <View key={edu.id || index} style={styles.subsection}>
                <Text style={styles.jobTitle}>
                  {edu.degree}
                  {edu.field && ` in ${edu.field}`}
                </Text>
                <Text style={styles.company}>{edu.institution}</Text>
                <Text style={styles.dateLocation}>
                  {edu.startDate} - {edu.endDate}
                  {edu.location && ` • ${edu.location}`}
                  {edu.gpa && ` • GPA: ${edu.gpa}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {resume.sections.skills && resume.sections.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SKILLS</Text>
            <View style={styles.skillsContainer}>
              {resume.sections.skills.slice(0, 20).map((skill, index) => (
                <Text key={index} style={styles.skillTag}>{skill}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Projects */}
        {resume.sections.projects && resume.sections.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROJECTS</Text>
            {resume.sections.projects.map((project, index) => (
              <View key={project.id || index} style={styles.subsection}>
                <Text style={styles.jobTitle}>{project.name}</Text>
                {project.url && (
                  <Text style={styles.dateLocation}>{project.url}</Text>
                )}
                {project.description && (
                  <Text style={styles.description}>{project.description}</Text>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <View style={styles.skillsContainer}>
                    {project.technologies.slice(0, 10).map((tech, techIndex) => (
                      <Text key={techIndex} style={styles.skillTag}>{tech}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

// Main PDF generation function
export const generatePDF = async (resume: ResumeData, options: ExportOptions): Promise<Blob> => {
  try {
    // Create the PDF document
    const pdfDoc = <ResumePDFDocument resume={resume} options={options} />;
    
    // Generate the PDF blob
    const blob = await pdf(pdfDoc).toBlob();
    
    return blob;
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

// Helper function to get template-specific settings
export const getTemplateDefaults = (templateId: string) => {
  const defaults = {
    'modern-professional': {
      colorScheme: 'blue' as const,
      fontSize: 'medium' as const,
      spacing: 'normal' as const,
    },
    'technical': {
      colorScheme: 'purple' as const,
      fontSize: 'medium' as const,
      spacing: 'compact' as const,
    },
    'classic-formal': {
      colorScheme: 'blue' as const,
      fontSize: 'medium' as const,
      spacing: 'spacious' as const,
    },
    'creative-modern': {
      colorScheme: 'orange' as const,
      fontSize: 'medium' as const,
      spacing: 'normal' as const,
    },
  };

  return defaults[templateId as keyof typeof defaults] || defaults['modern-professional'];
};
