import { Route, Routes } from "react-router";
import { Home, Login, Register } from "./pages";
import { Toaster } from "./components/ui/sonner";
import ROUTES from "./constants/routes";
import { AccessLevel, ThemeWrapper } from "./components/shared/ThemeWrapper";
import { useCurrentUser } from "./hooks/useCurrentUser";

const Layout = () => {
  const { data: user } = useCurrentUser();

  const role =
    (user?.roles[0].roleName.toLowerCase() as AccessLevel) || "client";

  return (
    <>
      <ThemeWrapper role={role} prefersDark={false}>
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register/>} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </ThemeWrapper>
      <Toaster />
    </>
  );
};

export default Layout;
