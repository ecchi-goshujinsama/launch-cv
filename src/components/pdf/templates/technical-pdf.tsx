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

// Technical specific styles - GitHub-inspired dark theme matching preview
const styles = StyleSheet.create({
  ...commonStyles,
  container: {
    ...commonStyles.container,
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#0d1117',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0d1117',
    fontFamily: 'Courier-Bold',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 3,
  },
  contactDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#58a6ff',
    marginRight: 8,
  },
  contactText: {
    fontSize: 10,
    color: '#656d76',
    fontFamily: 'Helvetica',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: '#0d1117',
    backgroundColor: '#f6f8fa',
    alignSelf: 'flex-end',
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0d1117',
    fontFamily: 'Courier-Bold',
  },
  summary: {
    marginTop: 15,
    paddingLeft: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#0d1117',
    backgroundColor: '#f6f8fa',
    padding: 10,
  },
  summaryText: {
    fontSize: 10,
    color: '#0d1117',
    lineHeight: 1.4,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0d1117',
    fontFamily: 'Courier-Bold',
    marginBottom: 12,
    marginTop: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#0d1117',
    backgroundColor: '#f6f8fa',
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0d1117',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  itemSubtitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#58a6ff',
    marginBottom: 3,
  },
  itemDate: {
    fontSize: 9,
    color: '#656d76',
    fontFamily: 'Courier',
    fontWeight: 'bold',
  },
  bulletPoint: {
    fontSize: 10,
    color: '#0d1117',
    marginBottom: 3,
    lineHeight: 1.4,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    marginTop: 6,
  },
  skillItem: {
    fontSize: 8,
    fontFamily: 'Courier',
    fontWeight: 'bold',
    backgroundColor: '#0d1117',
    color: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginRight: 3,
    marginBottom: 3,
  },
  statsBox: {
    backgroundColor: '#f6f8fa',
    borderWidth: 1,
    borderColor: '#d0d7de',
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0d1117',
    marginBottom: 8,
    fontFamily: 'Courier-Bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 9,
    color: '#656d76',
  },
  statsValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0d1117',
    fontFamily: 'Courier-Bold',
  },
});

interface TechnicalPDFProps {
  context: PDFRenderContext;
}

