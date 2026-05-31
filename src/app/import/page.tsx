"use client";

import { ResultsPanel } from "@/components/query-builder/ResultsPanel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ImportPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Query Simulator</h1>
        <p className="text-muted-foreground mt-2">
          Run your query against mock data and see filtered results in real-time
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Execution Results</CardTitle>
          <CardDescription>
            Build your query in the Workspace tab, then execute it here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResultsPanel />
        </CardContent>
      </Card>
    </div>
  );
}
