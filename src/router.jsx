import { lazy, createEffect, onMount, batch } from "solid-js";
import { supabase } from "./lib/supabaseClient";
import { createQuery, useQueryClient } from "@tanstack/solid-query";
import { Routes, Route, Navigate, Outlet, useNavigate, useLocation } from "solid-app-router";

import { getStorageData, setStorageData, DBDateToDateStr } from "./lib/helpers";

import Home from "./Home";
import NotFound from "./NotFound";
import Layout from "./shared/Layout";
import { setUserStore, userStore } from "./lib/userStore";
import { fetchAuthState } from "./lib/fetchFuncs";
import { addToast } from "./shared/Toast";
import CustomerRegisterForm from "./customer/CustomerRegisterForm";

const Login = lazy(() => import("./Login"));
const Signup = lazy(() => import("./Signup"));

const Admin = lazy(() => import("./admin"));
const Staff = lazy(() => import("./admin/Staff"));
const Professionals = lazy(() => import("./admin/Professionals"));
const Customers = lazy(() => import("./admin/Customers"));
const AppointmentRequests = lazy(() => import("./admin/Requests"));

const Customer = lazy(() => import("./customer/Customer"));
const Professional = lazy(() => import("./professional/Professional"));

const AuthStateHandler = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const updateAuthState = async session => {
    /// THIS IS THE ONLY PLACE WE'LL EVER TOUCH session.user.

    console.log("updateAuthState");

    if (!session) {
      setUserStore("session", null);
      setUserStore("user", null);
      return;
    }

    const { data: staffData, error } = await supabase
      .from("staff")
      .select("*")
      .eq("email", session.user.email);
    const staff = staffData[0] ?? null;

    let personData;
    let table = staff ? "professionals" : "customers";

    const { data: personD, error: err } = await supabase
      .from(table)
      .select("*")
      .eq("email", session.user.email);
    personData = personD[0];

    const user = {
      ...session.user,
      ...personData,
      ...(personData?.date_of_birth && { date_of_birth: DBDateToDateStr(personData.date_of_birth) }),
      category: staff?.category ?? "customer",
    };
    delete session.user; // session.user is deleted to prevent us from maintaining the same user data nested withing session

    setUserStore("user", user);
    setUserStore("session", session);

    queryClient.cancelQueries({ queryKey: ["admin"] });

    const redirects = {
      admin: "/admin",
      customer: `/customer/${user.id}`,
      professional: `/professional/${user.id}`,
    };

    navigate(redirects[user.category]);
  };

  onMount(async () => {
    const { session } = await fetchAuthState();
    updateAuthState(session);
    supabase.auth.onAuthStateChange(async (e, session) => updateAuthState(session));
  });

  return <></>;
};

export default function Router() {
  const Protected = () => {
    return (
      <Show when={userStore.user?.id} fallback={<Navigate href="/login" />}>
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
          <Route path="/:id/form" component={CustomerRegisterForm} />
        </Route>

        <Route path="/professional" component={Protected}>
          <Route path="/:id" component={Professional} />
        </Route>

        <Route path="/**" component={NotFound} />
      </Route>

      <AuthStateHandler />
    </Routes>
  );
}
