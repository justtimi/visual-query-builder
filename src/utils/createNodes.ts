import { GroupNode, RuleNode } from "@/types/query";

export function createRule(): RuleNode {
  return {
    id: crypto.randomUUID(),
    type: "rule",
    field: "",
    operator: "equals",
    value: "",
  };
}

export function createGroup(): GroupNode {
  return {
    id: crypto.randomUUID(),
    type: "group",
    logic: "AND",
    children: [],
  };
}

