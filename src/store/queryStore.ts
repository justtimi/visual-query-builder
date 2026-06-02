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
  deleteSavedQuery: (id: string) => void;

  addToHistory: (query: QueryNode) => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export const useQueryStore = create<QueryStore>((set, get) => ({
  tree: createGroup(),
  compiledQuery: null,
  executionState: "idle",
  validationErrors: [],
  results: [],
  isLoading: false,
  executedTree: null,

  // load saved queries from localStorage when available
  savedQueries: ((): SavedQuery[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("savedQueries");
      return raw ? (JSON.parse(raw) as SavedQuery[]) : [];
    } catch (e) {
      return [];
    }
  })(),
  // load query history from localStorage when available
  queryHistory: ((): QueryHistoryItem[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("queryHistory");
      return raw ? (JSON.parse(raw) as QueryHistoryItem[]) : [];
    } catch (e) {
      return [];
    }
  })(),
  selectedTab: "builder",

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
    set((state) => {
      const next: QueryHistoryItem[] = [
        {
          id: crypto.randomUUID(),
          tree,
          createdAt: Date.now(),
        },
        ...state.queryHistory,
      ];

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("queryHistory", JSON.stringify(next));
        } catch (e) {}
      }

      return { queryHistory: next };
    }),

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

      const newList: SavedQuery[] = [
        {
          id: crypto.randomUUID(),
          name,
          tree,
          createdAt: Date.now(),
        },
        ...state.savedQueries,
      ];

      // persist to localStorage on client
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("savedQueries", JSON.stringify(newList));
        } catch (e) {
          // ignore storage errors
        }
      }

      return {
        savedQueries: newList,
      };
    }),
  deleteSavedQuery: (id) =>
    set((state) => {
      const target = state.savedQueries.find((query) => query.id === id);
      if (!target) return state;

      const nextSavedQueries = state.savedQueries.filter(
        (query) => query.id !== id,
      );
      const nextHistory = state.queryHistory.filter(
        (item) => JSON.stringify(item.tree) !== JSON.stringify(target.tree),
      );

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            "savedQueries",
            JSON.stringify(nextSavedQueries),
          );
          localStorage.setItem("queryHistory", JSON.stringify(nextHistory));
        } catch (e) {
          // ignore storage errors
        }
      }

      return {
        savedQueries: nextSavedQueries,
        queryHistory: nextHistory,
      };
    }),
  loadSavedQuery: (saved) => {
    set({
      tree: saved.tree,
      compiledQuery: compileTreeToMongo(saved.tree),
      executionState: "idle",
      results: [],
      executedTree: null,
      selectedTab: "builder",
    });
  },
  setSelectedTab: (tab: string) => set({ selectedTab: tab }),
}));
