import posthog from "posthog-js";
import * as Sentry from "@sentry/nextjs";
if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2025-05-24",
    capture_exceptions: true, // This enables capturing exceptions using Error Tracking, set to false if you don't want this
  });
}
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
