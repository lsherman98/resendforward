import { Card, CardContent } from "@/components/ui/card";
import { TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail } from "lucide-react";
import type { ForwardingRulesResponse } from "@/lib/pocketbase-types";
import { cn } from "@/lib/utils";
import { RulesTableRow } from "./rules-table-row";

interface RulesTableProps {
  rules: ForwardingRulesResponse[] | undefined;
  selectedRule: ForwardingRulesResponse | null;
  onSelectRule: (rule: ForwardingRulesResponse) => void;
  onDeleteRule: (rule: ForwardingRulesResponse) => void;
  onEditRule: (rule: ForwardingRulesResponse) => void;
}

export function RulesTable({ rules, selectedRule, onSelectRule, onDeleteRule, onEditRule }: RulesTableProps) {
  if (!rules || rules.length === 0) {
    return (
      <Card className="flex flex-col pt-0 lg:col-span-3">
        <CardContent className="p-0 flex-1 overflow-auto">
          <div className="flex flex-col items-center justify-center py-12 text-center h-full">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No forwarding rules</h3>
            <p className="text-sm text-muted-foreground mb-4">Get started by creating your first forwarding rule</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "flex flex-col pt-0 pb-0 max-h-[calc(100vh-320px)]",
        selectedRule ? "lg:col-span-2" : "lg:col-span-3"
      )}
    >
      <CardContent className="p-0 flex-1 overflow-auto dark-scrollbar rounded">
        <div className="relative w-full">
          <table className="w-full caption-bottom text-sm">
            <TableHeader className="sticky top-0 bg-background z-10 rounded">
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Rule Email</TableHead>
                <TableHead>Forward To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Forwarded</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <RulesTableRow
                  key={rule.id}
                  rule={rule}
                  selectedRuleId={selectedRule?.id}
                  onSelectRule={onSelectRule}
                  onDeleteRule={onDeleteRule}
                  onEditRule={onEditRule}
                />
              ))}
            </TableBody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
