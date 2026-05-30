import { schema } from "@/lib/schema";
import { FieldType } from "@/types/schema";

export function getFieldType(field: string) {
  return schema[field]?.type;
}

export function getEnumOptions(field: string) {
  return schema[field]?.options ?? [];
}

export function getFields() {
  return Object.keys(schema);
}

export function getDefaultValue(type: FieldType) {
  switch (type) {
    case "string":
      return "";
    case "number":
      return 0;
    case "date":
      return "";
    case "enum":
      return "";
    default:
      return "";
  }
}