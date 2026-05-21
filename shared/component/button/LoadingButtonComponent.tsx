import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { twMerge } from "tailwind-merge";
interface IProps {
  isLoading: boolean;
  text: string;
  className?: string;
}
export default function LoadingButtonComponent({
  isLoading,
  text,
  className,
}: IProps) {
  return (
    <Button disabled={isLoading} type="submit" className={twMerge(className)}>
      {isLoading ? (
        <div className={twMerge("flex items-center gap-2")}>
          <Loader2 className="animate-spin" /> Loading
        </div>
      ) : (
        text
      )}
    </Button>
  );
}
