import { Columns3, Table2 } from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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
  onDeleteRow: (rowId: string) => void;
  onGenerateRow: (rowId: string) => void;
  onStatusChange: (rowId: string, status: JobStatus) => void;
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
  onGenerateRow,
  onStatusChange,
  onToggleAll,
  onToggleRow,
}: JobTrackerViewTabsProps) {
  return (
    <Tabs defaultValue="table" className="gap-3">
      <div className="flex justify-end">
        <TabsList>
          <TabsTrigger value="table">
            <Table2 className="size-4" />
            Table
          </TabsTrigger>
          <TabsTrigger value="kanban">
            <Columns3 className="size-4" />
            Kanban
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="table">
        <JobTrackerTable
          allSelected={allSelected}
          generatingIds={generatingIds}
          isLoading={isLoading}
          rows={rows}
          selectedIds={selectedIds}
          onClearSearch={onClearSearch}
          onCreateEntry={onCreateEntry}
          onDeleteRow={onDeleteRow}
          onGenerateRow={onGenerateRow}
          onStatusChange={onStatusChange}
          onToggleAll={onToggleAll}
          onToggleRow={onToggleRow}
        />
      </TabsContent>

      <TabsContent value="kanban">
        <JobTrackerKanban
          isLoading={isLoading}
          rows={rows}
          onClearSearch={onClearSearch}
          onCreateEntry={onCreateEntry}
          onStatusChange={onStatusChange}
        />
      </TabsContent>
    </Tabs>
  );
}
