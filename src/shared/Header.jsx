import { s } from "../lib/styles";
// import { supabase } from "../lib/supabaseClient";
import { FiChevronLeft } from "solid-icons/fi";
import { APP_NAME } from "../lib/constants";

import { useLocation, Link } from "solid-app-router";
import { createEffect, createMemo, createSignal, onMount, Show } from "solid-js";
import { userStore } from "../lib/userStore";
import { useQueryClient } from "@tanstack/solid-query";
import { setStorageData } from "../lib/helpers";
import AuthStateHandler from "./AuthStateHandler";

export default function Header(props) {
  const location = useLocation();
  const [pageTitle, setPageTitle] = createSignal("");
  const [backLink, setBackLink] = createSignal("/login");

  createEffect(() => {
    switch (true) {
      case /\/login/.test(location.pathname):
        setPageTitle("Login");
        setBackLink("/");
        break;
      case /\/signup/.test(location.pathname):
        setPageTitle("Criar Conta");
        setBackLink("/");
        break;
      case /\/customer\/.+\/form/.test(location.pathname):
        setPageTitle("Iniciar Tratamento");
        userStore?.user?.id && setBackLink(`/customer/${userStore?.user?.id}`);
        break;
      case /\/customer\/.+/.test(location.pathname):
        setPageTitle("Cliente");
        setBackLink("/login");
        break;
      case /\/professional\/.+/.test(location.pathname):
        setPageTitle("Profissional");
        setBackLink("/login");
        break;
      case /\/admin\/requests/.test(location.pathname):
        setPageTitle("Requisições");
        setBackLink("/admin");
        break;
      case /\/admin\/customers\/.+/.test(location.pathname):
        setPageTitle("Cliente");
        setBackLink("/admin/customers");
        break;
      case /\/admin\/professionals\/.+/.test(location.pathname):
        setPageTitle("Profissional");
        setBackLink("/admin/professionals");
        break;
      case /\/admin\/professionals/.test(location.pathname):
        setPageTitle("Profissionais");
        setBackLink("/admin");
        break;
      case /\/admin\/customers/.test(location.pathname):
        setPageTitle("Clientes");
        setBackLink("/admin");
        break;
      case /\/admin\/staff/.test(location.pathname):
        setPageTitle("Membros");
        setBackLink("/admin");
        break;
      case /\/admin/.test(location.pathname):
        setPageTitle("Admin");
        setBackLink("/login");
        break;
      default:
        setBackLink("/");
        setPageTitle(APP_NAME);
        break;
    }
  });

  // createEffect(() => {
  //   console.log("ROUTER LOG", location.pathname);
  // });

  const pagesWithNoBackLink = createMemo(() => {
    return [
      APP_NAME,
      "Admin",
      userStore?.user?.category === "customer" && "Cliente",
      userStore?.user?.category === "professional" && "Profissional",
    ];
  });

  const showBackLink = createMemo(() => !pagesWithNoBackLink().includes(pageTitle()));

  return (
    <header class="bg-white">
      <AuthStateHandler />

      <div class="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">{pageTitle()}</h1>

        <Show when={userStore.user}>
          <div>{userStore.user.category === "admin" ? userStore.user.email : userStore.user.first_name}</div>
          <div>{userStore.user.category}</div>
        </Show>

        <Show when={showBackLink()}>
          <Link href={backLink()}>
            <button>
              <FiChevronLeft />
            </button>
          </Link>
        </Show>
      </div>
      {/* {queryClient.getQueryData(() => ["auth"]) && <div>{email()}</div>} */}

      {/* <pre class="text-xs">{JSON.stringify(userStore.user, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(pagesWithNoBackLink())}</pre> */}
    </header>
  );
}
