import { ForwardingEventsStatusOptions } from "@/lib/pocketbase-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function StatusFilter({
  selectedStatus,
  onValueChange,
}: {
  selectedStatus: ForwardingEventsStatusOptions | undefined;
  onValueChange: (status: ForwardingEventsStatusOptions | "all") => void;
}) {
  return (
    <Select value={selectedStatus || "all"} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px] text-accent-foreground">
        <SelectValue placeholder="All Statuses" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Statuses</SelectItem>
        <SelectItem value={ForwardingEventsStatusOptions.pending}>Pending</SelectItem>
        <SelectItem value={ForwardingEventsStatusOptions.sent}>Sent</SelectItem>
        <SelectItem value={ForwardingEventsStatusOptions.delivered}>Delivered</SelectItem>
        <SelectItem value={ForwardingEventsStatusOptions.failed}>Failed</SelectItem>
      </SelectContent>
    </Select>
  );
}
