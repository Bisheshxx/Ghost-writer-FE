import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type BulkGenerationActionsProps = {
  isGenerating: boolean;
  selectedCount: number;
  onClearSelection: () => void;
  onGenerate: () => void;
};

export default function BulkGenerationActions({
  isGenerating,
  selectedCount,
  onClearSelection,
  onGenerate,
}: BulkGenerationActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-background/90 px-4 py-3 shadow-sm">
      <div className="text-sm">
        {selectedCount} selected for backend generation
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={onClearSelection}
        >
          Clear
        </Button>
        <Button
          size="sm"
          className="gap-2"
          onClick={onGenerate}
          disabled={isGenerating}
        >
          <LoaderCircle
            className={`size-4 ${isGenerating ? "animate-spin" : ""}`}
          />{" "}
          Generate
        </Button>
      </div>
    </div>
  );
}
