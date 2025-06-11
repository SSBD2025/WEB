import { Badge } from "../ui/badge";

const NutrientBadge = ({
  label,
  value,
  unit = "",
  color = "default",
}: {
  label: string;
  value: number;
  unit?: string;
  color?: "default" | "secondary" | "destructive" | "outline";
}) => (
  <Badge variant={color} className="text-xs">
    {label}: {value.toFixed(value < 1 ? 3 : 1)}
    {unit}
  </Badge>
);

export default NutrientBadge;
