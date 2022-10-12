import { lazy, createResource } from "solid-js";
import { Routes, Route, Outlet, useNavigate } from "solid-app-router";

// import { userStore, logout } from "./userStore";

import Home from "./Home";
import Login from "./Login";
import NotFound from "./NotFound";

const Admin = lazy(() => import("./admin/Admin"));
const Staff = lazy(() => import("./admin/Staff"));
const AdminProfessionals = lazy(() => import("./admin/Professionals"));
const AdminProfessional = lazy(() => import("./admin/Professional"));
const AdminCustomers = lazy(() => import("./admin/Customers"));
const AdminCustomer = lazy(() => import("./admin/Customer"));
const AppointmentRequests = lazy(() => import("./admin/AppointmentRequests"));
const Appointments = lazy(() => import("./Appointments"));

const Customer = lazy(() => import("./customer/Customer"));
const Professional = lazy(() => import("./professional/Professional"));

import {
  AdminData,
  CustomersData,
  ProfessionalsData,
  StaffData,
  CustomerData,
  ProfessionalData,
  AppointmentData,
} from "./lib/resources";

import { s } from "./styles";
import Button from "./shared/Button";

export default function Router() {
  const navigate = useNavigate();

  const Layout = () => (
    <div>
      <header style={s.header}>
        <div>🌺</div>
        <a href="/login">
          <Button kind="logout" />
        </a>
      </header>

      <Outlet />
    </div>
  );

  return (
    <Routes>
      <Route path="/" component={Home} />

      <Route path="/login" component={Login} />

      <Route path="/admin" component={Layout}>
        <Route path="/" component={Admin} data={AdminData} />
        <Route path="/customers" component={AdminCustomers} data={CustomersData} />
        <Route path="/customers/:id" component={AdminCustomer} data={CustomerData} />
        <Route path="/professionals" component={AdminProfessionals} data={ProfessionalsData} />
        <Route path="/professionals/:id" component={AdminProfessional} data={ProfessionalData} />
        <Route path="/staff" component={Staff} data={StaffData} />
        <Route path="/requests" component={AppointmentRequests} />
        <Route path="/appointments" component={Appointments} />
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

//This won't work the way you'd expect
{
  /* <Route path="/users" component={Users}>
  <Route path="/:id" component={User} />
</Route>

//This works
<Route path="/users" component={Users} />
<Route path="/users/:id" component={User} />

//This also works
<Route path="/users">
  <Route path="/" component={Users} />
  <Route path="/:id" component={User} />
</Route> */
}
