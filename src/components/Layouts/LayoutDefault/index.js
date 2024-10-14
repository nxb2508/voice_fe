import { Outlet } from "react-router-dom";
import Header from "./Header";

function LayoutDefault() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}

export default LayoutDefault;
