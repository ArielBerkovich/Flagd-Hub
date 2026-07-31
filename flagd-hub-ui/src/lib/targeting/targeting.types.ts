export interface Rule {
  variable: string;
  operator: string;
  value: string;
  result: string;
}

export interface TargetingStructure {
  if: any[];
}

export interface OperatorTemplate {
  (variable: string, value: string): any;
}
