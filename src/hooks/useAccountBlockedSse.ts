import { useEffect, useRef } from "react";

export function useAccountBlockedSse(
    userId: string,
    onBlocked: () => void,
    onUnblocked?: () => void
) {
    const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!userId) return;

        let blockSource: EventSource | null = null;
        let unblockSource: EventSource | null = null;

        const connect = () => {
            blockSource = new EventSource(`/api/sse/subscribe/block?userId=${userId}`);
            unblockSource = new EventSource(`/api/sse/subscribe/unblock?userId=${userId}`);

            blockSource.addEventListener("account-blocked", () => {
                onBlocked();
                blockSource?.close();
                unblockSource?.close();
                reconnect();
            });

            if (onUnblocked) {
                unblockSource.addEventListener("account-unblocked", () => {
                    onUnblocked();
                    blockSource?.close();
                    unblockSource?.close();
                    reconnect();
                });
            }

            const reconnect = () => {
                if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
                reconnectTimeout.current = setTimeout(connect, 1000);
            };

            blockSource.onerror = unblockSource.onerror = () => {
                blockSource?.close();
                unblockSource?.close();
                reconnect();
            };
        };

        connect();

        return () => {
            blockSource?.close();
            unblockSource?.close();
            if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
        };
    }, [userId, onBlocked, onUnblocked]);
}