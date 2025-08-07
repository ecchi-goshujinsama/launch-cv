import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { BasePDFDocument, PDFHeader, commonStyles } from '../base-pdf-document';
import type { PDFRenderContext } from '../../../lib/pdf/types';

// Technical specific styles - clean, code-focused
const styles = StyleSheet.create({
  ...commonStyles,
  sectionTitle: {
    ...commonStyles.sectionTitle,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#059669',
    fontFamily: 'Courier',
    borderBottomWidth: 1,
    borderBottomColor: '#d1fae5',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  name: {
    ...commonStyles.name,
    fontSize: 24,
    color: '#065f46',
    fontFamily: 'Courier',
    fontWeight: 'bold',
  },
  itemTitle: {
    ...commonStyles.itemTitle,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#047857',
    fontFamily: 'Courier',
  },
});

interface TechnicalPDFProps {
  context: PDFRenderContext;
}

export const TechnicalPDF: React.FC<TechnicalPDFProps> = ({ context }) => {
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
                Technical template content will be implemented here
              </Text>
            </View>
          ))}
      </View>
    </BasePDFDocument>
  );
};