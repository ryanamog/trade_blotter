// Used AI to generate this
import { useEffect, useState } from 'react';
import { fetchEventSource, EventStreamContentType, type EventSourceMessage } from '@microsoft/fetch-event-source';

export const useServerSentEvents = <T>(url: string, token: string | null) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  useEffect(() => {
    // Gracefully exit if there's no valid authorization token yet
    if (!token) {
      setConnectionStatus('disconnected');
      return;
    }

    const ctrl = new AbortController();

    const connectToStream = async (): Promise<void> => {
      try {
        await fetchEventSource(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          signal: ctrl.signal,
          
          async onopen(response: Response): Promise<void> {
            const contentType = response.headers.get('content-type');
            
            if (response.ok && contentType?.includes(EventStreamContentType)) {
              setConnectionStatus('connected');
              setError(null);
            } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
              // Client errors (e.g., 401 Unauthorized, 403 Forbidden) are fatal: abort immediately
              setConnectionStatus('disconnected');
              ctrl.abort();
              throw new Error(`Fatal client side stream error: ${response.status}`);
            } else {
              // Server errors (5xx) or rate limits (429): throw to allow automatic retry pipeline
              throw new Error(`Server stream connection error: ${response.status}`);
            }
          },

          onmessage(msg: EventSourceMessage): void {
            if (!msg.data) return; // Discard empty keep-alive heartbeats
            
            try {
              const parsedData: T = JSON.parse(msg.data);
              setData(parsedData);
            } catch (err) {
              console.error("Failed to parse incoming SSE chunk JSON:", err);
            }
          },

          onerror(err: unknown): number | void {
            // Check if the stream was aborted during component unmounting cleanup
            if (ctrl.signal.aborted || (err instanceof Error && err.name === 'AbortError')) {
              return; // Suppress error tracking and stop the loop
            }
            
            setError(err);
            setConnectionStatus('disconnected');
            
            // Re-throwing forces fetchEventSource into its built-in exponential backoff retry loop
            throw err; 
          }
        });
      } catch (err) {
        if (!ctrl.signal.aborted) {
          console.error("Stream initialization error:", err);
        }
      }
    };

    connectToStream();

    return () => {
      ctrl.abort(); // Drops the ongoing HTTP network socket cleanly on unmount
    };
  }, [url, token]);

  return { data, error, connectionStatus };
};