import { describe, expect, it } from "vitest";
import { findNode } from "@/utils/findNode";
import { createGroup, createRule } from "@/utils/createNode";
import { GroupNode } from "@/types/query";

describe("findNode", () => {
  it("returns a node by id in a nested tree", () => {
    const root: GroupNode = createGroup();
    const childGroup = createGroup();
    const rule = createRule();
    childGroup.children = [rule];
    root.children = [childGroup];

    expect(findNode(root, rule.id)).toEqual(rule);
  });

  it("returns null when the node is missing", () => {
    const root = createGroup();

    expect(findNode(root, "missing")).toBeNull();
  });
});
