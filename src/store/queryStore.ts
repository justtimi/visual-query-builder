import { create } from "zustand";
import { QueryNode } from "@/types/query";
import { createGroup } from "@/utils/createNode";
import { addNode } from "@/utils/addNode";
import { removeNode } from "@/utils/removeNode";
import { updateNode } from "@/utils/updateRuleValue";
import { validateQuery } from "@/utils/validateQuery";
import { ValidationError as AppValidationError } from "@/types/validation";
import { toast } from "sonner";
import { compileTreeToMongo } from "@/utils/queryCompiler";
import { executeQuery } from "@/utils/queryExecutor";
import { User } from "@/types/data";

interface QueryStore {
  tree: QueryNode;
  setTree: (tree: QueryNode) => void;
  addNodeToTree: (parentId: string, node: QueryNode) => void;
  removeNodeFromTree: (nodeId: string) => void;
  updateNodeInTree: (nodeId: string, updates: Partial<QueryNode>) => void;
  validationErrors: AppValidationError[];
  setValidationErrors: (errors: AppValidationError[]) => void;
  compiledQuery: Record<string, unknown> | null;
  results: User[];
  isLoading: boolean;
  executedTree: QueryNode | null;
  runQuery: () => Promise<void>;
  clearResults: () => void;
}

export const useQueryStore = create<QueryStore>((set, get) => ({
  tree: createGroup(),
  compiledQuery: null,
  validationErrors: [],
  results: [],
  isLoading: false,
  executedTree: null,

  setTree: (tree) => set({ tree }),
  setValidationErrors: (errors) => set({ validationErrors: errors }),

  addNodeToTree: (parentId, node) => {
    const updated = addNode(get().tree, parentId, node);
    set({ tree: updated, compiledQuery: compileTreeToMongo(updated) });
  },

  removeNodeFromTree: (nodeId) => {
    const updated = removeNode(get().tree, nodeId);
    set({ tree: updated, compiledQuery: compileTreeToMongo(updated) });
  },

  updateNodeInTree: (nodeId, updates) => {
    const updated = updateNode(get().tree, nodeId, updates);
    const errors = validateQuery(updated);

    const compiled = compileTreeToMongo(updated);
    set({ tree: updated, validationErrors: errors, compiledQuery: compiled });
    if (errors.length > 0) {
      toast.error(errors[0].message);
    }
  },

  runQuery: async () => {
    set({ isLoading: true });
    await new Promise((res) => setTimeout(res, 300));

    const tree = get().tree;
    const results = executeQuery(tree);

    set({ results, executedTree: tree, isLoading: false });
  },

  clearResults: () => {
    set({ results: [], executedTree: null });
  },
}));
