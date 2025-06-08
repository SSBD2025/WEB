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
  ForceChangePasswordPage,
  CodeloginRequestPage,
  CodeloginPage,
  DieticianDashboard,
  ShowClientReports,
  ShowClientReportsByDietician,
  ClientDashboard,
  ClientPyramidsPage,
  DieticianClientPyramidsPage
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
import { useTheme } from "./hooks/useTheme.ts";
import {SessionTimeout} from "./components/sessionTimeout";

const Layout = () => {
  const { data: user } = useCurrentUser();
  const { currentRole, setCurrentRole } = useRole();
  const { userTheme, toggleTheme } = useTheme();

  const handleToggleTheme = () => {
    toggleTheme();
  };

  useEffect(() => {
    if (user?.roles?.[0]?.roleName && !currentRole) {
      const role = user.roles[0].roleName.toLowerCase() as AccessLevel;
      setCurrentRole(role);
    }
  }, [user, currentRole, setCurrentRole]);

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    localStorage.setItem('timezone', tz);
  }, []);

  return (
      <div className="min-h-screen flex flex-col relative">
        <ThemeWrapper role={currentRole || "client"} prefersDark={userTheme}>
          <Navbar onToggleTheme={handleToggleTheme} userTheme={userTheme} />
          <Routes>
            <Route path={ROUTES.REDIRECT} element={<Redirect />} />
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.PASSWORD_RESET} element={<PasswordReset />} />
            <Route path={ROUTES.NEW_PASSWORD} element={<NewPassword />} />
            <Route element={<GuestRoute />}>
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.USER_REGISTER} element={<ClientRegister />} />
              <Route path={ROUTES.FORCE_CHANGE_PASSWORD} element={<ForceChangePasswordPage/>}/>
              <Route path={ROUTES.CODELOGIN} element={<CodeloginPage />} />
              <Route path={ROUTES.CODELOGIN_REQUEST} element={<CodeloginRequestPage />} />
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
            <Route element={
              <ProtectedRoute allowedRoles={["client"]}/>
            }>
              <Route path={ROUTES.CLIENT_BLOOD_REPORT} element={<ShowClientReports />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route
                  path={ROUTES.ADMIN_USER_DETAILS}
                  element={<AdminUserAccount />}
              />
              <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
              <Route path={ROUTES.ADMIN_REGISTER} element={<AdminRegister />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["dietician"]} />}>
              <Route path={ROUTES.DIETICIAN_DASHBOARD} element={<DieticianDashboard />}/>
              <Route path={ROUTES.DIETICIAN_BLOOD_REPORT} element={<ShowClientReportsByDietician />}/>
              <Route path={ROUTES.DIETICIAN_CLIENT_PYRAMIDS} element={<DieticianClientPyramidsPage/>}/>
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
              <Route path={ROUTES.CLIENT_DASHBOARD} element={<ClientDashboard />}/>
              <Route path={ROUTES.CLIENT_ALL_PYRAMIDS} element={<ClientPyramidsPage/>}/>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <SessionTimeout />
          <Footer />
        </ThemeWrapper>
        <Toaster />
      </div>
  );
};

export default Layout;