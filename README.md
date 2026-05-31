# **Phase 3**

Phase 3 was about **schema-driven intelligence** for the rules. Each rule is supposed to be contextual. There is a dropdown that allows users to select values based on the type of field selected, and then basic validation is also implemented.

## **1. Redefining the Schema**

The first thing I did was redefine the shape of my schema in the `types/schema.ts` file.

The `schema.ts` file starts by defining `FieldType`, which can be:

- `string` for name
- `number` for age
- `enum` for status (meaning it has predefined options)
- `date` for createdAt

This `FieldType` is then used in the `SchemaField` type, which contains:

- `label`
- `type` (which is a `FieldType`)
- `options` (optional)

This allows every field in the schema to describe how it should behave in the UI.

## **2. Creating the Schema Configuration**

Next, I moved to the `schema.ts` file inside the `lib` folder and mapped fields to their respective types.

```ts
import { SchemaField } from "@/types/schema";

export const schema: Record<string, SchemaField> = {
  name: {
    label: "Name",
    type: "string",
  },
  age: {
    label: "Age",
    type: "number",
  },
  status: {
    label: "Status",
    type: "enum",
    options: ["active", "inactive"],
  },
  createdAt: {
    label: "Created At",
    type: "date",
  },
};
```

This became the single source of truth for all fields in the query builder.

## **3. Schema Utility Functions**

After that, I created helper functions in `utils/schema.ts`.

There are four main ones.

### **`getFieldType()`**

`getFieldType` checks the schema object from the lib folder.

It takes a field as a parameter, accesses that field in the schema, and then returns its type.

```ts
return schema[field]?.type;
```

This allows the UI to know whether a field is a string, number, enum, or date.

### **`getEnumOptions()`**

`getEnumOptions` works similarly.

In this case, only enum fields (such as `status`) have options.

The function accesses the field and returns its options. If the field has no options, it returns an empty array instead.

This prevents undefined values from causing issues in the UI.

### **`getFields()`**

`getFields` simply returns all the keys in the schema object.

```ts
return Object.keys(schema);
```

This is used to dynamically populate the field dropdown.

### **`getDefaultValue()`**

`getDefaultValue` is used to provide contextual default values.

If the field type is:

- `string`
- `date`
- `enum`

then it returns:

```ts
"";
```

If the field type is `number`, it returns:

```ts
0;
```

This ensures that every field starts with a valid default value.

## **4. Making the Rule Component Schema-Driven**

After creating the schema helpers, the `Rule.tsx` component had to reflect them.

First, I used:

```ts
const fields = getFields();
```

to retrieve all available fields.

Then I used:

```ts
const fieldType = getFieldType(node.field);
```

to determine the type of the currently selected field.

Finally, I used `operatorsByType` to determine which operators are allowed for that specific field type.

### **Operators by Type**

I defined operators for each field type:

```ts
export const operatorsByType: Record<FieldType, Operator[]> = {
  string: ["equals", "not_equals", "contains", "starts_with"],
  number: ["equals", "not_equals", "greater_than", "less_than"],
  date: ["equals", "before", "after", "between", "on_or_before", "on_or_after"],
  enum: ["equals", "not_equals", "in", "not_in"],
};
```

This means that:

- string fields can use operators like `contains`
- number fields can use comparison operators
- date fields can use date-specific operators
- enum fields can use set-based operators

This prevents users from selecting invalid combinations.

For example, a number field should never be able to use `contains`.

### **`handleFieldChange()`**

The main function here is `handleFieldChange`, which takes a field as a parameter.

When a user changes the field:

1. It finds the field type using `getFieldType()`
2. It retrieves the operators available for that type
3. It selects the first operator as the default
4. It resets the value using `getDefaultValue()`
5. It updates the node

So whenever a field changes, the operator and value are automatically reinitialized to match the new field type.

This keeps the rule in a valid state.

### **`handleOperatorChange()`**

`handleOperatorChange` takes an operator of type `Operator`.

When a user selects a new operator, it updates the current node with the new operator.

### **`handleValueChange()`**

`handleValueChange` follows the same idea.

Whenever the user changes the value, the node is updated with the new value.

### **Schema-Driven Dropdowns**

After that, I replaced the old field input with a select component.

The select is populated by mapping over the fields returned from:

```ts
getFields();
```

and on value change it calls:

```ts
handleFieldChange();
```

I did the same thing for the operators dropdown, except that it uses the operators available for the currently selected field type.

This means both dropdowns are now completely driven by the schema configuration.

If I add a new field to the schema later, the UI automatically adapts without requiring changes to the component itself.

And that was the main work for `Rule.tsx`.

At this point, the query builder had become schema-aware. Rules were no longer static inputs; they now adapted dynamically based on the field being selected.

### **Adding Validation**

The next step after this was adding **validation**, so that users could not create invalid query conditions.

I started by defining the type for validation errors:

```ts
export type ValidationError = {
  nodeId: string;
  message: string;
  field?: string;
};
```

This gives every validation error:

- the node that caused the error
- the error message itself
- an optional field name

This makes it easy to associate validation errors with specific rules in the query tree.

Then, in the `validateQuery.ts` file inside the `utils` folder, the validation logic depends on three things:

- `operatorsByType`
- `getFieldType`
- `ValidationError`

