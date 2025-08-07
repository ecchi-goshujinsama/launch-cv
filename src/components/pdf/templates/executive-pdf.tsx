import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { BasePDFDocument, PDFHeader, commonStyles } from '../base-pdf-document';
import type { PDFRenderContext } from '../../../lib/pdf/types';
import type { ResumeSection } from '../../../lib/types';

// Executive specific styles - premium, bold design
const styles = StyleSheet.create({
  ...commonStyles,
  sectionTitle: {
    ...commonStyles.sectionTitle,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#991b1b',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    borderBottomWidth: 2,
    borderBottomColor: '#991b1b',
    paddingBottom: 4,
  },
  name: {
    ...commonStyles.name,
    fontSize: 32,
    color: '#991b1b',
    fontWeight: 'bold',
    letterSpacing: -1,
    marginBottom: 12,
  },
  itemTitle: {
    ...commonStyles.itemTitle,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7c2d12',
  },
});

interface ExecutivePDFProps {
  context: PDFRenderContext;
}

export const ExecutivePDF: React.FC<ExecutivePDFProps> = ({ context }) => {
  const { resume } = context;

  return (
    <BasePDFDocument context={context}>
      <View style={styles.container}>
        <PDFHeader context={context} />
        
        {resume.sections
          .filter(section => section.visible)
          .sort((a, b) => a.order - b.order)
          .map(section => (
            <View key={section.id} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={commonStyles.text}>
                Executive template content will be implemented here
              </Text>
            </View>
          ))}
      </View>
    </BasePDFDocument>
  );
};