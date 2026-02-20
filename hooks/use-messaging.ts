"use client";

import { useState, useEffect, useCallback } from "react";

interface Conversation {
  id: string;
  title: string | null;
  is_group: boolean;
  last_message_at: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: "text" | "image" | "file" | "system";
  read_at: string | null;
  created_at: string;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/conversations");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to fetch");
      setConversations(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Failed to fetch conversations:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  async function createConversation(params: {
    title?: string;
    is_group?: boolean;
    participant_ids: string[];
  }): Promise<Conversation | null> {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to create");
      await fetchConversations();
      return json.data;
    } catch (err) {
      console.error("Failed to create conversation:", err);
      return null;
    }
  }

  return { conversations, isLoading, error, createConversation, refresh: fetchConversations };
}

export function useMessages(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    try {
      setError(null);
      const res = await fetch(`/api/conversations/${conversationId}/messages`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to fetch");
      setMessages(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Failed to fetch messages:", err);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  async function sendMessage(params: {
    content: string;
    message_type?: "text" | "image" | "file" | "system";
  }): Promise<Message | null> {
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message_type: "text", ...params }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to send");
      const newMessage: Message = json.data;
      setMessages((prev) => [...prev, newMessage]);
      return newMessage;
    } catch (err) {
      console.error("Failed to send message:", err);
      return null;
    }
  }

  async function markRead(messageId: string) {
    try {
      await fetch(`/api/conversations/${conversationId}/messages/${messageId}/read`, {
        method: "PATCH",
      });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, read_at: new Date().toISOString() } : m
        )
      );
    } catch (err) {
      console.error("Failed to mark message read:", err);
    }
  }

  return { messages, isLoading, error, sendMessage, markRead, refresh: fetchMessages };
}
