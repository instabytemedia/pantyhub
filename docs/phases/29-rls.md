# 29 - Row Level Security

> **Purpose:** Enable and configure RLS policies on all Supabase tables
> **Block:** B — Infrastructure
> **Depends on:** Phase 28 — database-schema (schema created)

---

## CRITICAL: Security

RLS ensures users can only access their own data. Every table MUST have RLS enabled.

**Note:** The schema phase may have already created RLS policies inline. This phase uses `DROP POLICY IF EXISTS` before each `CREATE POLICY` to be idempotent — safe to run regardless of whether policies already exist.

---

## Instructions

### 1. Profile Table RLS

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_public_read" ON profiles;
CREATE POLICY "profiles_public_read"
  ON profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));
```

### 2. Entity Table RLS

```sql
-- User (PRIVATE — owner-only access)
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "app_users_select_own" ON app_users;
CREATE POLICY "app_users_select_own"
  ON app_users FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "app_users_insert_own" ON app_users;
CREATE POLICY "app_users_insert_own"
  ON app_users FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "app_users_update_own" ON app_users;
CREATE POLICY "app_users_update_own"
  ON app_users FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "app_users_delete_own" ON app_users;
CREATE POLICY "app_users_delete_own"
  ON app_users FOR DELETE
  USING (auth.uid() = user_id);

-- Listing (PUBLIC READ — social/community content)
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "listings_public_read" ON listings;
CREATE POLICY "listings_public_read"
  ON listings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "listings_insert_own" ON listings;
CREATE POLICY "listings_insert_own"
  ON listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "listings_update_own" ON listings;
CREATE POLICY "listings_update_own"
  ON listings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "listings_delete_own" ON listings;
CREATE POLICY "listings_delete_own"
  ON listings FOR DELETE
  USING (auth.uid() = user_id);

-- Review (PUBLIC READ — social/community content)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews_public_read" ON reviews;
CREATE POLICY "reviews_public_read"
  ON reviews FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "reviews_insert_own" ON reviews;
CREATE POLICY "reviews_insert_own"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "reviews_update_own" ON reviews;
CREATE POLICY "reviews_update_own"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "reviews_delete_own" ON reviews;
CREATE POLICY "reviews_delete_own"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Shop (PRIVATE — owner-only access)
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shops_select_own" ON shops;
CREATE POLICY "shops_select_own"
  ON shops FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "shops_insert_own" ON shops;
CREATE POLICY "shops_insert_own"
  ON shops FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "shops_update_own" ON shops;
CREATE POLICY "shops_update_own"
  ON shops FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "shops_delete_own" ON shops;
CREATE POLICY "shops_delete_own"
  ON shops FOR DELETE
  USING (auth.uid() = user_id);

-- Order (PRIVATE — owner-only access)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orders_select_own" ON orders;
CREATE POLICY "orders_select_own"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "orders_insert_own" ON orders;
CREATE POLICY "orders_insert_own"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "orders_update_own" ON orders;
CREATE POLICY "orders_update_own"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "orders_delete_own" ON orders;
CREATE POLICY "orders_delete_own"
  ON orders FOR DELETE
  USING (auth.uid() = user_id);

-- Payment (PRIVATE — owner-only access)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payments_select_own" ON payments;
CREATE POLICY "payments_select_own"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "payments_insert_own" ON payments;
CREATE POLICY "payments_insert_own"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "payments_update_own" ON payments;
CREATE POLICY "payments_update_own"
  ON payments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "payments_delete_own" ON payments;
CREATE POLICY "payments_delete_own"
  ON payments FOR DELETE
  USING (auth.uid() = user_id);

-- Subscription (PRIVATE — owner-only access)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subscriptions_select_own" ON subscriptions;
CREATE POLICY "subscriptions_select_own"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "subscriptions_insert_own" ON subscriptions;
CREATE POLICY "subscriptions_insert_own"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "subscriptions_update_own" ON subscriptions;
CREATE POLICY "subscriptions_update_own"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "subscriptions_delete_own" ON subscriptions;
CREATE POLICY "subscriptions_delete_own"
  ON subscriptions FOR DELETE
  USING (auth.uid() = user_id);

-- Upload (PRIVATE — owner-only access)
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "uploads_select_own" ON uploads;
CREATE POLICY "uploads_select_own"
  ON uploads FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "uploads_insert_own" ON uploads;
CREATE POLICY "uploads_insert_own"
  ON uploads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "uploads_update_own" ON uploads;
