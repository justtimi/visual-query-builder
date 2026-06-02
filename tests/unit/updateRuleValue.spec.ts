import { describe, expect, it } from "vitest";
import { updateNode } from "@/utils/updateRuleValue";
import { findNode } from "@/utils/findNode";
import { createGroup, createRule } from "@/utils/createNode";
import { GroupNode } from "@/types/query";

describe("updateRuleValue", () => {
  it("updates a rule field value", () => {
    const root: GroupNode = createGroup();
    const rule = createRule();
    root.children = [rule];

    const next = updateNode(root, rule.id, { value: "hello" });

    expect(findNode(next, rule.id)).toEqual(
      expect.objectContaining({
        value: "hello",
      }),
    );
  });

  it("updates group logic when the target is a group", () => {
    const root: GroupNode = createGroup();

    const next = updateNode(root, root.id, { logic: "OR" });

    expect(next).toEqual(
      expect.objectContaining({
        logic: "OR",
      }),
    );
  });
});
