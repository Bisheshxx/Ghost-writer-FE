import { ArrowUpDown, Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { JOB_FILTER_CHIPS } from "../constants";

type JobTrackerFiltersProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

export default function JobTrackerFilters({
  query,
  onQueryChange,
}: JobTrackerFiltersProps) {
  return (
    <Card className="border-border/60 bg-background/80 shadow-sm backdrop-blur">
      <CardContent className="flex h-full flex-col gap-3 p-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Filter className="size-4" /> Search and filters
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search companies, titles, locations"
              className="pl-9"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <ArrowUpDown className="size-4" /> Sort
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {JOB_FILTER_CHIPS.map((chip) => (
            <span key={chip} className="rounded-full border px-2 py-1">
              {chip}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
