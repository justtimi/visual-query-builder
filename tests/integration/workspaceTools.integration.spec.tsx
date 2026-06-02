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
});
