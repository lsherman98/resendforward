import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { useGetForwardingEventLogs } from "@/lib/api/queries";
import { useState, useMemo } from "react";
import { FileText } from "lucide-react";
import { EventLogsTypeOptions } from "@/lib/pocketbase-types";
import { z } from "zod";
import { getDateRange } from "@/lib/utils";
import { RangeFilter } from "@/components/range-filter";
import { RuleFilter } from "@/components/rule-filter";
import { LogSearchByEventId } from "@/components/logs/log-search-by-event-id";
import { LogTypeFilter } from "@/components/logs/log-type-filter";
import { LogsTable } from "@/components/logs/logs-table";

const searchSchema = z.object({
  eventId: z.string().optional(),
  ruleId: z.string().optional(),
  type: z.nativeEnum(EventLogsTypeOptions).optional(),
  timeRange: z.enum(["all", "24h", "7d", "30d"]).optional(),
});

export const Route = createFileRoute("/_app/logs/")({
  component: RouteComponent,
  validateSearch: searchSchema,
  staticData: {
    routeName: "Event Logs",
  },
});

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { eventId, ruleId, type, timeRange } = Route.useSearch();

  const [selectedType, setSelectedType] = useState<EventLogsTypeOptions | undefined>(type);
  const [selectedRuleId, setSelectedRuleId] = useState<string | undefined>(ruleId);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>(timeRange || "all");
  const [searchEventId, setSearchEventId] = useState<string>(eventId || "");

  const dateRange = useMemo(() => getDateRange(selectedTimeRange), [selectedTimeRange]);

  const { data: logs } = useGetForwardingEventLogs({
    eventId,
    ruleId: selectedRuleId,
    type: selectedType,
    ...dateRange,
  });

  const onRangeChange = (value: "all" | "24h" | "7d" | "30d") => {
    setSelectedTimeRange(value);
    navigate({ search: (prev) => ({ ...prev, timeRange: value }) });
  };

  const onRuleChange = (value: string) => {
    const newRuleId = value === "all" ? undefined : value;
    setSelectedRuleId(newRuleId);
    navigate({ search: (prev) => ({ ...prev, ruleId: newRuleId }) });
  };

  const handleSearchByEventKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") navigate({ search: (prev) => ({ ...prev, eventId: searchEventId || undefined }) });
  };

  const handleSearchClear = () => {
    setSearchEventId("");
    navigate({ search: (prev) => ({ ...prev, eventId: undefined }) });
  };

  const onTypeFilterChange = (value: EventLogsTypeOptions | "all") => {
    setSelectedType(value === "all" ? undefined : value);
    navigate({ search: (prev) => ({ ...prev, type: value === "all" ? undefined : value }) });
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      <div className="shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-semibold">Event Logs</h1>
            <p className="text-sm text-muted-foreground">
              Detailed logs of all forwarding events and webhook activities
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <LogSearchByEventId
          searchEventId={searchEventId}
          setSearchEventId={setSearchEventId}
          onKeyDown={handleSearchByEventKeyDown}
          onClick={handleSearchClear}
        />
        <LogTypeFilter selectedType={selectedType} onValueChange={onTypeFilterChange} />
        <RangeFilter selectedTimeRange={selectedTimeRange} onValueChange={onRangeChange} />
        <RuleFilter selectedRuleId={selectedRuleId} onValueChange={onRuleChange} />
      </div>
      <Card className="flex-1 pt-0 pb-0 py-0">
        <CardContent className="p-0 h-full">
          {!logs || logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No event logs</h3>
              <p className="text-sm text-muted-foreground">
                {selectedType || selectedRuleId || selectedTimeRange !== "all"
                  ? "No logs match the selected filters"
                  : "Event logs will appear here as emails are processed"}
              </p>
            </div>
          ) : (
            <div className="rounded overflow-auto dark-scrollbar" style={{ maxHeight: "calc(100vh - 235px)" }}>
              <LogsTable logs={logs} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
