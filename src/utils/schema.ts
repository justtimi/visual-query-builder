import { schema } from "@/lib/schema";

export function getFieldType(field: string) {
  return schema[field]?.type;
}

export function getEnumOptions(field: string) {
  return schema[field]?.options ?? [];
}

export function getFields() {
  return Object.keys(schema);
}

export function getDefaultValue(field: string) {
   return schema[field]?.defaultValue ?? "";
}

export function getFieldUiType(field: string) {
  return schema[field]?.uiType;
}