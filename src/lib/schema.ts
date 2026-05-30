import { SchemaField } from "@/types/schema";

export const schema: Record<string, SchemaField> = {
  name: {
    label: "Name",
    type: "string",
  },
  age: {
    label: "Age",
    type: "number",
  },
  status: {
    label: "Status",
    type: "enum",
    options: ["active", "inactive"],
  },
  createdAt: {
    label: "Created At",
    type: "date",
  },
};