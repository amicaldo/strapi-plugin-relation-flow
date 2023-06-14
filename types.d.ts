export type Attribute = [string, AttributeOptions];

export interface AttributeOptions {
  type: string;
  targetModel?: string; // only for relation fields
  relationType?: string; // only for relation fields
}

export interface WatchContentResult {
  id: number;
  mainField: string;
  [key: string]: any;
}
