import { Operator, QueryNode, ValueType } from "@/types/query";

const operators = new Set<Operator>([
  "equals",
  "not_equals",
  "contains",
  "starts_with",
  "greater_than",
  "less_than",
  "in",
  "between",
  "before",
  "after",
  "on_or_before",
  "on_or_after",
  "not_in",
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isValueType = (value: unknown): value is ValueType => {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return true;
  }

  return (
    Array.isArray(value) &&
    value.every(
      (item) => typeof item === "string" || typeof item === "number",
    )
  );
};

export function isQueryNode(value: unknown): value is QueryNode {
  if (!isRecord(value) || typeof value.id !== "string") {
    return false;
  }

  if (value.type === "rule") {
    return (
      typeof value.field === "string" &&
      typeof value.operator === "string" &&
      operators.has(value.operator as Operator) &&
      isValueType(value.value)
    );
  }

  if (value.type === "group") {
    return (
      (value.logic === "AND" || value.logic === "OR") &&
      Array.isArray(value.children) &&
      value.children.every(isQueryNode)
    );
  }

  return false;
}

export function parseImportedQuery(json: string): QueryNode {
  let payload: unknown;

  try {
    payload = JSON.parse(json);
  } catch {
    throw new Error("Choose a valid JSON file");
  }

  const candidate =
    isRecord(payload) && "tree" in payload ? payload.tree : payload;

  if (!isQueryNode(candidate)) {
    throw new Error("JSON does not contain a valid query tree");
  }

  if (candidate.type !== "group") {
    throw new Error("Imported query must start with a group");
  }

  return candidate;
}
