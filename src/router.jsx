import { createResource } from "solid-js";
import { Routes, Route, Outlet, useNavigate } from "solid-app-router";

import Login from "./Login";

const Admin = lazy(() => import("./Admin"));
import Staff from "./Staff";
import Customer from "./Customer";
import Professional from "./Professional";
import AppointmentRequests from "./AppointmentRequests";
import Appointments from "./Appointments";
import Customers from "./Customers";
import Professionals from "./Professionals";
import NotFound from "./NotFound";

import { s } from "./styles";
import Button from "./Button";
import { userStore, logout } from "./userStore";
import {
  fetchAdminData,
  fetchAdminCountsData,
  fetchCustomersData,
  fetchProfessionalsData,
  fetchStaffData,
} from "./fetchFuncs";
import { lazy } from "solid-js";

export default function Router() {
  const navigate = useNavigate();

  function AdminData({ params, location, navigate, data }) {
    const [adminData] = createResource(fetchAdminCountsData);
    return adminData;
  }

  function CustomersData({ params, location, navigate, data }) {
    console.log({ params, location, navigate, data });
    const [customersData] = createResource(fetchCustomersData);
    return customersData;
  }

  function ProfessionalsData({ params, location, navigate, data }) {
    console.log({ params, location, navigate, data });
    const [professionalsData] = createResource(fetchProfessionalsData);
    return professionalsData;
  }

  function StaffData({ params, location, navigate, data }) {
    console.log({ params, location, navigate, data });
    const [staffData] = createResource(fetchStaffData);
    return staffData;
  }

  const Layout = () => (
    <div>
      <header style={s.header}>
        <div>🌺 Laços</div>
      </header>

      <Outlet />
    </div>
  );

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <h1>Hello Laços</h1>
            <a href="/login" class="nav-link">
              Login
            </a>
          </div>
        }
      />

      <Route path="/login" component={Login} />

      <Route path="/admin" component={Layout}>
        <Route path="/" component={Admin} data={AdminData} />
        <Route path="/customers" component={Customers} data={CustomersData} />
        <Route path="/professionals" component={Professionals} data={ProfessionalsData} />
        <Route path="/appointments" component={Appointments} />
        <Route path="/requests" component={AppointmentRequests} />
        <Route path="/staff" component={Staff} data={StaffData} />
      </Route>

      <Route path="/customer" component={Layout}>
        <Route path="/" component={Customer} />
      </Route>

      <Route path="/professional" component={Layout}>
        <Route path="/" component={Professional} />
      </Route>

      <Route path="/**" component={NotFound} />
    </Routes>
  );
}
