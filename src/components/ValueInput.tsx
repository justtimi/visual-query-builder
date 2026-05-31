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
    return <Input disabled placeholder="Select a field first" className="w-fit" />;
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
