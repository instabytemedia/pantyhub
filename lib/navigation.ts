/**
 * Navigation Registry
 *
 * Central array of all navigation items, built from entities
 * and enabled modules. Consumed by sidebar, mobile nav, and breadcrumbs.
 */

import { getEntityIcon } from "./icons";

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  group: "core" | "entities" | "settings" | "modules";
  badge?: string;
  external?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  // Core
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard", group: "core" },

  // Entities
  { href: "/users", label: "User", icon: getEntityIcon("users"), group: "entities" },
  { href: "/listings", label: "Listing", icon: getEntityIcon("listings"), group: "entities" },
  { href: "/reviews", label: "Review", icon: getEntityIcon("reviews"), group: "entities" },
  { href: "/shops", label: "Shop", icon: getEntityIcon("shops"), group: "entities" },
  { href: "/orders", label: "Order", icon: getEntityIcon("orders"), group: "entities" },
  { href: "/payments", label: "Payment", icon: getEntityIcon("payments"), group: "entities" },
  { href: "/subscriptions", label: "Subscription", icon: getEntityIcon("subscriptions"), group: "entities" },
  { href: "/uploads", label: "Upload", icon: getEntityIcon("uploads"), group: "entities" },
  { href: "/channels", label: "Channel", icon: getEntityIcon("channels"), group: "entities" },
  { href: "/notifications", label: "Notification", icon: getEntityIcon("notifications"), group: "entities" },
  { href: "/conversations", label: "Conversation", icon: getEntityIcon("conversations"), group: "entities" },
  { href: "/messages", label: "Message", icon: getEntityIcon("messages"), group: "entities" },
  { href: "/global-search-features", label: "Global Search Feature", icon: getEntityIcon("global-search-features"), group: "entities" },
  { href: "/safe-transactionses", label: "Safe Transactions", icon: getEntityIcon("safe-transactionses"), group: "entities" },
  { href: "/own-shop-systems", label: "Own Shop System", icon: getEntityIcon("own-shop-systems"), group: "entities" },
  { href: "/set-your-own-priceses", label: "Set Your Own Prices", icon: getEntityIcon("set-your-own-priceses"), group: "entities" },
  { href: "/no-transaction-feeses", label: "No Transaction Fees", icon: getEntityIcon("no-transaction-feeses"), group: "entities" },
  { href: "/messages-and-chat-systems", label: "Messages And Chat System", icon: getEntityIcon("messages-and-chat-systems"), group: "entities" },
  { href: "/classified-ad-markets", label: "Classified Ad Market", icon: getEntityIcon("classified-ad-markets"), group: "entities" },
  { href: "/member-reviewses", label: "Member Reviews", icon: getEntityIcon("member-reviewses"), group: "entities" },
  { href: "/privacy-functionses", label: "Privacy Functions", icon: getEntityIcon("privacy-functionses"), group: "entities" },
  { href: "/media-clouds", label: "Media Cloud", icon: getEntityIcon("media-clouds"), group: "entities" },
  { href: "/user-blocking-systems", label: "User Blocking System", icon: getEntityIcon("user-blocking-systems"), group: "entities" },
  { href: "/human-operated-fake-checks", label: "Human Operated Fake Check", icon: getEntityIcon("human-operated-fake-checks"), group: "entities" },
  { href: "/member-reviews-and-ratingses", label: "Member Reviews And Ratings", icon: getEntityIcon("member-reviews-and-ratingses"), group: "entities" },
  { href: "/full-featured-profileses", label: "Full Featured Profiles", icon: getEntityIcon("full-featured-profileses"), group: "entities" },
  { href: "/seller-ratings-and-buyer-reviewses", label: "Seller Ratings And Buyer Reviews", icon: getEntityIcon("seller-ratings-and-buyer-reviewses"), group: "entities" },
  { href: "/user-ranking-lists", label: "User Ranking List", icon: getEntityIcon("user-ranking-lists"), group: "entities" },
  { href: "/friends-and-fans-systems", label: "Friends And Fans System", icon: getEntityIcon("friends-and-fans-systems"), group: "entities" },
  { href: "/custom-video-clipses", label: "Custom Video Clips", icon: getEntityIcon("custom-video-clipses"), group: "entities" },
  { href: "/private-photosetses", label: "Private Photosets", icon: getEntityIcon("private-photosetses"), group: "entities" },
  { href: "/whatsapp-and-skype-chatses", label: "Whatsapp And Skype Chats", icon: getEntityIcon("whatsapp-and-skype-chatses"), group: "entities" },
  { href: "/profiles", label: "Profile", icon: getEntityIcon("profiles"), group: "entities" },
  { href: "/media-files", label: "Media File", icon: getEntityIcon("media-files"), group: "entities" },
  { href: "/comments", label: "Comment", icon: getEntityIcon("comments"), group: "entities" },
  { href: "/invoices", label: "Invoice", icon: getEntityIcon("invoices"), group: "entities" },

  // Settings
  { href: "/settings", label: "Settings", icon: "Settings", group: "settings" },
];

/**
 * Get nav items filtered by group.
 */
export function getNavItemsByGroup(group: NavItem["group"]): NavItem[] {
  return NAV_ITEMS.filter((item) => item.group === group);
}

/**
 * Get all nav item groups present in the registry.
 */
export function getNavGroups(): NavItem["group"][] {
  return [...new Set(NAV_ITEMS.map((item) => item.group))];
}
