import { QueryNode } from "./query"

export type ExportType = {
  version: "1.0",
  tree: QueryNode,
  name?: string,
  createdAt?: string
}