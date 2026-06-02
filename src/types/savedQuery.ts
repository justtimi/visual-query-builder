import { QueryNode } from "./query";

export type SavedQuery = {
  id: string;
  name: string;
  tree: QueryNode;
  createdAt: number;
};

export type QueryHistoryItem = {
  id: string;
  tree: QueryNode;
  createdAt: number;
};