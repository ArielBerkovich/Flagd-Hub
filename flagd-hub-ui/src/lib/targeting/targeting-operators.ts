import { OperatorTemplate } from './targeting.types';

// Template builders for various operation types
export const templateBuilders = {
  equality: (operator: string, variable: string, value: string) => ({
    [operator]: [{ var: variable }, value],
  }),

  comparison: (operator: string, variable: string, value: string) => ({
    [operator]: [{ var: variable }, value],
  }),

  listCheck: (operator: string, variable: string, value: string) => ({
    [operator]: [{ var: variable }, value.split(',').map((v) => v.trim())],
  }),

  negation: (template: any) => ({
    '!': template,
  }),
};

// Available operators grouped by type
export const OPERATORS = {
  STRING_OPERATORS: ['starts_with', 'ends_with', 'contains_string', 'not_contains_string'],
  LIST_OPERATORS: ['in_list', 'not_in_list'],
  EQUALITY_OPERATORS: ['==', '===', '!=', '!=='],
  COMPARISON_OPERATORS: ['>', '>=', '<', '<='],
} as const;

// Combined list of all operators
export const ALL_OPERATORS = [
  ...OPERATORS.STRING_OPERATORS,
  ...OPERATORS.LIST_OPERATORS,
  ...OPERATORS.EQUALITY_OPERATORS,
  ...OPERATORS.COMPARISON_OPERATORS,
];

// Mapping of operators to their template functions
export const operatorTemplates: Record<string, OperatorTemplate> = {
  // String operations
  starts_with: (variable, value) => templateBuilders.comparison('starts_with', variable, value),
  ends_with: (variable, value) => templateBuilders.comparison('ends_with', variable, value),
  contains_string: (variable, value) => templateBuilders.comparison('in', variable, value),
  not_contains_string: (variable, value) =>
    templateBuilders.negation(templateBuilders.comparison('in', variable, value)),

  // List operations
  in_list: (variable, value) => templateBuilders.listCheck('in', variable, value),
  not_in_list: (variable, value) =>
    templateBuilders.negation(templateBuilders.listCheck('in', variable, value)),

  // Equality operations
  '==': (variable, value) => templateBuilders.equality('===', variable, value),
  '===': (variable, value) => templateBuilders.equality('===', variable, value),
  '!=': (variable, value) => templateBuilders.equality('!==', variable, value),
  '!==': (variable, value) => templateBuilders.equality('!==', variable, value),

  // Comparison operations
  '>': (variable, value) => templateBuilders.comparison('>', variable, value),
  '<': (variable, value) => templateBuilders.comparison('<', variable, value),
  '>=': (variable, value) => templateBuilders.comparison('>=', variable, value),
  '<=': (variable, value) => templateBuilders.comparison('<=', variable, value),
};
