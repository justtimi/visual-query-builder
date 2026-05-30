"use client";

import { useQueryStore } from "@/store/queryStore";
import { Group } from "./Group";

export default function QueryBuilder() {
  const tree = useQueryStore((state) => state.tree);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Query Builder</h1>

      <pre className="text-xs bg-primary p-2 rounded">
        {JSON.stringify(tree, null, 2)}
      </pre>
      <div className="p-4">
      <Group node={tree} />
    </div>
    </div>
  );
}