CREATE POLICY "uploads_update_own"
  ON uploads FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "uploads_delete_own" ON uploads;
CREATE POLICY "uploads_delete_own"
  ON uploads FOR DELETE
  USING (auth.uid() = user_id);

-- Channel (PRIVATE — owner-only access)
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "channels_select_own" ON channels;
CREATE POLICY "channels_select_own"
  ON channels FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "channels_insert_own" ON channels;
CREATE POLICY "channels_insert_own"
  ON channels FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "channels_update_own" ON channels;
CREATE POLICY "channels_update_own"
  ON channels FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "channels_delete_own" ON channels;
CREATE POLICY "channels_delete_own"
  ON channels FOR DELETE
  USING (auth.uid() = user_id);

-- Notification (PRIVATE — owner-only access)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_select_own" ON notifications;
CREATE POLICY "notifications_select_own"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_insert_own" ON notifications;
CREATE POLICY "notifications_insert_own"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_update_own" ON notifications;
CREATE POLICY "notifications_update_own"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_delete_own" ON notifications;
CREATE POLICY "notifications_delete_own"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Conversation (PRIVATE — owner-only access)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "conversations_select_own" ON conversations;
CREATE POLICY "conversations_select_own"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "conversations_insert_own" ON conversations;
CREATE POLICY "conversations_insert_own"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "conversations_update_own" ON conversations;
CREATE POLICY "conversations_update_own"
  ON conversations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "conversations_delete_own" ON conversations;
CREATE POLICY "conversations_delete_own"
  ON conversations FOR DELETE
  USING (auth.uid() = user_id);

-- Message (PRIVATE — owner-only access)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_select_own" ON messages;
CREATE POLICY "messages_select_own"
  ON messages FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "messages_insert_own" ON messages;
CREATE POLICY "messages_insert_own"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "messages_update_own" ON messages;
CREATE POLICY "messages_update_own"
  ON messages FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "messages_delete_own" ON messages;
CREATE POLICY "messages_delete_own"
  ON messages FOR DELETE
  USING (auth.uid() = user_id);

-- GlobalSearchFeature (PRIVATE — owner-only access)
ALTER TABLE global_search_features ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "global_search_features_select_own" ON global_search_features;
CREATE POLICY "global_search_features_select_own"
  ON global_search_features FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "global_search_features_insert_own" ON global_search_features;
CREATE POLICY "global_search_features_insert_own"
  ON global_search_features FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "global_search_features_update_own" ON global_search_features;
CREATE POLICY "global_search_features_update_own"
  ON global_search_features FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "global_search_features_delete_own" ON global_search_features;
CREATE POLICY "global_search_features_delete_own"
  ON global_search_features FOR DELETE
  USING (auth.uid() = user_id);

-- SafeTransactions (PRIVATE — owner-only access)
ALTER TABLE safe_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "safe_transactions_select_own" ON safe_transactions;
CREATE POLICY "safe_transactions_select_own"
  ON safe_transactions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "safe_transactions_insert_own" ON safe_transactions;
CREATE POLICY "safe_transactions_insert_own"
  ON safe_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "safe_transactions_update_own" ON safe_transactions;
CREATE POLICY "safe_transactions_update_own"
  ON safe_transactions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "safe_transactions_delete_own" ON safe_transactions;
CREATE POLICY "safe_transactions_delete_own"
  ON safe_transactions FOR DELETE
  USING (auth.uid() = user_id);

-- OwnShopSystem (PRIVATE — owner-only access)
ALTER TABLE own_shop_systems ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_shop_systems_select_own" ON own_shop_systems;
CREATE POLICY "own_shop_systems_select_own"
  ON own_shop_systems FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "own_shop_systems_insert_own" ON own_shop_systems;
CREATE POLICY "own_shop_systems_insert_own"
  ON own_shop_systems FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own_shop_systems_update_own" ON own_shop_systems;
CREATE POLICY "own_shop_systems_update_own"
  ON own_shop_systems FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own_shop_systems_delete_own" ON own_shop_systems;
CREATE POLICY "own_shop_systems_delete_own"
  ON own_shop_systems FOR DELETE
  USING (auth.uid() = user_id);

-- SetYourOwnPrices (PRIVATE — owner-only access)
ALTER TABLE set_your_own_prices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "set_your_own_prices_select_own" ON set_your_own_prices;
CREATE POLICY "set_your_own_prices_select_own"
  ON set_your_own_prices FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "set_your_own_prices_insert_own" ON set_your_own_prices;
