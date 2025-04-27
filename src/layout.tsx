import { Route, Routes } from "react-router";
import { Home } from "./pages";
import { Toaster } from "./components/ui/sonner";

const Layout = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="*" element={<div>404 Not Found</div>} />
        <Toaster/>
      </Routes>
    </>
  );
};

export default Layout;
