import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type IconTooltipButtonProps = {
  icon: LucideIcon;
  label: string;
  ariaLabel?: string;
  iconClassName?: string;
  onClick?: () => void;
};

export default function IconTooltipButton({
  icon: Icon,
  label,
  ariaLabel = label,
  iconClassName,
  onClick,
}: IconTooltipButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label={ariaLabel}
          onClick={onClick}
        >
          <Icon className={iconClassName ?? "size-4"} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
