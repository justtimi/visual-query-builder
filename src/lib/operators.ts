import { Operator } from "@/types/query";
import { FieldType } from "@/types/schema";

export const operatorsByType: Record<FieldType, Operator[]> = {
  string: ["equals", "not_equals", "contains", "starts_with"],
  number: ["equals", "not_equals", "greater_than", "less_than"],
  date: ["equals", "before", "after", "between", "on_or_before", "on_or_after"],
  enum: ["equals", "not_equals", "in", "not_in"],
};