CREATE POLICY "set_your_own_prices_insert_own"
  ON set_your_own_prices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "set_your_own_prices_update_own" ON set_your_own_prices;
CREATE POLICY "set_your_own_prices_update_own"
  ON set_your_own_prices FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "set_your_own_prices_delete_own" ON set_your_own_prices;
CREATE POLICY "set_your_own_prices_delete_own"
  ON set_your_own_prices FOR DELETE
  USING (auth.uid() = user_id);

-- NoTransactionFees (PRIVATE — owner-only access)
ALTER TABLE no_transaction_fees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "no_transaction_fees_select_own" ON no_transaction_fees;
CREATE POLICY "no_transaction_fees_select_own"
  ON no_transaction_fees FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "no_transaction_fees_insert_own" ON no_transaction_fees;
CREATE POLICY "no_transaction_fees_insert_own"
  ON no_transaction_fees FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "no_transaction_fees_update_own" ON no_transaction_fees;
CREATE POLICY "no_transaction_fees_update_own"
  ON no_transaction_fees FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "no_transaction_fees_delete_own" ON no_transaction_fees;
CREATE POLICY "no_transaction_fees_delete_own"
  ON no_transaction_fees FOR DELETE
  USING (auth.uid() = user_id);

-- MessagesAndChatSystem (PRIVATE — owner-only access)
ALTER TABLE messages_and_chat_systems ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_and_chat_systems_select_own" ON messages_and_chat_systems;
CREATE POLICY "messages_and_chat_systems_select_own"
  ON messages_and_chat_systems FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "messages_and_chat_systems_insert_own" ON messages_and_chat_systems;
CREATE POLICY "messages_and_chat_systems_insert_own"
  ON messages_and_chat_systems FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "messages_and_chat_systems_update_own" ON messages_and_chat_systems;
CREATE POLICY "messages_and_chat_systems_update_own"
  ON messages_and_chat_systems FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "messages_and_chat_systems_delete_own" ON messages_and_chat_systems;
CREATE POLICY "messages_and_chat_systems_delete_own"
  ON messages_and_chat_systems FOR DELETE
  USING (auth.uid() = user_id);

-- ClassifiedAdMarket (PRIVATE — owner-only access)
ALTER TABLE classified_ad_markets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "classified_ad_markets_select_own" ON classified_ad_markets;
CREATE POLICY "classified_ad_markets_select_own"
  ON classified_ad_markets FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "classified_ad_markets_insert_own" ON classified_ad_markets;
CREATE POLICY "classified_ad_markets_insert_own"
  ON classified_ad_markets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "classified_ad_markets_update_own" ON classified_ad_markets;
CREATE POLICY "classified_ad_markets_update_own"
  ON classified_ad_markets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "classified_ad_markets_delete_own" ON classified_ad_markets;
CREATE POLICY "classified_ad_markets_delete_own"
  ON classified_ad_markets FOR DELETE
  USING (auth.uid() = user_id);

-- MemberReviews (PRIVATE — owner-only access)
ALTER TABLE member_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "member_reviews_select_own" ON member_reviews;
CREATE POLICY "member_reviews_select_own"
  ON member_reviews FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "member_reviews_insert_own" ON member_reviews;
CREATE POLICY "member_reviews_insert_own"
  ON member_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "member_reviews_update_own" ON member_reviews;
CREATE POLICY "member_reviews_update_own"
  ON member_reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "member_reviews_delete_own" ON member_reviews;
CREATE POLICY "member_reviews_delete_own"
  ON member_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- PrivacyFunctions (PRIVATE — owner-only access)
ALTER TABLE privacy_functions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "privacy_functions_select_own" ON privacy_functions;
CREATE POLICY "privacy_functions_select_own"
  ON privacy_functions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "privacy_functions_insert_own" ON privacy_functions;
CREATE POLICY "privacy_functions_insert_own"
  ON privacy_functions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "privacy_functions_update_own" ON privacy_functions;
CREATE POLICY "privacy_functions_update_own"
  ON privacy_functions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "privacy_functions_delete_own" ON privacy_functions;
CREATE POLICY "privacy_functions_delete_own"
  ON privacy_functions FOR DELETE
  USING (auth.uid() = user_id);

-- MediaCloud (PRIVATE — owner-only access)
ALTER TABLE media_clouds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "media_clouds_select_own" ON media_clouds;
CREATE POLICY "media_clouds_select_own"
  ON media_clouds FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "media_clouds_insert_own" ON media_clouds;
CREATE POLICY "media_clouds_insert_own"
  ON media_clouds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "media_clouds_update_own" ON media_clouds;
