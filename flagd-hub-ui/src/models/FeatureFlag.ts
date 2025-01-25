export default class FeatureFlag {
  key: string;
  name: string;
  area: string;
  description: string;
  type: string
  variants: Map<string, string>;
  defaultVariant: string;
  targeting: string;
  creationTime: number;
  wasChanged: boolean;

  /**
   * Creates a new FeatureFlag instance.
   * @param key - The unique identifier for the flag.
   * @param name - The name of the flag.
   * @param area - The name of the area this flag belongs to.
   * @param description - A description of the flag.
   * @param type - The type of the flag (boolean, string, integer, float, object).
   * @param variants - A dictionary of possible variants for the flag.
   * @param defaultVariant - The chosen variant of the flag.
   * @param creationTime - The creation time of the flag.
   */
  constructor({
    key,
    name,
    area,
    description,
    type,
    variants,
    defaultVariant,
    creationTime,
  }: {
    key: string;
    name: string;
    area: string;
    description: string;
    type: string;
    variants: Map<string, string>;
    defaultVariant: string;
    creationTime: number;
  }) {
    this.key = key;
    this.name = name;
    this.area = area;
    this.description = description;
    this.type = type;
    this.variants = variants;
    this.defaultVariant = defaultVariant;
    this.targeting = "";
    this.creationTime=creationTime;
    this.wasChanged = false;
  }
}
