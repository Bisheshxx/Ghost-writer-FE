import { Columns3, Table2 } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { JobRow, JobStatus } from "../types/job-tracker";
import JobTrackerKanban from "./job-tracker-kanban";
import JobTrackerTable from "./job-tracker-table";

type JobTrackerViewTabsProps = {
  allSelected: boolean;
  generatingIds: string[];
  isLoading: boolean;
  rows: JobRow[];
  selectedIds: string[];
  onClearSearch: () => void;
  onCreateEntry: () => void;
  onDeleteRow: (row: JobRow) => void;
  onEditRow: (row: JobRow) => void;
  onGenerateRow: (rowId: string) => void;
  onStatusChange: (rowId: string, status: JobStatus) => Promise<void>;
  onToggleAll: () => void;
  onToggleRow: (rowId: string) => void;
};

export default function JobTrackerViewTabs({
  allSelected,
  generatingIds,
  isLoading,
  rows,
  selectedIds,
  onClearSearch,
  onCreateEntry,
  onDeleteRow,
  onEditRow,
  onGenerateRow,
  onStatusChange,
  onToggleAll,
  onToggleRow,
}: JobTrackerViewTabsProps) {
  return (
    <Tabs defaultValue="table" className="w-full gap-3">
      <div className="flex justify-start sm:justify-end">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto">
          <TabsTrigger value="table" className="gap-2">
            <Table2 className="size-4" />
            Table
          </TabsTrigger>
          <TabsTrigger value="kanban" className="gap-2">
            <Columns3 className="size-4" />
            Kanban
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="table" className="min-w-0">
        <JobTrackerTable
          allSelected={allSelected}
          generatingIds={generatingIds}
          isLoading={isLoading}
          rows={rows}
          selectedIds={selectedIds}
          onClearSearch={onClearSearch}
          onCreateEntry={onCreateEntry}
          onDeleteRow={onDeleteRow}
          onEditRow={onEditRow}
          onGenerateRow={onGenerateRow}
          onStatusChange={onStatusChange}
          onToggleAll={onToggleAll}
          onToggleRow={onToggleRow}
        />
      </TabsContent>

      <TabsContent value="kanban" className="min-w-0">
        <JobTrackerKanban onStatusChange={onStatusChange} />
      </TabsContent>
    </Tabs>
  );
}
