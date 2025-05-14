import { Route, Routes } from "react-router";
import {
  Home,
  Login,
  NotFound,
  ClientRegister,
  DieticianRegister,
  AdminUserAccount,
  AdminDashboard,
} from "./pages";
import { Toaster } from "./components/ui/sonner";
import ROUTES from "./constants/routes";
import { AccessLevel, ThemeWrapper } from "./components/shared/ThemeWrapper";
import { useCurrentUser } from "./hooks/useCurrentUser";
import MeProfile from "./pages/MeProfile";
import Footer from "./components/shared/Footer";
import useRole from "./store";
import { useEffect } from "react";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import GuestRoute from "./components/shared/GuestRole";

const Layout = () => {
  const { data: user } = useCurrentUser();
  const { currentRole, setCurrentRole } = useRole();

  useEffect(() => {
    if (user?.roles?.[0]?.roleName) {
      const role = user.roles[0].roleName.toLowerCase() as AccessLevel;
      if (role !== currentRole) {
        setCurrentRole(role);
      }
    } else {
      setCurrentRole(null);
    }
  }, [user, currentRole, setCurrentRole]);

  return (
    <div className="min-h-screen flex flex-col">
      <ThemeWrapper role={currentRole || "client"} prefersDark={false}>
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route element={<GuestRoute />}>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.USER_REGISTER} element={<ClientRegister />} />
            <Route
              path={ROUTES.DIETICIAN_REGISTER}
              element={<DieticianRegister />}
            />
          </Route>
          <Route
            element={
              <ProtectedRoute allowedRoles={["client", "dietician", "admin"]} />
            }
          >
            <Route path={ROUTES.ME} element={<MeProfile />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route
              path={ROUTES.ADMIN_USER_DETAILS}
              element={<AdminUserAccount />}
            />
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </ThemeWrapper>
      <Toaster />
    </div>
  );
};

export default Layout;
