// Template Validation Script
// Validates all templates against ATS, print, mobile, and brand standards

import { templates } from '../templates';
import { validateTemplate, getTemplateRecommendations } from './template-enhancements';

/**
 * Validate all templates and log results
 */
export const validateAllTemplates = () => {
  console.log('=== LaunchCV Template Validation Report ===\n');
  
  let allValid = true;
  
  templates.forEach(template => {
    const validation = validateTemplate(template);
    const recommendations = getTemplateRecommendations(template);
    
    console.log(`Template: ${template.name} (${template.id})`);
    console.log(`Category: ${template.category}`);
    console.log('Validation Results:');
    console.log(`  ✅ ATS Compatible: ${validation.atsCompatible ? 'PASS' : 'FAIL'}`);
    console.log(`  🖨️  Print Friendly: ${validation.printFriendly ? 'PASS' : 'FAIL'}`);
    console.log(`  📱 Mobile Responsive: ${validation.mobileResponsive ? 'PASS' : 'FAIL'}`);
    console.log(`  🎨 Brand Consistent: ${validation.brandConsistent ? 'PASS' : 'FAIL'}`);
    console.log(`  🚀 Overall: ${validation.overall ? 'PASS ✅' : 'FAIL ❌'}`);
    
    if (recommendations.length > 0) {
      console.log('Recommendations:');
      recommendations.forEach(rec => console.log(`  - ${rec}`));
      allValid = false;
    }
    
    console.log(''); // Empty line for readability
  });
  
  console.log('=== Summary ===');
  console.log(`Total Templates: ${templates.length}`);
  console.log(`All Templates Valid: ${allValid ? 'YES ✅' : 'NO ❌'}`);
  console.log(`ATS Compatible: ${templates.filter(t => validateTemplate(t).atsCompatible).length}/${templates.length}`);
  console.log(`Print Friendly: ${templates.filter(t => validateTemplate(t).printFriendly).length}/${templates.length}`);
  console.log(`Mobile Responsive: ${templates.filter(t => validateTemplate(t).mobileResponsive).length}/${templates.length}`);
  console.log(`Brand Consistent: ${templates.filter(t => validateTemplate(t).brandConsistent).length}/${templates.length}`);
  
  return allValid;
};

/**
 * Get template statistics
 */
export const getTemplateStats = () => {
  const stats = {
    total: templates.length,
    byCategory: {} as Record<string, number>,
    byDifficulty: {} as Record<string, number>,
    validation: {
      atsCompatible: 0,
      printFriendly: 0,
      mobileResponsive: 0,
      brandConsistent: 0,
      overall: 0
    }
  };
  
  templates.forEach(template => {
    // Category stats
    stats.byCategory[template.category] = (stats.byCategory[template.category] || 0) + 1;
    
    // Difficulty stats
    stats.byDifficulty[template.difficulty] = (stats.byDifficulty[template.difficulty] || 0) + 1;
    
    // Validation stats
    const validation = validateTemplate(template);
    if (validation.atsCompatible) stats.validation.atsCompatible++;
    if (validation.printFriendly) stats.validation.printFriendly++;
    if (validation.mobileResponsive) stats.validation.mobileResponsive++;
    if (validation.brandConsistent) stats.validation.brandConsistent++;
    if (validation.overall) stats.validation.overall++;
  });
  
  return stats;
};

// Auto-run validation if this file is imported
if (typeof window === 'undefined') { // Only run in Node.js environment
  validateAllTemplates();
}

export default { validateAllTemplates, getTemplateStats };