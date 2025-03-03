import React from "react";
import { useState } from "react";
import "./targeting.css";

interface Rule {
  variable: string;
  operator: string;
  value: string;
  result: string;
}

interface TargetingProps {
  variants: string[];
  setTargeting: (value: string) => void;
}

const sharedTemplates = {
  equality: (operator: string, variable: string, value: string) => ({
    [operator]: [{ "var": variable }, value]
  }),
  comparison: (operator: string, variable: string, value: string) => ({
    [operator]: [{ "var": variable }, value]
  }),
  listCheck: (operator: string, variable: string, value: string) => ({
    [operator]: [{ "var": variable }, value.split(",").map(v => v.trim())]
  })
};

// , "!!", "!",

const operators = [
  "starts_with", "ends_with","contains_string", "not_contains_string", "in_list", "not_in_list", "==", "===", "!=", "!==", ">", ">=", "<", "<="
];

// Assigning shared templates to multiple operators
const operatorTemplates: Record<string, (variable: string, value: string) => any> = {
  "starts_with": (variable, value) => sharedTemplates.comparison("starts_with", variable, value),
  "ends_with": (variable, value) => sharedTemplates.comparison("ends_with", variable, value),
  "contains_string": (variable, value) => sharedTemplates.comparison("in", variable, value),
  "not_contains_string": (variable, value) => ({ 
    "!": sharedTemplates.comparison("in", variable, value)
  }),
  "in_list": (variable, value) => sharedTemplates.listCheck("in", variable, value),
  "not_in_list": (variable, value) => ({
    "!": sharedTemplates.listCheck("in", variable, value)
  }),
  "==": (variable, value) => sharedTemplates.equality("===", variable, value),
  "===": (variable, value) => sharedTemplates.equality("===", variable, value),
  "!=": (variable, value) => sharedTemplates.equality("!==", variable, value),
  "!==": (variable, value) => sharedTemplates.equality("!==", variable, value),
  ">": (variable, value) => sharedTemplates.comparison(">", variable, value),
  "<": (variable, value) => sharedTemplates.comparison("<", variable, value),
  ">=": (variable, value) => sharedTemplates.comparison(">=", variable, value),
  "<=": (variable, value) => sharedTemplates.comparison("<=", variable, value),
};


const generateTargeting = (updatedRules: Rule[],setTargeting:(value: string) => void) => {
  const targetingArray = updatedRules.map((rule) => {
    if (!rule.variable || !rule.operator || !rule.value || !rule.result) return null;

    const conditionBuilder = operatorTemplates[rule.operator];
    if (!conditionBuilder) return null;


    return [
      {
        ...conditionBuilder(rule.variable, rule.value)
      },
      rule.result
    ]
  }).filter(Boolean); // Remove any null values

  const targeting = {
    if:targetingArray.flatMap(innerArray => innerArray)
  }
  
  setTargeting(JSON.stringify(targeting, null, 2));
};

const Targeting: React.FC<TargetingProps> = ({ variants, setTargeting }) => {
  const [rules, setRules] = useState<Rule[]>([]);

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

  generateTargeting(rules,setTargeting)
  
  return (
    <div className="targeting-container">
      <h2 className="targeting-title">Targeting Rules</h2>
      {rules.map((rule, index) => (
        <div key={index} className="targeting-rule">
          {index === 0 ? <label>if</label> : <label>else if</label>}

          <input
            type="text"
            value={rule.variable}
            onChange={(e) => updateRule(index, "variable", e.target.value)}
            placeholder="Variable"
            className="targeting-input"
          />

          <select
            value={rule.operator}
            onChange={(e) => updateRule(index, "operator", e.target.value)}
            className="targeting-select"
          >
            <option value="" disabled hidden>
              Select Operator
            </option>
            {operators.map((op) => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>

          <input
            type="text"
            value={rule.value}
            onChange={(e) => updateRule(index, "value", e.target.value)}
            placeholder="Value"
            className="targeting-input"
          />

          <span>then return</span>

          <select
            value={rule.result}
            onChange={(e) => updateRule(index, "result", e.target.value)}
            className="targeting-select"
          >
            <option value="" disabled hidden>
              Select Result
            </option>
            {variants.map((variant) => (
              <option key={variant} value={variant}>{variant}</option>
            ))}
          </select>

          <button
            onClick={() => removeRule(index)}
            className="remove-rule-button targeting-button"
          >
            X
          </button>
        </div>
      ))}

      <button onClick={addRule} className="add-rule-button targeting-button">
        + Add Rule
      </button>
    </div>
  );
};

export default Targeting;
