"use client";
import QueryBuilder from "./query-builder/QueryBuilder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JSONPreview from "./JSONPreview";
import { ResultsPanel } from "./query-builder/ResultsPanel";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { useQueryStore } from "@/store/queryStore";
import { toast } from "sonner";
import { Redo2, Undo2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const Home = () => {
  const addSavedQuery = useQueryStore((s) => s.addSavedQuery);
  const savedQueries = useQueryStore((s) => s.savedQueries);
  const tree = useQueryStore((s) => s.tree);
  const selectedTab = useQueryStore((s) => s.selectedTab);
  const setSelectedTab = useQueryStore((s) => s.setSelectedTab);
  const undo = useQueryStore((s) => s.undo);
  const redo = useQueryStore((s) => s.redo);
  const canUndo = useQueryStore((s) => s.canUndo);
  const canRedo = useQueryStore((s) => s.canRedo);
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState("My Query");

  const handleSaveOpen = (value: boolean) => {
    setSaveOpen(value);
    if (value) setSaveName("My Query");
  };

  const handleSave = () => {
    const exists = savedQueries.some(
      (q) => JSON.stringify(q.tree) === JSON.stringify(tree),
    );

    if (exists) {
      toast.error("An identical query is already saved");
      setTimeout(() => setSaveOpen(false), 150);
      return;
    }

    addSavedQuery(tree, saveName || undefined);
    toast.success("Query saved");
    setTimeout(() => setSaveOpen(false), 150);
  };

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Undo"
                title="Undo"
                variant="secondary"
                size="icon"
                disabled={!canUndo}
                onClick={undo}
              >
                <Undo2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Redo"
                title="Redo"
                variant="secondary"
                size="icon"
                disabled={!canRedo}
                onClick={redo}
              >
                <Redo2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Dialog open={saveOpen} onOpenChange={handleSaveOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">Save Query</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Save Query</DialogTitle>
            </DialogHeader>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Query Name</p>

                <Input
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="Enter query name..."
                />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleSave}>
                  Save
                </Button>

                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setSaveOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="builder">Builder</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="builder">
          <QueryBuilder />
        </TabsContent>

        <TabsContent value="json">
          <JSONPreview />
        </TabsContent>
        <TabsContent value="results">
          <ResultsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Home;
