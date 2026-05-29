import { QueryNode } from "@/types/query";

export function addNode(
  tree: QueryNode,
  parentId: string,
  newNode: QueryNode
): QueryNode {
  if (tree.id === parentId && tree.type === "group") {
    return {
      ...tree,
      children: [...tree.children, newNode],
    };
  }

  if (tree.type === "group") {
    return {
      ...tree,
      children: tree.children.map((child) =>
        addNode(child, parentId, newNode)
      ),
    };
  }

  return tree;
}