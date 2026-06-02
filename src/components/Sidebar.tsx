"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar";
import { WorkspaceTools } from "./WorkspaceTools";
import { useQueryStore } from "@/store/queryStore";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";

const SidebarRoot = () => {
  const savedQueries = useQueryStore((s) => s.savedQueries);
  const loadSavedQuery = useQueryStore((s) => s.loadSavedQuery);
  const deleteSavedQuery = useQueryStore((s) => s.deleteSavedQuery);
  const runQuery = useQueryStore((s) => s.runQuery);
  const queryHistory = useQueryStore((s) => s.queryHistory);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const openDeleteConfirm = (id: string, name: string) => {
    setDeleteTargetId(id);
    setDeleteTargetName(name);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTargetId) return;
    deleteSavedQuery(deleteTargetId);
    setConfirmOpen(false);
    setDeleteTargetId(null);
    setDeleteTargetName("");
  };
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>Builder</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Workspace Tools</SidebarGroupLabel>
          <WorkspaceTools />
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Saved Queries</SidebarGroupLabel>

          <ScrollArea className="h-20">
            <SidebarMenu>
              {savedQueries.length === 0 ? (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    No saved queries
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                savedQueries.map((query) => (
                  <SidebarMenuItem
                    key={query.id}
                    className="flex items-center gap-2"
                  >
                    <SidebarMenuButton
                      className="flex-1"
                      onClick={() => loadSavedQuery(query)}
                    >
                      {query.name}
                    </SidebarMenuButton>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="text-destructive"
                      onClick={(event) => {
                        event.stopPropagation();
                        openDeleteConfirm(query.id, query.name);
                      }}
                      aria-label={`Delete saved query ${query.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </ScrollArea>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>History</SidebarGroupLabel>

          <ScrollArea className="h-20">
            <SidebarMenu>
              {queryHistory.length === 0 ? (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>No history yet</SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                queryHistory.slice(0, 10).map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={async () => {
                        loadSavedQuery(item);
                        await runQuery();
                      }}
                    >
                      Run {new Date(item.createdAt).toLocaleTimeString()}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </ScrollArea>
        </SidebarGroup>

        <SidebarSeparator />

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete saved query?</DialogTitle>
            </DialogHeader>
            <p className="py-2 text-sm text-muted-foreground">
              Are you sure you want to delete &quot;{deleteTargetName}&quot;? This will
              also remove any matching history items.
            </p>
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>Toggle Theme</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarRoot;
