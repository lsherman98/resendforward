import { useQuery } from "@tanstack/react-query";
import { getResendApiKey, getResendWebhookSecret } from "../api/api";

export function useRequiredSettings() {
    const { data: apiKey, isLoading: isLoadingApiKey } = useQuery({
        queryKey: ['resendApiKey'],
        queryFn: getResendApiKey,
        retry: false
    });

    const { data: webhookSecret, isLoading: isLoadingWebhook } = useQuery({
        queryKey: ['resendWebhookSecret'],
        queryFn: getResendWebhookSecret,
        retry: false
    });

    const isLoading = isLoadingApiKey || isLoadingWebhook;
    const hasApiKey = !!apiKey;
    const hasWebhookSecret = !!webhookSecret;
    const isConfigured = hasApiKey && hasWebhookSecret;

    return {
        apiKey,
        webhookSecret,
        hasApiKey,
        hasWebhookSecret,
        isConfigured,
        isLoading,
        missingSettings: {
            apiKey: !hasApiKey,
            webhookSecret: !hasWebhookSecret
        }
    };
}
