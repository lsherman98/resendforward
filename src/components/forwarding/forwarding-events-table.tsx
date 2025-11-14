import type { ForwardingEventsResponse } from "@/lib/pocketbase-types";
import { Calendar, Inbox, Mail } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn, getStatusBadge } from "@/lib/utils";
import { format } from "date-fns";

export function ForwardingEventsTable({
  events,
  selectedEvent,
  setSelectedEvent,
}: {
  events: ForwardingEventsResponse[] | null | undefined;
  selectedEvent: ForwardingEventsResponse | null;
  setSelectedEvent: (event: ForwardingEventsResponse) => void;
}) {
  return !events || events.length === 0 ? (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No forwarding events</h3>
      <p className="text-sm text-muted-foreground">Forwarding events will appear here once emails are processed</p>
    </div>
  ) : (
    <div>
      {events.map((event) => {
        const { variant, label } = getStatusBadge(event.status);

        return (
          <div
            key={event.id}
            className={cn(
              "p-6 cursor-pointer hover:bg-muted/50 transition-colors rounded border-b border-border",
              selectedEvent?.id === event.id && "bg-muted"
            )}
            onClick={() => setSelectedEvent(event)}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0 flex gap-3">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="font-medium text-sm truncate">
                    {event.subject || <span className="text-muted-foreground italic">No subject</span>}
                  </div>
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    <div className="truncate">
                      <span className="font-medium">From:</span> {event.from || "-"}
                    </div>
                    <div className="truncate">
                      <span className="font-medium">To:</span> {event.to || "-"}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Badge variant={variant}>{label}</Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(event.created), "MMM d, yyyy 'at' HH:mm")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
