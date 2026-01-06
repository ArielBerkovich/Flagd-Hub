import React, { useState, useEffect } from "react";
import "./targeting.css";

// Type definitions
interface Rule {
  variable: string;
  operator: string;
  value: string;
  result: string;
}

interface TargetingProps {
  variants: string[];
  setTargeting: (value: string) => void;
  initialTargeting?: string;
}

interface OperatorTemplate {
  (variable: string, value: string): any;
}

// Template functions for various operation types
const templateBuilders = {
  equality: (operator: string, variable: string, value: string) => ({
    [operator]: [{ "var": variable }, value]
  }),
  
  comparison: (operator: string, variable: string, value: string) => ({
    [operator]: [{ "var": variable }, value]
  }),
  
  listCheck: (operator: string, variable: string, value: string) => ({
    [operator]: [
      { "var": variable }, 
      value.split(",").map(v => v.trim())
    ]
  }),
  
  negation: (template: any) => ({
    "!": template
  })
};

// Available operators grouped by type
const OPERATORS = {
  STRING_OPERATORS: ["starts_with", "ends_with", "contains_string", "not_contains_string"],
  LIST_OPERATORS: ["in_list", "not_in_list"],
  EQUALITY_OPERATORS: ["==", "===", "!=", "!=="],
  COMPARISON_OPERATORS: [">", ">=", "<", "<="]
};

// Combined list of all operators for the dropdown
const allOperators = [
  ...OPERATORS.STRING_OPERATORS,
  ...OPERATORS.LIST_OPERATORS,
  ...OPERATORS.EQUALITY_OPERATORS,
  ...OPERATORS.COMPARISON_OPERATORS
];

// Mapping of operators to their template functions
const operatorTemplates: Record<string, OperatorTemplate> = {
  // String operations
  "starts_with": (variable, value) => 
    templateBuilders.comparison("starts_with", variable, value),
    
  "ends_with": (variable, value) => 
    templateBuilders.comparison("ends_with", variable, value),
    
  "contains_string": (variable, value) => 
    templateBuilders.comparison("in", variable, value),
    
  "not_contains_string": (variable, value) => 
    templateBuilders.negation(templateBuilders.comparison("in", variable, value)),
  
  // List operations
  "in_list": (variable, value) => 
    templateBuilders.listCheck("in", variable, value),
    
  "not_in_list": (variable, value) => 
    templateBuilders.negation(templateBuilders.listCheck("in", variable, value)),
  
  // Equality operations
  "==": (variable, value) => 
    templateBuilders.equality("===", variable, value),
    
  "===": (variable, value) => 
    templateBuilders.equality("===", variable, value),
    
  "!=": (variable, value) => 
    templateBuilders.equality("!==", variable, value),
    
  "!==": (variable, value) => 
    templateBuilders.equality("!==", variable, value),
  
  // Comparison operations
  ">": (variable, value) => 
    templateBuilders.comparison(">", variable, value),
    
  "<": (variable, value) => 
    templateBuilders.comparison("<", variable, value),
    
  ">=": (variable, value) => 
    templateBuilders.comparison(">=", variable, value),
    
  "<=": (variable, value) => 
    templateBuilders.comparison("<=", variable, value),
};

/**
 * Generates the targeting JSON structure based on the rules
 */
const generateTargeting = (rules: Rule[], setTargeting: (value: string) => void) => {
  // Map each rule to a condition-result pair
  const targetingRules = rules
    .map((rule) => {
      // Skip incomplete rules
      if (!isRuleComplete(rule)) return null;

      const conditionBuilder = operatorTemplates[rule.operator];
      if (!conditionBuilder) return null;

      // Create the condition-result pair
      return [
        conditionBuilder(rule.variable, rule.value),
        rule.result
      ];
    })
    .filter(Boolean); // Remove null entries

  // Format the final targeting structure
  const targeting = {
    if: targetingRules.flat()
  };
  
  // Pass the formatted JSON to the parent component
  setTargeting(JSON.stringify(targeting, null, 2));
};

