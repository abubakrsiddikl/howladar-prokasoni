import { useEffect } from "react";

import {  loadGtag, pageview } from "@/lib/gtag";
import config from "@/config/env";
import { useLocation } from "react-router";

export default function GATracker() {
  const location = useLocation();

  useEffect(() => {
    if (!config.gAMeasurementId) return;
    loadGtag(config.gAMeasurementId);
  }, []);

  useEffect(() => {
    if (!config.gAMeasurementId) return;
    const path = location.pathname + location.search;
    pageview(path);
  }, [location.pathname, location.search]);

  return null;
}
