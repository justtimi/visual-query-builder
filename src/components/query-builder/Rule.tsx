"use client";

import { Operator, RuleNode, ValueType } from "@/types/query";
import { useQueryStore } from "@/store/queryStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import { schema } from "@/lib/schema";
import { getDefaultValue, getFields } from "@/utils/schema";
import { operatorsByType } from "@/lib/operators";
import { getFieldType } from "@/utils/schema";
import { ValueInput } from "../ValueInput";

type Props = {
  node: RuleNode;
};

export function Rule({ node }: Props) {
  const removeNodeFromTree = useQueryStore((s) => s.removeNodeFromTree);
  const updateNodeInTree = useQueryStore((s) => s.updateNodeInTree);

  const fields = getFields();

  const fieldType = node.field ? getFieldType(node.field) : "string";
  const operators = fieldType ? operatorsByType[fieldType] : [];

  const handleFieldChange = (field: string) => {
    const type = getFieldType(field);
    const defaultOperator = operatorsByType[type][0];

    updateNodeInTree(node.id, {
      field,
      operator: defaultOperator,
      value: getDefaultValue(field),
    });
  };

  const handleOperatorChange = (operator: Operator) => {
    updateNodeInTree(node.id, { operator });
  };

  const handleValueChange = (value: ValueType) => {
    updateNodeInTree(node.id, { value });
  };

  return (
    <div className="flex items-center gap-2 border p-2 rounded justify-between">
      <Select value={node.field} onValueChange={handleFieldChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select field" />
        </SelectTrigger>

        <SelectContent>
          {fields.map((field) => (
            <SelectItem key={field} value={field}>
              {schema[field].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={node.operator} onValueChange={handleOperatorChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Operator" />
        </SelectTrigger>

        <SelectContent>
          {operators.map((op) => (
            <SelectItem key={op} value={op}>
              {op}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ValueInput
        key={node.field}
        field={node.field}
        value={node.value}
        onChange={handleValueChange}
      />

      <Button
        size="icon"
        variant="destructive"
        onClick={() => removeNodeFromTree(node.id)}
      >
        <X />
      </Button>
    </div>
  );
}
