import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useMutation } from "@tanstack/react-query";
import { refresh } from "@/api/refresh.api.ts";
import { toast } from "sonner";
import { t } from "i18next";

interface JwtPayload {
    exp: number;
}

export const useSessionTimeout = (thresholdSeconds: number = 300, onExpired?: () => void) => {
    const [isExpiringSoon, setIsExpiringSoon] = useState(false);

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            const decoded: JwtPayload = jwtDecode(token);
            const now = Date.now() / 1000;
            const timeLeft = decoded.exp - now;

            if (timeLeft <= 0) {
                onExpired?.();
                return;
            }

            setIsExpiringSoon(timeLeft < thresholdSeconds);
        };

        checkToken();

        const interval = setInterval(checkToken, 5000);

        return () => clearInterval(interval);
    }, [thresholdSeconds, onExpired]);

    return {
        isExpiringSoon,
        resetWarning: () => setIsExpiringSoon(false),
    };
};

export const useRefreshSession = () => {
    return useMutation({
        mutationFn: refresh,
        onSuccess: (data) => {
            localStorage.setItem("token", data.value);
            toast.success(t("session.extended"));
        },
        onError: () => {
            toast.error(t("session.extension_failed"));
        },
    });
};