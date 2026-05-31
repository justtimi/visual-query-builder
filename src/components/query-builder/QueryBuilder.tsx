"use client";

import { useQueryStore } from "@/store/queryStore";
import { Group } from "./Group";
import { QueryPreview } from "./QueryPreview";

export default function QueryBuilder() {
  const tree = useQueryStore((state) => state.tree);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Query Builder</h1>

      <div className="p-4 flex gap-4 items-start justify-center">
        <div className="w-1/2 shrink-0">
          <Group node={tree} />
        </div>

        <QueryPreview />
      </div>
    </div>
  );
}
