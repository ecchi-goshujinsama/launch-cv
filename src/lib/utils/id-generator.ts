// Utility for generating predictable IDs during SSR/hydration
let idCounter = 0;

export function generateId(prefix = 'id'): string {
  // Use a predictable counter instead of Date.now() or Math.random()
  // This ensures server and client generate the same IDs during hydration
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function generateExperienceId(): string {
  return generateId('exp');
}

export function generateEducationId(): string {
  return generateId('edu');
}

export function generateProjectId(): string {
  return generateId('proj');
}

export function generateSkillId(): string {
  return generateId('skill');
}

export function generateCertificationId(): string {
  return generateId('cert');
}

// Reset counter (useful for testing)
export function resetIdCounter(): void {
  idCounter = 0;
}