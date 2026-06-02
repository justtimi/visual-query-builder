import { describe, expect, it } from "vitest";
import { parseImportedQuery } from "@/utils/importQuery";
import { createGroup } from "@/utils/createNode";

describe("import query helpers", () => {
  it("parses an exported query payload", () => {
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

    const imported = parseImportedQuery(
      JSON.stringify({
        version: "1.0",
        name: "Active users",
        tree,
      }),
    );

    expect(imported).toEqual(tree);
  });

  it("parses a raw root group", () => {
    const tree = createGroup();

    expect(parseImportedQuery(JSON.stringify(tree))).toEqual(tree);
  });

  it("rejects invalid JSON", () => {
    expect(() => parseImportedQuery("{")).toThrow("Choose a valid JSON file");
  });

  it("rejects payloads without a valid query tree", () => {
    expect(() => parseImportedQuery(JSON.stringify({ tree: {} }))).toThrow(
      "JSON does not contain a valid query tree",
    );
  });
});
