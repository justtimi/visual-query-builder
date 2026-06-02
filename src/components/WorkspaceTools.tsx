"use client";

import { useQueryStore } from "@/store/queryStore";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { exportQuery, copyToClipboard } from "@/utils/export";
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
import { Badge } from "./ui/badge";

export function WorkspaceTools() {
  const tree = useQueryStore((s) => s.tree);
  const setTree = useQueryStore((s) => s.setTree);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("My Query");

  const json = open ? exportQuery(tree, name) : "";

  const handleOpen = (value: boolean) => {
    setOpen(value);

    if (value) {
      setName("My Query");
    }
  };
  const handleCopy = async () => {
    await copyToClipboard(json);

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

  const handleDownload = () => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${name || "query"}.json`;
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

                <Badge variant="secondary">JSON</Badge>
              </div>

              <Card className="bg-muted/30">
                <CardContent className="p-3">
                  <ScrollArea className="h-48 w-full rounded-md">
                    <pre className="text-xs whitespace-pre-wrap break-words">
                      {json}
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

      <Button variant="secondary" className="w-full" onClick={handleClear}>
        Clear Builder
      </Button>
    </div>
  );
}
