import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ConfigurationStatusAlertProps {
  isConfigured: boolean;
}

export function ConfigurationStatusAlert({ isConfigured }: ConfigurationStatusAlertProps) {
  if (isConfigured) {
    return null;
  }

  return (
    <Alert variant="destructive" className="border border-primary">
      <AlertTriangle className="h-4 w-4 stroke-primary" />
      <AlertDescription className="text-primary!">
        Your application is not fully configured. Please set both the Resend API key and webhook secret to enable email
        forwarding.
      </AlertDescription>
    </Alert>
  );
}
