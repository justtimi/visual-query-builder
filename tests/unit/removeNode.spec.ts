import { describe, expect, it } from "vitest";
import { removeNode } from "@/utils/removeNode";
import { createGroup, createRule } from "@/utils/createNode";
import { GroupNode } from "@/types/query";

describe("removeNode", () => {
  it("removes a direct child rule", () => {
    const root: GroupNode = createGroup();
    const rule = createRule();
    root.children = [rule];

    const next = removeNode(root, rule.id) as GroupNode;

    expect(next.children).toHaveLength(0);
  });

  it("removes a nested rule from a deep tree", () => {
    const root: GroupNode = createGroup();
    const childGroup = createGroup();
    const rule = createRule();
    childGroup.children = [rule];
    root.children = [childGroup];

    const next = removeNode(root, rule.id) as GroupNode;

    expect(next.children[0].type).toBe("group");
    expect((next.children[0] as GroupNode).children).toHaveLength(0);
  });
});
