import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { pb } from "@/lib/pocketbase";
import { useDeleteAccount } from "@/lib/api/mutations";

export function DangerZoneCard() {
  const deleteAccountMutation = useDeleteAccount();

  const handleDeleteAccount = async () => {
    await deleteAccountMutation.mutateAsync().then(() => {
      toast.success("Account deleted successfully");
      pb.authStore.clear();
      window.location.href = "/";
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>Delete your account</CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <div className="flex justify-end">
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
          </div>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-muted-foreground">Delete Account</AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/50 rounded-md">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-destructive">Danger Zone</p>
                    <p className="text-destructive/90">
                      This action cannot be undone. This will permanently delete your account and remove all your data.
                    </p>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-foreground mb-2">The following data will be permanently deleted:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>All forwarding rules</li>
                    <li>All forwarding events</li>
                    <li>All API keys</li>
                    <li>All webhook secrets</li>
                  </ul>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="text-muted-foreground">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleteAccountMutation.isPending}
              >
                {deleteAccountMutation.isPending ? "Deleting..." : "Delete Account"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
