import { createEffect, createSignal, onMount } from "solid-js";
import { useRouteData, Link } from "solid-app-router";
import { createQuery } from "@tanstack/solid-query";
import { fetchLoginFakeData } from "./lib/fetchFuncs";

import { AiOutlineArrowLeft, AiFillLock } from "solid-icons/ai";
import Button from "./shared/Button";
import { addToast } from "./shared/ToastContainer";
import Header from "./shared/Header";

export default function Login() {
  const [email, setEmail] = createSignal("");

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

  // const navigate = useNavigate();
  // const [store, { emailLogin }] = useAuthContext();

  return (
    <div>
      <Header />

      <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
          <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Logar na sua conta</h2>
            <p class="mt-2 text-center text-sm text-gray-600">
              Ou{" "}
              <Link href="/signup" class="font-medium text-indigo-600 hover:text-indigo-500">
                crie uma nova aqui mesmo
              </Link>
            </p>
          </div>
          <form class="mt-8 space-y-6">
            <input type="hidden" name="remember" />
            <div class="rounded-md shadow-sm -space-y-px">
              <div>
                <label for="email-address" class="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  // use:formControl={[email, setEmail]}
                  required
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>
            <div>
              <button
                type="button"
                disabled={!email()}
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={async e => {
                  const res = await emailLogin(email());
                  alert("cheque seu email");
                }}
              >
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <AiFillLock
                    class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="flex justify-center my-6">
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

      <div class="flex justify-between px-24">
        <Link href="/admin">admin </Link>| <Link href={`/customer/${cId()}`}>customer </Link>|{" "}
        <Link href={`/professional/${pId()}`}>professional </Link>
      </div>
    </div>
  );
}
