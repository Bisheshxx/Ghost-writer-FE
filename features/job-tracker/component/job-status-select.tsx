import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { JOB_STATUS_OPTIONS } from "../constants";
import type { JobStatus } from "../types/job-tracker";

const ALL_STATUSES_VALUE = "all";

type JobStatusSelectProps = {
  value: JobStatus | "";
  onValueChange: (status: JobStatus | "") => void;
  includeAllOption?: boolean;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
};

export default function JobStatusSelect({
  value,
  onValueChange,
  includeAllOption = false,
  placeholder = "Select status",
  ariaLabel = "Select status",
  className,
}: JobStatusSelectProps) {
  return (
    <Select
      value={includeAllOption ? value || ALL_STATUSES_VALUE : value}
      onValueChange={(nextValue) =>
        onValueChange(
          includeAllOption && nextValue === ALL_STATUSES_VALUE
            ? ""
            : (nextValue as JobStatus),
        )
      }
    >
      <SelectTrigger aria-label={ariaLabel} className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {includeAllOption && (
          <SelectItem value={ALL_STATUSES_VALUE}>All statuses</SelectItem>
        )}
        {JOB_STATUS_OPTIONS.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
