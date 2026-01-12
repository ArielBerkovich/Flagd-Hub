import React, { useState, useEffect } from "react";
import "./targeting.css";
import { Rule, ALL_OPERATORS, generateTargeting, parseTargetingToRules } from '../../../../lib/targeting';

interface TargetingProps {
  variants: string[];
  setTargeting: (value: string) => void;
  initialTargeting?: string;
}

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
      const targetingJson = generateTargeting(rules);
      setTargeting(targetingJson);
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
      {ALL_OPERATORS.map((op) => (
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