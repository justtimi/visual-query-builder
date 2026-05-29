export type LogicOperator = "AND" | "OR";

export type Operator =
  | "equals"
  | "not_equals"
  | "contains"
  | "starts_with"
  | "greater_than"
  | "less_than"
  | "in"
  | "between";

export type FieldType = "string" | "number" | "date" | "enum";

export type ValueType = string | number | boolean | string[] | number[];

export interface BaseNode {
  id: string;
}

export interface RuleNode extends BaseNode {
  type: "rule";
  field: string;
  operator: Operator;
  value: ValueType;
}

export interface GroupNode extends BaseNode {
  type: "group";
  logic: LogicOperator;
  children: QueryNode[];
}

export type QueryNode = RuleNode | GroupNode;