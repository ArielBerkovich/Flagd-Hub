import { FeatureFlag } from '../models';

/**
 * Converts variant objects to Maps for feature flags
 * Handles both array of flags and single flag
 */
export function convertVariantsToMap(flags: any[]): FeatureFlag[] {
  return flags.map(flag => ({
    ...flag,
    variants: variantObjectToMap(flag.variants),
  }));
}

/**
 * Converts a variants object to a Map
 */
export function variantObjectToMap(variants: any): Map<string, string> {
  if (variants instanceof Map) {
    return variants;
  }

  const variantsMap = new Map<string, string>();
  if (variants && typeof variants === 'object') {
    Object.entries(variants).forEach(([key, value]) => {
      variantsMap.set(key, value as string);
    });
  }

  return variantsMap;
}

/**
 * Converts a variants Map to a plain object (for API serialization)
 */
export function variantMapToObject(variants: Map<string, string>): Record<string, string> {
  return Object.fromEntries(variants);
}

/**
 * Serializes a feature flag for API transmission
 */
export function serializeFeatureFlag(flag: FeatureFlag): any {
  return {
    ...flag,
    variants: variantMapToObject(flag.variants),
  };
}
