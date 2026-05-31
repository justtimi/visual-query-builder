import { GroupNode, QueryNode, RuleNode } from "@/types/query";

export function updateNode(
  tree: QueryNode,
  nodeId: string,
  updates: Partial<RuleNode> | Partial<GroupNode>,
): QueryNode {
  if (tree.id === nodeId) {
    if (tree.type === "rule") {
      return {
        ...tree,
        ...(updates as Partial<RuleNode>),
      };
    }

    return {
      ...tree,
      ...(updates as Partial<GroupNode>),
    };
  }

  if (tree.type === "group") {
    return {
      ...tree,
      children: tree.children.map((child) =>
        updateNode(child, nodeId, updates),
      ),
    };
  }
  return tree;
}
