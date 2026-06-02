"use client";

import { useQueryStore } from "@/store/queryStore";
import { Group } from "./Group";
import { QueryPreview } from "./QueryPreview";
import { ScrollArea } from "../ui/scroll-area";

export default function QueryBuilder() {
  const tree = useQueryStore((state) => state.tree);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-3xl font-bold">Query Simulator</h1>

      <div className="p-4 flex flex-col lg:flex-row gap-4 items-start justify-center">
        <ScrollArea className="w-full lg:w-1/2">
          <Group node={tree} />
        </ScrollArea>

        <ScrollArea className="w-full lg:w-1/2">
          <QueryPreview />
        </ScrollArea>
      </div>
    </div>
  );
}
