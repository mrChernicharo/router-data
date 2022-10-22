import { createEffect, createMemo, createSignal, onMount } from "solid-js";
import { useRouteData, Link } from "solid-app-router";
import { createQuery } from "@tanstack/solid-query";
import { fetchLoginFakeData } from "./lib/fetchFuncs";
import { supabase } from "./lib/supabaseClient";
import { translateError } from "./lib/helpers";

import { AiOutlineArrowLeft, AiFillLock } from "solid-icons/ai";

import { addToast, ToastContainer } from "./shared/ToastContainer";

import Header from "./shared/Header";

export default function Signup() {
  let emailInputRef;
  let passwordInputRef;
  let usernameInputRef;
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [username, setUsername] = createSignal("");

  const isDisabled = createMemo(
    () => !email() || !password() || !username() || !emailInputRef.validity.valid
  );

  async function handleSubmit(e) {
    e.preventDefault();
    const credentials = { email: email(), password: password(), username: username() };
    console.log(credentials);
    if (!emailInputRef.validity.valid || !passwordInputRef.value) return;

    const { data, error } = await supabase.auth.signUp(credentials);

    if (error) addToast({ message: translateError(error.message), status: "danger", duration: 3000 });

    console.log({ data, error });

    // alert("cheque seu email");
  }

  return (
    <div>
      <Header />
      <ToastContainer />

      <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
          <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Criar conta</h2>
            <p class="mt-2 text-center text-sm text-gray-600">
              já tem conta?{" "}
              <Link href="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
                fazer login
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
            <div class="rounded-md shadow-sm">
              <div>
                <label for="username" class="text-sm">
                  Como devemos de chamar?
                </label>
                <input
                  ref={usernameInputRef}
                  id="username"
                  name="username"
                  type="text"
                  // use:formControl={[email, setEmail]}
                  value={username()}
                  onInput={e => setUsername(e.currentTarget.value)}
                  required
                  class="input input-bordered input-primary w-full max-w-md bg-white"
                  placeholder="Nome"
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
                Criar conta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
