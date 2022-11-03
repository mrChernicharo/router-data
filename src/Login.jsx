import { createEffect, createSignal, onMount, createMemo } from "solid-js";
import { useRouteData, Link, useNavigate } from "solid-app-router";
import { createQuery } from "@tanstack/solid-query";
import { supabase } from "./lib/supabaseClient";
import { translateError } from "./lib/translations";

import { AiOutlineArrowLeft, AiFillLock } from "solid-icons/ai";

import { addToast, ToastContainer } from "./shared/Toast";

import Header from "./shared/Header";
import Loading from "./shared/Loading";
import { userStore } from "./lib/userStore";
import { FiLock } from "solid-icons/fi";

export default function Login() {
  const navigate = useNavigate();

  let emailInputRef;
  let passwordInputRef;

  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [isLoading, setIsLoading] = createSignal("");

  const isDisabled = createMemo(() => !email() || !password() || !emailInputRef.validity.valid);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!emailInputRef.validity.valid || !passwordInputRef.value) return;

    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email: email(), password: password() });
    if (error) {
      addToast({ message: translateError(error.message), status: "danger", duration: 3000 });
      return setIsLoading(false);
    }

    addToast({ message: "boas vindas!", status: "success", duration: 2000 });
    return setIsLoading(false);
  }

  return (
    <div>
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
              <button disabled={isDisabled()} class="btn btn-primary relative w-full flex justify-between">
                <span class="">
                  <AiFillLock class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                Entrar
                {isLoading() ? <Loading color="#fff" /> : <div class="h-5 w-8"></div>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
