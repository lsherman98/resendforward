import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { Card, CardContent } from "@/components/ui/card";
import { useGetForwardingEvents, useGetForwardingEventLogs } from "@/lib/api/queries";
import { useState, useEffect, useMemo } from "react";
import { ForwardingEventsStatusOptions, type ForwardingEventsResponse } from "@/lib/pocketbase-types";
import { z } from "zod";
import { cn, getDateRange } from "@/lib/utils";
import { StatusFilter } from "@/components/forwarding/status-filter";
import { RangeFilter } from "@/components/range-filter";
import { RuleFilter } from "@/components/rule-filter";
import { ForwardingEventsTable } from "@/components/forwarding/forwarding-events-table";
import { SelectedEvent } from "@/components/forwarding/selected-event";
import { ForwardingStats } from "@/components/forwarding/forwarding-stats";

const searchSchema = z.object({
  ruleId: z.string().optional(),
  eventId: z.string().optional(),
  status: z.nativeEnum(ForwardingEventsStatusOptions).optional(),
  timeRange: z.enum(["all", "24h", "7d", "30d"]).catch("all"),
});

export const Route = createFileRoute("/_app/forwarding/")({
  component: RouteComponent,
  validateSearch: zodValidator(searchSchema),
  staticData: {
    routeName: "Forwarding Events",
  },
});

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { ruleId, eventId, status, timeRange } = Route.useSearch();

  const [selectedStatus, setSelectedStatus] = useState<ForwardingEventsStatusOptions | undefined>(status);
  const [selectedRuleId, setSelectedRuleId] = useState<string>(ruleId || "all");
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>(timeRange || "all");
  const [selectedEvent, setSelectedEvent] = useState<ForwardingEventsResponse | null>(null);

  const dateRange = useMemo(() => getDateRange(selectedTimeRange), [selectedTimeRange]);

  const { data: events } = useGetForwardingEvents({
    ruleId: selectedRuleId === "all" ? undefined : selectedRuleId,
    status: selectedStatus,
    ...dateRange,
  });
  const { data: eventLogs } = useGetForwardingEventLogs({ eventId: selectedEvent?.id });

  useEffect(() => {
    if (eventId && events) {
      const event = events.find((e) => e.id === eventId);
      if (event) setSelectedEvent(event);
      else setSelectedEvent(null);
    }
  }, [eventId, events]);

  const onStatusChange = (value: ForwardingEventsStatusOptions | "all") => {
    setSelectedStatus(value === "all" ? undefined : value);
    navigate({
      search: (prev) => ({
        ...prev,
        status: value === "all" ? undefined : value,
      }),
    });
  };

  const onRangeChange = (value: "all" | "24h" | "7d" | "30d") => {
    setSelectedTimeRange(value);
    navigate({
      search: (prev) => ({
        ...prev,
        timeRange: value,
      }),
    });
  };

  const onRuleChange = (value: string) => {
    setSelectedRuleId(value);
    navigate({
      search: (prev) => ({
        ...prev,
        ruleId: value === "all" ? undefined : value,
      }),
    });
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      <div className="shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-semibold">Forwarding Events</h1>
            <p className="text-sm text-muted-foreground">
              Monitor webhook events and troubleshoot email forwarding issues
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3 shrink-0">
        <ForwardingStats />
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <StatusFilter selectedStatus={selectedStatus} onValueChange={onStatusChange} />
        <RangeFilter selectedTimeRange={selectedTimeRange} onValueChange={onRangeChange} />
        <RuleFilter selectedRuleId={selectedRuleId} onValueChange={onRuleChange} />
      </div>
      <div className={cn("grid gap-4 flex-1 min-h-0", selectedEvent ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1")}>
        <Card className="flex flex-col py-0 max-h-[calc(100vh-335px)]">
          <CardContent className="p-0 flex-1 overflow-auto dark-scrollbar">
            <ForwardingEventsTable events={events} selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} />
          </CardContent>
        </Card>
        {selectedEvent && (
          <SelectedEvent selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} eventLogs={eventLogs} />
        )}
      </div>
    </div>
  );
}
