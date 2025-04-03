import { Route, Routes } from "react-router";
import { Home } from "./pages";

const Layout = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
};

export default Layout;
