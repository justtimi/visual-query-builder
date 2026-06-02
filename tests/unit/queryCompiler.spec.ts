import { describe, expect, it } from "vitest";
import { compileTreeToMongo } from "@/utils/queryCompiler";
import { createGroup } from "@/utils/createNode";
import { RuleNode } from "@/types/query";

describe("queryCompiler", () => {
  it("compiles equals rules without special operator", () => {
    const node: RuleNode = {
      id: "rule-1",
      type: "rule",
      field: "status",
      operator: "equals",
      value: "active",
    };

    expect(compileTreeToMongo(node)).toEqual({ status: "active" });
  });

  it("compiles greater_than to $gt", () => {
    const node: RuleNode = {
      id: "rule-1",
      type: "rule",
      field: "amount",
      operator: "greater_than",
      value: 5,
    };

    expect(compileTreeToMongo(node)).toEqual({ amount: { $gt: 5 } });
  });

  it("builds $and for multi-child AND groups", () => {
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
        operator: "less_than",
        value: 30,
      },
    ];

    expect(compileTreeToMongo(tree)).toEqual({
      $and: [{ status: "active" }, { age: { $lt: 30 } }],
    });
  });

  it("returns single child result for one-child AND groups", () => {
    const tree = createGroup();
    tree.children = [
      {
        id: "rule-1",
        type: "rule",
        field: "status",
        operator: "equals",
        value: "active",
      },
    ];

    expect(compileTreeToMongo(tree)).toEqual({ status: "active" });
  });

  it("builds $or for OR groups", () => {
    const tree = createGroup();
    tree.logic = "OR";
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
        field: "status",
        operator: "equals",
        value: "inactive",
      },
    ];

    expect(compileTreeToMongo(tree)).toEqual({
      $or: [{ status: "active" }, { status: "inactive" }],
    });
  });

  it("returns empty object for empty groups", () => {
    const tree = createGroup();
    expect(compileTreeToMongo(tree)).toEqual({});
  });
});
