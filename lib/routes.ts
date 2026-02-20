/**
 * Route Registry
 *
 * Central map of all application routes.
 * Generated from blueprint entities and enabled modules.
 */

export interface EntityRoutes {
  list: string;
  detail: (id: string) => string;
  create: string;
  edit: (id: string) => string;
}

export const ROUTES = {
  home: "/",
  dashboard: "/dashboard",
  login: "/login",
  register: "/register",
  "users": {
    list: "/users",
    detail: (id: string) => `/users/${id}`,
    create: "/users/new",
    edit: (id: string) => `/users/${id}/edit`,
  },
  "listings": {
    list: "/listings",
    detail: (id: string) => `/listings/${id}`,
    create: "/listings/new",
    edit: (id: string) => `/listings/${id}/edit`,
  },
  "reviews": {
    list: "/reviews",
    detail: (id: string) => `/reviews/${id}`,
    create: "/reviews/new",
    edit: (id: string) => `/reviews/${id}/edit`,
  },
  "shops": {
    list: "/shops",
    detail: (id: string) => `/shops/${id}`,
    create: "/shops/new",
    edit: (id: string) => `/shops/${id}/edit`,
  },
  "orders": {
    list: "/orders",
    detail: (id: string) => `/orders/${id}`,
    create: "/orders/new",
    edit: (id: string) => `/orders/${id}/edit`,
  },
  "payments": {
    list: "/payments",
    detail: (id: string) => `/payments/${id}`,
    create: "/payments/new",
    edit: (id: string) => `/payments/${id}/edit`,
  },
  "subscriptions": {
    list: "/subscriptions",
    detail: (id: string) => `/subscriptions/${id}`,
    create: "/subscriptions/new",
    edit: (id: string) => `/subscriptions/${id}/edit`,
  },
  "uploads": {
    list: "/uploads",
    detail: (id: string) => `/uploads/${id}`,
    create: "/uploads/new",
    edit: (id: string) => `/uploads/${id}/edit`,
  },
  "channels": {
    list: "/channels",
    detail: (id: string) => `/channels/${id}`,
    create: "/channels/new",
    edit: (id: string) => `/channels/${id}/edit`,
  },
  "notifications": {
    list: "/notifications",
    detail: (id: string) => `/notifications/${id}`,
    create: "/notifications/new",
    edit: (id: string) => `/notifications/${id}/edit`,
  },
  "conversations": {
    list: "/conversations",
    detail: (id: string) => `/conversations/${id}`,
    create: "/conversations/new",
    edit: (id: string) => `/conversations/${id}/edit`,
  },
  "messages": {
    list: "/messages",
    detail: (id: string) => `/messages/${id}`,
    create: "/messages/new",
    edit: (id: string) => `/messages/${id}/edit`,
  },
  "global-search-features": {
    list: "/global-search-features",
    detail: (id: string) => `/global-search-features/${id}`,
    create: "/global-search-features/new",
    edit: (id: string) => `/global-search-features/${id}/edit`,
  },
  "safe-transactionses": {
    list: "/safe-transactionses",
    detail: (id: string) => `/safe-transactionses/${id}`,
    create: "/safe-transactionses/new",
    edit: (id: string) => `/safe-transactionses/${id}/edit`,
  },
  "own-shop-systems": {
    list: "/own-shop-systems",
    detail: (id: string) => `/own-shop-systems/${id}`,
    create: "/own-shop-systems/new",
    edit: (id: string) => `/own-shop-systems/${id}/edit`,
  },
  "set-your-own-priceses": {
    list: "/set-your-own-priceses",
    detail: (id: string) => `/set-your-own-priceses/${id}`,
    create: "/set-your-own-priceses/new",
    edit: (id: string) => `/set-your-own-priceses/${id}/edit`,
  },
  "no-transaction-feeses": {
    list: "/no-transaction-feeses",
    detail: (id: string) => `/no-transaction-feeses/${id}`,
    create: "/no-transaction-feeses/new",
    edit: (id: string) => `/no-transaction-feeses/${id}/edit`,
  },
  "messages-and-chat-systems": {
    list: "/messages-and-chat-systems",
    detail: (id: string) => `/messages-and-chat-systems/${id}`,
    create: "/messages-and-chat-systems/new",
    edit: (id: string) => `/messages-and-chat-systems/${id}/edit`,
  },
  "classified-ad-markets": {
    list: "/classified-ad-markets",
    detail: (id: string) => `/classified-ad-markets/${id}`,
    create: "/classified-ad-markets/new",
    edit: (id: string) => `/classified-ad-markets/${id}/edit`,
  },
  "member-reviewses": {
    list: "/member-reviewses",
    detail: (id: string) => `/member-reviewses/${id}`,
    create: "/member-reviewses/new",
    edit: (id: string) => `/member-reviewses/${id}/edit`,
  },
  "privacy-functionses": {
    list: "/privacy-functionses",
    detail: (id: string) => `/privacy-functionses/${id}`,
    create: "/privacy-functionses/new",
    edit: (id: string) => `/privacy-functionses/${id}/edit`,
  },
  "media-clouds": {
    list: "/media-clouds",
    detail: (id: string) => `/media-clouds/${id}`,
    create: "/media-clouds/new",
    edit: (id: string) => `/media-clouds/${id}/edit`,
  },
  "user-blocking-systems": {
    list: "/user-blocking-systems",
    detail: (id: string) => `/user-blocking-systems/${id}`,
    create: "/user-blocking-systems/new",
    edit: (id: string) => `/user-blocking-systems/${id}/edit`,
  },
  "human-operated-fake-checks": {
    list: "/human-operated-fake-checks",
    detail: (id: string) => `/human-operated-fake-checks/${id}`,
    create: "/human-operated-fake-checks/new",
    edit: (id: string) => `/human-operated-fake-checks/${id}/edit`,
  },
  "member-reviews-and-ratingses": {
    list: "/member-reviews-and-ratingses",
    detail: (id: string) => `/member-reviews-and-ratingses/${id}`,
    create: "/member-reviews-and-ratingses/new",
    edit: (id: string) => `/member-reviews-and-ratingses/${id}/edit`,
  },
  "full-featured-profileses": {
    list: "/full-featured-profileses",
    detail: (id: string) => `/full-featured-profileses/${id}`,
    create: "/full-featured-profileses/new",
    edit: (id: string) => `/full-featured-profileses/${id}/edit`,
  },
  "seller-ratings-and-buyer-reviewses": {
    list: "/seller-ratings-and-buyer-reviewses",
    detail: (id: string) => `/seller-ratings-and-buyer-reviewses/${id}`,
    create: "/seller-ratings-and-buyer-reviewses/new",
    edit: (id: string) => `/seller-ratings-and-buyer-reviewses/${id}/edit`,
  },
  "user-ranking-lists": {
    list: "/user-ranking-lists",
    detail: (id: string) => `/user-ranking-lists/${id}`,
    create: "/user-ranking-lists/new",
    edit: (id: string) => `/user-ranking-lists/${id}/edit`,
  },
  "friends-and-fans-systems": {
    list: "/friends-and-fans-systems",
    detail: (id: string) => `/friends-and-fans-systems/${id}`,
    create: "/friends-and-fans-systems/new",
    edit: (id: string) => `/friends-and-fans-systems/${id}/edit`,
  },
  "custom-video-clipses": {
    list: "/custom-video-clipses",
    detail: (id: string) => `/custom-video-clipses/${id}`,
    create: "/custom-video-clipses/new",
    edit: (id: string) => `/custom-video-clipses/${id}/edit`,
  },
  "private-photosetses": {
    list: "/private-photosetses",
    detail: (id: string) => `/private-photosetses/${id}`,
    create: "/private-photosetses/new",
    edit: (id: string) => `/private-photosetses/${id}/edit`,
  },
  "whatsapp-and-skype-chatses": {
    list: "/whatsapp-and-skype-chatses",
    detail: (id: string) => `/whatsapp-and-skype-chatses/${id}`,
    create: "/whatsapp-and-skype-chatses/new",
    edit: (id: string) => `/whatsapp-and-skype-chatses/${id}/edit`,
  },
  "profiles": {
    list: "/profiles",
    detail: (id: string) => `/profiles/${id}`,
    create: "/profiles/new",
    edit: (id: string) => `/profiles/${id}/edit`,
  },
  "media-files": {
    list: "/media-files",
    detail: (id: string) => `/media-files/${id}`,
    create: "/media-files/new",
    edit: (id: string) => `/media-files/${id}/edit`,
  },
  "comments": {
    list: "/comments",
    detail: (id: string) => `/comments/${id}`,
    create: "/comments/new",
    edit: (id: string) => `/comments/${id}/edit`,
  },
  "reactions": {
    list: "/reactions",
    detail: (id: string) => `/reactions/${id}`,
    create: "/reactions/new",
    edit: (id: string) => `/reactions/${id}/edit`,
  },
  "pricing-plans": {
    list: "/pricing-plans",
    detail: (id: string) => `/pricing-plans/${id}`,
    create: "/pricing-plans/new",
    edit: (id: string) => `/pricing-plans/${id}/edit`,
  },
  "invoices": {
    list: "/invoices",
    detail: (id: string) => `/invoices/${id}`,
    create: "/invoices/new",
    edit: (id: string) => `/invoices/${id}/edit`,
  },
} as const;

