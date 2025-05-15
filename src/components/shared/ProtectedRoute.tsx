import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Spinner } from "../ui/spinner";
import { Navigate, Outlet } from "react-router";
import ROUTES from "@/constants/routes";
import useRole from "@/store";
import { useTranslation } from "react-i18next";
import Unauthorized from "@/pages/Unauthorized";

const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { data: user, isLoading, isError } = useCurrentUser();
  const { currentRole } = useRole();
  const { t } = useTranslation();

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

  if (isError || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!user.account.active) {
    localStorage.removeItem("token");
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    return <Unauthorized />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
