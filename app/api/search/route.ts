import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const limit = Math.min(Number(searchParams.get("limit") ?? "10"), 50);

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = await createClient();
  const pattern = `%${q}%`;

  const results: Array<{ type: string; items: unknown[] }> = [];

  // Search User
  {
    let query = supabase.from("users").select("*");
    query = query.or(`username.ilike.${pattern},email.ilike.${pattern},password.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "User", items: data });
    }
  }

  // Search Listing
  {
    let query = supabase.from("listings").select("*");
    query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "Listing", items: data });
    }
  }

  // Search Review
  {
    let query = supabase.from("reviews").select("*");
    query = query.ilike("feedback", pattern);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "Review", items: data });
    }
  }

  // Search Shop
  {
    let query = supabase.from("shops").select("*");
    query = query.or(`name.ilike.${pattern},description.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "Shop", items: data });
    }
  }

  // Search Order
  {
    let query = supabase.from("orders").select("*");
    query = query.ilike("payment_intent_id", pattern);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "Order", items: data });
    }
  }

  // Search Payment
  {
    let query = supabase.from("payments").select("*");
    query = query.or(`stripe_payment_id.ilike.${pattern},currency.ilike.${pattern},payment_method.ilike.${pattern},description.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "Payment", items: data });
    }
  }

  // Search Subscription
  {
    let query = supabase.from("subscriptions").select("*");
    query = query.or(`stripe_customer_id.ilike.${pattern},stripe_subscription_id.ilike.${pattern},plan_name.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "Subscription", items: data });
    }
  }

  // Search Upload
  {
    let query = supabase.from("uploads").select("*");
    query = query.or(`file_name.ilike.${pattern},file_url.ilike.${pattern},file_type.ilike.${pattern},storage_path.ilike.${pattern},alt_text.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "Upload", items: data });
    }
  }

  // Search Channel
  {
    let query = supabase.from("channels").select("*");
    query = query.or(`name.ilike.${pattern},type.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "Channel", items: data });
    }
  }

  // Search Notification
  {
    let query = supabase.from("notifications").select("*");
    query = query.or(`title.ilike.${pattern},message.ilike.${pattern},action_url.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "Notification", items: data });
    }
  }

  // Search Conversation
  {
    let query = supabase.from("conversations").select("*");
    query = query.ilike("title", pattern);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "Conversation", items: data });
    }
  }

  // Search Message
  {
    let query = supabase.from("messages").select("*");
    query = query.ilike("content", pattern);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "Message", items: data });
    }
  }

  // Search GlobalSearchFeature
  {
    let query = supabase.from("global_search_features").select("*");
    query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "GlobalSearchFeature", items: data });
    }
  }

  // Search SafeTransactions
  {
    let query = supabase.from("safe_transactionses").select("*");
    query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "SafeTransactions", items: data });
    }
  }

  // Search OwnShopSystem
  {
    let query = supabase.from("own_shop_systems").select("*");
    query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "OwnShopSystem", items: data });
    }
  }

  // Search SetYourOwnPrices
  {
    let query = supabase.from("set_your_own_priceses").select("*");
    query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "SetYourOwnPrices", items: data });
    }
  }

  // Search NoTransactionFees
  {
    let query = supabase.from("no_transaction_feeses").select("*");
    query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "NoTransactionFees", items: data });
    }
  }

  // Search MessagesAndChatSystem
  {
    let query = supabase.from("messages_and_chat_systems").select("*");
    query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "MessagesAndChatSystem", items: data });
    }
  }

  // Search ClassifiedAdMarket
  {
    let query = supabase.from("classified_ad_markets").select("*");
    query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "ClassifiedAdMarket", items: data });
    }
  }

  // Search MemberReviews
  {
    let query = supabase.from("member_reviewses").select("*");
    query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "MemberReviews", items: data });
    }
  }

  // Search PrivacyFunctions
  {
    let query = supabase.from("privacy_functionses").select("*");
    query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "PrivacyFunctions", items: data });
    }
  }

  // Search MediaCloud
  {
    let query = supabase.from("media_clouds").select("*");
    query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "MediaCloud", items: data });
    }
  }

  // Search UserBlockingSystem
  {
    let query = supabase.from("user_blocking_systems").select("*");
    query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "UserBlockingSystem", items: data });
    }
  }

  // Search HumanOperatedFakeCheck
  {
    let query = supabase.from("human_operated_fake_checks").select("*");
    query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "HumanOperatedFakeCheck", items: data });
    }
  }

  // Search MemberReviewsAndRatings
  {
    let query = supabase.from("member_reviews_and_ratingses").select("*");
    query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "MemberReviewsAndRatings", items: data });
    }
  }

  // Search FullFeaturedProfiles
  {
    let query = supabase.from("full_featured_profileses").select("*");
    query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "FullFeaturedProfiles", items: data });
    }
  }

  // Search SellerRatingsAndBuyerReviews
  {
    let query = supabase.from("seller_ratings_and_buyer_reviewses").select("*");
    query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "SellerRatingsAndBuyerReviews", items: data });
    }
  }

  // Search UserRankingList
  {
    let query = supabase.from("user_ranking_lists").select("*");
    query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "UserRankingList", items: data });
    }
  }

  // Search FriendsAndFansSystem
  {
    let query = supabase.from("friends_and_fans_systems").select("*");
    query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "FriendsAndFansSystem", items: data });
    }
  }

  // Search CustomVideoClips
  {
    let query = supabase.from("custom_video_clipses").select("*");
    query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "CustomVideoClips", items: data });
    }
  }

  // Search PrivatePhotosets
  {
    let query = supabase.from("private_photosetses").select("*");
    query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "PrivatePhotosets", items: data });
    }
  }

  // Search WhatsappAndSkypeChats
  {
    let query = supabase.from("whatsapp_and_skype_chatses").select("*");
    query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "WhatsappAndSkypeChats", items: data });
    }
  }

  // Search Profile
  {
    let query = supabase.from("profiles").select("*");
    query = query.or(`display_name.ilike.${pattern},avatar_url.ilike.${pattern},bio.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "Profile", items: data });
    }
  }

  // Search MediaFile
  {
    let query = supabase.from("media_files").select("*");
    query = query.or(`filename.ilike.${pattern},url.ilike.${pattern},mime_type.ilike.${pattern},alt_text.ilike.${pattern},folder.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "MediaFile", items: data });
    }
  }

  // Search Comment
  {
    let query = supabase.from("comments").select("*");
    query = query.or(`body.ilike.${pattern},target_type.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "Comment", items: data });
    }
  }

  // Search Reaction
  {
    let query = supabase.from("reactions").select("*");
    query = query.or(`emoji.ilike.${pattern},target_type.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "Reaction", items: data });
    }
  }

  // Search PricingPlan
  {
    let query = supabase.from("pricing_plans").select("*");
    query = query.or(`name.ilike.${pattern},slug.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "PricingPlan", items: data });
    }
  }

  // Search Invoice
  {
    let query = supabase.from("invoices").select("*");
    query = query.or(`currency.ilike.${pattern},stripe_invoice_id.ilike.${pattern},pdf_url.ilike.${pattern}`);
    const { data } = await query.limit(limit);
    if (data && data.length > 0) {
      results.push({ type: "Invoice", items: data });
    }
  }

  return NextResponse.json({ results, query: q });
}
