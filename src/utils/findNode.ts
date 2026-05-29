import { QueryNode } from "@/types/query";

export function findNode(
  tree: QueryNode,
  id: string
): QueryNode | null {
  if (tree.id === id) return tree;

  if (tree.type === "group") {
    for (const child of tree.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
  }

  return null;
}