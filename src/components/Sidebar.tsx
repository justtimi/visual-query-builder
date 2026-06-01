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

const SidebarRoot = () => {
  const savedQueries = useQueryStore((s) => s.savedQueries);
  const loadSavedQuery = useQueryStore((s) => s.loadSavedQuery);
  const queryHistory = useQueryStore((s) => s.queryHistory);
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

          <SidebarMenu>
            {savedQueries.length === 0 ? (
              <SidebarMenuItem>
                <SidebarMenuButton disabled>No saved queries</SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              savedQueries.map((query) => (
                <SidebarMenuItem key={query.id}>
                  <SidebarMenuButton onClick={() => loadSavedQuery(query)}>
                    {query.name}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>History</SidebarGroupLabel>

          <SidebarMenu>
            {queryHistory.length === 0 ? (
              <SidebarMenuItem>
                <SidebarMenuButton disabled>No history yet</SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              queryHistory.slice(0, 10).map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton onClick={() => loadSavedQuery(item)}>
                    Run {new Date(item.createdAt).toLocaleTimeString()}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

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
