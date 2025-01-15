export default class FeatureFlag {
  key: string;
  name: string;
  area: string;
  description: string;
  type: string
  variants: Record<string, string>;
  defaultVariant: string;

  /**
   * Creates a new FeatureFlag instance.
   * @param key - The unique identifier for the flag.
   * @param name - The name of the flag.
   * @param area - The name of the area this flag belongs to.
   * @param description - A description of the flag.
   * @param type - The type of the flag (boolean, string, integer, float, object).
   * @param variants - A dictionary of possible variants for the flag.
   * @param defaultVariant - The chosen variant of the flag.
   */
  constructor({
    key,
    name,
    area,
    description,
    type,
    variants,
    defaultVariant,
  }: {
    key: string;
    name: string;
    area: string;
    description: string;
    type: string;
    variants: Record<string, string>;
    defaultVariant: string;
  }) {
    this.key = key;
    this.name = name;
    this.area = area;
    this.description = description;
    this.type = type;
    this.variants = variants;
    this.defaultVariant = defaultVariant;
  }
}
