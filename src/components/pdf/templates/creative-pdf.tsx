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

// Creative specific styles - unique, colorful design
const styles = StyleSheet.create({
  ...commonStyles,
  sectionTitle: {
    ...commonStyles.sectionTitle,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7c3aed',
    transform: 'rotate(-2deg)',
    borderBottomWidth: 3,
    borderBottomColor: '#f97316',
    borderBottomStyle: 'solid',
    paddingBottom: 6,
  },
  name: {
    ...commonStyles.name,
    fontSize: 30,
    color: '#7c3aed',
    fontWeight: 'bold',
    transform: 'rotate(-1deg)',
    marginBottom: 16,
  },
  itemTitle: {
    ...commonStyles.itemTitle,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#c2410c',
  },
});

interface CreativePDFProps {
  context: PDFRenderContext;
}

export const CreativePDF: React.FC<CreativePDFProps> = ({ context }) => {
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

const PDFSection: React.FC<PDFSectionProps> = ({ section }) => {
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

// Item components for each section type (creative style)
const ExperienceItemPDF: React.FC<{ item: ExperienceItem }> = ({ item }) => (
  <View style={styles.item}>
    <View style={styles.itemHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{item.position}</Text>
        <Text style={styles.itemSubtitle}>{item.company} ★ {item.location}</Text>
      </View>
      <Text style={styles.itemDate}>
        {item.startDate} - {item.endDate || 'Present'}
      </Text>
    </View>
    {item.description?.map((desc, index) => (
      <Text key={index} style={styles.bulletPoint}>✦ {desc}</Text>
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
        <Text style={styles.itemSubtitle}>{item.institution} ★ {item.location}</Text>
      </View>
      <Text style={styles.itemDate}>
        {item.startDate} - {item.endDate || 'Present'}
      </Text>
    </View>
    {item.gpa && (
      <Text style={styles.bulletPoint}>✦ GPA: {item.gpa}</Text>
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
    <Text style={styles.bulletPoint}>✦ {item.description}</Text>
    {item.highlights?.map((highlight, index) => (
      <Text key={index} style={styles.bulletPoint}>✦ {highlight}</Text>
    ))}
    {Array.isArray(item.technologies) && item.technologies.length > 0 && (
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
    <Text style={styles.itemTitle}>★ {item.category || 'SKILLS'}</Text>
    <View style={{ ...styles.skillsGrid, marginTop: 6 }}>
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
      </View>
      {item.date && (
        <Text style={styles.itemDate}>{item.date}</Text>
      )}
    </View>
    {Array.isArray(item.description) ? 
      item.description.map((desc, index) => (
        <Text key={index} style={styles.bulletPoint}>✦ {desc}</Text>
      )) :
      <Text style={styles.bulletPoint}>✦ {item.description}</Text>
    }
  </View>
);