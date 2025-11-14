import { EventLogsTypeOptions } from "@/lib/pocketbase-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function LogTypeFilter({
  selectedType,
  onValueChange,
}: {
  selectedType: EventLogsTypeOptions | undefined;
  onValueChange: (type: EventLogsTypeOptions | "all") => void;
}) {
  return (
    <Select value={selectedType} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px] text-accent-foreground!">
        <SelectValue placeholder="All Types" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Types</SelectItem>
        <SelectItem value={EventLogsTypeOptions["webhook.received"]}>Webhook Received</SelectItem>
        <SelectItem value={EventLogsTypeOptions["forward.initiated"]}>Forward Initiated</SelectItem>
        <SelectItem value={EventLogsTypeOptions["email.sent"]}>Email Sent</SelectItem>
        <SelectItem value={EventLogsTypeOptions["email.delivered"]}>Email Delivered</SelectItem>
        <SelectItem value={EventLogsTypeOptions["email.failed"]}>Email Failed</SelectItem>
        <SelectItem value={EventLogsTypeOptions.error}>Error</SelectItem>
      </SelectContent>
    </Select>
  );
}
