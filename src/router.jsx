import { lazy, createEffect, onMount, batch } from "solid-js";
import { supabase } from "./lib/supabaseClient";
import { createQuery } from "@tanstack/solid-query";
import { Routes, Route } from "solid-app-router";

import Home from "./Home";
import NotFound from "./NotFound";
import Layout from "./shared/Layout";
import { setUserStore, userStore } from "./lib/userStore";
import { unwrap } from "solid-js/store";

const Login = lazy(() => import("./Login"));
const Signup = lazy(() => import("./Signup"));

const Admin = lazy(() => import("./admin"));
const Staff = lazy(() => import("./admin/Staff"));
const Professionals = lazy(() => import("./admin/Professionals"));
const Customers = lazy(() => import("./admin/Customers"));
const AppointmentRequests = lazy(() => import("./admin/Requests"));

const Customer = lazy(() => import("./customer/Customer"));
const Professional = lazy(() => import("./professional/Professional"));

const fetchAuthState = async () => {
  const { data: authData, error } = await supabase.auth.getSession();
  // setUserStore(prev => ({ session: authData?.session, user: authData?.session.user ?? null }));
  // setUserStore("user", authData?.session.user ?? null);
  // console.log("App", { session: authData.session, user: authData.session?.user ?? null });
  return authData;
};

export default function Router() {
  const query = createQuery(() => ["auth"], fetchAuthState);
  // const updateUser = session => {
  //   setUserStore("session", session);
  //   setUserStore("user", session?.user ?? null);
  // };

  onMount(() => {
    supabase.auth.onAuthStateChange((e, session) => {
      query.refetch();
    });
  });

  createEffect(() => {
    console.log(query.data, userStore());
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
