import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetForwardingEvents } from "@/lib/api/queries";
import { ArrowRight, X } from "lucide-react";
import type { ForwardingRulesResponse } from "@/lib/pocketbase-types";
import { cn } from "@/lib/utils";

interface RecentEventsCardProps {
  rule: ForwardingRulesResponse;
  onClose: () => void;
}

export function RecentEvents({ rule, onClose }: RecentEventsCardProps) {
  const { data: forwardingEvents } = useGetForwardingEvents({ ruleId: rule.id });

  const recentEvents = forwardingEvents?.filter((e) => e.rule === rule.id).slice(0, 5) || [];

  return (
    <Card className="lg:col-span-1 flex flex-col pt-0 pb-0 gap-0 max-h-[calc(100vh-320px)]">
      <CardHeader className="border-b bg-muted/30 shrink-0 pt-4 pb-4!">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Recent Forwarding Events</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <span className="sr-only">Close</span>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-auto dark-scrollbar">
        <div className="divide-y h-full">
          {recentEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <p className="text-sm text-muted-foreground">No forwarding events yet</p>
            </div>
          ) : (
            <>
              {recentEvents.map((event) => (
                <div key={event.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="font-medium text-sm truncate">{event.subject || "No subject"}</div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "shrink-0 text-xs",
                        event.status === "delivered" && "bg-emerald-500/10 text-emerald-600",
                        event.status === "failed" && "bg-destructive/10 text-destructive",
                        event.status === "pending" && "bg-yellow-500/10 text-yellow-600"
                      )}
                    >
                      {event.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="truncate">From: {event.from}</div>
                    <div className="truncate">To: {event.to}</div>
                    <div>{new Date(event.created).toLocaleString()}</div>
                  </div>
                </div>
              ))}
              <div className="p-4">
                <Link to="/forwarding" search={{ ruleId: rule.id, timeRange: "all" }} className="inline-flex">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Events
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
