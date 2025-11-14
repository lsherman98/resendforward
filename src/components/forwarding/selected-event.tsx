import type { EventLogsResponse, ForwardingEventsResponse } from "@/lib/pocketbase-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Calendar, ChevronDown, ExternalLink, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { getLogTypeBadge, getStatusBadge } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Link } from "@tanstack/react-router";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";

function EventHeader({ selectedEvent, onClose }: { selectedEvent: ForwardingEventsResponse; onClose: () => void }) {
  return (
    <CardHeader className="border-b border-border bg-muted/30 shrink-0 pt-4 pb-4!">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <CardTitle className="text-base">{selectedEvent.subject || "No subject"}</CardTitle>
          <CardDescription className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {format(new Date(selectedEvent.created), "MMMM d, yyyy 'at' HH:mm")}
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-1" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
}

function MetadataSection({ selectedEvent }: { selectedEvent: ForwardingEventsResponse }) {
  const { variant, label } = getStatusBadge(selectedEvent.status);

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-muted-foreground">Metadata</h3>
      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-3 gap-2">
          <div className="text-muted-foreground">Status</div>
          <Badge variant={variant}>{label}</Badge>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-muted-foreground">From</div>
          <div className="col-span-2 font-mono text-xs break-all">{selectedEvent.from || "-"}</div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-muted-foreground">To</div>
          <div className="col-span-2 font-mono text-xs break-all">{selectedEvent.to || "-"}</div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-muted-foreground">Rule</div>
          <div className="col-span-2">
            <Link
              to="/rules"
              search={{ ruleId: selectedEvent.rule }}
              className="font-mono text-xs break-all text-primary hover:underline inline-flex items-center gap-1"
            >
              {selectedEvent.rule}
              <ExternalLink className="h-3 w-3 shrink-0" />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-muted-foreground">Received ID</div>
          <div className="col-span-2 font-mono text-xs break-all">{selectedEvent.received_email_id}</div>
        </div>
        {selectedEvent.sent_email_id && (
          <div className="grid grid-cols-3 gap-2">
            <div className="text-muted-foreground">Sent ID</div>
            <div className="col-span-2 font-mono text-xs break-all">{selectedEvent.sent_email_id}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetadataValue({ value }: { value: unknown }) {
  if (Array.isArray(value)) {
    return (
      <div className="space-y-1">
        {value.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            {typeof item === "object" && item !== null ? (
              <pre className="text-xs bg-background rounded p-2 overflow-x-auto font-mono flex-1">
                {JSON.stringify(item, null, 2)}
              </pre>
            ) : (
              <span className="font-mono">{String(item)}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object" && value !== null) {
    return (
      <pre className="text-xs bg-background rounded p-2 overflow-x-auto font-mono">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  return <span className="font-mono">{String(value)}</span>;
}

function EventLogItem({ log }: { log: EventLogsResponse }) {
  const { variant, label } = getLogTypeBadge(log.type);
  return (
    <Collapsible>
      <div className="rounded-lg bg-muted/50 overflow-hidden">
        <CollapsibleTrigger className="w-full flex items-center gap-3 p-3 text-xs hover:bg-muted/70 transition-colors">
          <div className="shrink-0">
            <Badge variant={variant}>{label}</Badge>
          </div>
          <div className="flex-1 min-w-0"></div>
          <div className="flex items-center gap-2 text-muted-foreground shrink-0">
            <span className="text-right">{format(new Date(log.created), "MMM d, HH:mm:ss")}</span>
            <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
          </div>
        </CollapsibleTrigger>
        {log.metadata !== null && log.metadata !== undefined && (
          <CollapsibleContent className="px-3 pb-3">
            <div className="pt-2 border-t border-border/50">
              <div className="text-xs font-semibold mb-2 text-muted-foreground">Metadata</div>
              <div className="space-y-2">
                {Object.entries(log.metadata as Record<string, unknown>).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-muted-foreground font-medium wrap-break-word">{key}</div>
                    <div className="col-span-2 wrap-break-word">
                      <MetadataValue value={value} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        )}
      </div>
    </Collapsible>
  );
}

function EventLogsSection({ eventLogs, eventId }: { eventLogs: EventLogsResponse[] | undefined; eventId: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-muted-foreground">Event Logs</h3>
      {!eventLogs || eventLogs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No event logs available</p>
      ) : (
        <div className="space-y-2">
          {eventLogs.slice(0, 5).map((log) => (
            <EventLogItem key={log.id} log={log} />
          ))}
          <Link to="/logs" search={{ eventId }}>
            <Button variant="outline" size="sm" className="w-full mt-2">
              <ExternalLink className="h-4 w-4 mr-2" />
              View All Logs
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export function SelectedEvent({
  selectedEvent,
  setSelectedEvent,
  eventLogs,
}: {
  selectedEvent: ForwardingEventsResponse;
  setSelectedEvent: (event: ForwardingEventsResponse | null) => void;
  eventLogs: EventLogsResponse[] | undefined;
}) {
  return (
    <Card className="flex flex-col py-0 max-h-[calc(100vh-335px)] gap-0">
      <EventHeader selectedEvent={selectedEvent} onClose={() => setSelectedEvent(null)} />
      <CardContent className="px-6 py-2 space-y-6 max-h-[64vh] overflow-auto dark-scrollbar">
        <MetadataSection selectedEvent={selectedEvent} />
        <EventLogsSection eventLogs={eventLogs} eventId={selectedEvent.id} />
      </CardContent>
    </Card>
  );
}
