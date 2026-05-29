# **Phase 1**

This is to talk about the first phase of what I have done. As you can see here, this is a **visual query engine builder**, a system where users can create complex database-style filters and logic without writing code manually. Instead of typing SQL or MongoDB queries, users interact with a graphical interface to add rules, group conditions, nest **AND/OR logic infinitely**, preview the generated query in real time, and run it against mock datasets to inspect results dynamically.

Underneath the UI, the real challenge is engineering a **scalable recursive architecture** that can manage deeply nested query trees, schema-driven validation, dynamic rendering, performant state updates, drag-and-drop interactions, query parsing, and live execution simulation, all while keeping the experience smooth, maintainable, and production-grade using technologies like **Next.js, TypeScript, Zustand, DnD Kit**, and recursive React components.

So the first thing I had to do was start with the **logic layer** of the project, because it’s easier to build the logic first so wiring the UI becomes much easier later.

---

## **1. Core Types (`query.ts`)**

I defined the types in `query.ts` for a **rule** and a **group**. We define the types for a `GroupNode` and a `RuleNode`.

A `RuleNode` contains:

* `id` (from the base node extension)
* `type`
* `field`
* `operator`
* `value`

This is what makes up a single condition node.

A `GroupNode`, on the other hand, contains children which can be:

* a combination of `RuleNodes`
* a combination of `GroupNodes`
* or both

It also contains:

* `id`
* `type`
* a logical operator (**AND / OR**)

To remove the `any` type, I created a `ValueType`:

```ts
export type ValueType = string | number | boolean | string[] | number[];
```

This made value handling more structured and type-safe.

---

## **2. Utility Functions (Helpers)**

In the utils folder, I created helper functions to manage node creation and tree manipulation.

---

### **`createRule()`**

`createRule` is responsible for creating a rule node. It returns an object with a default configuration:

* random `id`
* type: `rule`
* operator: `equals`
* empty `field`
* empty `value`

---

### **`createGroup()`**

`createGroup` is similar to `createRule`, but for groups. It returns:

* random `id`
* type: `group`
* logic operator: `AND`
* empty `children` array

---

### **`addNode()`**

`addNode` is a function that takes three parameters:

* `tree` → the current node being inspected
* `parentId` → the group where we want to insert the node
* `newNode` → the node we want to insert

It starts by checking if the current node matches the `parentId`:

```ts
if (tree.id === parentId && tree.type === "group") {
  return {
    ...tree,
    children: [...tree.children, newNode],
  };
}
```

If this condition is true, we return an **immutable copy** of the tree and add the new node to `children`:

```ts
children: [...tree.children, newNode]
```

Then we check if the current node is a group. If it is, it may contain nested groups, this is where **recursion** comes in.

Recursion is when a function gradually solves itself by calling itself on smaller versions of the same problem until it reaches a **base case**.

This is a concept in data structures and algorithms I’ve worked with before, commonly seen in examples like factorial calculations.

So we return a copy of the tree, and recursively update children using:

```ts
children: tree.children.map((child) =>
  addNode(child, parentId, newNode)
)
```

Because `map()` returns a new array, this also maintains **immutable state updates**.

Finally, if no condition matches, we simply return the original tree.

---

### **`findNode()`**

This function is used to find a particular node in the tree.

It takes two parameters:

* `tree`: the tree to search in
* `id`: the id of the node we are looking for

It starts by checking if the current node matches:

```ts
if (tree.id === id) return tree;
```

If not, and the node is a group, we recursively search through its children:

```ts
for (const child of tree.children) {
  const found = findNode(child, id);
  if (found) return found;
}
```

If no match is found, we return:

```ts
return null;
```

---

### **`removeNode()`**

This function removes a node from the tree.

It takes:

* `tree`
* `nodeId`

If the current node is a group, we first create an updated copy where we remove the matching node:

```ts
children: tree.children.filter(child => child.id !== nodeId)
```

Then we recursively apply the function again:

```ts
.map((child) => removeNode(child, nodeId))
```

Finally, if nothing is found, we return the original tree.

---

## **3. Query Store (`queryStore.ts`)**

After building the core utilities, I created a store called `queryStore.ts`.

It handles four main things:

---

### **`tree`**

This initializes the state using:

```ts
createGroup()
```

This acts as the default root node.

---

### **`setTree`**

Directly sets the entire tree state.

---

### **`addNodeToTree`**

* gets the current tree
* applies `addNode`
* updates state with the new tree

---

### **`removeNodeFromTree`**

* gets the current tree
* applies `removeNode`
* updates state with the modified tree

---

## **4. Extras**

Lastly, I added:

* a basic schema for future dynamic validation
* simple unit tests for `createRule` and `createGroup`

---

## **End of Phase 1**

And that was everything for Phase 1.

This phase was mainly about building the **core recursive engine**, the foundation that everything else in the project will sit on.

Without this layer, the UI, interactions, and query preview system would not scale properly.
