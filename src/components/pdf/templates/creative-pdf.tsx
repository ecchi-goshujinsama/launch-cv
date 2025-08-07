import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { BasePDFDocument, PDFHeader, commonStyles } from '../base-pdf-document';
import type { PDFRenderContext } from '../../../lib/pdf/types';

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
            <View key={section.id} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={commonStyles.text}>
                Creative template content will be implemented here
              </Text>
            </View>
          ))}
      </View>
    </BasePDFDocument>
  );
};