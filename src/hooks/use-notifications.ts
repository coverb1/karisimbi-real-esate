"use client";

import { useEffect, useState, useCallback } from "react";

export type NotifType = "sell-property" | "property-visit";

export interface UnifiedNotification {
  id: string;
  type: NotifType;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  unread: boolean;
  created_at: string;
  // shared
  address?: string | null;
  id_number?: string | null;
  property_type?: string | null;
  // sell-property
  location?: string | null;
  property_size?: string | null;
  asking_price?: string | null;
  documents_available?: string | null;
  has_issues?: string | null;
  issues_explanation?: string | null;
  // property-visit
  property_location?: string | null;
  property_price?: string | null;
  visit_date?: string | null;
  visit_time?: string | null;
  transportation?: string | null;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<UnifiedNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const json = await res.json();
      if (json.success) setNotifications(json.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = async (id: string, type: NotifType) => {
    await fetch("/api/notifications/mark-read", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type }),
    });
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id && n.type === type ? { ...n, unread: false } : n
      )
    );
  };

  const markAllAsRead = async () => {
    await fetch("/api/notifications/mark-all-read", { method: "PATCH" });
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch: fetchAll,
  };
}
