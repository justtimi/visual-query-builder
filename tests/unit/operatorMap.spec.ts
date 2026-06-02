import { describe, expect, it } from "vitest";
import { operatorMap } from "@/utils/operatorMap";

describe("operatorMap", () => {
  it("exposes expected Mongo operator mappings", () => {
    expect(operatorMap.equals).toBe("");
    expect(operatorMap.not_equals).toBe("$ne");
    expect(operatorMap.contains).toBe("$regex");
    expect(operatorMap.starts_with).toBe("$regex");
    expect(operatorMap.in).toBe("$in");
  });
});
