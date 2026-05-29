import { QueryNode, RuleNode } from "@/types/query";

export function updateRuleValue(
  tree: QueryNode,
  nodeId: string,
  value: RuleNode["value"]
): QueryNode {
  if (tree.id === nodeId && tree.type === "rule") {
    return {
      ...tree,
      value,
    };
  }

  if (tree.type === "group") {
    return {
      ...tree,
      children: tree.children.map((child) =>
        updateRuleValue(child, nodeId, value)
      ),
    };
  }

  return tree;
}