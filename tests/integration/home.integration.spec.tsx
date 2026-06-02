import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/components/Home";
import { createGroup } from "@/utils/createNode";
import { useQueryStore } from "@/store/queryStore";

describe("Home integration", () => {
  beforeEach(() => {
    useQueryStore.setState({
      tree: createGroup(),
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

  it("opens the save query modal and allows typing a name", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const saveButton = screen.getByRole("button", { name: "Save Query" });
    expect(saveButton).toBeVisible();

    await user.click(saveButton);

    const dialogTitle = await screen.findByRole("heading", {
      name: "Save Query",
    });
    expect(dialogTitle).toBeVisible();

    const input = screen.getByPlaceholderText("Enter query name...");
    await user.clear(input);
    await user.type(input, "Integration Save");

    expect(input).toHaveValue("Integration Save");
  });

  it("adds a rule through the builder and updates the preview output", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const ruleButton = screen.getByRole("button", { name: "Rule" });
    expect(ruleButton).toBeVisible();

    await user.click(ruleButton);

    const preview = await screen.findByText("{", { exact: false });
    expect(preview).toHaveTextContent('"": ""');
  });

  it("enables undo and redo controls for builder changes", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const undoButton = screen.getByRole("button", { name: "Undo" });
    const redoButton = screen.getByRole("button", { name: "Redo" });

    expect(undoButton).toBeDisabled();
    expect(redoButton).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Rule" }));

    expect(undoButton).toBeEnabled();
    expect(redoButton).toBeDisabled();

    await user.click(undoButton);

    expect(undoButton).toBeDisabled();
    expect(redoButton).toBeEnabled();

    await user.click(redoButton);

    expect(undoButton).toBeEnabled();
    expect(redoButton).toBeDisabled();
  });

  it("imports a JSON query file and renders the builder state", async () => {
    const user = userEvent.setup();
    render(<Home />);

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
                id: "rule-1",
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

    expect(screen.getByRole("button", { name: "Undo" })).toBeEnabled();
    expect(screen.getByText("active")).toBeVisible();
  });
});
