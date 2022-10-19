import { lazy, createResource, createEffect } from "solid-js";
import { Routes, Route, Outlet, useNavigate } from "solid-app-router";

import { s } from "./lib/styles";
import Button from "./shared/Button";
import { ToastContainer } from "./shared/ToastContainer";
import Header from "./shared/Header";

// import { userStore, logout } from "./userStore";

import Home from "./Home";
import NotFound from "./NotFound";
import { useQueryClient } from "@tanstack/solid-query";

const Login = lazy(() => import("./Login"));
const Admin = lazy(() => import("./admin/Admin"));
const Staff = lazy(() => import("./admin/Staff"));
const Professionals = lazy(() => import("./admin/Professionals"));
const Customers = lazy(() => import("./admin/Customers"));
const AppointmentRequests = lazy(() => import("./admin/Requests"));

const Customer = lazy(() => import("./customer/Customer"));
const Professional = lazy(() => import("./professional/Professional"));

export default function Router() {
  const queryClient = useQueryClient();

  const Layout = () => (
    <div>
      <ToastContainer />

      <Header />

      <Outlet />
    </div>
  );

  createEffect(() => {
    console.log({ ...queryClient });
    console.log({ cache: queryClient.getQueryCache(), map: queryClient.getQueryCache().findAll() });
  });

  return (
    <Routes>
      <Route path="/" component={Home} />

      <Route path="/login" component={Login} />

      <Route path="/admin" component={Layout}>
        <Route path="/" component={Admin} />
        <Route path="/customers" component={Customers} />
        <Route path="/customers/:id" component={Customer} />
        <Route path="/professionals" component={Professionals} />
        <Route path="/professionals/:id" component={Professional} />
        <Route path="/staff" component={Staff} />
        <Route path="/requests" component={AppointmentRequests} />
        {/* <Route path="/appointments" component={Appointments} /> */}
      </Route>

      <Route path="/customer" component={Layout}>
        <Route path="/:id" component={Customer} />
      </Route>

      <Route path="/professional" component={Layout}>
        <Route path="/:id" component={Professional} />
      </Route>

      <Route path="/**" component={NotFound} />
    </Routes>
  );
}
