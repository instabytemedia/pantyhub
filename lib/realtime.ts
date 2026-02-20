"use client";

import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

/**
 * Create a Supabase Realtime channel for a conversation.
 * Subscribes to INSERT events on the messages table
 * filtered by conversation_id.
 */
export function createMessageChannel(
  conversationId: string,
  onMessage: (message: Record<string, unknown>) => void
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        onMessage(payload.new as Record<string, unknown>);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Create a presence channel for online/typing indicators.
 */
export function createPresenceChannel(
  conversationId: string,
  userId: string,
  onSync: (presenceState: Record<string, unknown[]>) => void
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase.channel(`presence:${conversationId}`, {
    config: { presence: { key: userId } },
  });

  channel
    .on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      onSync(state as Record<string, unknown[]>);
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({
          user_id: userId,
          online_at: new Date().toISOString(),
          is_typing: false,
        });
      }
    });

  return channel;
}

/**
 * Update typing status on a presence channel.
 */
export async function setTypingStatus(
  channel: RealtimeChannel,
  userId: string,
  isTyping: boolean
): Promise<void> {
  await channel.track({
    user_id: userId,
    online_at: new Date().toISOString(),
    is_typing: isTyping,
  });
}

/**
 * Unsubscribe and remove a channel.
 */
export function removeChannel(channel: RealtimeChannel): void {
  const supabase = createClient();
  supabase.removeChannel(channel);
}
