export default class Changelog {
  previousVariant: string;
  updatedVariant: string;
  timestamp: number;

  constructor(previousVariant: string, updatedVariant: string, timestamp: number) {
    this.previousVariant = previousVariant;
    this.updatedVariant = updatedVariant;
    this.timestamp = timestamp;
  }
}
