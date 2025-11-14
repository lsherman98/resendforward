import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    getForwardingEvent,
    getForwardingEventLogs,
    getForwardingEvents,
    getForwardingRule,
    getForwardingRules,
    type ForwardingEventFilters,
    type EventLogFilters,
    getResendApiKey,
    getResendWebhookSecret,
    getRuleForwardingCount,
    getForwardingStats,
    getRulesStats,
} from "./api";
import { EventLogsTypeOptions, ForwardingEventsStatusOptions } from "../pocketbase-types";

export function useGetForwardingRules() {
    return useQuery({
        queryKey: ['forwardingRules'],
        queryFn: getForwardingRules,
        placeholderData: keepPreviousData
    });
}

export function useGetForwardingRule(id: string) {
    return useQuery({
        queryKey: ['forwardingRule', id],
        queryFn: () => getForwardingRule(id),
        placeholderData: keepPreviousData
    });
}

export function useGetForwardingEvents(filters?: ForwardingEventFilters) {
    return useQuery({
        queryKey: ['forwardingEvents', filters],
        queryFn: () => getForwardingEvents(filters),
        placeholderData: keepPreviousData,
        refetchInterval: (query) => {
            const data = query.state.data;
            const hasPendingEvents = data?.some(event => event.status === ForwardingEventsStatusOptions.pending);
            return hasPendingEvents ? 3000 : false;
        }
    });
}

export function useGetForwardingEvent(id: string) {
    return useQuery({
        queryKey: ['forwardingEvent', id],
        queryFn: () => getForwardingEvent(id),
        placeholderData: keepPreviousData,
        enabled: !!id
    });
}

export function useGetForwardingEventLogs(filters?: EventLogFilters) {
    return useQuery({
        queryKey: ['forwardingEventLogs', filters],
        queryFn: () => getForwardingEventLogs(filters),
        placeholderData: keepPreviousData,
        refetchInterval: (query) => {
            const data = query.state.data;
            const hasPendingEvents = data?.some(event => event.type === EventLogsTypeOptions["forward.initiated"] || event.type === EventLogsTypeOptions["webhook.received"]);
            return hasPendingEvents ? 3000 : false;
        }
    });
}

export function useGetResendApiKey() {
    return useQuery({
        queryKey: ['resendApiKey'],
        queryFn: getResendApiKey,
        placeholderData: keepPreviousData,
    });
}

export function useGetResendWebhookSecret() {
    return useQuery({
        queryKey: ['resendWebhookSecret'],
        queryFn: getResendWebhookSecret,
        placeholderData: keepPreviousData,
    });
}

export function useGetRuleForwardingCount(ruleId: string) {
    return useQuery({
        queryKey: ['ruleForwardingCount', ruleId],
        queryFn: () => getRuleForwardingCount(ruleId),
        placeholderData: keepPreviousData,
        enabled: !!ruleId
    });
}

export function useGetForwardingStats() {
    return useQuery({
        queryKey: ['forwardingStats'],
        queryFn: getForwardingStats,
        placeholderData: keepPreviousData
    });
}

export function useGetRulesStats() {
    return useQuery({
        queryKey: ['rulesStats'],
        queryFn: getRulesStats,
        placeholderData: keepPreviousData
    });
}