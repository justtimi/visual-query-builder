import { ExportType } from "@/types/export";
import { QueryNode } from "@/types/query";

export type ExportFileSuffix = "json" | "compiled-mongo";

export function buildExport(tree: QueryNode, name: string): ExportType {
  return {
    version: "1.0",
    name,
    createdAt: new Date().toISOString(),
    tree,
  };
}

export function exportQuery(tree: QueryNode, name: string): string {
  const payload = buildExport(tree, name);
  return JSON.stringify(payload, null, 2);
}

export function buildExportFilename(
  name: string,
  suffix: ExportFileSuffix,
): string {
  return `${name || "query"}-${suffix}.json`;
}

export function copyToClipboard(text: string) {
  return navigator.clipboard.writeText(text);
}
