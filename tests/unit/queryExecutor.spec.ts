import { describe, expect, it } from "vitest";
import { evaluateQuery } from "@/utils/queryExecutor";
import { createGroup } from "@/utils/createNode";
import { RuleNode } from "@/types/query";

describe("queryExecutor", () => {
  const data = [
    { id: 1, status: "active", age: 20, name: "Alice" },
    { id: 2, status: "inactive", age: 35, name: "Bob" },
    { id: 3, status: "active", age: 40, name: "Carol" },
  ];

  it("filters by equals", () => {
    const tree: RuleNode = {
      id: "rule-1",
      type: "rule",
      field: "status",
      operator: "equals",
      value: "active",
    };

    expect(evaluateQuery(tree, data)).toHaveLength(2);
  });

  it("filters by not_equals", () => {
    const tree: RuleNode = {
      id: "rule-1",
      type: "rule",
      field: "status",
      operator: "not_equals",
      value: "active",
    };

    expect(evaluateQuery(tree, data)).toEqual([
      { id: 2, status: "inactive", age: 35, name: "Bob" },
    ]);
  });

  it("filters by greater_than and less_than", () => {
    const gtTree: RuleNode = {
      id: "rule-1",
      type: "rule",
      field: "age",
      operator: "greater_than",
      value: 30,
    };
    const ltTree: RuleNode = {
      id: "rule-2",
      type: "rule",
      field: "age",
      operator: "less_than",
      value: 30,
    };

    expect(evaluateQuery(gtTree, data)).toEqual([
      { id: 2, status: "inactive", age: 35, name: "Bob" },
      { id: 3, status: "active", age: 40, name: "Carol" },
    ]);
    expect(evaluateQuery(ltTree, data)).toEqual([
      { id: 1, status: "active", age: 20, name: "Alice" },
    ]);
  });

  it("evaluates OR logic", () => {
    const tree = createGroup();
    tree.logic = "OR";
    tree.children = [
      {
        id: "rule-1",
        type: "rule",
        field: "status",
        operator: "equals",
        value: "inactive",
      },
      {
        id: "rule-2",
        type: "rule",
        field: "age",
        operator: "greater_than",
        value: 30,
      },
    ];

    expect(evaluateQuery(tree, data)).toEqual([
      { id: 2, status: "inactive", age: 35, name: "Bob" },
      { id: 3, status: "active", age: 40, name: "Carol" },
    ]);
  });

  it("evaluates AND logic", () => {
    const tree = createGroup();
    tree.children = [
      {
        id: "rule-1",
        type: "rule",
        field: "status",
        operator: "equals",
        value: "active",
      },
      {
        id: "rule-2",
        type: "rule",
        field: "age",
        operator: "greater_than",
        value: 30,
      },
    ];

    expect(evaluateQuery(tree, data)).toEqual([
      { id: 3, status: "active", age: 40, name: "Carol" },
    ]);
  });
});
