import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSessionTimeout, useRefreshSession } from "@/hooks/useSessionTimeout.ts";
import apiClient from "@/lib/apiClient.ts";
import { useNavigate } from "react-router";
import useRole from "@/store";
import {useQueryClient} from "@tanstack/react-query";
import ROUTES from "@/constants/routes";
import { t } from "i18next";

export const SessionTimeout = () => {
    const refreshSession = useRefreshSession();
    const navigate = useNavigate();
    const { setCurrentRole } = useRole();
    const queryClient = useQueryClient();

    const handleExtend = () => {
        refreshSession.mutate();
        resetWarning();
    };

    const handleLogout = async () => {
        await apiClient.post("/account/logout");

        localStorage.removeItem("token");

        setCurrentRole(null);

        localStorage.removeItem("user-role");
        queryClient.setQueryData(["currentUser"], null);
        queryClient.removeQueries();

        navigate(ROUTES.LOGIN);
        resetWarning();
    };

    const { isExpiringSoon, resetWarning } = useSessionTimeout(300, handleLogout);

    return (
        <Dialog open={isExpiringSoon}>
            <DialogContent className="sm:max-w-md [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle>{t("session.title")}</DialogTitle>
                    <DialogDescription>
                        {t("session.description")}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleLogout}>
                        {t("session.logout")}
                    </Button>
                    <Button onClick={handleExtend}>
                        {t("session.extend")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
