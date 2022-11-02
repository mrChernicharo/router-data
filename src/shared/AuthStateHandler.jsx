import { lazy, createEffect, onMount, batch } from "solid-js";
import { supabase } from "../lib/supabaseClient";
import { createQuery, useQueryClient } from "@tanstack/solid-query";
import { Routes, Route, Navigate, Outlet, useNavigate, useLocation } from "solid-app-router";

import { getStorageData, setStorageData, DBDateToDateStr } from "../lib/helpers";

import { setUserStore, userStore } from "../lib/userStore";
import { fetchAuthState } from "../lib/fetchFuncs";
import { addToast } from "./Toast";

export default function AuthStateHandler() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const updateAuthState = async session => {
    /// THIS IS THE ONLY PLACE WE'LL EVER TOUCH session.user.

    console.log("updateAuthState", { session });

    if (!session) {
      setUserStore("session", null);
      setUserStore("user", null);
      navigate("/login");
      return;
    }

    const { data: staffData, error } = await supabase.from("staff").select("*").eq("email", session.user.email);
    const staff = staffData[0] ?? null;

    let personData;
    let table = staff ? "professionals" : "customers";

    const { data: personD, error: err } = await supabase.from(table).select("*").eq("email", session.user.email);
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

    console.log({ personData, personD, user, session });
    // const lastVisited = getStorageData("last-visited");
    // console.log({ lastVisited });

    const redirects = {
      admin: "/admin",
      customer: `/customer/${user.id}`,
      professional: `/professional/${user.id}`,
    };

    // navigate(lastVisited ?? redirects[user.category]);
    navigate(redirects[user.category]);
  };

  onMount(async () => {
    const { session } = await fetchAuthState();
    updateAuthState(session);
    supabase.auth.onAuthStateChange(async (e, session) => updateAuthState(session));
  });

  return null;
}
