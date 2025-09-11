import { useCallback } from "react";
import { gtagEvent } from "@/lib/gtag";
import type { AnalyticsEventName, AnalyticsEventParams } from "@/lib/analyticsEvents";

export function useAnalytics() {
  const trackEvent = useCallback(
    <T extends AnalyticsEventName>(
      action: T,
      params: AnalyticsEventParams[T]
    ) => {
      gtagEvent(action, params);
    },
    []
  );

  return { trackEvent };
}
