import { QueryNode, RuleNode } from "@/types/query";
import { operatorMap } from "./operatorMap";

export function compileTreeToMongo(
  node: QueryNode,
): Record<string, unknown> | undefined {
  if (node.type === "rule") {
    const rule = node as RuleNode;

    const mongoOperator = operatorMap[rule.operator];
    if (!mongoOperator) {
      return {
        [rule.field]: rule.value,
      };
    }
    return {
      [rule.field]: {
        [mongoOperator]: rule.value,
      },
    };
  }

  if (node.type === "group") {
    const group = node;
    const compiledChildren = group.children
      .map((child) => compileTreeToMongo(child))
      .filter((child): child is Record<string, unknown> => child !== undefined);

    if (compiledChildren.length === 0) {
      return {};
    }

    if (group.logic === "AND") {
      if (compiledChildren.length === 1) {
        return compiledChildren[0];
      }
      return {
        $and: compiledChildren,
      };
    }
    if (group.logic === "OR") {
      return {
        $or: compiledChildren,
      };
    }
  }
}
