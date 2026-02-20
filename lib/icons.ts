/**
 * Icon registry — maps entity kebab-case names to Lucide icon names.
 *
 * Used by navigation, entity cards, and listing components to pick
 * a contextual icon for each data type.
 */

export const ENTITY_ICONS: Record<string, string> = {
  dashboard: "LayoutDashboard",
  "user": "User",
  "listing": "List",
  "review": "Star",
  "shop": "FileText",
  "order": "ShoppingCart",
  "payment": "CreditCard",
  "subscription": "Repeat",
  "upload": "FileText",
  "channel": "FileText",
  "notification": "Bell",
  "conversation": "MessagesSquare",
  "message": "Mail",
  "global-search-feature": "FileText",
  "safe-transactions": "FileText",
  "own-shop-system": "FileText",
  "set-your-own-prices": "FileText",
  "no-transaction-fees": "FileText",
  "messages-and-chat-system": "FileText",
  "classified-ad-market": "FileText",
  "member-reviews": "FileText",
  "privacy-functions": "FileText",
  "media-cloud": "FileText",
  "user-blocking-system": "FileText",
  "human-operated-fake-check": "FileText",
  "member-reviews-and-ratings": "FileText",
  "full-featured-profiles": "FileText",
  "seller-ratings-and-buyer-reviews": "FileText",
  "user-ranking-list": "FileText",
  "friends-and-fans-system": "FileText",
  "custom-video-clips": "FileText",
  "private-photosets": "FileText",
  "whatsapp-and-skype-chats": "FileText",
  "profile": "UserCircle",
  "media-file": "FileText",
  "comment": "MessageSquare",
  "reaction": "FileText",
  "pricing-plan": "FileText",
  "invoice": "Receipt",
};

/**
 * Get the icon name for an entity. Falls back to "FileText".
 */
export function getEntityIcon(entityKey: string): string {
  return ENTITY_ICONS[entityKey] ?? "FileText";
}

/**
 * All Lucide icon names that are actively used in this project.
 * Useful for preloading or tree-shaking analysis.
 */
export const USED_ICONS = [
  "Bell",
  "CreditCard",
  "FileText",
  "Home",
  "LayoutDashboard",
  "List",
  "Mail",
  "MessageSquare",
  "MessagesSquare",
  "Receipt",
  "Repeat",
  "Settings",
  "ShoppingCart",
  "Star",
  "User",
  "UserCircle",
] as const;