/**
 * Checks if a rule has all required fields
 */
const isRuleComplete = (rule: Rule): boolean => {
  return !!(rule.variable && rule.operator && rule.value && rule.result);
};

/**
 * Parses targeting JSON back into rules for editing
 */
const parseTargetingToRules = (targetingJson: string): Rule[] => {
  if (!targetingJson || targetingJson.trim() === '') return [];

  try {
    const targeting = JSON.parse(targetingJson);
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
};

/**
 * Parses a single condition object into a Rule
 */
const parseCondition = (condition: any, result: string): Rule | null => {
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
    result
  };
};

const Targeting: React.FC<TargetingProps> = ({ variants, setTargeting, initialTargeting }) => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Initialize rules from existing targeting JSON when component mounts
  useEffect(() => {
    if (initialTargeting && !initialized) {
      const parsedRules = parseTargetingToRules(initialTargeting);
      if (parsedRules.length > 0) {
        setRules(parsedRules);
      }
      setInitialized(true);
    }
  }, [initialTargeting, initialized]);

  // Generate targeting JSON whenever rules change (but skip initial empty state)
  useEffect(() => {
    if (initialized || rules.length > 0) {
      generateTargeting(rules, setTargeting);
    }
  }, [rules, setTargeting, initialized]);

  // Handler functions
  const addRule = () => {
    setRules([...rules, { variable: "", operator: "", value: "", result: "" }]);
  };

  const updateRule = (index: number, key: keyof Rule, value: string) => {
    const updatedRules = [...rules];
    updatedRules[index][key] = value;
    setRules(updatedRules);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  // UI components
  const renderRulePrefix = (index: number) => (
    <label>{index === 0 ? "if" : "else if"}</label>
  );

  const renderVariableInput = (rule: Rule, index: number) => (
    <input
      type="text"
      value={rule.variable}
      onChange={(e) => updateRule(index, "variable", e.target.value)}
      placeholder="Variable"
      className="targeting-input"
      aria-label="Variable name"
    />
  );

  const renderOperatorSelect = (rule: Rule, index: number) => (
    <select
      value={rule.operator}
      onChange={(e) => updateRule(index, "operator", e.target.value)}
      className="targeting-select"
      aria-label="Operator"
    >
      <option value="" disabled hidden>
        Select Operator
      </option>
      {allOperators.map((op) => (
        <option key={op} value={op}>{op}</option>
      ))}
    </select>
  );

  const renderValueInput = (rule: Rule, index: number) => (
    <input
      type="text"
      value={rule.value}
      onChange={(e) => updateRule(index, "value", e.target.value)}
      placeholder="Value"
      className="targeting-input"
      aria-label="Comparison value"
    />
  );

  const renderResultSelect = (rule: Rule, index: number) => (
    <>
      <span>then return</span>
      <select
        value={rule.result}
        onChange={(e) => updateRule(index, "result", e.target.value)}
        className="targeting-select"
        aria-label="Result variant"
      >
        <option value="" disabled hidden>
          Select Result
        </option>
        {variants.map((variant) => (
          <option key={variant} value={variant}>{variant}</option>
        ))}
      </select>
    </>
  );

  const renderRemoveButton = (index: number) => (
    <button
      onClick={() => removeRule(index)}
      className="remove-rule-button targeting-button"
      aria-label="Remove rule"
    >
      X
    </button>
  );

  return (
    <div className="targeting-container">
      <h2 className="targeting-title">Targeting Rules</h2>
      
      {rules.map((rule, index) => (
        <div key={index} className="targeting-rule">
          {renderRulePrefix(index)}
          {renderVariableInput(rule, index)}
          {renderOperatorSelect(rule, index)}
          {renderValueInput(rule, index)}
          {renderResultSelect(rule, index)}
          {renderRemoveButton(index)}
        </div>
      ))}

      <button 
        onClick={addRule} 
        className="add-rule-button targeting-button"
        aria-label="Add rule"
      >
        + Add Rule
      </button>
    </div>
  );
};

export default Targeting;