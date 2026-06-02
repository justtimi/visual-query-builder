import { describe, expect, it } from "vitest";
import {
  getDefaultValue,
  getEnumOptions,
  getFieldType,
  getFieldUiType,
  getFields,
} from "@/utils/schema";

describe("schema utils", () => {
  it("returns metadata for known schema fields", () => {
    expect(getFieldType("status")).toBe("enum");
    expect(getEnumOptions("status")).toEqual(["active", "inactive"]);
    expect(getFields()).toEqual(
      expect.arrayContaining(["name", "age", "status", "createdAt"]),
    );
    expect(getDefaultValue("age")).toBe(0);
    expect(getFieldUiType("createdAt")).toBe("date");
  });

  it("returns safe defaults for unknown fields", () => {
    expect(getFieldType("missing")).toBeUndefined();
    expect(getEnumOptions("missing")).toEqual([]);
    expect(getDefaultValue("missing")).toBe("");
    expect(getFieldUiType("missing")).toBeUndefined();
  });
});
