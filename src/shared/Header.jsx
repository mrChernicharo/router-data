import { s } from "../lib/styles";
// import { supabase } from "../lib/supabaseClient";
import { FiChevronLeft } from "solid-icons/fi";
import { APP_NAME } from "../lib/constants";

import { useLocation, Link } from "solid-app-router";
import { createEffect, createMemo, createSignal, onMount, Show } from "solid-js";
import { userStore } from "../lib/userStore";
import { useQueryClient } from "@tanstack/solid-query";

export default function Header(props) {
  const location = useLocation();
  const [pageTitle, setPageTitle] = createSignal("Admin");
  const [backLink, setBackLink] = createSignal("/login");

  createEffect(() => {
    // console.log(location.pathname);

    switch (true) {
      case /\/login/.test(location.pathname):
        setPageTitle("Login");
        setBackLink("/");
        break;
      case /\/signup/.test(location.pathname):
        setPageTitle("Criar Conta");
        setBackLink("/");
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

  const pagesWithNoBackLink = createMemo(() => {
    return [
      APP_NAME,
      "Admin",
      userStore?.user?.category === "customer" && "Cliente",
      userStore?.user?.category === "professional" && "Profissional",
    ];
  });

  const showBackLink = createMemo(() => !pagesWithNoBackLink().includes(pageTitle()));

  // createEffect(() => {

  // })

  return (
    <header class="bg-white">
      <div class="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">{pageTitle()}</h1>

        <Show when={userStore.user}>
          <div>{userStore.user.category === "admin" ? userStore.user.email : userStore.user.name}</div>
          <div>{userStore.user.category}</div>
        </Show>

        {/* {queryClient.getQueryData(() => ["auth"]) && <div>{email()}</div>} */}

        <Show when={showBackLink()}>
          <Link href={backLink()}>
            <button>
              <FiChevronLeft />
            </button>
          </Link>
        </Show>
      </div>

      {/* <pre class="text-xs">{JSON.stringify(userStore.user, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(pagesWithNoBackLink())}</pre> */}
    </header>
  );
}
