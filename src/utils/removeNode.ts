import { QueryNode } from "@/types/query";

export function removeNode(
  tree: QueryNode,
  nodeId: string
): QueryNode {
  if (tree.type === "group") {
    return {
      ...tree,
      children: tree.children
        .filter((child) => child.id !== nodeId)
        .map((child) => removeNode(child, nodeId)),
    };
  }

  return tree;
}