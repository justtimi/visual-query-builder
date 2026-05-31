export type LogicOperator = "AND" | "OR";

export type Operator =
  | "equals"
  | "not_equals"
  | "contains"
  | "starts_with"
  | "greater_than"
  | "less_than"
  | "in"
  | "between"
  | "before"
  | "after"
  | "on_or_before"
  | "on_or_after"
  | "not_in";

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