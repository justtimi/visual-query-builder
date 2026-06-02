import { describe, expect, it } from "vitest";
import { addNode } from "@/utils/addNode";
import { createGroup, createRule } from "@/utils/createNode";
import { GroupNode } from "@/types/query";

describe("addNode", () => {
  it("adds a new node under the target group", () => {
    const root: GroupNode = createGroup();
    const child = createRule();

    const next = addNode(root, root.id, child) as GroupNode;

    expect(next.children).toHaveLength(1);
    expect(next.children[0]).toEqual(child);
    expect(root.children).toHaveLength(0);
  });

  it("leaves the tree unchanged when parent id is missing", () => {
    const root = createGroup();
    const child = createRule();
    const next = addNode(root, "missing-id", child);

    expect(next).toEqual(root);
  });
});
