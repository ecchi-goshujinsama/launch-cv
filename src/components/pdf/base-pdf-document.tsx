import React from 'react';
import { Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer';
import type { PDFRenderContext } from '../../lib/pdf/types';

// Register fonts for better typography - use system fonts to avoid loading issues
// Font.register({
//   family: 'Inter',
//   fonts: [
//     { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2' },
//     { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2', fontWeight: 'bold' },
//   ],
// });

// Font.register({
//   family: 'Source Sans Pro',
//   fonts: [
//     { src: 'https://fonts.gstatic.com/s/sourcesanspro/v21/6xK3dSBYKcSV-LCoeQqfX1RYOo3qOK7lujVj9w.woff2' },
//     { src: 'https://fonts.gstatic.com/s/sourcesanspro/v21/6xKydSBYKcSV-LCoeQqfX1RYOo3ik4zwlxdu3cOWxw.woff2', fontWeight: 'bold' },
//   ],
// });

// Create common PDF styles
export const commonStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.4,
    padding: 40,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  contactInfo: {
    fontSize: 10,
    color: '#4a4a4a',
    textAlign: 'center',
    marginBottom: 4,
  },
  summary: {
    fontSize: 11,
    lineHeight: 1.5,
    color: '#2a2a2a',
    marginTop: 12,
    marginBottom: 20,
    textAlign: 'justify',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#2563eb',
    borderBottomStyle: 'solid',
  },
  item: {
    marginBottom: 16,
    pageBreakInside: false,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
    wrap: false,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
  },
  itemSubtitle: {
    fontSize: 11,
    color: '#4a4a4a',
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 10,
    color: '#6b6b6b',
    textAlign: 'right',
    minWidth: 80,
  },
  itemLocation: {
    fontSize: 10,
    color: '#6b6b6b',
    fontStyle: 'italic',
  },
  bulletPoint: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#2a2a2a',
    marginBottom: 3,
    marginLeft: 12,
    textAlign: 'left',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillItem: {
    fontSize: 10,
    color: '#2a2a2a',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
});

interface BasePDFDocumentProps {
  context: PDFRenderContext;
  children: React.ReactNode;
}

export const BasePDFDocument: React.FC<BasePDFDocumentProps> = ({ 
  context, 
  children 
}) => {
  const { options } = context;

  return (
    <Document>
      <Page size={options.format} style={commonStyles.page}>
        {children}
      </Page>
    </Document>
  );
};

// Common PDF section components
interface PDFHeaderProps {
  context: PDFRenderContext;
  style?: 'default' | 'centered' | 'minimal';
}

export const PDFHeader: React.FC<PDFHeaderProps> = ({ 
  context, 
  style = 'default' 
}) => {
  const { resume } = context;
  const { personalInfo } = resume;

  const contactInfo = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.website,
  ].filter(Boolean);

  return (
    <View style={commonStyles.header}>
      <Text style={commonStyles.name}>{personalInfo.fullName}</Text>
      <Text style={commonStyles.contactInfo}>
        {contactInfo.join(' • ')}
      </Text>
      {personalInfo.summary && (
        <Text style={commonStyles.summary}>
          {personalInfo.summary}
        </Text>
      )}
    </View>
  );
};