export const TechnicalPDF: React.FC<TechnicalPDFProps> = ({ context }) => {
  const { resume } = context;
  
  // Get visible sections in order
  const visibleSections = resume.sections
    .filter(section => section.visible)
    .sort((a, b) => a.order - b.order);
  
  const skillsSection = visibleSections.find(s => s.type === 'skills');
  const experienceSection = visibleSections.find(s => s.type === 'experience');
  const projectsSection = visibleSections.find(s => s.type === 'projects');
  const otherSections = visibleSections.filter(s => !['skills', 'experience', 'projects'].includes(s.type));

  return (
    <BasePDFDocument context={context}>
      <View style={styles.container}>
        {/* Technical Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{resume.personalInfo.fullName}</Text>
              
              {/* Contact Info Grid */}
              <View style={styles.contactInfo}>
                <View style={{ flex: 1 }}>
                  {resume.personalInfo.email && (
                    <View style={styles.contactItem}>
                      <View style={styles.contactDot} />
                      <Text style={styles.contactText}>{resume.personalInfo.email}</Text>
                    </View>
                  )}
                  {resume.personalInfo.phone && (
                    <View style={styles.contactItem}>
                      <View style={styles.contactDot} />
                      <Text style={styles.contactText}>{resume.personalInfo.phone}</Text>
                    </View>
                  )}
                  {resume.personalInfo.location && (
                    <View style={styles.contactItem}>
                      <View style={styles.contactDot} />
                      <Text style={styles.contactText}>{resume.personalInfo.location}</Text>
                    </View>
                  )}
                </View>
                
                <View style={{ flex: 1 }}>
                  {resume.personalInfo.website && (
                    <View style={styles.contactItem}>
                      <View style={styles.contactDot} />
                      <Text style={styles.contactText}>{resume.personalInfo.website}</Text>
                    </View>
                  )}
                  {resume.personalInfo.linkedin && (
                    <View style={styles.contactItem}>
                      <View style={styles.contactDot} />
                      <Text style={styles.contactText}>{resume.personalInfo.linkedin}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            
            {/* Technical Badge */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>DEVELOPER</Text>
            </View>
          </View>
          
          {/* Professional Summary */}
          {resume.personalInfo.summary && (
            <View style={styles.summary}>
              <Text style={styles.summaryText}>{resume.personalInfo.summary}</Text>
            </View>
          )}
        </View>
        
        {/* Two Column Layout */}
        <View style={{ flexDirection: 'row', gap: 15 }}>
          {/* Left Column - Skills & Stats */}
          <View style={{ flex: 1 }}>
            {/* Skills Section */}
            {skillsSection && (
              <View>
                <Text style={styles.sectionTitle}>TECH STACK</Text>
                {skillsSection.items?.map((item: any, index: number) => (
                  <View key={index} style={{ marginBottom: 15 }}>
                    <Text style={{
                      fontSize: 9,
                      fontWeight: 'bold',
                      color: '#0d1117',
                      backgroundColor: '#f6f8fa',
                      paddingHorizontal: 6,
                      paddingVertical: 3,
                      marginBottom: 6,
                      textTransform: 'uppercase',
                      fontFamily: 'Courier-Bold'
                    }}>
                      {item.category}
                    </Text>
                    <View style={styles.skillsGrid}>
                      {item.skills?.slice(0, 6).map((skill: string, skillIdx: number) => (
                        <Text key={skillIdx} style={styles.skillItem}>{skill}</Text>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}
            
            {/* Quick Stats */}
            <View style={styles.statsBox}>
              <Text style={styles.statsTitle}>QUICK STATS</Text>
              <View style={styles.statsRow}>
                <Text style={styles.statsLabel}>Projects:</Text>
                <Text style={styles.statsValue}>{projectsSection?.items?.length || 0}</Text>
              </View>
              <View style={styles.statsRow}>
                <Text style={styles.statsLabel}>Experience:</Text>
                <Text style={styles.statsValue}>{experienceSection?.items?.length || 0}+ roles</Text>
              </View>
              <View style={styles.statsRow}>
                <Text style={styles.statsLabel}>Skills:</Text>
                <Text style={styles.statsValue}>
                  {skillsSection?.items?.reduce((acc: number, item: any) => acc + (item.skills?.length || 0), 0) || 0}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Right Column - Experience & Projects */}
          <View style={{ flex: 2 }}>
            {[experienceSection, projectsSection, ...otherSections].filter(Boolean).map(section => (
              <PDFSection key={section!.id} section={section!} context={context} />
            ))}
          </View>
        </View>
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
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.sectionTitle}>
        {section.title.toUpperCase()}
      </Text>
      {renderSectionContent()}
    </View>
  );
};

// Item components for each section type (technical style matching preview)
const ExperienceItemPDF: React.FC<{ item: ExperienceItem }> = ({ item }) => (
  <View style={{
    padding: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#58a6ff',
    backgroundColor: '#f6f8fa',
    borderRadius: 4,
  }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{item.position}</Text>
        <Text style={styles.itemSubtitle}>{item.company}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.itemDate}>
          {item.startDate} → {item.endDate || 'CURRENT'}
        </Text>
        {item.location && (
          <Text style={{ fontSize: 8, color: '#8b949e', fontFamily: 'Courier' }}>
            {item.location}
          </Text>
        )}
      </View>
    </View>
    {item.description?.map((desc, index) => (
      <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 3 }}>
        <View style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: '#58a6ff',
          marginRight: 8,
          marginTop: 2,
          flexShrink: 0,
        }} />
        <Text style={styles.bulletPoint}>{desc}</Text>
      </View>
    ))}
    {item.skills?.length > 0 && (
      <View style={styles.skillsGrid}>
        {item.skills.map((skill, index) => (
          <Text key={index} style={styles.skillItem}>{skill}</Text>
        ))}
      </View>
    )}
  </View>
);

const EducationItemPDF: React.FC<{ item: EducationItem }> = ({ item }) => (
  <View style={{
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#d0d7de',
    backgroundColor: '#f6f8fa',
    borderRadius: 4,
  }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>
          {item.degree} {item.field && `in ${item.field}`}
        </Text>
        <Text style={styles.itemSubtitle}>{item.institution}</Text>
        {item.gpa && (
          <Text style={{ fontSize: 9, color: '#8b949e', marginTop: 3 }}>
            GPA: {item.gpa}
          </Text>
        )}
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.itemDate}>
          {item.startDate} → {item.endDate}
        </Text>
        {item.location && (
          <Text style={{ fontSize: 8, color: '#8b949e', fontFamily: 'Courier' }}>
            {item.location}
          </Text>
        )}
      </View>
    </View>
  </View>
);

const ProjectItemPDF: React.FC<{ item: ProjectItem }> = ({ item }) => (
  <View style={{
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#d0d7de',
    backgroundColor: '#f6f8fa',
    borderRadius: 4,
  }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        {item.url && (
          <Text style={{ fontSize: 9, color: '#0969da', fontFamily: 'Courier' }}>
            {item.url}
          </Text>
        )}
      </View>
      {item.startDate && (
        <Text style={styles.itemDate}>
          {item.startDate} → {item.endDate || 'ONGOING'}
        </Text>
      )}
    </View>
    {item.description && (
      <Text style={{
        ...styles.bulletPoint,
        marginBottom: 8,
        lineHeight: 1.5,
      }}>
        {item.description}
      </Text>
    )}
    {Array.isArray(item.technologies) && item.technologies.length > 0 && (
      <View style={styles.skillsGrid}>
        {item.technologies.map((tech, index) => (
          <Text key={index} style={{
            ...styles.skillItem,
            backgroundColor: 'transparent',
            color: '#58a6ff',
            borderWidth: 1,
            borderColor: '#58a6ff',
          }}>
            {tech}
          </Text>
        ))}
      </View>
    )}
  </View>
);

const SkillsItemPDF: React.FC<{ item: SkillsItem }> = ({ item }) => (
  <View style={styles.item}>
    <Text style={styles.itemTitle}>[{item.category || 'SKILLS'}]</Text>
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
        <Text key={index} style={styles.bulletPoint}>▶ {desc}</Text>
      )) :
      <Text style={styles.bulletPoint}>▶ {item.description}</Text>
    }
  </View>
);