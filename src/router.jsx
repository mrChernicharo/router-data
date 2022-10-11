import { Routes, Route, Outlet, useNavigate } from "solid-app-router";
import Admin from "./Admin";
import Professional from "./Professional";
import Customer from "./Customer";
import NotFound from "./NotFound";
import Professionals from "./Professionals";
import Customers from "./Customers";
import Appointments from "./Appointments";
import AppointmentRequests from "./AppointmentRequests";

import Login from "./Login";
import Button from "./Button";

import { s } from "./styles";
import { userStore, logout } from "./userStore";
import Staff from "./Staff";

export default function Router() {
  const navigate = useNavigate();

  //   const userExists = () => userStore.user_id || userStore.id;

  const Layout = () => (
    <div>
      <header style={s.header}>
        <div>🌺 Laços</div>
        {/* {userExists() && (
          <>
            <div>{userStore.name}</div>
            <Button
              kind="logout"
              onClick={(e) => {
                logout();
                navigate("/login");
              }}
            />
          </>
        )} */}
      </header>

      <Outlet />
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<h1>Hello Laços</h1>} />

      <Route path="/login" component={Login} />

      <Route path="/admin" component={Layout}>
        <Route path="/" component={Admin} />
        <Route path="/customers" component={Customers} />
        <Route path="/professionals" component={Professionals} />
        <Route path="/appointments" component={Appointments} />
        <Route path="/requests" component={AppointmentRequests} />
        <Route path="/staff" component={Staff} />
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
