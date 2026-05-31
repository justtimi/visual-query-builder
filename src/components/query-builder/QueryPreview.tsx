"use client";

import { useQueryStore } from "@/store/queryStore";

export function QueryPreview() {
  const compiledQuery = useQueryStore((s) => s.compiledQuery);

  return (
    <div className="border rounded p-3 h-full overflow-auto w-1/2 shrink-0">
      <h2 className="text-sm font-semibold mb-2">
        Query Preview
      </h2>

      <pre className="text-xs">
        {compiledQuery
          ? JSON.stringify(compiledQuery, null, 2)
          : "No query yet"}
      </pre>
    </div>
  );
}