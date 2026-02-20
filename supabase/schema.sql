-- Schema for PantyHub

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  subscription_plan TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX profiles_username_idx ON profiles(username);
CREATE INDEX profiles_stripe_customer_id_idx ON profiles(stripe_customer_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles viewable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT app_users_role_check CHECK (role IN ('buyer', 'seller'))
);

ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own app_users"
  ON app_users FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_app_users_updated_at
  BEFORE UPDATE ON app_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX app_users_user_id_idx ON app_users(user_id);
CREATE INDEX app_users_username_idx ON app_users(username);
CREATE INDEX app_users_email_idx ON app_users(email);
COMMENT ON COLUMN app_users.username IS 'The user''s username';
COMMENT ON COLUMN app_users.email IS 'The user''s email address';
COMMENT ON COLUMN app_users.password IS 'The user''s password';
COMMENT ON COLUMN app_users.role IS 'The user''s role on the platform';

CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT listings_status_check CHECK (status IN ('available', 'sold'))
);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read listings" ON listings FOR SELECT USING (true);
CREATE POLICY "Owner insert listings" ON listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update listings" ON listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner delete listings" ON listings FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX listings_user_id_idx ON listings(user_id);
CREATE INDEX listings_user_id_idx ON listings(user_id);
COMMENT ON COLUMN listings.title IS 'The title of the listing';
COMMENT ON COLUMN listings.description IS 'The description of the listing';
COMMENT ON COLUMN listings.price IS 'The price of the listing';
COMMENT ON COLUMN listings.status IS 'The status of the listing';

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID,
  listing_id UUID,
  rating INTEGER NOT NULL,
  feedback TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Owner insert reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner delete reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX reviews_user_id_idx ON reviews(user_id);
CREATE INDEX reviews_user_id_idx ON reviews(user_id);
CREATE INDEX reviews_listing_id_idx ON reviews(listing_id);
COMMENT ON COLUMN reviews.rating IS 'The rating of the review';
COMMENT ON COLUMN reviews.feedback IS 'The feedback of the review';

CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own shops"
  ON shops FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_shops_updated_at
  BEFORE UPDATE ON shops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX shops_user_id_idx ON shops(user_id);
CREATE INDEX shops_user_id_idx ON shops(user_id);
COMMENT ON COLUMN shops.name IS 'The name of the shop';
COMMENT ON COLUMN shops.description IS 'The description of the shop';

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL,
  buyer_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_intent_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT orders_status_check CHECK (status IN ('pending', 'paid', 'shipped', 'completed', 'cancelled', 'refunded'))
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own orders"
  ON orders FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX orders_user_id_idx ON orders(user_id);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_id TEXT NOT NULL UNIQUE,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT payments_status_check CHECK (status IN ('pending', 'completed', 'failed', 'refunded'))
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own payments"
  ON payments FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX payments_user_id_idx ON payments(user_id);
CREATE INDEX payments_stripe_payment_id_idx ON payments(stripe_payment_id);
CREATE INDEX payments_status_idx ON payments(status);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL UNIQUE,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  plan_name TEXT NOT NULL,
  price_amount INTEGER NOT NULL,
  interval TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT subscriptions_interval_check CHECK (interval IN ('monthly', 'yearly')),
  CONSTRAINT subscriptions_status_check CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete'))
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own subscriptions"
  ON subscriptions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX subscriptions_stripe_customer_id_idx ON subscriptions(stripe_customer_id);
CREATE INDEX subscriptions_stripe_subscription_id_idx ON subscriptions(stripe_subscription_id);
CREATE INDEX subscriptions_interval_idx ON subscriptions(interval);
CREATE INDEX subscriptions_status_idx ON subscriptions(status);

CREATE TABLE uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own uploads"
  ON uploads FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_uploads_updated_at
  BEFORE UPDATE ON uploads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX uploads_user_id_idx ON uploads(user_id);

CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own channels"
  ON channels FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_channels_updated_at
  BEFORE UPDATE ON channels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX channels_user_id_idx ON channels(user_id);
CREATE INDEX channels_type_idx ON channels(type);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  action_url TEXT NOT NULL,
  sender_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT notifications_type_check CHECK (type IN ('info', 'success', 'warning', 'error', 'mention', 'follow', 'like'))
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own notifications"
  ON notifications FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX notifications_user_id_idx ON notifications(user_id);