CREATE POLICY "media_clouds_update_own"
  ON media_clouds FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "media_clouds_delete_own" ON media_clouds;
CREATE POLICY "media_clouds_delete_own"
  ON media_clouds FOR DELETE
  USING (auth.uid() = user_id);

-- UserBlockingSystem (PRIVATE — owner-only access)
ALTER TABLE user_blocking_systems ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_blocking_systems_select_own" ON user_blocking_systems;
CREATE POLICY "user_blocking_systems_select_own"
  ON user_blocking_systems FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_blocking_systems_insert_own" ON user_blocking_systems;
CREATE POLICY "user_blocking_systems_insert_own"
  ON user_blocking_systems FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_blocking_systems_update_own" ON user_blocking_systems;
CREATE POLICY "user_blocking_systems_update_own"
  ON user_blocking_systems FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_blocking_systems_delete_own" ON user_blocking_systems;
CREATE POLICY "user_blocking_systems_delete_own"
  ON user_blocking_systems FOR DELETE
  USING (auth.uid() = user_id);

-- HumanOperatedFakeCheck (PRIVATE — owner-only access)
ALTER TABLE human_operated_fake_checks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "human_operated_fake_checks_select_own" ON human_operated_fake_checks;
CREATE POLICY "human_operated_fake_checks_select_own"
  ON human_operated_fake_checks FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "human_operated_fake_checks_insert_own" ON human_operated_fake_checks;
CREATE POLICY "human_operated_fake_checks_insert_own"
  ON human_operated_fake_checks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "human_operated_fake_checks_update_own" ON human_operated_fake_checks;
CREATE POLICY "human_operated_fake_checks_update_own"
  ON human_operated_fake_checks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "human_operated_fake_checks_delete_own" ON human_operated_fake_checks;
CREATE POLICY "human_operated_fake_checks_delete_own"
  ON human_operated_fake_checks FOR DELETE
  USING (auth.uid() = user_id);

-- MemberReviewsAndRatings (PRIVATE — owner-only access)
ALTER TABLE member_reviews_and_ratings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "member_reviews_and_ratings_select_own" ON member_reviews_and_ratings;
CREATE POLICY "member_reviews_and_ratings_select_own"
  ON member_reviews_and_ratings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "member_reviews_and_ratings_insert_own" ON member_reviews_and_ratings;
CREATE POLICY "member_reviews_and_ratings_insert_own"
  ON member_reviews_and_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "member_reviews_and_ratings_update_own" ON member_reviews_and_ratings;
CREATE POLICY "member_reviews_and_ratings_update_own"
  ON member_reviews_and_ratings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "member_reviews_and_ratings_delete_own" ON member_reviews_and_ratings;
CREATE POLICY "member_reviews_and_ratings_delete_own"
  ON member_reviews_and_ratings FOR DELETE
  USING (auth.uid() = user_id);

-- FullFeaturedProfiles (PRIVATE — owner-only access)
ALTER TABLE full_featured_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "full_featured_profiles_select_own" ON full_featured_profiles;
CREATE POLICY "full_featured_profiles_select_own"
  ON full_featured_profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "full_featured_profiles_insert_own" ON full_featured_profiles;
CREATE POLICY "full_featured_profiles_insert_own"
  ON full_featured_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "full_featured_profiles_update_own" ON full_featured_profiles;
CREATE POLICY "full_featured_profiles_update_own"
  ON full_featured_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "full_featured_profiles_delete_own" ON full_featured_profiles;
CREATE POLICY "full_featured_profiles_delete_own"
  ON full_featured_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- SellerRatingsAndBuyerReviews (PRIVATE — owner-only access)
ALTER TABLE seller_ratings_and_buyer_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "seller_ratings_and_buyer_reviews_select_own" ON seller_ratings_and_buyer_reviews;
CREATE POLICY "seller_ratings_and_buyer_reviews_select_own"
  ON seller_ratings_and_buyer_reviews FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "seller_ratings_and_buyer_reviews_insert_own" ON seller_ratings_and_buyer_reviews;
CREATE POLICY "seller_ratings_and_buyer_reviews_insert_own"
  ON seller_ratings_and_buyer_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "seller_ratings_and_buyer_reviews_update_own" ON seller_ratings_and_buyer_reviews;
CREATE POLICY "seller_ratings_and_buyer_reviews_update_own"
  ON seller_ratings_and_buyer_reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "seller_ratings_and_buyer_reviews_delete_own" ON seller_ratings_and_buyer_reviews;
