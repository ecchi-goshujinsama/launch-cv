import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { BasePDFDocument, PDFHeader, commonStyles } from '../base-pdf-document';
import type { PDFRenderContext } from '../../../lib/pdf/types';
import type { 
  ExperienceItem, 
  EducationItem, 
  ProjectItem, 
  SkillsItem, 
  CertificationItem,
  CustomSectionItem,
  ResumeSection
} from '../../../lib/types';

// Classic Professional specific styles
const styles = StyleSheet.create({
  ...commonStyles,
  sectionTitle: {
    ...commonStyles.sectionTitle,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e40af',
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 2,
    borderBottomColor: '#1e40af',
  },
  name: {
    ...commonStyles.name,
    fontSize: 26,
    color: '#1e40af',
    fontWeight: 'bold',
  },
  itemTitle: {
    ...commonStyles.itemTitle,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
  },
});

interface ClassicProfessionalPDFProps {
  context: PDFRenderContext;
}

export const ClassicProfessionalPDF: React.FC<ClassicProfessionalPDFProps> = ({ 
  context 
}) => {
  const { resume } = context;

  return (
    <BasePDFDocument context={context}>
      <View style={styles.container}>
        <PDFHeader context={context} />
        
        {resume.sections
          .filter(section => section.visible)
          .sort((a, b) => a.order - b.order)
          .map(section => (
            <PDFSection key={section.id} section={section} context={context} />
          ))}
      </View>
    </BasePDFDocument>
  );
};

interface PDFSectionProps {
  section: ResumeSection;
  context: PDFRenderContext;
}

const PDFSection: React.FC<PDFSectionProps> = ({ section, context }) => {
  if (!section.visible || section.items.length === 0) return null;

  const renderSectionContent = () => {
    switch (section.type) {
      case 'experience':
        return section.items.map(item => 
          <ExperienceItemPDF key={item.id} item={item as ExperienceItem} />
        );
      case 'education':
        return section.items.map(item => 
          <EducationItemPDF key={item.id} item={item as EducationItem} />
        );
      case 'projects':
        return section.items.map(item => 
          <ProjectItemPDF key={item.id} item={item as ProjectItem} />
        );
      case 'skills':
        return section.items.map(item => 
          <SkillsItemPDF key={item.id} item={item as SkillsItem} />
        );
      case 'certifications':
        return section.items.map(item => 
          <CertificationItemPDF key={item.id} item={item as CertificationItem} />
        );
      case 'custom':
        return section.items.map(item => 
          <CustomSectionItemPDF key={item.id} item={item as CustomSectionItem} />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      {renderSectionContent()}
    </View>
  );
};

// Item components for each section type
const ExperienceItemPDF: React.FC<{ item: ExperienceItem }> = ({ item }) => (
  <View style={styles.item}>
    <View style={styles.itemHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{item.position}</Text>
        <Text style={styles.itemSubtitle}>{item.company}</Text>
        {item.location && (
          <Text style={styles.itemLocation}>{item.location}</Text>
        )}
      </View>
      <Text style={styles.itemDate}>
        {item.startDate} - {item.endDate || 'Present'}
      </Text>
    </View>
    {item.description?.map((desc, index) => (
      <Text key={index} style={styles.bulletPoint}>• {desc}</Text>
    ))}
    {item.skills?.length > 0 && (
      <View style={{ ...styles.skillsGrid, marginTop: 6 }}>
        {item.skills.map((skill, index) => (
          <Text key={index} style={styles.skillItem}>{skill}</Text>
        ))}
      </View>
    )}
  </View>
);

const EducationItemPDF: React.FC<{ item: EducationItem }> = ({ item }) => (
  <View style={styles.item}>
    <View style={styles.itemHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{item.degree}</Text>
        <Text style={styles.itemSubtitle}>{item.institution}</Text>
        {item.field && (
          <Text style={styles.itemSubtitle}>Field of Study: {item.field}</Text>
        )}
        {item.location && (
          <Text style={styles.itemLocation}>{item.location}</Text>
        )}
      </View>
      <Text style={styles.itemDate}>
        {item.startDate} - {item.endDate || 'Present'}
      </Text>
    </View>
    {item.gpa && (
      <Text style={styles.bulletPoint}>GPA: {item.gpa}</Text>
    )}
    {item.honors && item.honors.length > 0 && (
      <Text style={styles.bulletPoint}>Honors: {item.honors.join(', ')}</Text>
    )}
  </View>
);

const ProjectItemPDF: React.FC<{ item: ProjectItem }> = ({ item }) => (
  <View style={styles.item}>
    <View style={styles.itemHeader}>
      <Text style={styles.itemTitle}>{item.name}</Text>
      <Text style={styles.itemDate}>
        {item.startDate} - {item.endDate || 'Present'}
      </Text>
    </View>
    <Text style={styles.bulletPoint}>• {item.description}</Text>
    {item.highlights?.map((highlight, index) => (
      <Text key={index} style={styles.bulletPoint}>• {highlight}</Text>
    ))}
    {item.technologies.length > 0 && (
      <View style={{ ...styles.skillsGrid, marginTop: 6 }}>
        {item.technologies.map((tech, index) => (
          <Text key={index} style={styles.skillItem}>{tech}</Text>
        ))}
      </View>
    )}
  </View>
);

const SkillsItemPDF: React.FC<{ item: SkillsItem }> = ({ item }) => (
  <View style={styles.item}>
    <Text style={styles.itemTitle}>{item.category}</Text>
    <View style={styles.skillsGrid}>
      {item.skills?.map((skill, index) => (
        <Text key={index} style={styles.skillItem}>{skill}</Text>
      ))}
    </View>
  </View>
);

const CertificationItemPDF: React.FC<{ item: CertificationItem }> = ({ item }) => (
  <View style={styles.item}>
    <View style={styles.itemHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemSubtitle}>{item.issuer}</Text>
      </View>
      <Text style={styles.itemDate}>{item.issueDate}</Text>
    </View>
    {item.credentialId && (
      <Text style={styles.bulletPoint}>Credential ID: {item.credentialId}</Text>
    )}
  </View>
);

const CustomSectionItemPDF: React.FC<{ item: CustomSectionItem }> = ({ item }) => (
  <View style={styles.item}>
    <View style={styles.itemHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        {item.subtitle && (
          <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
        )}
        {item.location && (
          <Text style={styles.itemLocation}>{item.location}</Text>
        )}
      </View>
      {item.date && (
        <Text style={styles.itemDate}>{item.date}</Text>
      )}
    </View>
    {item.description.map((desc, index) => (
      <Text key={index} style={styles.bulletPoint}>• {desc}</Text>
    ))}
  </View>
);