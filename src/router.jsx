import { lazy, createResource } from "solid-js";
import { Routes, Route, Outlet, useNavigate } from "solid-app-router";

// import { userStore, logout } from "./userStore";

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
  fetchAdminData,
  fetchAdminCountsData,
  fetchCustomersData,
  fetchCustomerData,
  fetchProfessionalsData,
  fetchProfessionalData,
  fetchAppointmentsData,
  fetchAppointmentData,
  fetchStaffData,
} from "./lib/fetchFuncs";

import { s } from "./styles";
import Button from "./shared/Button";

export default function Router() {
  const navigate = useNavigate();

  function AdminData({ params, location, navigate, data }) {
    const [adminData] = createResource(fetchAdminCountsData);
    return adminData;
  }

  function CustomersData({ params, location, navigate, data }) {
    const [customersData] = createResource(fetchCustomersData);
    return customersData;
  }

  function ProfessionalsData({ params, location, navigate, data }) {
    const [professionalsData] = createResource(fetchProfessionalsData);
    return professionalsData;
  }

  function StaffData({ params, location, navigate, data }) {
    const [staffData] = createResource(fetchStaffData);
    return staffData;
  }

  function CustomerData({ params, location, navigate, data }) {
    const [customerData] = createResource(() => fetchCustomerData(params.id));
    return customerData;
  }

  function ProfessionalData({ params, location, navigate, data }) {
    const [professionalData] = createResource(() => fetchProfessionalData(params.id));
    return professionalData;
  }

  function AppointmentData({ params, location, navigate, data }) {
    const [appointmentData] = createResource(() => fetchAppointmentData(params.id));
    return appointmentData;
  }

  const Layout = () => (
    <div>
      <header style={s.header}>
        <div>🌺 Laços</div>
        <a href="/login">
          <Button kind="logout" />
        </a>
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
