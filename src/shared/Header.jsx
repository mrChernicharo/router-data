import { s } from "../lib/styles";
import { FaSolidArrowLeft, FaSolidChevronLeft } from "solid-icons/fa";
import { APP_NAME } from "../lib/constants";

import { useLocation, Link } from "solid-app-router";
import { createEffect, createSignal } from "solid-js";

export default function Header(props) {
  const location = useLocation();
  const [pageTitle, setPageTitle] = createSignal("Admin");
  const [backLink, setBackLink] = createSignal("/login");

  createEffect(() => {
    console.log(location.pathname);

    switch (true) {
      case /\/login/.test(location.pathname):
        setPageTitle("Login");
        setBackLink("/");
        break;
      case /\/customer\/.+/.test(location.pathname):
        setPageTitle("Customer");
        setBackLink("/login");
        break;
      case /\/professional\/.+/.test(location.pathname):
        setPageTitle("Professional");
        setBackLink("/login");
        break;
      case /\/admin\/requests/.test(location.pathname):
        setPageTitle("Requests");
        setBackLink("/admin");
        break;
      case /\/admin\/customers\/.+/.test(location.pathname):
        setPageTitle("Customer");
        setBackLink("/admin/customers");
        break;
      case /\/admin\/professionals\/.+/.test(location.pathname):
        setPageTitle("Professional");
        setBackLink("/admin/professionals");
        break;
      case /\/admin\/professionals/.test(location.pathname):
        setPageTitle("Professionals");
        setBackLink("/admin");
        break;
      case /\/admin\/customers/.test(location.pathname):
        setPageTitle("Customers");
        setBackLink("/admin");
        break;
      case /\/admin\/staff/.test(location.pathname):
        setPageTitle("Staff");
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

  return (
    <header class="bg-white">
      <div class="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">{pageTitle()}</h1>

        <Show when={pageTitle() !== APP_NAME}>
          <Link href={backLink()}>
            <button>
              <FaSolidChevronLeft class="mr-1" />
            </button>
          </Link>
        </Show>
      </div>
    </header>
  );
}
