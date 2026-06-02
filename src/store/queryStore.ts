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

const MAX_HISTORY = 50;

const cloneTree = (tree: QueryNode): QueryNode =>
  JSON.parse(JSON.stringify(tree)) as QueryNode;

const treesMatch = (left: QueryNode, right: QueryNode) =>
  JSON.stringify(left) === JSON.stringify(right);

const buildTreeState = (tree: QueryNode) => ({
  tree,
  compiledQuery: compileTreeToMongo(tree),
  validationErrors: validateQuery(tree),
  results: [],
  isLoading: false,
  executionState: "idle" as ExecutionState,
  executedTree: null,
});

interface QueryStore {
  tree: QueryNode;
  pastTrees: QueryNode[];
  futureTrees: QueryNode[];
  canUndo: boolean;
  canRedo: boolean;
  setTree: (tree: QueryNode) => void;
  addNodeToTree: (parentId: string, node: QueryNode) => void;
  removeNodeFromTree: (nodeId: string) => void;
  updateNodeInTree: (nodeId: string, updates: Partial<QueryNode>) => void;
  undo: () => void;
  redo: () => void;
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
  pastTrees: [],
  futureTrees: [],
  canUndo: false,
  canRedo: false,
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
    } catch {
      return [];
    }
  })(),
  // load query history from localStorage when available
  queryHistory: ((): QueryHistoryItem[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("queryHistory");
      return raw ? (JSON.parse(raw) as QueryHistoryItem[]) : [];
    } catch {
      return [];
    }
  })(),
  selectedTab: "builder",

  setTree: (tree) =>
    set((state) => {
      if (treesMatch(state.tree, tree)) return state;

      const pastTrees = [...state.pastTrees, cloneTree(state.tree)].slice(
        -MAX_HISTORY,
      );

      return {
        ...buildTreeState(tree),
        pastTrees,
        futureTrees: [],
        canUndo: pastTrees.length > 0,
        canRedo: false,
      };
    }),
  setValidationErrors: (errors) => set({ validationErrors: errors }),

  addNodeToTree: (parentId, node) => {
    const updated = addNode(get().tree, parentId, node);
    get().setTree(updated);
  },

  removeNodeFromTree: (nodeId) => {
    const updated = removeNode(get().tree, nodeId);
    get().setTree(updated);
  },

  updateNodeInTree: (nodeId, updates) => {
    const updated = updateNode(get().tree, nodeId, updates);
    const errors = validateQuery(updated);
    get().setTree(updated);
    if (errors.length > 0) {
      toast.error(errors[0].message);
    }
  },

  undo: () =>
    set((state) => {
      const previous = state.pastTrees.at(-1);
      if (!previous) return state;

      const pastTrees = state.pastTrees.slice(0, -1);
      const futureTrees = [cloneTree(state.tree), ...state.futureTrees].slice(
        0,
        MAX_HISTORY,
      );

      return {
        ...buildTreeState(cloneTree(previous)),
        pastTrees,
        futureTrees,
        canUndo: pastTrees.length > 0,
        canRedo: futureTrees.length > 0,
      };
    }),

  redo: () =>
    set((state) => {
      const next = state.futureTrees[0];
      if (!next) return state;

      const pastTrees = [...state.pastTrees, cloneTree(state.tree)].slice(
        -MAX_HISTORY,
      );
      const futureTrees = state.futureTrees.slice(1);

      return {
        ...buildTreeState(cloneTree(next)),
        pastTrees,
        futureTrees,
        canUndo: pastTrees.length > 0,
        canRedo: futureTrees.length > 0,
      };
    }),

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
        } catch {}
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
        } catch {
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
        } catch {
          // ignore storage errors
        }
      }

      return {
        savedQueries: nextSavedQueries,
        queryHistory: nextHistory,
      };
    }),
  loadSavedQuery: (saved) => {
    get().setTree(saved.tree);
    set({
      executionState: "idle",
      results: [],
      executedTree: null,
      selectedTab: "builder",
    });
  },
  setSelectedTab: (tab: string) => set({ selectedTab: tab }),
}));
