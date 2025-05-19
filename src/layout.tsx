import { Route, Routes } from "react-router";
import {
  Home,
  Login,
  NotFound,
  ClientRegister,
  AdminRegister,
  DieticianRegister,
  AdminUserAccount,
  PasswordReset,
  NewPassword,
  AdminDashboard,
} from "./pages";
import { Toaster } from "./components/ui/sonner";
import ROUTES from "./constants/routes";
import { ThemeWrapper } from "./components/shared/ThemeWrapper";
import { useCurrentUser } from "./hooks/useCurrentUser";
import MeProfile from "./pages/MeProfile";
import Footer from "./components/shared/Footer";
import useRole from "./store";
import { useEffect } from "react";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import GuestRoute from "./components/shared/GuestRole";
import { Navbar } from "./components/shared/Navbar";
import Redirect from "./pages/Redirect";
import { AccessLevel } from "./types/user";

const Layout = () => {
  const { data: user } = useCurrentUser();
  const { currentRole, setCurrentRole } = useRole();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!currentRole && user?.roles?.[0]?.roleName) {
      const role = user.roles[0].roleName.toLowerCase() as AccessLevel;
      setCurrentRole(role);
    }
  }, [user, currentRole, setCurrentRole]);

  return (
    <div className="min-h-screen flex flex-col">
      <ThemeWrapper role={currentRole || "client"} prefersDark={false}>
        <Navbar />
        <Routes>
          <Route path={ROUTES.REDIRECT} element={<Redirect />} />
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.PASSWORD_RESET} element={<PasswordReset />} />
          <Route path={ROUTES.NEW_PASSWORD} element={<NewPassword />} />
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
            <Route path={ROUTES.ADMIN_REGISTER} element={<AdminRegister />}/>
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
