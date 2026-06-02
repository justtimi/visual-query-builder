import { beforeEach, describe, expect, it } from "vitest";
import { useQueryStore } from "@/store/queryStore";
import { createGroup } from "@/utils/createNode";

describe("Query Store", () => {
  beforeEach(() => {
    localStorage.clear();
    useQueryStore.setState({
      tree: createGroup(),
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

  it("adds a saved query and persists it to localStorage", () => {
    const tree = createGroup();
    tree.children = [
      {
        id: "rule-1",
        type: "rule",
        field: "status",
        operator: "equals",
        value: "active",
      },
    ];

    useQueryStore.getState().addSavedQuery(tree, "Active users");

    const savedQueries = useQueryStore.getState().savedQueries;
    expect(savedQueries).toHaveLength(1);
    expect(savedQueries[0].name).toBe("Active users");

    const persisted = JSON.parse(localStorage.getItem("savedQueries") ?? "[]");
    expect(persisted).toHaveLength(1);
    expect(persisted[0].name).toBe("Active users");
  });

  it("does not add duplicate saved queries", () => {
    const tree = createGroup();
    tree.children = [
      {
        id: "rule-1",
        type: "rule",
        field: "status",
        operator: "equals",
        value: "active",
      },
    ];

    useQueryStore.getState().addSavedQuery(tree, "Active users");
    useQueryStore.getState().addSavedQuery(tree, "Active users");

    expect(useQueryStore.getState().savedQueries).toHaveLength(1);
    expect(
      JSON.parse(localStorage.getItem("savedQueries") ?? "[]"),
    ).toHaveLength(1);
  });

  it("runs a query and records history", async () => {
    const tree = createGroup();
    tree.children = [
      {
        id: "rule-1",
        type: "rule",
        field: "status",
        operator: "equals",
        value: "active",
      },
    ];

    useQueryStore.getState().setTree(tree);
    await useQueryStore.getState().runQuery();

    const store = useQueryStore.getState();
    expect(store.executionState).toBe("success");
    expect(store.results).toHaveLength(3);
    expect(store.queryHistory).toHaveLength(1);
    expect(store.executedTree).toEqual(tree);
    expect(
      JSON.parse(localStorage.getItem("queryHistory") ?? "[]"),
    ).toHaveLength(1);
  });

  it("deletes a saved query and removes matching history items", async () => {
    const tree = createGroup();
    tree.children = [
      {
        id: "rule-1",
        type: "rule",
        field: "status",
        operator: "equals",
        value: "active",
      },
    ];

    useQueryStore.getState().addSavedQuery(tree, "Active users");
    useQueryStore.getState().addToHistory(tree);

    expect(useQueryStore.getState().savedQueries).toHaveLength(1);
    expect(useQueryStore.getState().queryHistory).toHaveLength(1);

    const savedId = useQueryStore.getState().savedQueries[0].id;
    useQueryStore.getState().deleteSavedQuery(savedId);

    expect(useQueryStore.getState().savedQueries).toHaveLength(0);
    expect(useQueryStore.getState().queryHistory).toHaveLength(0);
    expect(
      JSON.parse(localStorage.getItem("savedQueries") ?? "[]"),
    ).toHaveLength(0);
    expect(
      JSON.parse(localStorage.getItem("queryHistory") ?? "[]"),
    ).toHaveLength(0);
  });

  it("loads a saved query and resets builder state", () => {
    const tree = createGroup();
    tree.children = [
      {
        id: "rule-1",
        type: "rule",
        field: "status",
        operator: "equals",
        value: "active",
      },
    ];

    const savedQuery = {
      id: "saved-1",
      name: "Active users",
      tree,
      createdAt: Date.now(),
    };

    useQueryStore.getState().loadSavedQuery(savedQuery);

    const store = useQueryStore.getState();
    expect(store.tree).toEqual(tree);
    expect(store.compiledQuery).not.toBeNull();
    expect(store.selectedTab).toBe("builder");
    expect(store.executionState).toBe("idle");
    expect(store.results).toEqual([]);
  });
});
