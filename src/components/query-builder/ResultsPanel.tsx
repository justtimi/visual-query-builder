"use client";

import { useQueryStore } from "@/store/queryStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export function ResultsPanel() {
  const results = useQueryStore((s) => s.results);
  const isLoading = useQueryStore((s) => s.isLoading);
  const runQuery = useQueryStore((s) => s.runQuery);
  const clearResults = useQueryStore((s) => s.clearResults);
  const executionState = useQueryStore((s) => s.executionState);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Query Simulator</h1>
        <p className="text-muted-foreground mt-2">
          Run your query against mock data and see filtered results in real-time
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Execution Results</CardTitle>
          <CardDescription>
            Build your query in the Workspace tab, then execute it here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold">Results</h3>
              </div>

              <div className="space-x-2">
                <Button
                  size="sm"
                  onClick={runQuery}
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    "Execute Query"
                  )}
                </Button>

                {executionState !== "idle" && (
                  <Button size="sm" variant="outline" onClick={clearResults}>
                    Clear
                  </Button>
                )}
              </div>
            </div>

            <Separator />
            {executionState === "idle" && (
              <div className="text-center py-12 text-muted-foreground">
                Build a query and execute it to see results
              </div>
            )}
            {executionState === "running" && (
              <div className="text-center py-12">
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground mt-3">
                  Executing query...
                </p>
              </div>
            )}
            {executionState === "success" && (
              <div className="space-y-3">
                <Badge variant="secondary" className="w-fit">
                  {results.length} result{results.length !== 1 ? "s" : ""} found
                </Badge>

                <ScrollArea className="h-96 border rounded p-3">
                  <div className="space-y-2 pr-4">
                    {results.map((user, i) => (
                      <div
                        key={`${user.name}-${i}`}
                        className="rounded border p-3 bg-card hover:bg-accent transition-colors"
                      >
                        <div className="font-medium text-sm">{user.name}</div>

                        <div className="text-xs text-muted-foreground mt-2 space-y-1">
                          <div>
                            <span className="font-semibold">Age:</span>{" "}
                            {user.age}
                          </div>

                          <div>
                            <span className="font-semibold">Status:</span>{" "}
                            <Badge variant="outline" className="ml-1 text-xs">
                              {user.status}
                            </Badge>
                          </div>

                          <div>
                            <span className="font-semibold">Purchases:</span>{" "}
                            {user.purchases}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
            {executionState === "empty" && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No results found</p>
                <p className="text-xs mt-2">Try adjusting your query filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
