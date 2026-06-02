import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WorkspaceTools } from "@/components/WorkspaceTools";
import { useQueryStore } from "@/store/queryStore";
import { createGroup } from "@/utils/createNode";

describe("WorkspaceTools integration", () => {
  beforeEach(() => {
    const tree = createGroup();
    tree.children = [
      {
        id: "rule-1",
        type: "rule",
        field: "age",
        operator: "greater_than",
        value: 18,
      },
    ];

    useQueryStore.setState({
      tree,
      pastTrees: [],
      futureTrees: [],
      canUndo: false,
      canRedo: false,
      compiledQuery: null,
      validationErrors: [],
      results: [],
      isLoading: false,
      executionState: "idle",
      executedTree: null,
      savedQueries: [],
      queryHistory: [],
      selectedTab: "builder",
    });
  });

  it("switches export preview between JSON payload and compiled Mongo", async () => {
    const user = userEvent.setup();
    render(<WorkspaceTools />);

    await user.click(screen.getByRole("button", { name: "Export Query" }));

    expect(screen.getByText('"version": "1.0"', { exact: false })).toBeVisible();

    await user.click(screen.getByRole("tab", { name: "Compiled Mongo" }));

    expect(screen.getByText('"$gt": 18', { exact: false })).toBeVisible();
    expect(
      screen.queryByText('"version": "1.0"', { exact: false }),
    ).not.toBeInTheDocument();
  });

  it("imports a JSON query file through workspace tools", async () => {
    const user = userEvent.setup();
    render(<WorkspaceTools />);

    await user.click(screen.getByRole("button", { name: "Import JSON" }));

    const file = new File(
      [
        JSON.stringify({
          version: "1.0",
          name: "Imported query",
          tree: {
            id: "root",
            type: "group",
            logic: "AND",
            children: [
              {
                id: "rule-2",
                type: "rule",
                field: "status",
                operator: "equals",
                value: "active",
              },
            ],
          },
        }),
      ],
      "query.json",
      { type: "application/json" },
    );

    await user.upload(screen.getByLabelText("JSON File"), file);
    await user.click(screen.getByRole("button", { name: "Import" }));

    const store = useQueryStore.getState();

    expect(store.canUndo).toBe(true);
    expect(store.tree).toEqual({
      id: "root",
      type: "group",
      logic: "AND",
      children: [
        {
          id: "rule-2",
          type: "rule",
          field: "status",
          operator: "equals",
          value: "active",
        },
      ],
    });
  });
});
