"use client";

import { useQueryStore } from "@/store/queryStore";
import { Group } from "./Group";
import { QueryPreview } from "./QueryPreview";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export default function QueryBuilder() {
  const tree = useQueryStore((state) => state.tree);

  return (
    <div className="p-4 space-y-4 min-h-[60vh]">
      <h1 className="text-3xl font-bold">Query Simulator</h1>

      <div className="flex flex-col lg:flex-row gap-4 min-h-0">
        <ScrollArea className="w-full lg:w-1/2 min-h-0 h-full">
          <Group node={tree} />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <ScrollArea className="w-full lg:w-1/2 min-h-0 h-full">
          <QueryPreview />
        </ScrollArea>
      </div>
    </div>
  );
}
