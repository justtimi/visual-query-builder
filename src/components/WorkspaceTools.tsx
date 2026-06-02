"use client";

import { useQueryStore } from "@/store/queryStore";
import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  buildExportFilename,
  copyToClipboard,
  exportQuery,
  type ExportFileSuffix,
} from "@/utils/export";
import { compileTreeToMongo } from "@/utils/queryCompiler";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { parseImportedQuery } from "@/utils/importQuery";
import { QueryNode } from "@/types/query";
import { FileUp } from "lucide-react";

type ExportFormat = "json" | "compiled-mongo";

export function WorkspaceTools() {
  const tree = useQueryStore((s) => s.tree);
  const setTree = useQueryStore((s) => s.setTree);
  const setSelectedTab = useQueryStore((s) => s.setSelectedTab);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("My Query");
  const [format, setFormat] = useState<ExportFormat>("json");
  const [importOpen, setImportOpen] = useState(false);
  const [importFileName, setImportFileName] = useState("");
  const [importError, setImportError] = useState("");
  const [importTree, setImportTree] = useState<QueryNode | null>(null);

  const exportedJson = open ? exportQuery(tree, name) : "";
  const compiledMongo = open
    ? JSON.stringify(compileTreeToMongo(tree) ?? {}, null, 2)
    : "";
  const preview = format === "json" ? exportedJson : compiledMongo;
  const fileSuffix: ExportFileSuffix =
    format === "json" ? "json" : "compiled-mongo";

  const handleOpen = (value: boolean) => {
    setOpen(value);

    if (value) {
      setName("My Query");
      setFormat("json");
    }
  };
  const handleCopy = async () => {
    await copyToClipboard(preview);

    toast.success("Query exported (copied to clipboard)", {
      description: "Ready to paste or share",
    });
    setTimeout(() => setOpen(false), 150);
  };

  const handleClear = () => {
    setTree({
      id: "root",
      type: "group",
      logic: "AND",
      children: [],
    });

    toast.success("Builder cleared");
  };

  const handleImportOpen = (value: boolean) => {
    setImportOpen(value);

    if (!value) {
      setImportFileName("");
      setImportError("");
      setImportTree(null);
    }
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setImportTree(null);
    setImportError("");
    setImportFileName(file?.name ?? "");

    if (!file) return;

    try {
      const text = await file.text();
      setImportTree(parseImportedQuery(text));
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : "Unable to import JSON file",
      );
    }
  };

  const handleImport = () => {
    if (!importTree) return;

    setTree(importTree);
    setSelectedTab("builder");
    toast.success("Query imported");
    setTimeout(() => handleImportOpen(false), 150);
  };

  const handleDownload = () => {
    const blob = new Blob([preview], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = buildExportFilename(name, fileSuffix);
    a.click();

    URL.revokeObjectURL(url);

    toast.success("Downloaded successfully");
    setTimeout(() => setOpen(false), 150);
  };

  return (
    <div className="space-y-2">
      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" variant="outline">
            Export Query
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Export Query</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Query Name</p>

                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter query name..."
                />
              </div>

              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Preview</p>

                <Tabs
                  value={format}
                  onValueChange={(value) => setFormat(value as ExportFormat)}
                >
                  <TabsList>
                    <TabsTrigger value="json">JSON</TabsTrigger>
                    <TabsTrigger value="compiled-mongo">
                      Compiled Mongo
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <Card className="bg-muted/30">
                <CardContent className="p-3">
                  <ScrollArea className="h-48 w-full rounded-md">
                    <pre className="text-xs whitespace-pre-wrap break-words">
                      {preview}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <Separator />
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleCopy}>
                Copy
              </Button>

              <Button
                variant="secondary"
                className="flex-1"
                onClick={handleDownload}
              >
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={importOpen} onOpenChange={handleImportOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" variant="outline">
            <FileUp />
            Import JSON
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Import JSON</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <label
                htmlFor="workspace-import-json-file"
                className="text-xs text-muted-foreground"
              >
                JSON File
              </label>

              <Input
                id="workspace-import-json-file"
                type="file"
                accept="application/json,.json"
                onChange={handleImportFile}
              />
            </div>

            {importFileName ? (
              <p className="text-xs text-muted-foreground">{importFileName}</p>
            ) : null}

            {importError ? (
              <p className="text-sm text-destructive">{importError}</p>
            ) : null}

            <div className="flex gap-2">
              <Button
                className="flex-1"
                disabled={!importTree}
                onClick={handleImport}
              >
                Import
              </Button>

              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => handleImportOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Button variant="secondary" className="w-full" onClick={handleClear}>
        Clear Builder
      </Button>
    </div>
  );
}
