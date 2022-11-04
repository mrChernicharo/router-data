import { createEffect, createMemo, createSignal, onMount } from "solid-js";
import { useRouteData, Link } from "solid-app-router";
import { createQuery } from "@tanstack/solid-query";
import { supabase } from "./lib/supabaseClient";
import { translateError } from "./lib/translations";

import { AiOutlineArrowLeft, AiFillLock } from "solid-icons/ai";

import { addToast, ToastContainer } from "./shared/Toast";

import Header from "./shared/Header";
import { createUser } from "./lib/mutationFuncs";
import Loading from "./shared/Loading";

export default function Signup() {
  let emailInputRef;
  let passwordInputRef;
  const [email, setEmail] = createSignal("felipe.chernicharo@gmail.com");
  const [password, setPassword] = createSignal("123123");
  const [isLoading, setIsLoading] = createSignal(false);

  const isDisabled = createMemo(() => !email() || !password() || (emailInputRef && !emailInputRef.validity.valid));

  // const registerMutation = createMutation(["staff"], person => insertProfessional(person));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!emailInputRef?.validity.valid || !passwordInputRef.value) return;

    setIsLoading(true);

    const credentials = { email: email(), password: password() };

    const { data: authData, error: authErr } = await supabase.auth.signUp(credentials);
    if (authErr) {
      setIsLoading(false);
      console.log({ authErr });
      return addToast({ message: translateError(authErr.message), status: "danger" });
    }

    credentials.auth_id = authData.user.id;
    const res = await createUser(credentials);

    setIsLoading(false);

    console.log({ res });

    if (res?.code) {
      return addToast({
        message: res?.code ? translateError(res?.message) : "Erro ao criar sua conta",
        status: "danger",
        duration: 4000,
      });
    }

    addToast({
      title: "Conta Criada!",
      message: "Enviamos um email pra você! Abre lá e clica no link para concluir seu cadastro",
      status: "success",
      duration: 5000,
    });
  }

  return (
    <div>
      {/* <Header /> */}
      {/* <ToastContainer /> */}

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

            <div class="pt-6">
              <button disabled={isDisabled()} class="btn btn-primary relative w-full">
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <AiFillLock class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                <div class="flex items-center">
                  <span>Criar conta</span> {isLoading() && <Loading small classes="ml-2" />}
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
