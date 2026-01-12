import { Rule, TargetingStructure } from './targeting.types';
import { operatorTemplates } from './targeting-operators';

/**
 * Checks if a rule has all required fields
 */
export function isRuleComplete(rule: Rule): boolean {
  return !!(rule.variable && rule.operator && rule.value && rule.result);
}

/**
 * Generates the targeting JSON structure based on the rules
 */
export function generateTargeting(rules: Rule[]): string {
  const targetingRules = rules
    .map((rule) => {
      if (!isRuleComplete(rule)) return null;

      const conditionBuilder = operatorTemplates[rule.operator];
      if (!conditionBuilder) return null;

      return [conditionBuilder(rule.variable, rule.value), rule.result];
    })
    .filter(Boolean);

  const targeting: TargetingStructure = {
    if: targetingRules.flat(),
  };

  return JSON.stringify(targeting, null, 2);
}
