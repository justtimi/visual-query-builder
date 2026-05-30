"use client"

import { RuleNode } from "@/types/query";
import { useQueryStore } from "@/store/queryStore";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type Props = {
  node: RuleNode;
};

export function Rule({ node }: Props) {
 const removeNodeFromTree = useQueryStore((s) => s.removeNodeFromTree);

  return (
    <div className="flex items-center gap-2 border p-2 rounded justify-between">
      <div className="flex gap-2">
        <span>{node.field || "field"}</span>
        <span>{node.operator}</span>
        <span>{String(node.value)}</span>
      </div>

      <Button
        size="sm"
        variant="destructive"
        onClick={() => removeNodeFromTree(node.id)}
      >
        <X/>
      </Button>
    </div>
  );
}