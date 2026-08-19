'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import {
  type NotifikasiItem,
  getNotifikasiList,
  markNotifikasiRead,
  markAllNotifikasiRead,
} from '@/lib/services/notifikasi.service';
import { useAuthStore } from '@/store/authStore';
import { refreshAccessToken } from '@/lib/services/api';

export function useNotificationStream() {
  const [notifs, setNotifs] = useState<NotifikasiItem[]>([]);
  const [count, setCount] = useState<number>(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();

  // Reconnect attempts must live in a ref so the counter survives re-renders.
  // A plain variable would be re-created on every render, resetting the
  // backoff counter and causing an infinite reconnect storm.
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Referensi fungsi connectSSE agar `scheduleReconnect` bisa memanggilnya tanpa
  // circular dependency (connectSSE ↔ scheduleReconnect). Diset via useEffect
  // setelah connectSSE didefinisikan.
  const connectSSERef = useRef<() => void>(() => {});

  const fetchInitial = useCallback(async () => {
    try {
      const res = await getNotifikasiList();
      if (res && Array.isArray(res)) {
        setNotifs(res);
        setCount(res.filter((n) => !n.isRead).length);
      }
    } catch (err) {
      console.error('[SSE] Failed to fetch initial notifications', err);
    }
  }, []);

  // scheduleReconnect is defined before connectSSE so connectSSE's onerror
  // closure can reference it without forward-declaration issues.  Both use
  // useCallback with stable dependencies, so the references won't churn.
  const scheduleReconnect = useCallback(() => {
    const maxAttempts = 5;
    const attempt = ++reconnectAttemptsRef.current;

    if (attempt > maxAttempts) {
      // Too many failures — try to refresh the JWT access token.
      // If refresh also fails (refresh token expired), log the user out.
      refreshAccessToken()
        .then((ok) => {
          if (ok) {
            reconnectAttemptsRef.current = 0;
            void fetchInitial().then(() => connectSSERef.current());
          } else {
            logout();
          }
        })
        .catch(() => {
          logout();
        });
      return;
    }

    // Exponential backoff: 1s, 2s, 4s, 8s, 16s
    const delay = Math.min(
      1000 * Math.pow(2, attempt - 1), 16000,
    );
        reconnectTimerRef.current = setTimeout(() => {
      connectSSERef.current();
    }, delay);
  }, [fetchInitial, logout]);

  const connectSSE = useCallback(() => {
    const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || '/api').replace(/\/$/, '');
    const es = new EventSource(`${baseUrl}/notifikasi/stream`, {
      withCredentials: true,
    });

    es.addEventListener('connected', () => {
      setIsStreaming(true);
      reconnectAttemptsRef.current = 0; // reset backoff on success
    });

    es.addEventListener('notification', (event) => {
      try {
        const payload = JSON.parse(event.data) as NotifikasiItem;
        setNotifs((prev) => {
          if (prev.some((n) => n.id === payload.id)) return prev;
          return [payload, ...prev].slice(0, 50);
        });
        setCount((prev) => prev + 1);
      } catch (err) {
        console.error('[SSE] Failed to parse notification payload', err);
      }
    });

    es.addEventListener('ping', () => {
      // Heartbeat received — server is still reachable.
    });

    es.onerror = () => {
      es.close();
      setIsStreaming(false);
      // Browser EventSource auto-reconnects with the SAME expired cookie and
      // no token refresh.  We take over reconnection so we can refresh the
      // access token before the 6th attempt (after 5 retries).
      scheduleReconnect();
    };

    return es;
  }, [scheduleReconnect]);

  // Set ref ke connectSSE terbaru agar scheduleReconnect selalu memanggil
  // versi yang valid (tanpa circular dependency di dependency array).
  useEffect(() => {
    connectSSERef.current = connectSSE;
  }, [connectSSE]);

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifs([]);
      setCount(0);
      setIsStreaming(false);
      return;
    }

    let es: EventSource | undefined;

    // Fetch initial notifications FIRST, then connect SSE.
    // This prevents the race condition where EventSource connects with an
    // already-expired access_token before fetchInitial() triggers a refresh.
    (async () => {
      await fetchInitial();
      es = connectSSE();
    })();

        return () => {
      es?.close();
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      setIsStreaming(false);
      reconnectAttemptsRef.current = 0;
    };
  }, [isAuthenticated, fetchInitial, connectSSE]);

  const markRead = useCallback(async (id: string) => {
    try {
      await markNotifikasiRead(id);
      setNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('[SSE] Failed to mark notification as read', err);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await markAllNotifikasiRead();
      setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setCount(0);
    } catch (err) {
      console.error('[SSE] Failed to mark all notifications as read', err);
    }
  }, []);

  return {
    notifs,
    count,
    markRead,
    markAllRead,
    refresh: fetchInitial,
    isStreaming,
  };
}
