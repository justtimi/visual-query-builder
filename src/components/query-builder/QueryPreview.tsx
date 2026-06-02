"use client";

import { useQueryStore } from "@/store/queryStore";

export function QueryPreview() {
  const compiledQuery = useQueryStore((s) => s.compiledQuery);

  return (
    <div className="border rounded p-3 w-full h-full flex flex-col min-h-0">
      <h2 className="text-sm font-semibold mb-2">Query Preview</h2>
      <div className="flex-1 overflow-auto min-h-0">
        {compiledQuery ? (
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(compiledQuery, null, 2)}
          </pre>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No query yet
          </div>
        )}
      </div>
    </div>
  );
}
