export interface FeatureFlag {
  key: string;
  name: string;
  area: string;
  description: string;
  type: string;
  variants: Map<string, string>;
  defaultVariant: string;
  targeting: string;
  creationTime: number;
}