CREATE INDEX notifications_type_idx ON notifications(type);
CREATE INDEX notifications_sender_id_idx ON notifications(sender_id);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_group BOOLEAN NOT NULL,
  last_message_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own conversations"
  ON conversations FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX conversations_user_id_idx ON conversations(user_id);
CREATE INDEX conversations_last_message_at_idx ON conversations(last_message_at);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  message_type TEXT NOT NULL,
  read_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT messages_message_type_check CHECK (message_type IN ('text', 'image', 'file', 'system'))
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own messages"
  ON messages FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX messages_user_id_idx ON messages(user_id);
CREATE INDEX messages_conversation_id_idx ON messages(conversation_id);
CREATE INDEX messages_sender_id_idx ON messages(sender_id);
CREATE INDEX messages_message_type_idx ON messages(message_type);

CREATE TABLE global_search_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT global_search_features_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

ALTER TABLE global_search_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own global_search_features"
  ON global_search_features FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_global_search_features_updated_at
  BEFORE UPDATE ON global_search_features
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX global_search_features_user_id_idx ON global_search_features(user_id);
CREATE INDEX global_search_features_status_idx ON global_search_features(status);

CREATE TABLE safe_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT safe_transactions_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

ALTER TABLE safe_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own safe_transactions"
  ON safe_transactions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_safe_transactions_updated_at
  BEFORE UPDATE ON safe_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX safe_transactions_user_id_idx ON safe_transactions(user_id);
CREATE INDEX safe_transactions_status_idx ON safe_transactions(status);

CREATE TABLE own_shop_systems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT own_shop_systems_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

ALTER TABLE own_shop_systems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own own_shop_systems"
  ON own_shop_systems FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_own_shop_systems_updated_at
  BEFORE UPDATE ON own_shop_systems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX own_shop_systems_user_id_idx ON own_shop_systems(user_id);
CREATE INDEX own_shop_systems_status_idx ON own_shop_systems(status);

CREATE TABLE set_your_own_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT set_your_own_prices_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

ALTER TABLE set_your_own_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own set_your_own_prices"
  ON set_your_own_prices FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_set_your_own_prices_updated_at
  BEFORE UPDATE ON set_your_own_prices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX set_your_own_prices_user_id_idx ON set_your_own_prices(user_id);
CREATE INDEX set_your_own_prices_status_idx ON set_your_own_prices(status);

CREATE TABLE no_transaction_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT no_transaction_fees_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

ALTER TABLE no_transaction_fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own no_transaction_fees"
  ON no_transaction_fees FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_no_transaction_fees_updated_at
  BEFORE UPDATE ON no_transaction_fees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX no_transaction_fees_user_id_idx ON no_transaction_fees(user_id);
CREATE INDEX no_transaction_fees_status_idx ON no_transaction_fees(status);

CREATE TABLE messages_and_chat_systems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT messages_and_chat_systems_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

ALTER TABLE messages_and_chat_systems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own messages_and_chat_systems"
  ON messages_and_chat_systems FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_messages_and_chat_systems_updated_at
  BEFORE UPDATE ON messages_and_chat_systems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX messages_and_chat_systems_user_id_idx ON messages_and_chat_systems(user_id);
CREATE INDEX messages_and_chat_systems_status_idx ON messages_and_chat_systems(status);

CREATE TABLE classified_ad_markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT classified_ad_markets_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

ALTER TABLE classified_ad_markets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own classified_ad_markets"
  ON classified_ad_markets FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_classified_ad_markets_updated_at
  BEFORE UPDATE ON classified_ad_markets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX classified_ad_markets_user_id_idx ON classified_ad_markets(user_id);
CREATE INDEX classified_ad_markets_status_idx ON classified_ad_markets(status);

CREATE TABLE member_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT member_reviews_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

ALTER TABLE member_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own member_reviews"
  ON member_reviews FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_member_reviews_updated_at
  BEFORE UPDATE ON member_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX member_reviews_user_id_idx ON member_reviews(user_id);
CREATE INDEX member_reviews_status_idx ON member_reviews(status);

CREATE TABLE privacy_functions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT privacy_functions_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

ALTER TABLE privacy_functions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own privacy_functions"
  ON privacy_functions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_privacy_functions_updated_at
  BEFORE UPDATE ON privacy_functions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX privacy_functions_user_id_idx ON privacy_functions(user_id);
