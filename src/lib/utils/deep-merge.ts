/**
 * Deep merge utility for safely merging nested objects
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T> | undefined | null): T {
  if (!source || typeof source !== 'object') {
    return target;
  }

  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue) &&
          targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)) {
        // Both are objects, merge recursively
        result[key] = deepMerge(targetValue, sourceValue);
      } else if (sourceValue !== undefined) {
        // Source value is defined, use it
        result[key] = sourceValue;
      }
    }
  }

  return result;
}