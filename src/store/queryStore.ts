import { create } from "zustand";
import { QueryNode } from "@/types/query";
import { createGroup } from "@/utils/createNode";
import { addNode } from "@/utils/addNode";
import { removeNode } from "@/utils/removeNode";
import { updateNode } from "@/utils/updateRuleValue";
import { validateQuery } from "@/utils/validateQuery";
import { ValidationError as AppValidationError  } from "@/types/validation";
import { toast } from "sonner";

interface QueryStore {
  tree: QueryNode;

  setTree: (tree: QueryNode) => void;

  addNodeToTree: (parentId: string, node: QueryNode) => void;

  removeNodeFromTree: (nodeId: string) => void;
  updateNodeInTree: (nodeId: string, updates: Partial<QueryNode>) => void;
  validationErrors: AppValidationError[];
  setValidationErrors: (errors: AppValidationError[]) => void;
}

export const useQueryStore = create<QueryStore>((set, get) => ({
  tree: createGroup(),

validationErrors: [],
  setTree: (tree) => set({ tree }),
  setValidationErrors: (errors) => set({ validationErrors: errors }),
  addNodeToTree: (parentId, node) => {
    const updated = addNode(get().tree, parentId, node);
    set({ tree: updated });
  },

  removeNodeFromTree: (nodeId) => {
    const updated = removeNode(get().tree, nodeId);
    set({ tree: updated });
  },

  updateNodeInTree: (nodeId, updates) => {
    const updated = updateNode(get().tree, nodeId, updates);
const errors = validateQuery(updated);

  set({ tree: updated, validationErrors: errors });
  if (errors.length > 0) {
    toast.error(errors[0].message);
  }
  },
  
}));
