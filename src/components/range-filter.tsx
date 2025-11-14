import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function RangeFilter({
  selectedTimeRange,
  onValueChange,
}: {
  selectedTimeRange: string;
  onValueChange: (value: "all" | "24h" | "7d" | "30d") => void;
}) {
  return (
    <Select value={selectedTimeRange} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px] text-accent-foreground">
        <SelectValue placeholder="Time Range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Time</SelectItem>
        <SelectItem value="24h">Last 24 hours</SelectItem>
        <SelectItem value="7d">Last 7 days</SelectItem>
        <SelectItem value="30d">Last 30 days</SelectItem>
      </SelectContent>
    </Select>
  );
}
