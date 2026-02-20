"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  createPresenceChannel,
  setTypingStatus,
  removeChannel,
} from "@/lib/realtime";

interface PresenceUser {
  user_id: string;
  online_at: string;
  is_typing: boolean;
}

interface UsePresenceReturn {
  /** Online users in this conversation */
  onlineUsers: PresenceUser[];
  /** Users currently typing */
  typingUsers: PresenceUser[];
  /** Set own typing status */
  setTyping: (isTyping: boolean) => void;
}

/**
 * Track online and typing presence for a conversation.
 */
export function usePresence(
  conversationId: string | null,
  userId: string | null
): UsePresenceReturn {
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);
  const channelRef = useRef<ReturnType<typeof createPresenceChannel> | null>(null);

  useEffect(() => {
    if (!conversationId || !userId) return;

    if (channelRef.current) {
      removeChannel(channelRef.current);
    }

    const channel = createPresenceChannel(
      conversationId,
      userId,
      (presenceState) => {
        const users: PresenceUser[] = [];
        for (const [, entries] of Object.entries(presenceState)) {
          for (const entry of entries as PresenceUser[]) {
            users.push(entry);
          }
        }
        setOnlineUsers(users);
      }
    );

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [conversationId, userId]);

  const setTyping = useCallback(
    (isTyping: boolean) => {
      if (channelRef.current && userId) {
        setTypingStatus(channelRef.current, userId, isTyping);
      }
    },
    [userId]
  );

  const typingUsers = onlineUsers.filter(
    (u) => u.is_typing && u.user_id !== userId
  );

  return { onlineUsers, typingUsers, setTyping };
}
