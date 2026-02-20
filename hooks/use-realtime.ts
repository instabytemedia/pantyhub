"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type ChangeEvent = "INSERT" | "UPDATE" | "DELETE" | "*";

interface RealtimeOptions<T extends Record<string, unknown>> {
  /** Supabase table to listen to */
  table: string;
  /** Postgres change events to subscribe to */
  events?: ChangeEvent[];
  /** Optional filter, e.g. "user_id=eq.some-uuid" */
  filter?: string;
  /** Called whenever a matching change occurs */
  onChange: (payload: RealtimePostgresChangesPayload<T>) => void;
}

/**
 * useRealtimeSubscription
 *
 * Subscribes to Supabase postgres_changes for a given table.
 * Automatically cleans up the channel on unmount.
 *
 * @example
 * useRealtimeSubscription({
 *   table: "messages",
 *   events: ["INSERT"],
 *   filter: `room_id=eq.${roomId}`,
 *   onChange: (payload) => {
 *     if (payload.eventType === "INSERT") {
 *       setMessages(prev => [payload.new, ...prev]);
 *     }
 *   },
 * });
 */
export function useRealtimeSubscription<T extends Record<string, unknown>>({
  table,
  events = ["*"],
  filter,
  onChange,
}: RealtimeOptions<T>) {
  const supabase = createClient();
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const channelId = `realtime:${table}:${filter ?? "all"}`;
    let channel = supabase.channel(channelId);

    for (const event of events) {
      channel = channel.on(
        "postgres_changes",
        {
          event,
          schema: "public",
          table,
          ...(filter ? { filter } : {}),
        },
        (payload: RealtimePostgresChangesPayload<T>) => {
          onChangeRef.current(payload);
        }
      );
    }

    channel.subscribe((status) => {
      if (status === "CHANNEL_ERROR") {
        console.error(`[Realtime] Channel error for ${channelId}`);
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, filter, supabase]);
}
