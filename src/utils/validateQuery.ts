import { QueryNode, RuleNode } from "@/types/query";
import { getFieldType } from "@/utils/schema";
import { operatorsByType } from "@/lib/operators";
import { ValidationError } from "@/types/validation";

export function validateQuery(
  node: QueryNode,
  errors: ValidationError[] = [],
): ValidationError[] {
  if (node.type === "rule") {
    const rule = node as RuleNode;

    const fieldType = getFieldType(rule.field);
    const isRuleActive = rule.field && rule.operator;
    const operatorsThatNeedValue = new Set([
  "equals",
  "not_equals",
  "contains",
  "starts_with",
  "greater_than",
  "less_than",
  "in",
  "between",
]);

    if (!fieldType) {
      errors.push({
        nodeId: rule.id,
        message: "Invalid field selected",
      });
      return errors;
    }
    const allowedOperators = operatorsByType[fieldType];

    if (!allowedOperators.includes(rule.operator)) {
      errors.push({
        nodeId: rule.id,
        message: `Operator "${rule.operator}" is not valid for ${fieldType}`,
      });
    }
    if (isRuleActive) {
        const needsValue = operatorsThatNeedValue.has(rule.operator);
      if (needsValue) {
    if (
      rule.value === "" ||
      rule.value === null ||
      rule.value === undefined
    ) {
      errors.push({
        nodeId: rule.id,
        message: "Value cannot be empty",
      });
    }
  }
    }
  }
  if (node.type === "group") {
    for (const child of node.children) {
      validateQuery(child, errors);
    }
  }

  return errors;
}
