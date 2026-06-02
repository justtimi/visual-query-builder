"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueryStore } from "@/store/queryStore";
import { QueryNode } from "@/types/query";

const JSONPreview = () => {
  const tree = useQueryStore((state) => state.tree);
  const nodeCount = countNodes(tree);
  const json = JSON.stringify(tree, null, 2);

  return (
    <Card className="w-full" size="sm">
      <CardHeader className="gap-2 sm:flex sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle>JSON Preview</CardTitle>
          <CardDescription>
            Raw query tree generated from the builder.
          </CardDescription>
        </div>

        <Badge variant="secondary" className="w-fit">
          {nodeCount} {nodeCount === 1 ? "node" : "nodes"}
        </Badge>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[min(60vh,32rem)] w-full rounded-md border bg-muted/30">
          <pre className="min-w-full whitespace-pre-wrap break-words p-4 font-mono text-xs leading-relaxed sm:text-sm">
            {json}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

function countNodes(node: QueryNode): number {
  if (node.type === "rule") {
    return 1;
  }

  return 1 + node.children.reduce((total, child) => total + countNodes(child), 0);
}

export default JSONPreview;