CREATE POLICY "seller_ratings_and_buyer_reviews_delete_own"
  ON seller_ratings_and_buyer_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- UserRankingList (PRIVATE — owner-only access)
ALTER TABLE user_ranking_lists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_ranking_lists_select_own" ON user_ranking_lists;
CREATE POLICY "user_ranking_lists_select_own"
  ON user_ranking_lists FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_ranking_lists_insert_own" ON user_ranking_lists;
CREATE POLICY "user_ranking_lists_insert_own"
  ON user_ranking_lists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_ranking_lists_update_own" ON user_ranking_lists;
CREATE POLICY "user_ranking_lists_update_own"
  ON user_ranking_lists FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_ranking_lists_delete_own" ON user_ranking_lists;
CREATE POLICY "user_ranking_lists_delete_own"
  ON user_ranking_lists FOR DELETE
  USING (auth.uid() = user_id);

-- FriendsAndFansSystem (PRIVATE — owner-only access)
ALTER TABLE friends_and_fans_systems ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "friends_and_fans_systems_select_own" ON friends_and_fans_systems;
CREATE POLICY "friends_and_fans_systems_select_own"
  ON friends_and_fans_systems FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "friends_and_fans_systems_insert_own" ON friends_and_fans_systems;
CREATE POLICY "friends_and_fans_systems_insert_own"
  ON friends_and_fans_systems FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "friends_and_fans_systems_update_own" ON friends_and_fans_systems;
CREATE POLICY "friends_and_fans_systems_update_own"
  ON friends_and_fans_systems FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "friends_and_fans_systems_delete_own" ON friends_and_fans_systems;
CREATE POLICY "friends_and_fans_systems_delete_own"
  ON friends_and_fans_systems FOR DELETE
  USING (auth.uid() = user_id);

-- CustomVideoClips (PRIVATE — owner-only access)
ALTER TABLE custom_video_clips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "custom_video_clips_select_own" ON custom_video_clips;
CREATE POLICY "custom_video_clips_select_own"
  ON custom_video_clips FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "custom_video_clips_insert_own" ON custom_video_clips;
CREATE POLICY "custom_video_clips_insert_own"
  ON custom_video_clips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "custom_video_clips_update_own" ON custom_video_clips;
CREATE POLICY "custom_video_clips_update_own"
  ON custom_video_clips FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "custom_video_clips_delete_own" ON custom_video_clips;
CREATE POLICY "custom_video_clips_delete_own"
  ON custom_video_clips FOR DELETE
  USING (auth.uid() = user_id);

-- PrivatePhotosets (PRIVATE — owner-only access)
ALTER TABLE private_photosets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "private_photosets_select_own" ON private_photosets;
CREATE POLICY "private_photosets_select_own"
  ON private_photosets FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "private_photosets_insert_own" ON private_photosets;
CREATE POLICY "private_photosets_insert_own"
  ON private_photosets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "private_photosets_update_own" ON private_photosets;
CREATE POLICY "private_photosets_update_own"
  ON private_photosets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "private_photosets_delete_own" ON private_photosets;
CREATE POLICY "private_photosets_delete_own"
  ON private_photosets FOR DELETE
  USING (auth.uid() = user_id);

-- WhatsappAndSkypeChats (PRIVATE — owner-only access)
ALTER TABLE whatsapp_and_skype_chats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "whatsapp_and_skype_chats_select_own" ON whatsapp_and_skype_chats;
CREATE POLICY "whatsapp_and_skype_chats_select_own"
  ON whatsapp_and_skype_chats FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "whatsapp_and_skype_chats_insert_own" ON whatsapp_and_skype_chats;
CREATE POLICY "whatsapp_and_skype_chats_insert_own"
  ON whatsapp_and_skype_chats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "whatsapp_and_skype_chats_update_own" ON whatsapp_and_skype_chats;
CREATE POLICY "whatsapp_and_skype_chats_update_own"
  ON whatsapp_and_skype_chats FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "whatsapp_and_skype_chats_delete_own" ON whatsapp_and_skype_chats;
CREATE POLICY "whatsapp_and_skype_chats_delete_own"
  ON whatsapp_and_skype_chats FOR DELETE
  USING (auth.uid() = user_id);
