# Query Builder Studio

A visual query builder built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and Zustand. The app lets users construct nested query logic through a UI, preview the generated Mongo-style query, run it against mock user data, save presets, view history, and export/import query JSON.

## Running Locally

```bash
pnpm install
pnpm dev
```

Useful checks:

```bash
pnpm lint
pnpm test
pnpm test:unit
pnpm test:e2e
```

On Windows PowerShell, use `pnpm.cmd` if script execution policy blocks the `pnpm.ps1` shim.

## Core Design Decisions

### Query Tree As The Source Of Truth

The builder is modeled as a recursive tree of two node types:

- `group`: contains `logic` (`AND` or `OR`) and nested `children`
- `rule`: contains `field`, `operator`, and `value`

This shape was chosen because it maps directly to how users think about nested conditions. It also keeps add, remove, update, compile, validate, execute, save, export, and import operations working against one consistent structure.

### Recursive Rendering

The UI renders groups recursively. A `Group` can render rules or more groups, so the interface supports nested conditions without needing separate components for each depth level.

This keeps the implementation scalable: adding another nested level does not require new UI code, only another node in the tree.

### Schema-Driven Controls

Fields, labels, input types, defaults, and valid operators are driven by the schema in `src/lib/schema.ts` and `src/lib/operators.ts`.

That decision keeps query behavior centralized:

- string fields get string operators like `contains`
- number fields get numeric operators like `greater_than`
- enum fields get select-style values
- date fields get date-specific operators

The UI does not hard-code every field-specific behavior directly inside the rule component.

### Zustand For Builder State

Zustand is used for global builder state because the query tree is shared across the builder, JSON preview, results panel, sidebar, saved queries, history, import/export, and undo/redo controls.

The store owns:

- current query tree
- compiled query preview
- validation errors
- execution results and status
- saved queries
- query history
- selected tab
- undo/redo history

Keeping this state in one store avoids prop drilling through recursive components and makes cross-panel updates immediate.

### Immutable Recursive Updates

Tree mutations are handled through utility functions such as `addNode`, `removeNode`, and `updateNode`. These functions return new tree objects instead of mutating the existing tree.

That makes state updates predictable, keeps Zustand changes easy to reason about, and allows undo/redo to snapshot previous tree states cleanly.

### Mongo-Style Query Preview

The compiler generates Mongo-style query objects instead of SQL or GraphQL filters. This was chosen because the recursive `AND`/`OR` tree maps naturally to `$and` and `$or` arrays, and individual rule operators map cleanly to Mongo-like operators.

Example:

```json
{
  "$and": [
    { "age": { "$gt": 18 } },
    { "status": { "$eq": "active" } }
  ]
}
```

### Execution Simulator Over Real Backend Calls

Queries are executed against mock user data in the frontend. This keeps the challenge focused on query-building architecture rather than backend integration.

The execution engine recursively evaluates the same query tree used by the UI and compiler, so preview and results remain tied to the same source model.

### Validation At The Query Layer

Validation is handled by walking the query tree and checking each rule against the schema and allowed operator map.

This catches problems such as:

- unknown fields
- invalid operators for a field type
- empty values where a value is required

Validation lives outside the UI so imported JSON, saved queries, and manual builder edits can all be checked through the same path.

### Import And Export Use The Same Tree Shape

Exported JSON includes metadata plus the query tree:

```json
{
  "version": "1.0",
  "name": "My Query",
  "createdAt": "2026-06-02T00:00:00.000Z",
  "tree": {}
}
```

Import validates the file before applying it to the builder. The importer accepts the app export payload and a raw root group as a practical fallback. Imported trees go through the normal `setTree` path, so the UI reconstructs from JSON and the import can be undone.

### Saved Queries And History In Local Storage

Saved queries and query history are stored in `localStorage`. This keeps persistence simple and client-only while still giving users reusable presets and recent runs.

Duplicate saved queries are blocked by comparing tree shape, so users do not accidentally save the exact same query more than once.

### Undo And Redo Are Builder-Scoped

Undo/redo tracks builder tree changes only. It applies to actions that change the query itself, such as adding rules, removing groups, editing values, clearing, loading, and importing.

Actions like saving, exporting, and running queries are not added to undo history because they do not modify the builder tree.

History is bounded to avoid unbounded memory growth during long sessions.

### Tabs Separate Builder, Preview, And Results

The main workspace uses tabs for:

- visual builder
- JSON preview
- execution results

This avoids crowding the screen while still keeping each workflow close. The builder remains the primary surface, while preview and results are available when users need inspection.

### Sidebar For Workspace Tools And Recall

The sidebar holds secondary workflows:

- export query
- clear builder
- saved queries
- query history

This keeps the main canvas focused on query construction while still making persistence and recall easy to reach.

### Component And Utility Separation

The project separates UI components, store logic, query utilities, schema definitions, and type definitions.

Important boundaries:

- `src/components/query-builder`: recursive builder UI
- `src/store/queryStore.ts`: shared application state
- `src/utils`: tree mutation, compilation, execution, validation, import/export helpers
- `src/types`: query, schema, export, saved query, and validation types
- `src/lib`: schema, operators, mock data, shared helpers

This separation makes the code easier to test and keeps the recursive logic from being tangled with presentation details.

### Testing Strategy

Tests focus on the behavior most likely to break:

- recursive tree mutation
- query compilation
- query execution
- validation
- import/export parsing
- store behavior
- critical UI flows such as saving, adding rules, undo/redo, and importing JSON

Vitest is used for unit and integration tests. Playwright is configured for browser-level e2e coverage.

## Trade-Offs

- The app uses mock data instead of a backend so the project can focus on frontend query architecture.
- Query execution supports the core operators needed for the simulator, while the compiler supports a broader Mongo-style mapping.
- `localStorage` persistence is simple and useful for a client-only demo, but a production multi-user app would move saved queries and history to a backend.
- Undo/redo snapshots full query trees. This is simple and reliable for the current tree size; a larger production system could use patches or operation logs.
- Imported JSON is validated structurally before rendering, but stricter semantic validation could be expanded further for date ranges, enum values, and deeply malformed edge cases.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- Vitest
- React Testing Library
- Playwright
