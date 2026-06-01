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
import { evaluateQuery } from "@/utils/queryExecutor";
import { User } from "@/types/data";
import { users } from "@/lib/mockData";
import { SavedQuery, QueryHistoryItem } from "@/types/savedQuery";

type ExecutionState = "idle" | "running" | "success" | "empty";

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
  runQuery: () => Promise<void>;
  clearResults: () => void;
  executionState: ExecutionState;
  savedQueries: SavedQuery[];
  queryHistory: QueryHistoryItem[];
  executedTree: QueryNode | null;
  addSavedQuery: (tree: QueryNode, name?: string) => void;
  loadSavedQuery: (query: { tree: QueryNode }) => void;

  addToHistory: (query: QueryNode) => void;
}

export const useQueryStore = create<QueryStore>((set, get) => ({
  tree: createGroup(),
  compiledQuery: null,
  executionState: "idle",
  validationErrors: [],
  results: [],
  isLoading: false,
  executedTree: null,

  savedQueries: [],
  queryHistory: [],

  setTree: (tree) => set({ tree, compiledQuery: compileTreeToMongo(tree) }),
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

  addToHistory: (tree) =>
    set((state) => ({
      queryHistory: [
        {
          id: crypto.randomUUID(),
          tree,
          createdAt: Date.now(),
        },
        ...state.queryHistory,
      ],
    })),

  runQuery: async () => {
    set({ isLoading: true, executionState: "running" });

    await new Promise((res) => setTimeout(res, 300));

    const tree = get().tree;
    const results = evaluateQuery(tree, users);

    get().addToHistory(tree);

    const executionState: ExecutionState =
      results.length > 0 ? "success" : "empty";

    set({
      results,
      isLoading: false,
      executionState,
      executedTree: tree,
    });
  },

  clearResults: () => {
    set({
      results: [],
      isLoading: false,
      executionState: "idle",
    });
  },
  addSavedQuery: (tree, name = `Query ${new Date().toLocaleTimeString()}`) =>
    set((state) => {
      const exists = state.savedQueries.some(
        (q) => JSON.stringify(q.tree) === JSON.stringify(tree),
      );

      if (exists) return state;

      return {
        savedQueries: [
          {
            id: crypto.randomUUID(),
            name,
            tree,
            createdAt: Date.now(),
          },
          ...state.savedQueries,
        ],
      };
    }),
  loadSavedQuery: (saved) => {
    set({
      tree: saved.tree,
      compiledQuery: compileTreeToMongo(saved.tree),
      executionState: "idle",
      results: [],
      executedTree: null,
    });
  },
}));
