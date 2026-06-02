import { describe, expect, it } from "vitest";
import { createGroup, createRule } from "@/utils/createNode";

describe("createNode", () => {
  it("creates a rule node with default values", () => {
    const rule = createRule();

    expect(rule.type).toBe("rule");
    expect(rule.field).toBe("");
    expect(rule.operator).toBe("equals");
    expect(rule.value).toBe("");
    expect(typeof rule.id).toBe("string");
  });

  it("creates an empty group node", () => {
    const group = createGroup();

    expect(group.type).toBe("group");
    expect(group.logic).toBe("AND");
    expect(group.children).toEqual([]);
    expect(typeof group.id).toBe("string");
  });
});