/** All entity route keys (plural, matching URL paths) */
export const ENTITY_ROUTE_KEYS = [
  "users",
  "listings",
  "reviews",
  "shops",
  "orders",
  "payments",
  "subscriptions",
  "uploads",
  "channels",
  "notifications",
  "conversations",
  "messages",
  "global-search-features",
  "safe-transactionses",
  "own-shop-systems",
  "set-your-own-priceses",
  "no-transaction-feeses",
  "messages-and-chat-systems",
  "classified-ad-markets",
  "member-reviewses",
  "privacy-functionses",
  "media-clouds",
  "user-blocking-systems",
  "human-operated-fake-checks",
  "member-reviews-and-ratingses",
  "full-featured-profileses",
  "seller-ratings-and-buyer-reviewses",
  "user-ranking-lists",
  "friends-and-fans-systems",
  "custom-video-clipses",
  "private-photosetses",
  "whatsapp-and-skype-chatses",
  "profiles",
  "media-files",
  "comments",
  "reactions",
  "pricing-plans",
  "invoices",
] as const;

export type EntityRouteKey = (typeof ENTITY_ROUTE_KEYS)[number];

/**
 * Get the route config for an entity by its plural kebab-case key.
 */
export function getEntityRoutes(key: EntityRouteKey): EntityRoutes {
  return ROUTES[key] as EntityRoutes;
}
