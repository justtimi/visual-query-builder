export type FieldType = "string" | "number" | "date" | "enum";

export type SchemaField = {
  label: string;
  type: FieldType;
  options?: string[];
  defaultValue?: string | number;
  uiType?: "text" | "number" | "select" | "date";
};