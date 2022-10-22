import { createEffect, createSignal, onMount } from "solid-js";
import { useRouteData, Link } from "solid-app-router";
import { createQuery } from "@tanstack/solid-query";
import { fetchLoginFakeData } from "./lib/fetchFuncs";

import { AiOutlineArrowLeft, AiFillLock } from "solid-icons/ai";

import { addToast } from "./shared/ToastContainer";
import Header from "./shared/Header";

export default function Login() {
  let emailInputRef;
  let passwordInputRef;
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

  /////////////////************************//////////////////************************/
  const [cId, setCId] = createSignal("");
  const [pId, setPId] = createSignal("");
  // const data = useRouteData();
  const query = createQuery(() => ["admin"], fetchLoginFakeData, {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    // cacheTime: 0,
    // staleTime: 0,
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
  //////////////////////////////////************************//////////////////************************/

  // const navigate = useNavigate();
  // const [store, { emailLogin }] = useAuthContext();

  async function handleSubmit(e) {
    e.preventDefault();
    console.log({ email: email(), password: password() });
    if (!emailInputRef.validity.valid || !passwordInputRef.value) return;

    alert("cheque seu email");
  }

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
          <form class="mt-8" onSubmit={handleSubmit}>
            <div class="rounded-md shadow-sm -space-y-px">
              <div>
                <label for="email-address" class="text-sm">
                  Email
                </label>
                <input
                  ref={emailInputRef}
                  id="email-address"
                  name="email"
                  type="email"
                  // use:formControl={[email, setEmail]}
                  value={email()}
                  onInput={e => setEmail(e.currentTarget.value)}
                  required
                  class="input input-bordered input-primary w-full max-w-md bg-white"
                  placeholder="Endereço de email"
                />
              </div>
            </div>
            <div class="rounded-md shadow-sm">
              <div>
                <label for="password" class="text-sm">
                  Senha
                </label>
                <input
                  ref={passwordInputRef}
                  id="password"
                  name="password"
                  type="text"
                  // use:formControl={[email, setEmail]}
                  value={password()}
                  onInput={e => setPassword(e.currentTarget.value)}
                  required
                  class="input input-bordered input-primary w-full max-w-md bg-white"
                  placeholder="Senha"
                />
              </div>
            </div>
            <div class="pt-6">
              <button disabled={!email() || !password()} class="btn btn-primary relative w-full">
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
            <select
              class="capitalize"
              value={query.data?.customers[0].id}
              onChange={e => setCId(e.currentTarget.value)}
            >
              <For each={query.data?.customers}>
                {customer => <option value={customer.id}>{customer.name}</option>}
              </For>
            </select>
          </Show>

          <Show when={query.data?.professionals}>
            <select
              class="capitalize"
              value={query?.data?.professionals[0].id}
              onChange={e => setPId(e.currentTarget.value)}
            >
              <For each={query.data?.professionals}>
                {professional => <option value={professional.id}>{professional.name}</option>}
              </For>
            </select>
          </Show>
        </Show>
      </div>

      <div class="flex justify-between px-24 capitalize">
        <Link href="/admin">admin </Link>| <Link href={`/customer/${cId()}`}>cliente </Link>|{" "}
        <Link href={`/professional/${pId()}`}>profissional </Link>
      </div>
    </div>
  );
}
