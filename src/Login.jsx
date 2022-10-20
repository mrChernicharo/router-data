import { createEffect, createSignal, onMount } from "solid-js";
import { useRouteData, Link } from "solid-app-router";
import { createQuery } from "@tanstack/solid-query";
import { fetchLoginFakeData } from "./lib/fetchFuncs";

import Button from "./shared/Button";
import { addToast } from "./shared/ToastContainer";

export default function Login() {
  const [cId, setCId] = createSignal("");
  const [pId, setPId] = createSignal("");
  // const data = useRouteData();
  const query = createQuery(() => ["admin"], fetchLoginFakeData, {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    cacheTime: 0,
    staleTime: 0,
  });

  createEffect(() => {
    if (!query.isLoading && query?.data?.customers && query?.data?.professionals) {
      setPId(query?.data.professionals[0].id);
      setCId(query?.data.customers[0].id);
    } else {
      setPId("");
      setCId("");
    }
  });

  return (
    <div>
      <h1>Login</h1>
      <div>
        <Link href="/">
          <Button kind="light" type="button" text="👈🏽" />
        </Link>
      </div>

      <nav>
        <Link href="/admin">admin </Link>| <Link href={`/customer/${cId()}`}>customer </Link>|{" "}
        <Link href={`/professional/${pId()}`}>professional </Link>
      </nav>

      <div>
        <Show when={!query.isLoading} fallback={<div>Loading...</div>}>
          <Show when={query.data?.customers}>
            <select value={query.data?.customers[0].id} onChange={e => setCId(e.currentTarget.value)}>
              <For each={query.data?.customers}>
                {customer => <option value={customer.id}>{customer.name}</option>}
              </For>
            </select>
          </Show>

          <Show when={query.data?.professionals}>
            <select value={query?.data?.professionals[0].id} onChange={e => setPId(e.currentTarget.value)}>
              <For each={query.data?.professionals}>
                {professional => <option value={professional.id}>{professional.name}</option>}
              </For>
            </select>
          </Show>
        </Show>
      </div>

      {/* <pre>{JSON.stringify(query, null, 2)}</pre> */}
    </div>
  );
}
