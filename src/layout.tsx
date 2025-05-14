import { Route, Routes } from "react-router";
import {
  Home,
  Login,
  NotFound,
  ClientRegister,
  DieticianRegister,
  AdminUserAccount,
} from "./pages";
import { Toaster } from "./components/ui/sonner";
import ROUTES from "./constants/routes";
import { AccessLevel, ThemeWrapper } from "./components/shared/ThemeWrapper";
import { useCurrentUser } from "./hooks/useCurrentUser";
import Footer from "./components/shared/Footer";

const Layout = () => {
  const { data: user } = useCurrentUser();

  const role =
    (user?.roles[0].roleName.toLowerCase() as AccessLevel) || "client";

  return (
    <div className="min-h-screen flex flex-col">
      <ThemeWrapper role={role} prefersDark={false}>
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.USER_REGISTER} element={<ClientRegister />} />
          <Route
            path={ROUTES.DIETICIAN_REGISTER}
            element={<DieticianRegister />}
          />
          <Route
            path={ROUTES.ADMIN_USER_DETAILS}
            element={<AdminUserAccount />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </ThemeWrapper>
      <Toaster />
    </div>
  );
};

export default Layout;
