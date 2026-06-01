import { QueryNode, RuleNode } from "@/types/query";

type OperatorFn = (a: unknown, b: unknown) => boolean;

export function evaluateQuery<T extends Record<string, unknown>>(
  tree: QueryNode,
  data: T[],
) {
  return data.filter((item) => evaluateNode(item, tree));
}

function evaluateNode<T extends Record<string, unknown>>(
  item: T,
  node: QueryNode,
): boolean {
  if (node.type === "rule") {
    return evaluateRule(item, node);
  }

  if (node.type === "group") {
    const results = node.children.map((child) => evaluateNode(item, child));

    return node.logic === "AND"
      ? results.every(Boolean)
      : results.some(Boolean);
  }

  return false;
}

function evaluateRule<T extends Record<string, unknown>>(
  item: T,
  rule: RuleNode,
): boolean {
  const value = item[rule.field as keyof T];

  const operators: Record<string, OperatorFn> = {
    equals: (a, b) => a === b,
    not_equals: (a, b) => a !== b,
    contains: (a, b) => String(a).includes(String(b)),
    greater_than: (a, b) => Number(a) > Number(b),
    less_than: (a, b) => Number(a) < Number(b),
  };

  const op = operators[rule.operator];

  if (!op) return false;

  return op(value, rule.value);
}