I started with the `validateQuery()` function, which takes two parameters:

```ts
validateQuery(
  node: QueryNode,
  errors: ValidationError[]
)
```

and returns an array of `ValidationError`.

The first thing it does is check if the node is a rule.

If the node type is a rule, validation becomes straightforward.

I create a variable called `rule`, which is simply the current node cast as a `RuleNode`.

Then I retrieve the field type using:

```ts
const fieldType = getFieldType(rule.field);
```

I also define a variable called `isRuleActive`.

A rule is considered active when it already has both:

- a field
- an operator

This allows validation to ignore incomplete rules that have not been configured yet.

Next, I create a set containing all operators that require a value in order to work.

This makes it easy to determine whether a rule should have a value attached to it.

The first validation check is for invalid fields.

If `fieldType` does not exist, then the selected field is not valid according to the schema.

In that case, I push a validation error into the errors array:

```ts
errors.push({
  nodeId: rule.id,
  message: "Invalid field selected",
});
```

and immediately return the errors array.

If the field is valid, I retrieve all operators that are allowed for that field type:

```ts
const allowedOperators = operatorsByType[fieldType];
```

Then I check whether the currently selected operator exists inside that list.

If it does not, another validation error is added:

```ts
errors.push({
  nodeId: rule.id,
  message: "Operator is not valid for this field type",
});
```

This prevents cases such as:

- using `contains` on a number field
- using `greater_than` on an enum field

and other invalid combinations.

Finally, if the rule is active, I check whether the current operator requires a value.

```ts
if (isRuleActive) {
  const needsValue = operatorsThatNeedValue.has(rule.operator);

  if (needsValue) {
    if (rule.value === "" || rule.value === null || rule.value === undefined) {
      errors.push({
        nodeId: rule.id,
        message: "Value cannot be empty",
      });
    }
  }
}
```

This ensures that operators requiring user input cannot be left empty.

For example:

```txt
Age > ?
```

would be considered invalid because the value is missing.

The final part handles groups.

If the node type is a group, then we recursively validate every child inside that group.

```ts
for (const child of node.children) {
  validateQuery(child, errors);
}
```

This is the same recursive pattern used throughout the project.

Since groups can contain:

- rules
- groups
- or both

the validator needs to keep traversing the tree until every node has been checked.

At the very end, if none of the validation checks produce errors, we simply return the `errors` array.

```ts
return errors;
```

What I like about this implementation is that the validation engine automatically scales with the tree structure.

Whether the query contains:

- 2 rules
- 20 rules
- or 200 nested groups

the same recursive validation function continues to work without any additional logic. This is one of the advantages of building the query system as a recursive tree from the beginning.

### **Making Value Fully Schema-Driven**

Then I realized something that I did **not fully align with the requirements of the application**.

I was not rendering the value _contextually_.

What I mean is: the value input is supposed to depend on the **type of the field**. It was already type-driven, but not fully schema-driven — and that’s what I decided to fix.

I started by adding two new properties to each field in the schema inside `schema.ts` (in the `lib` folder):

- `uiType`
- `defaultValue`

This made the schema not just define _data types_, but also define _how the UI should behave_.

Then I went into `schema.ts` inside the `utils` folder and refactored:

#### **`getDefaultValue()`**

Now instead of hardcoding defaults, it returns the `defaultValue` directly from the schema based on the field.

I also created a similar function:

#### **`getFieldUiType()`**

which returns the `uiType` of a field directly from the schema.

This was the final step that made everything truly **schema-driven**, not just type-driven.

### **6. Creating `ValueInput.tsx` (Dynamic UI Renderer)**

After that, I created a new component called **`ValueInput.tsx`**.

This component is responsible for rendering the correct input UI depending on the `uiType`.

I started by getting the UI type of the field:

```ts
const uiType = getFieldUiType(field);
```

Then I used a **switch statement** to render different inputs based on the type.

I also added an edge case:

If no field is selected yet, it renders a disabled input prompting the user to select a field first.

### **7. Full `ValueInput.tsx` Component**

This is the full implementation:

```tsx id="value-input"
import { ValueType } from "@/types/query";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { getFieldUiType, getEnumOptions } from "@/utils/schema";

type Props = {
  field: string;
  value: unknown;
  onChange: (value: ValueType) => void;
};

export function ValueInput({ field, value, onChange }: Props) {
  const uiType = getFieldUiType(field);

  if (!field) {
    return (
      <Input disabled placeholder="Select a field first" className="w-fit" />
    );
  }

  const safeValue =
    value === undefined || value === null ? undefined : String(value);

  switch (uiType) {
    case "select":
      return (
        <Select value={safeValue} onValueChange={onChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select value" />
          </SelectTrigger>

          <SelectContent>
            {getEnumOptions(field).map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "number":
      return (
        <Input
          type="number"
          className="w-32"
          value={String(value ?? "")}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );

    case "date":
      return (
        <Input
          type="date"
          className="w-40"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "text":
    default:
      return (
        <Input
          className="w-32"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}
```

At this point, the query builder became fully **schema-driven end-to-end**:

- Fields determine available operators
- Fields determine default values
- Fields determine UI input types
- Value input adapts automatically based on schema config

Phase 3 was the point where the system stopped being just type-aware and became truly **schema-driven and intelligent**.