```

### 3. Verification

After applying RLS in Supabase:
1. Public-read tables (posts, comments, etc.): anyone can SELECT, only owner can INSERT/UPDATE/DELETE
2. Private tables (settings, bookmarks, etc.): only owner can do anything
3. Try to update another user's data → should fail for ALL tables
4. Own data should be fully accessible

---

### 4. Query Performance with RLS

**Preventing N+1 queries:** When fetching entities with relationships (e.g., posts with author profiles), use Supabase's join syntax instead of separate queries:

```typescript
// ✅ GOOD: Single query with join (1 query)
const { data } = await supabase
  .from("posts")
  .select("*, profiles!user_id(display_name, avatar_url)")
  .order("created_at", { ascending: false });

// ❌ BAD: Separate queries (N+1 problem)
const { data: posts } = await supabase.from("posts").select("*");
for (const post of posts) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", post.user_id)
    .single();
}
```

**RLS works with joins** — Supabase evaluates RLS policies on each joined table. If the user has SELECT access on both tables, the join works. This is both safer AND faster.

**Common joined queries to use:**
- List pages with author info: `.select("*, profiles!user_id(display_name, avatar_url)")`
- Detail pages with related items: `.select("*, comments(id, text, created_at, profiles!user_id(display_name))")`

---

## Validation

- [ ] RLS enabled on ALL tables (profiles + 32 entity tables)
- [ ] Public content tables have `SELECT USING (true)` for read access
- [ ] Private tables restrict all operations to `auth.uid() = user_id`
- [ ] INSERT/UPDATE/DELETE always restricted to owner via `auth.uid()`
- [ ] Joined queries used instead of N+1 separate queries for related data


---

## 📋 Domain Context

**Domain:** marketplace | **Trust Level:** high | **Risk:** critical
**Safety:** seller_verification, escrow_payments, dispute_resolution, fraud_detection
**Compliance:** pci_dss, consumer_protection, tax_reporting
**Audience:** standard UX | both-first | wcag_aa | professional tone

**Entities:**
- **User** (display: `username`, cache: moderate, RLS: user-owns-own) → Listing (one_to_many), → Review (one_to_many)
- **Listing** (display: `title`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Review (one_to_many)
- **Review** (display: `id`, cache: moderate, RLS: user-owns-own) → User (many_to_one), → Listing (many_to_one)
- **Shop** (display: `name`, cache: moderate, RLS: user-owns-own) → User (many_to_one)
- **Order** (display: `payment_intent_id`, cache: moderate, RLS: user-owns-own)
- **Payment** (display: `stripe_payment_id`, cache: moderate, RLS: user-owns-own)
- **Subscription** (display: `stripe_customer_id`, cache: moderate, RLS: user-owns-own)
- **Upload** (display: `file_name`, cache: moderate, RLS: user-owns-own)
- **Channel** (display: `name`, cache: moderate, RLS: user-owns-own)
- **Notification** (display: `title`, cache: none, RLS: user-owns-own)
- **Conversation** (display: `title`, cache: moderate, RLS: user-owns-own)
- **Message** (display: `id`, cache: none, RLS: user-owns-own)
- **GlobalSearchFeature** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SafeTransactions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **OwnShopSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **SetYourOwnPrices** (display: `title`, cache: moderate, RLS: user-owns-own)
- **NoTransactionFees** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MessagesAndChatSystem** (display: `title`, cache: none, RLS: user-owns-own)
- **ClassifiedAdMarket** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivacyFunctions** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MediaCloud** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserBlockingSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **HumanOperatedFakeCheck** (display: `title`, cache: moderate, RLS: user-owns-own)
- **MemberReviewsAndRatings** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FullFeaturedProfiles** (display: `title`, cache: aggressive, RLS: user-owns-own)
- **SellerRatingsAndBuyerReviews** (display: `title`, cache: moderate, RLS: user-owns-own)
- **UserRankingList** (display: `title`, cache: moderate, RLS: user-owns-own)
- **FriendsAndFansSystem** (display: `title`, cache: moderate, RLS: user-owns-own)
- **CustomVideoClips** (display: `title`, cache: moderate, RLS: user-owns-own)
- **PrivatePhotosets** (display: `title`, cache: moderate, RLS: user-owns-own)
- **WhatsappAndSkypeChats** (display: `title`, cache: moderate, RLS: user-owns-own)

**Custom Screens:**
- `/` — Landing (public): The landing page of the platform
- `/search` — Search Results (public): The search results page
- `/listing/:id` — Listing Details (auth): The details page of a listing
- `/messages` — Message Thread (auth): The message thread between a buyer and seller
- `/checkout` — Checkout (auth): The checkout page
- `/reviews` — Reviews (public): 

**Sensitive Data:** User.password
