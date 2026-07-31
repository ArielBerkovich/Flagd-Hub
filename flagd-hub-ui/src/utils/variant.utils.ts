/**
 * Utility functions for handling feature flag variants
 */

/**
 * Gets variant keys from either a Map or plain object
 * Consolidates duplicate logic across components
 */
export function getVariantKeys(variants: Map<string, string> | Record<string, string> | undefined): string[] {
  if (!variants) return [];

  if (variants instanceof Map) {
    return Array.from(variants.keys());
  }

  return Object.keys(variants);
}

/**
 * Gets variant values from either a Map or plain object
 */
export function getVariantValues(variants: Map<string, string> | Record<string, string> | undefined): string[] {
  if (!variants) return [];

  if (variants instanceof Map) {
    return Array.from(variants.values());
  }

  return Object.values(variants);
}

/**
 * Gets a variant entry from either a Map or plain object
 */
export function getVariantEntries(variants: Map<string, string> | Record<string, string> | undefined): [string, string][] {
  if (!variants) return [];

  if (variants instanceof Map) {
    return Array.from(variants.entries());
  }

  return Object.entries(variants);
}

/**
 * Checks if a variant key exists
 */
export function hasVariant(variants: Map<string, string> | Record<string, string> | undefined, key: string): boolean {
  if (!variants) return false;

  if (variants instanceof Map) {
    return variants.has(key);
  }

  return key in variants;
}
