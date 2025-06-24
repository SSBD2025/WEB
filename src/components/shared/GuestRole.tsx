import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Spinner } from "../ui/spinner";
import { Navigate, Outlet } from "react-router";
import ROUTES from "@/constants/routes";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import useRole from "@/store";

const GuestRoute = () => {
  const { data: user, isFetching, isError, refetch } = useCurrentUser();
  const {currentRole, setCurrentRole} = useRole();
  const { t } = useTranslation();
  const [hasRefetchedManually, setHasRefetchedManually] = useState(false);
  const hasToken =
    typeof window !== "undefined" && localStorage.getItem("token");

  useEffect(() => {
    if (!hasToken && !hasRefetchedManually) {
      refetch().finally(() => setHasRefetchedManually(true));
    }
  }, [hasToken, hasRefetchedManually, refetch]);

  useEffect(() => {
    if ((isError || !user) && hasRefetchedManually && currentRole !== null) {
      setCurrentRole(null);
    }
  }, [isError, user, hasRefetchedManually, currentRole, setCurrentRole]);

  const isLoading = (!hasToken && !hasRefetchedManually) || isFetching;

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center flex-col">
        <Spinner />
        <p className="text-gray-500">{t("common.loading")}...</p>
      </div>
    );
  }

  if (isError || !user) {
    return <Outlet />;
  }

  return <Navigate to={ROUTES.HOME} replace />;
};

export default GuestRoute;
