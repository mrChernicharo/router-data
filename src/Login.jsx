import { createEffect, createSignal, onMount, createMemo } from "solid-js";
import { useRouteData, Link, useNavigate } from "solid-app-router";
import { createQuery } from "@tanstack/solid-query";
import { fetchLoginFakeData } from "./lib/fetchFuncs";
import { supabase } from "./lib/supabaseClient";
import { translateError } from "./lib/helpers";

import { AiOutlineArrowLeft, AiFillLock } from "solid-icons/ai";

import { addToast, ToastContainer } from "./shared/Toast";

import Header from "./shared/Header";
import { userStore } from "./lib/userStore";
import { FiLock } from "solid-icons/fi";

export default function Login() {
  const navigate = useNavigate();

  let emailInputRef;
  let passwordInputRef;

  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

  const isDisabled = createMemo(() => !email() || !password() || !emailInputRef.validity.valid);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!emailInputRef.validity.valid || !passwordInputRef.value) return;

    const { data, error } = await supabase.auth.signInWithPassword({ email: email(), password: password() });
    if (error) {
      return addToast({ message: translateError(error.message), status: "danger", duration: 3000 });
    }

    addToast({ message: "boas vindas!", status: "success", duration: 2000 });
  }

  return (
    <div>
      {/* <Header /> */}
      {/* <ToastContainer /> */}

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
              <button disabled={isDisabled()} class="btn btn-primary relative w-full">
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <AiFillLock
                    class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Entrar
              </button>
            </div>
          </form>
        </div>

        {/* <button class="btn" type="button" onClick={async e => await supabase.auth.signOut()}>
          logout
        </button> */}
      </div>

      {/* <div class="flex justify-center my-6">
        <Show when={!query.isLoading} fallback={<div>Loading...</div>}>
          <Show when={query.data?.customers}>
            <select
              class="capitalize"
              value={query.data?.customers.length && query.data?.customers[0].id}
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
              value={query.data?.professionals.length && query.data?.professionals[0].id}
              onChange={e => setPId(e.currentTarget.value)}
            >
              <For each={query.data?.professionals}>
                {professional => <option value={professional.id}>{professional.name}</option>}
              </For>
            </select>
          </Show>
        </Show>
      </div> */}

      {/* <div class="flex justify-between px-24 capitalize">
        <Link href="/admin">admin </Link>| <Link href={`/customer/${cId()}`}>cliente </Link>|{" "}
        <Link href={`/professional/${pId()}`}>profissional </Link>
      </div> */}
    </div>
  );
}
