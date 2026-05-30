"use client";

import { Operator, RuleNode } from "@/types/query";
import { useQueryStore } from "@/store/queryStore";
import { Input } from "../ui/input";
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
      value: getDefaultValue(type),
    });
  };

  const handleOperatorChange = (operator: Operator) => {
    updateNodeInTree(node.id, { operator });
  };

  const handleValueChange = (value: string) => {
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

      <Input
        className="w-32"
        placeholder="value"
        value={String(node.value ?? "")}
        onChange={(e) => handleValueChange(e.target.value)}
      />

      <Button
        size="sm"
        variant="destructive"
        onClick={() => removeNodeFromTree(node.id)}
      >
        <X />
      </Button>
    </div>
  );
}
