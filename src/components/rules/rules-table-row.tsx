import type { ForwardingRulesResponse } from "@/lib/pocketbase-types";
import { cn } from "@/lib/utils";
import { TableCell, TableRow } from "../ui/table";
import { MoreVertical } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useUpdateForwardingRule } from "@/lib/api/mutations";
import { toast } from "sonner";
import { useRequiredSettings } from "@/lib/hooks/useRequiredSettings";
import { useGetRuleForwardingCount } from "@/lib/api/queries";

export function RulesTableRow({
  rule,
  selectedRuleId,
  onSelectRule,
  onDeleteRule,
  onEditRule,
}: {
  rule: ForwardingRulesResponse;
  selectedRuleId?: string;
  onSelectRule: (rule: ForwardingRulesResponse) => void;
  onDeleteRule: (rule: ForwardingRulesResponse) => void;
  onEditRule: (rule: ForwardingRulesResponse) => void;
}) {
  const updateRule = useUpdateForwardingRule();
  const { isConfigured } = useRequiredSettings();
  const { data: forwardCount } = useGetRuleForwardingCount(rule.id);

  const handleToggleEnabled = async (rule: ForwardingRulesResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateRule.mutateAsync({
        id: rule.id,
        updates: { enabled: !rule.enabled },
      });
      toast.success(`Rule ${!rule.enabled ? "enabled" : "disabled"} successfully`);
    } catch (error) {
      toast.error("Failed to update rule");
    }
  };

  return (
    <TableRow
      className={cn("cursor-pointer hover:bg-muted/50", selectedRuleId === rule.id && "bg-muted")}
      onClick={() => onSelectRule(rule)}
    >
      <TableCell className="font-mono text-xs">{rule.rule_name}</TableCell>
      <TableCell className="font-mono text-xs text-primary">{rule.rule_email}</TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <div className="font-mono text-xs">{rule.forward_to_email}</div>
          <div className="font-mono text-xs text-muted-foreground">From: {rule.send_from_email}</div>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant="secondary"
          className={cn(
            "gap-1",
            rule.enabled
              ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
              : "bg-muted text-muted-foreground hover:bg-muted"
          )}
        >
          <div className={cn("h-1.5 w-1.5 rounded-full", rule.enabled ? "bg-emerald-500" : "bg-muted-foreground")} />
          {rule.enabled ? "Active" : "Paused"}
        </Badge>
      </TableCell>
      <TableCell className="font-medium">{forwardCount?.total}</TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" disabled={!isConfigured}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEditRule(rule);
              }}
            >
              Edit Rule
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => handleToggleEnabled(rule, e)}>
              {rule.enabled ? "Pause" : "Activate"} Rule
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDeleteRule(rule);
              }}
              className="text-destructive"
            >
              Delete Rule
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
