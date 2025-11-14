import { useGetForwardingRules } from "@/lib/api/queries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function RuleFilter({
  selectedRuleId,
  onValueChange,
}: {
  selectedRuleId: string | undefined;
  onValueChange: (value: string) => void;
}) {
  const { data: rules } = useGetForwardingRules();
  return (
    <Select value={selectedRuleId} onValueChange={onValueChange}>
      <SelectTrigger className="w-[250px] text-accent-foreground!">
        <SelectValue placeholder="All Rules" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Rules</SelectItem>
        {rules?.map((rule) => (
          <SelectItem key={rule.id} value={rule.id}>
            {rule.rule_email}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
