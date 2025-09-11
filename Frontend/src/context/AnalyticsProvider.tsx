import { type ReactNode, useEffect } from "react";
import { useLocation } from "react-router";
import { loadGtag, pageview } from "@/lib/gtag";
import config from "@/config/env";


export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    //  Load GA script only once
    loadGtag(config.gAMeasurementId);

  }, []);

  useEffect(() => {
    //  Track pageview when route changes
    const path = location.pathname + location.search;
    pageview(path);
  }, [location]);

  return <>{children}</>;
}
