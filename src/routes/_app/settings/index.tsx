import { createFileRoute } from "@tanstack/react-router";
import { useGetResendApiKey, useGetResendWebhookSecret } from "@/lib/api/queries";
import { ConfigurationStatusAlert } from "@/components/settings/configuration-status-alert";
import { ResendApiKeyCard } from "@/components/settings/resend-api-key-card";
import { WebhookSecretCard } from "@/components/settings/webhook-secret-card";
import { DangerZoneCard } from "@/components/settings/danger-zone-card";

export const Route = createFileRoute("/_app/settings/")({
  component: RouteComponent,
  staticData: {
    routeName: "Settings",
  },
});

function RouteComponent() {
  const { data: apiKey } = useGetResendApiKey();
  const { data: webhookSecret } = useGetResendWebhookSecret();

  const isConfigured = !!apiKey && !!webhookSecret;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <ConfigurationStatusAlert isConfigured={isConfigured} />
      <div className="space-y-6">
        <ResendApiKeyCard />
        <WebhookSecretCard />
        <DangerZoneCard />
      </div>
    </div>
  );
}
