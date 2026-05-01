import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";
import { FieldValues } from "react-hook-form";
import { twMerge } from "tailwind-merge";
interface IProps<T extends FieldValues> {
  isLoading: boolean;
  text: string;
  className?: string;
}
export default function LoadingButtonComponent<T extends FieldValues>({
  isLoading,
  text,
  className,
}: IProps<T>) {
  return (
    <Button disabled={isLoading} type="submit">
      {isLoading ? (
        <div className={twMerge("flex items-center gap-2", className)}>
          <Loader2 className="animate-spin" /> Loading
        </div>
      ) : (
        text
      )}
    </Button>
  );
}
