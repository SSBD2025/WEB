import { Route, Routes } from "react-router";
import { Home } from "./pages";
import { Toaster } from "./components/ui/sonner";
import ROUTES from "./constants/routes";

const Layout = () => {
  return (
    <>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
      <Toaster />
    </>
  );
};

export default Layout;