CREATE INDEX privacy_functions_status_idx ON privacy_functions(status);

CREATE TABLE media_clouds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT media_clouds_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

ALTER TABLE media_clouds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own media_clouds"
  ON media_clouds FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_media_clouds_updated_at
  BEFORE UPDATE ON media_clouds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX media_clouds_user_id_idx ON media_clouds(user_id);
CREATE INDEX media_clouds_status_idx ON media_clouds(status);

CREATE TABLE user_blocking_systems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT user_blocking_systems_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

ALTER TABLE user_blocking_systems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own user_blocking_systems"
  ON user_blocking_systems FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_user_blocking_systems_updated_at
  BEFORE UPDATE ON user_blocking_systems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX user_blocking_systems_user_id_idx ON user_blocking_systems(user_id);
CREATE INDEX user_blocking_systems_status_idx ON user_blocking_systems(status);

CREATE TABLE human_operated_fake_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT human_operated_fake_checks_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

ALTER TABLE human_operated_fake_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own human_operated_fake_checks"
  ON human_operated_fake_checks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_human_operated_fake_checks_updated_at
  BEFORE UPDATE ON human_operated_fake_checks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX human_operated_fake_checks_user_id_idx ON human_operated_fake_checks(user_id);
CREATE INDEX human_operated_fake_checks_status_idx ON human_operated_fake_checks(status);

CREATE TABLE member_reviews_and_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT member_reviews_and_ratings_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

ALTER TABLE member_reviews_and_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own member_reviews_and_ratings"
  ON member_reviews_and_ratings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_member_reviews_and_ratings_updated_at
  BEFORE UPDATE ON member_reviews_and_ratings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX member_reviews_and_ratings_user_id_idx ON member_reviews_and_ratings(user_id);
CREATE INDEX member_reviews_and_ratings_status_idx ON member_reviews_and_ratings(status);

CREATE TABLE full_featured_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT full_featured_profiles_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

ALTER TABLE full_featured_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own full_featured_profiles"
  ON full_featured_profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_full_featured_profiles_updated_at
  BEFORE UPDATE ON full_featured_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX full_featured_profiles_user_id_idx ON full_featured_profiles(user_id);
CREATE INDEX full_featured_profiles_status_idx ON full_featured_profiles(status);

CREATE TABLE seller_ratings_and_buyer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT seller_ratings_and_buyer_reviews_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

ALTER TABLE seller_ratings_and_buyer_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own seller_ratings_and_buyer_reviews"
  ON seller_ratings_and_buyer_reviews FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_seller_ratings_and_buyer_reviews_updated_at
  BEFORE UPDATE ON seller_ratings_and_buyer_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX seller_ratings_and_buyer_reviews_user_id_idx ON seller_ratings_and_buyer_reviews(user_id);
CREATE INDEX seller_ratings_and_buyer_reviews_status_idx ON seller_ratings_and_buyer_reviews(status);

CREATE TABLE user_ranking_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT user_ranking_lists_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

ALTER TABLE user_ranking_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own user_ranking_lists"
  ON user_ranking_lists FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_user_ranking_lists_updated_at
  BEFORE UPDATE ON user_ranking_lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX user_ranking_lists_user_id_idx ON user_ranking_lists(user_id);
CREATE INDEX user_ranking_lists_status_idx ON user_ranking_lists(status);

CREATE TABLE friends_and_fans_systems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT friends_and_fans_systems_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

ALTER TABLE friends_and_fans_systems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own friends_and_fans_systems"
  ON friends_and_fans_systems FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_friends_and_fans_systems_updated_at
  BEFORE UPDATE ON friends_and_fans_systems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX friends_and_fans_systems_user_id_idx ON friends_and_fans_systems(user_id);
CREATE INDEX friends_and_fans_systems_status_idx ON friends_and_fans_systems(status);

CREATE TABLE custom_video_clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT custom_video_clips_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

ALTER TABLE custom_video_clips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own custom_video_clips"
  ON custom_video_clips FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_custom_video_clips_updated_at
  BEFORE UPDATE ON custom_video_clips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX custom_video_clips_user_id_idx ON custom_video_clips(user_id);
CREATE INDEX custom_video_clips_status_idx ON custom_video_clips(status);

