import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Spinner } from "../ui/spinner";
import { Navigate, Outlet } from "react-router";
import ROUTES from "@/constants/routes";
import useRole from "@/store";
import { useTranslation } from "react-i18next";
import Unauthorized from "@/pages/Unauthorized";
import { useEffect, useState } from "react";
import { AccessLevel } from "@/types/user";

const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { data: user, isLoading, isError } = useCurrentUser();
  const { currentRole, setCurrentRole } = useRole();
  const { t } = useTranslation();
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    if (!currentRole && user?.roles?.[0]?.roleName) {
      setCurrentRole(user.roles[0].roleName.toLowerCase() as AccessLevel);
    }
  }, [user, currentRole, setCurrentRole]);

  useEffect(() => {
    if (isError || (user && !user.account.active)) {
      localStorage.removeItem("token");
      setCurrentRole(null);
      setRedirectToLogin(true);
    }
  }, [isError, user, setCurrentRole]);

  if (redirectToLogin) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center flex-col">
        <Spinner />
        <p className="text-gray-500">{t("common.loading")}...</p>
      </div>
    );
  }

  if (!currentRole) {
    return <Unauthorized />;
  }

  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    return <Unauthorized />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
