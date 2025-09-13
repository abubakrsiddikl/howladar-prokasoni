export type AnalyticsEventName =
  | "page_view"
  | "signup"
  | "login"
  | "purchase"
  | "search"
  | "add_to_cart"
  | "remove_from_cart"
  | "checkout_start"
  | "checkout_complete"
  | "share";

export interface AnalyticsEventParams {
  signup: { method: "email" | "google" | "facebook" };
  login: { method: "email" | "google" | "facebook" };
  purchase: { value: number; currency: string; transaction_id: string };
  search: { search_term: string };
  add_to_cart: { item_id: string; item_name: string; price: number };
  remove_from_cart: { item_id: string };
  checkout_start: { step: number };
  checkout_complete: { name: string; totalPrice: number };
  share: { method: "facebook" | "twitter" | "whatsapp"; content_id: string };

  // fallback for others
  page_view: { page_path?: string };
}