CREATE TABLE private_photosets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT private_photosets_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

ALTER TABLE private_photosets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own private_photosets"
  ON private_photosets FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_private_photosets_updated_at
  BEFORE UPDATE ON private_photosets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX private_photosets_user_id_idx ON private_photosets(user_id);
CREATE INDEX private_photosets_status_idx ON private_photosets(status);

CREATE TABLE whatsapp_and_skype_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT whatsapp_and_skype_chats_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

ALTER TABLE whatsapp_and_skype_chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own whatsapp_and_skype_chats"
  ON whatsapp_and_skype_chats FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_whatsapp_and_skype_chats_updated_at
  BEFORE UPDATE ON whatsapp_and_skype_chats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX whatsapp_and_skype_chats_user_id_idx ON whatsapp_and_skype_chats(user_id);
CREATE INDEX whatsapp_and_skype_chats_status_idx ON whatsapp_and_skype_chats(status);

-- Smart relationship wiring (domain pattern detection)
-- Smart FK: Payment → Order
ALTER TABLE payments ADD COLUMN order_id UUID REFERENCES orders(id) ON DELETE CASCADE;
CREATE INDEX payments_order_id_idx ON payments(order_id);

-- Smart FK: MessagesAndChatSystem → Conversation
ALTER TABLE messagesandchatsystems ADD COLUMN conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE;
CREATE INDEX messagesandchatsystems_conversation_id_idx ON messagesandchatsystems(conversation_id);

-- Smart FK: MemberReviews polymorphic reference
ALTER TABLE memberreviews ADD COLUMN target_id UUID;
ALTER TABLE memberreviews ADD COLUMN target_type TEXT;
CREATE INDEX memberreviews_target_idx ON memberreviews(target_id, target_type);

-- Smart FK: MemberReviewsAndRatings polymorphic reference
ALTER TABLE memberreviewsandratings ADD COLUMN target_id UUID;
ALTER TABLE memberreviewsandratings ADD COLUMN target_type TEXT;
CREATE INDEX memberreviewsandratings_target_idx ON memberreviewsandratings(target_id, target_type);

-- Smart FK: SellerRatingsAndBuyerReviews polymorphic reference
ALTER TABLE sellerratingsandbuyerreviews ADD COLUMN target_id UUID;
ALTER TABLE sellerratingsandbuyerreviews ADD COLUMN target_type TEXT;
CREATE INDEX sellerratingsandbuyerreviews_target_idx ON sellerratingsandbuyerreviews(target_id, target_type);

-- Smart junction table: Conversation participants
CREATE TABLE IF NOT EXISTS conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_read_at TIMESTAMPTZ,
  UNIQUE(conversation_id, user_id)
);

CREATE INDEX conversation_participants_conversation_id_idx ON conversation_participants(conversation_id);
CREATE INDEX conversation_participants_user_id_idx ON conversation_participants(user_id);

ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own conversation participants" ON conversation_participants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can join conversations" ON conversation_participants FOR INSERT WITH CHECK (auth.uid() = user_id);


-- ============================================================================
-- Feature-specific tables
-- ============================================================================

-- File uploads tracking (uploads feature)
CREATE TABLE IF NOT EXISTS file_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bucket TEXT NOT NULL,
  path TEXT NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT,
  size_bytes BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own uploads" ON file_uploads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own uploads" ON file_uploads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own uploads" ON file_uploads FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_file_uploads_user_id ON file_uploads(user_id);

-- Search index (search feature)
CREATE TABLE IF NOT EXISTS search_index (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  tags TEXT[] DEFAULT '{}',
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE search_index ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Search index is publicly readable" ON search_index FOR SELECT USING (true);
CREATE POLICY "System can manage search index" ON search_index FOR ALL USING (true);

CREATE INDEX idx_search_index_vector ON search_index USING GIN(search_vector);
CREATE INDEX idx_search_index_entity ON search_index(entity_type, entity_id);

-- Deferred foreign key constraints (avoids circular reference errors)
ALTER TABLE listings ADD CONSTRAINT listings_user_id_fk FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE;
ALTER TABLE reviews ADD CONSTRAINT reviews_user_id_fk FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE;
ALTER TABLE reviews ADD CONSTRAINT reviews_listing_id_fk FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE;
ALTER TABLE shops ADD CONSTRAINT shops_user_id_fk FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE;
