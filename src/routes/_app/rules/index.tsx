import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGetForwardingRules } from "@/lib/api/queries";
import { useRequiredSettings } from "@/lib/hooks/useRequiredSettings";
import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import type { ForwardingRulesResponse } from "@/lib/pocketbase-types";
import { z } from "zod";
import { RulesTable } from "@/components/rules/rules-table";
import { RulesStats } from "@/components/rules/rules-stats";
import { CreateRule } from "@/components/rules/create-rule";
import { DeleteRule } from "@/components/rules/delete-rule";
import { UpdateRule } from "@/components/rules/update-rule";
import { RecentEvents } from "@/components/rules/recent-events";

const searchSchema = z.object({
  ruleId: z.string().optional(),
});

export const Route = createFileRoute("/_app/rules/")({
  component: RouteComponent,
  validateSearch: zodValidator(searchSchema),
  staticData: {
    routeName: "Forwarding Rules",
  },
});

function RouteComponent() {
  const { ruleId } = Route.useSearch();
  const { data: rules } = useGetForwardingRules();
  const { isConfigured } = useRequiredSettings();

  const [selectedRule, setSelectedRule] = useState<ForwardingRulesResponse | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<ForwardingRulesResponse | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [ruleToUpdate, setRuleToUpdate] = useState<ForwardingRulesResponse | null>(null);

  useEffect(() => {
    if (ruleId && rules && !selectedRule) {
      const rule = rules.find((r) => r.id === ruleId);
      if (rule) setSelectedRule(rule);
    }
  }, [ruleId, rules, selectedRule]);

  const handleDeleteRule = (rule: ForwardingRulesResponse) => {
    setRuleToDelete(rule);
    setIsDeleteDialogOpen(true);
  };

  const handleEditRule = (rule: ForwardingRulesResponse) => {
    setRuleToUpdate(rule);
    setIsUpdateDialogOpen(true);
  };

  const handleDeleteSuccess = () => {
    if (selectedRule?.id === ruleToDelete?.id) setSelectedRule(null);
    setRuleToDelete(null);
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Forwarding Rules</h1>
          <p className="text-muted-foreground mt-1">
            Manage email forwarding rules and configure destination addresses
          </p>
        </div>
        <CreateRule isConfigured={isConfigured} currentRuleCount={rules?.length ?? 0} />
      </div>
      {!isConfigured && (
        <Alert variant="destructive" className="border border-primary">
          <AlertTriangle className="h-4 w-4 stroke-primary" />
          <AlertDescription className="flex text-primary!">
            Please configure your Resend API key and webhook secret in
            <Link to="/settings" className="underline font-medium px-1 text-accent-foreground">
              Settings
            </Link>
            before creating forwarding rules.
          </AlertDescription>
        </Alert>
      )}
      <RulesStats />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <RulesTable
          rules={rules}
          selectedRule={selectedRule}
          onSelectRule={setSelectedRule}
          onDeleteRule={handleDeleteRule}
          onEditRule={handleEditRule}
        />
        {selectedRule && <RecentEvents rule={selectedRule} onClose={() => setSelectedRule(null)} />}
      </div>
      <DeleteRule
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        rule={ruleToDelete}
        onDeleteSuccess={handleDeleteSuccess}
      />
      <UpdateRule isOpen={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen} rule={ruleToUpdate} />
    </div>
  );
}
