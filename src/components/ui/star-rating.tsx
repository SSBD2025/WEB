import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
} from "react-hook-form";

interface StarRatingProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
> extends React.HTMLAttributes<HTMLDivElement> {
  name: TName;
  control: Control<TFieldValues>;
  defaultValue?: PathValue<TFieldValues, TName>;
}

export function StarRating<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
>({
  name,
  control,
  defaultValue = 0 as PathValue<TFieldValues, TName>,
  className,
  ...props
}: StarRatingProps<TFieldValues, TName>) {
  const [hoveredRating, setHoveredRating] = React.useState<number>(0);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <div
          className={cn("flex items-center justify-center gap-2", className)}
          {...props}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-8 w-8 cursor-pointer transition-all ${
                star <= (hoveredRating || field.value)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
              onClick={() => field.onChange(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
            />
          ))}
        </div>
      )}
    />
  );
}
