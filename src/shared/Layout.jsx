import { Outlet } from "solid-app-router";

// import { s } from "./lib/styles";
// import Button from "./shared/Button";
import { ToastContainer } from "./ToastContainer";
import Header from "./Header";

export default function Layout() {
  return (
    <div>
      <ToastContainer />

      <Header />

      <Outlet />
    </div>
  );
}
