import { lazy, createEffect, onMount, batch, createSignal } from "solid-js";
import { supabase } from "./lib/supabaseClient";
import { Routes, Route, Navigate, Outlet, useNavigate, useLocation } from "solid-app-router";

import Home from "./Home";
import NotFound from "./NotFound";
import Layout from "./shared/Layout";
import { userStore } from "./lib/userStore";
import Loading from "./shared/Loading";
import AppointmentsHistory from "./shared/AppointmentsHIstory";
import Patients from "./professional/Patients";

import CustomerCalendar from "./customer/CustomerCalendar";
import ProfessionalCalendar from "./professional/ProfessionalCalendar";

const Login = lazy(() => import("./Login"));
const Signup = lazy(() => import("./Signup"));

const Admin = lazy(() => import("./admin"));
const Staff = lazy(() => import("./admin/Staff"));
const Professionals = lazy(() => import("./admin/Professionals"));
const Customers = lazy(() => import("./admin/Customers"));
const AppointmentRequests = lazy(() => import("./admin/Requests"));

const Customer = lazy(() => import("./customer/Customer"));
const RegisterForm = lazy(() => import("./shared/RegisterForm"));

const Professional = lazy(() => import("./professional/Professional"));

export default function Router() {
  const Protected = () => {
    return (
      <Show when={userStore.user?.id} fallback={userStore.user ? <Loading /> : <Navigate href="/login" />}>
        <Outlet />
      </Show>
    );
  };

  return (
    <Routes>
      <Route path="" component={Layout}>
        <Route path="/" component={Home} />

        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />

        <Route path="/admin" component={Protected}>
          <Route path="/" component={Admin} />
          <Route path="/customers" component={Customers} />
          <Route path="/customers/:id" component={Customer} />
          <Route path="/professionals" component={Professionals} />
          <Route path="/professionals/:id" component={Professional} />
          <Route path="/staff" component={Staff} />
          <Route path="/requests" component={AppointmentRequests} />
        </Route>

        <Route path="/customer" component={Protected}>
          <Route path="/:id" component={Customer} />
          <Route path="/:id/form" component={RegisterForm} />
          <Route path="/:id/history" component={AppointmentsHistory} />
          <Route path="/:id/calendar" component={CustomerCalendar} />
        </Route>

        <Route path="/professional" component={Protected}>
          <Route path="/:id" component={Professional} />
          <Route path="/:id/form" component={RegisterForm} />
          <Route path="/:id/history" component={AppointmentsHistory} />
          <Route path="/:id/patients" component={Patients} />
          <Route path="/:id/calendar" component={ProfessionalCalendar} />
        </Route>

        <Route path="/**" component={NotFound} />
      </Route>
    </Routes>
  );
}
