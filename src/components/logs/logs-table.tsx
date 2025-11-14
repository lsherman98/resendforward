import { cn, getLogTypeBadge } from "@/lib/utils";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { Link } from "@tanstack/react-router";
import type { EventLogsResponse } from "@/lib/pocketbase-types";
import { useState, Fragment } from "react";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";

interface LogRowProps {
  log: EventLogsResponse;
}

const LogRow = ({ log }: LogRowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { variant, label } = getLogTypeBadge(log.type);

  return (
    <Fragment>
      <TableRow
        className={cn("cursor-pointer hover:bg-muted/50", isOpen && "bg-muted/30")}
        onClick={() => setIsOpen(!isOpen)}
      >
        <TableCell>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </TableCell>
        <TableCell>
          <Badge variant={variant}>{label}</Badge>
        </TableCell>
        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
          {format(new Date(log.created), "MMM d, yyyy HH:mm:ss")}
        </TableCell>
        <TableCell>
          {log.expand && typeof log.expand === "object" && "rule" in log.expand && log.expand.rule ? (
            <Link
              to="/rules"
              search={{ ruleId: log.rule }}
              className="font-mono text-sm hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {(log.expand.rule as any).rule_email}
            </Link>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </TableCell>
        <TableCell>
          {log.expand && typeof log.expand === "object" && "event" in log.expand && log.expand.event ? (
            <Link
              to="/forwarding"
              search={{ ruleId: "", timeRange: "all", eventId: log.event }}
              className="text-sm hover:underline text-muted-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              View Event
            </Link>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={5} className="py-0">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleContent>
              <div className="bg-muted/10 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <h4 className="text-sm font-medium">Log Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Log ID</p>
                        <p className="text-sm font-mono">{log.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="text-sm">{format(new Date(log.created), "PPpp")}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {log.metadata ? (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Metadata</h4>
                    <pre className="text-xs bg-background border border-border rounded-lg p-3 overflow-x-auto max-h-[300px] overflow-y-auto">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No metadata available</p>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

export function LogsTable({ logs }: { logs: EventLogsResponse[] }) {
  return (
    <div className="relative w-full">
      <table className="w-full caption-bottom text-sm">
        <TableHeader className="sticky top-0 bg-background z-10 rounded">
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Rule</TableHead>
            <TableHead>Event</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <LogRow key={log.id} log={log} />
          ))}
        </TableBody>
      </table>
    </div>
  );
}
