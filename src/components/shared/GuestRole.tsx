import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Spinner } from "../ui/spinner";
import { Navigate, Outlet } from "react-router";
import ROUTES from "@/constants/routes";
import { useTranslation } from "react-i18next";

const GuestRoute = () => {
  const { data: user, isLoading } = useCurrentUser();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center flex-col">
        <Spinner />
        <p className="text-gray-500">{t("common.loading")}...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
