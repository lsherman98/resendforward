import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteForwardingRule } from "@/lib/api/mutations";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ForwardingRulesResponse } from "@/lib/pocketbase-types";

interface DeleteRuleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  rule: ForwardingRulesResponse | null;
  onDeleteSuccess?: () => void;
}

export function DeleteRule({ isOpen, onOpenChange, rule, onDeleteSuccess }: DeleteRuleDialogProps) {
  const deleteRule = useDeleteForwardingRule();

  const handleDelete = async () => {
    if (!rule) return;

    try {
      await deleteRule.mutateAsync(rule.id);
      onOpenChange(false);
      toast.success("Forwarding rule deleted successfully");
      onDeleteSuccess?.();
    } catch (error) {
      toast.error("Failed to delete forwarding rule");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 border-secondary">
        <DialogHeader>
          <DialogTitle className="text-muted-foreground">Delete Forwarding Rule</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this forwarding rule? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {rule && (
          <div className="py-4">
            <div className="rounded-lg bg-muted p-4 space-y-1 text-muted-foreground">
              <p className="text-sm">
                <span className="font-medium">Rule Email:</span> <span className="font-mono">{rule.rule_email}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Forward To:</span>{" "}
                <span className="font-mono">{rule.forward_to_email}</span>
              </p>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-muted-foreground">
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteRule.isPending}>
            {deleteRule.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Rule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
