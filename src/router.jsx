import { lazy, createEffect, onMount, batch } from "solid-js";
import { supabase } from "./lib/supabaseClient";
import { createQuery } from "@tanstack/solid-query";
import { Routes, Route } from "solid-app-router";

import Home from "./Home";
import NotFound from "./NotFound";
import Layout from "./shared/Layout";
import { setUserStore, userStore } from "./lib/userStore";
import { fetchAuthState } from "./lib/fetchFuncs";

const Login = lazy(() => import("./Login"));
const Signup = lazy(() => import("./Signup"));

const Admin = lazy(() => import("./admin"));
const Staff = lazy(() => import("./admin/Staff"));
const Professionals = lazy(() => import("./admin/Professionals"));
const Customers = lazy(() => import("./admin/Customers"));
const AppointmentRequests = lazy(() => import("./admin/Requests"));

const Customer = lazy(() => import("./customer/Customer"));
const Professional = lazy(() => import("./professional/Professional"));

export default function Router() {
  onMount(async () => {
    const { session } = await fetchAuthState();
    setUserStore("session", session);

    supabase.auth.onAuthStateChange((e, session) => {
      if (session) {
        setUserStore("session", session);
      } else {
        setUserStore("session", null);
      }
    });
  });

  return (
    <Routes>
      <Route path="/" component={Home} />

      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />

      <Route path="/admin" component={Layout}>
        <Route path="/" component={Admin} />
        <Route path="/customers" component={Customers} />
        <Route path="/customers/:id" component={Customer} />
        <Route path="/professionals" component={Professionals} />
        <Route path="/professionals/:id" component={Professional} />
        <Route path="/staff" component={Staff} />
        <Route path="/requests" component={AppointmentRequests} />
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
