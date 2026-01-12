import { Rule, TargetingStructure } from './targeting.types';

/**
 * Parses a single condition object into a Rule
 */
function parseCondition(condition: any, result: string): Rule | null {
  // Handle negation wrapper
  if (condition['!']) {
    const innerCondition = condition['!'];
    const rule = parseCondition(innerCondition, result);
    if (rule) {
      // Map back to negated operators
      if (rule.operator === 'in') rule.operator = 'not_contains_string';
      else if (rule.operator === 'in_list') rule.operator = 'not_in_list';
    }
    return rule;
  }

  // Get the operator (first key in condition)
  const operator = Object.keys(condition)[0];
  if (!operator) return null;

  const operands = condition[operator];
  if (!Array.isArray(operands) || operands.length < 2) return null;

  // Extract variable and value
  const variableObj = operands[0];
  const value = operands[1];

  if (!variableObj || typeof variableObj !== 'object' || !variableObj.var) return null;

  const variable = variableObj.var;

  // Map operator back to UI operator
  let uiOperator = operator;
  if (operator === 'starts_with' || operator === 'ends_with') {
    uiOperator = operator;
  } else if (operator === 'in' && Array.isArray(value)) {
    uiOperator = 'in_list';
  } else if (operator === 'in') {
    uiOperator = 'contains_string';
  } else if (operator === '===') {
    uiOperator = '===';
  } else if (operator === '!==') {
    uiOperator = '!==';
  }

  // Format value
  let formattedValue = value;
  if (Array.isArray(value)) {
    formattedValue = value.join(', ');
  }

  return {
    variable,
    operator: uiOperator,
    value: String(formattedValue),
    result,
  };
}

/**
 * Parses targeting JSON back into rules for editing
 */
export function parseTargetingToRules(targetingJson: string): Rule[] {
  if (!targetingJson || targetingJson.trim() === '') return [];

  try {
    const targeting: TargetingStructure = JSON.parse(targetingJson);
    if (!targeting.if || !Array.isArray(targeting.if)) return [];

    const parsedRules: Rule[] = [];
    const ifArray = targeting.if;

    // Process pairs of [condition, result]
    for (let i = 0; i < ifArray.length; i += 2) {
      const condition = ifArray[i];
      const result = ifArray[i + 1];

      if (!condition || !result) continue;

      const rule = parseCondition(condition, result);
      if (rule) parsedRules.push(rule);
    }

    return parsedRules;
  } catch (e) {
    console.error('Failed to parse targeting JSON:', e);
    return [];
  }
}
