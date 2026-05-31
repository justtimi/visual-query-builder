/* import { Operator } from "@/types/query"; */

export const operatorMap: Record<string, string> = {
  equals: "",
  not_equals: "$ne",
  greater_than: "$gt",
  less_than: "$lt",
  contains: "$regex",
  starts_with: "$regex",
  in: "$in",
};