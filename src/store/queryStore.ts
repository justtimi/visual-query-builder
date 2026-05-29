import { create } from "zustand";
import { QueryNode } from "@/types/query";
import { createGroup } from "@/utils/createNodes";
import { addNode } from "@/utils/addNode";
import { removeNode } from "@/utils/removeNode";

interface QueryStore {
  tree: QueryNode;

  setTree: (tree: QueryNode) => void;

  addNodeToTree: (parentId: string, node: QueryNode) => void;

  removeNodeFromTree: (nodeId: string) => void;
}

export const useQueryStore = create<QueryStore>((set, get) => ({
  tree: createGroup(),

  setTree: (tree) => set({ tree }),

  addNodeToTree: (parentId, node) => {
    const updated = addNode(get().tree, parentId, node);
    set({ tree: updated });
  },

  removeNodeFromTree: (nodeId) => {
    const updated = removeNode(get().tree, nodeId);
    set({ tree: updated });
  },
}));
