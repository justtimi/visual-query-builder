
import { QueryNode, RuleNode } from "@/types/query";
import { users } from "@/lib/mockData";
import { User } from "@/types/data";

export function executeQuery(tree: QueryNode) {
  return users.filter((item) => evaluateNode(item, tree));
}

function evaluateNode(item: User, node: QueryNode): boolean {
  if (node.type === "rule") {
    return evaluateRule(item, node);
  }

  if (node.type === "group") {
    const results = node.children.map((child) =>
      evaluateNode(item, child)
    );

    return node.logic === "AND"
      ? results.every(Boolean)
      : results.some(Boolean);
  }

  return false;
}

function evaluateRule(item: User, rule: RuleNode): boolean {
  const value = item[rule.field as keyof User];

  switch (rule.operator) {
    case "equals":
      return value === rule.value;

    case "not_equals":
      return value !== rule.value;

    case "contains":
      return String(value).includes(String(rule.value));

    case "greater_than":
      return Number(value) > Number(rule.value);

    case "less_than":
      return Number(value) < Number(rule.value);

    default:
      return false;
  }
}

