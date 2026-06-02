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

});
