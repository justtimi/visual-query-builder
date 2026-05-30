"use client";

import { QueryNode, GroupNode } from "@/types/query";
import { Rule } from "./Rule";
import { useQueryStore } from "@/store/queryStore";
import { createRule, createGroup } from "@/utils/createNode";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type Props = {
  node: QueryNode;
};

export function Group({ node }: Props) {
  const addNodeToTree = useQueryStore((s) => s.addNodeToTree);
  const removeNodeFromTree = useQueryStore((s) => s.removeNodeFromTree);
  if (node.type === "rule") {
    return <Rule node={node} />;
  }

  const group = node as GroupNode;

  const handleAddRule = () => {
    addNodeToTree(group.id, createRule());
  };

  const handleAddGroup = () => {
    addNodeToTree(group.id, createGroup());
  };

  const handleDelete = () => {
    removeNodeFromTree(group.id);
  };

  return (
    <div className="border rounded-md p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{group.logic} GROUP</span>

        <Button variant="destructive" size="sm" onClick={handleDelete}>
          Delete
        </Button>
      </div>

      <div className="flex gap-2">
        <Button size="sm" onClick={handleAddRule} className="flex gap-2">
          <Plus className="w-2 h-2" />
          <span>Rule</span>
        </Button>

        <Button
          size="sm"
          variant="secondary"
          onClick={handleAddGroup}
          className="flex gap-2"
        >
          <Plus className="w-2 h-2" />
          <span>Group</span>
        </Button>
      </div>

      <div className="pl-4 border-l space-y-2">
        {group.children.map((child) => (
          <Group key={child.id} node={child} />
        ))}
      </div>
    </div>
  );
}
