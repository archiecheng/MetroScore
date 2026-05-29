/** Typed event names for the MetroScore analytics funnel. */
export const ANALYTICS_EVENTS = {
  LANDING_PAGE_VIEWED: "landing_page_viewed",
  CITY_PAIR_SELECTED: "city_pair_selected",
  CHECKOUT_STARTED: "checkout_started",
  REPORT_ACCESSED: "report_accessed",
  PRINT_CLICKED: "print_clicked",
} as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
