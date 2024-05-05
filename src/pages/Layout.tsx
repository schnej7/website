import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div id="APP">
        <Outlet />
      </div>
    </>
  )
};

export default Layout;
