import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildExport,
  buildExportFilename,
  copyToClipboard,
  exportQuery,
} from "@/utils/export";
import { createGroup } from "@/utils/createNode";

describe("export helpers", () => {
  beforeEach(() => {
    if (!navigator.clipboard) {
      Object.defineProperty(global.navigator, "clipboard", {
        value: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
        configurable: true,
      });
    }
  });

  it("builds a valid export payload", () => {
    const tree = createGroup();
    const payload = buildExport(tree, "My query");

    expect(payload.version).toBe("1.0");
    expect(payload.name).toBe("My query");
    expect(payload.tree).toEqual(tree);
    expect(typeof payload.createdAt).toBe("string");
  });

  it("serializes the export payload to JSON", () => {
    const tree = createGroup();
    const text = exportQuery(tree, "My query");
    const parsed = JSON.parse(text);

    expect(parsed.version).toBe("1.0");
    expect(parsed.name).toBe("My query");
    expect(parsed.tree).toEqual(tree);
  });

  it("builds export filenames with the selected format suffix", () => {
    expect(buildExportFilename("My query", "json")).toBe(
      "My query-json.json",
    );
    expect(buildExportFilename("My query", "compiled-mongo")).toBe(
      "My query-compiled-mongo.json",
    );
    expect(buildExportFilename("", "json")).toBe("query-json.json");
  });

  it("copies text to the clipboard", async () => {
    const clip = navigator.clipboard as unknown as {
      writeText: ReturnType<typeof vi.fn>;
    };
    const text = "hello";

    await copyToClipboard(text);
    expect(clip.writeText).toHaveBeenCalledWith(text);
  });
});
