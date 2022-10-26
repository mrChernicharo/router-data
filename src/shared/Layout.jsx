import { createSignal } from "solid-js";
import { Outlet, useLocation } from "solid-app-router";
import Header from "./Header";

import Nav from "./Nav";
import { ToastContainer } from "./Toast";
import { classss } from "../lib/helpers";
import { userStore } from "../lib/userStore";

export default function Layout() {
  const location = useLocation();
  return (
    <>
      <Nav />

      <Header />

      <ToastContainer />

      <Show when={location.pathname !== "/"} fallback={<Outlet />}>
        <main>
          <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div class="px-4 sm:px-0">
              <Outlet />
            </div>
          </div>
        </main>
      </Show>

      {/* <pre class="text-xs">{JSON.stringify(userStore, null, 2)}</pre> */}
    </>
  );
}
