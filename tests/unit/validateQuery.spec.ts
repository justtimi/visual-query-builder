import { describe, expect, it } from "vitest";
import { validateQuery } from "@/utils/validateQuery";

describe("validateQuery", () => {
  it("returns an error for invalid field names", () => {
    const result = validateQuery({
      id: "rule-1",
      type: "rule",
      field: "invalid",
      operator: "equals",
      value: "x",
    });

    expect(result).toEqual([
      expect.objectContaining({
        nodeId: "rule-1",
        message: "Invalid field selected",
      }),
    ]);
  });

  it("returns an error when operator is invalid for the field type", () => {
    const result = validateQuery({
      id: "rule-1",
      type: "rule",
      field: "age",
      operator: "contains",
      value: "20",
    });

    expect(result).toEqual([
      expect.objectContaining({
        nodeId: "rule-1",
        message: 'Operator "contains" is not valid for number',
      }),
    ]);
  });

  it("returns an error when a required value is empty", () => {
    const result = validateQuery({
      id: "rule-1",
      type: "rule",
      field: "status",
      operator: "equals",
      value: "",
    });

    expect(result).toEqual([
      expect.objectContaining({
        nodeId: "rule-1",
        message: "Value cannot be empty",
      }),
    ]);
  });

  it("validates nested children inside groups", () => {
    const result = validateQuery({
      id: "group-1",
      type: "group",
      logic: "AND",
      children: [
        {
          id: "rule-1",
          type: "rule",
          field: "invalid",
          operator: "equals",
          value: "x",
        },
      ],
    });

    expect(result).toHaveLength(1);
    expect(result[0].nodeId).toBe("rule-1");
  });
});
