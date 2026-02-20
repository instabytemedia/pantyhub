"use client";

import { useState, useEffect, useCallback } from "react";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  type: "text" | "image" | "file";
  created_at: string;
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

interface UseMessagesReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  send: (body: string, type?: "text" | "image" | "file") => Promise<void>;
  loadMore: () => void;
  hasMore: boolean;
}

export function useMessages(conversationId: string | null): UseMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchMessages = useCallback(
    async (before?: string) => {
      if (!conversationId) return;
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          conversation_id: conversationId,
          limit: "50",
        });
        if (before) params.set("before", before);

        const res = await fetch(`/api/messages?${params}`);
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        const items: Message[] = data.items ?? [];

        if (before) {
          setMessages((prev) => [...items, ...prev]);
        } else {
          setMessages(items);
        }

        setHasMore(items.length >= 50);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId]
  );

  useEffect(() => {
    if (conversationId) {
      setMessages([]);
      fetchMessages();
    }
  }, [conversationId, fetchMessages]);

  const send = useCallback(
    async (body: string, type: "text" | "image" | "file" = "text") => {
      if (!conversationId || !body.trim()) return;

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: conversationId,
          body: body.trim(),
          type,
        }),
      });

      if (res.ok) {
        const newMessage = await res.json();
        setMessages((prev) => [...prev, newMessage]);
      }
    },
    [conversationId]
  );

  const loadMore = useCallback(() => {
    if (messages.length > 0 && hasMore) {
      fetchMessages(messages[0].created_at);
    }
  }, [messages, hasMore, fetchMessages]);

  return { messages, isLoading, error, send, loadMore, hasMore };
}
