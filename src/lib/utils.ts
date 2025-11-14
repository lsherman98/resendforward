import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { pb } from "./pocketbase";
import { toast } from "sonner";
import { subDays } from "date-fns";
import { EventLogsTypeOptions, ForwardingEventsStatusOptions, type UsersResponse } from "./pocketbase-types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleError(error: Error) {
  if (error instanceof Error && error.message.includes("The request was autocancelled")) {
    return;
  }
  console.error(error)
  toast.error("An error occurred", {
    description: error.message,
    richColors: true
  })
}

export function getUserId(msg: string = 'No logged in user detected.'): string | null {
  const user = pb.authStore.record;
  if (!user?.id) {
    handleError(new Error(msg));
    return null
  }
  return user.id;
}

export function getUserRecord(): UsersResponse {
  pb.collection("users").authRefresh();
  return pb.authStore.record as UsersResponse;
}

export function getUserName(): string {
  const user = pb.authStore.record;
  return user?.name;
}

export const getDateRange = (range: string) => {
  const now = new Date();
  switch (range) {
    case "24h":
      return { startDate: subDays(now, 1).toISOString() };
    case "7d":
      return { startDate: subDays(now, 7).toISOString() };
    case "30d":
      return { startDate: subDays(now, 30).toISOString() };
    default:
      return {};
  }
};

export const getStatusBadge = (status: ForwardingEventsStatusOptions) => {
  let variant: "default" | "secondary" | "destructive" | "outline";
  let label: string;

  switch (status) {
    case ForwardingEventsStatusOptions.pending:
      variant = "secondary";
      label = "Pending";
      break;
    case ForwardingEventsStatusOptions.sent:
      variant = "outline";
      label = "Sent";
      break;
    case ForwardingEventsStatusOptions.delivered:
      variant = "default";
      label = "Delivered";
      break;
    case ForwardingEventsStatusOptions.failed:
      variant = "destructive";
      label = "Failed";
      break;
  }

  return { variant, label };
};

export function getLogTypeBadge(type: EventLogsTypeOptions): { variant: "default" | "secondary" | "destructive" | "outline"; label: string; } {
  switch (type) {
    case "webhook.received":
      return { variant: "secondary", label: "Webhook Received" };
    case "forward.initiated":
      return { variant: "outline", label: "Forward Initiated" };
    case "email.sent":
      return { variant: "outline", label: "Email Sent" };
    case "email.delivered":
      return { variant: "default", label: "Email Delivered" };
    case "email.failed":
      return { variant: "destructive", label: "Email Failed" };
    case "error":
      return { variant: "destructive", label: "Error" };
    default:
      return { variant: "secondary", label: type };
  }
}