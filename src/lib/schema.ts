import { SchemaField } from "@/types/schema";

export const schema: Record<string, SchemaField> = {
  name: {
    label: "Name",
    type: "string",
    uiType: "text",
    defaultValue: "",
  },
  age: {
    label: "Age",
    type: "number",
    uiType: "number",
    defaultValue: 0,
  },
  status: {
    label: "Status",
    type: "enum",
    uiType: "select",
    options: ["active", "inactive"],
    defaultValue: "active",
  },
  createdAt: {
    label: "Created At",
    type: "date",
    uiType: "date",
    defaultValue: "",
  },
};
