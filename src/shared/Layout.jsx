import { createSignal } from "solid-js";
import { Outlet } from "solid-app-router";
import Header from "./Header";

import Nav from "./Nav";
import { ToastContainer } from "./Toast";
import { FiMenu } from "solid-icons/fi";
import { classss } from "../lib/helpers";

export default function Layout() {
  return (
    <>
      <Nav />

      <Header />

      <ToastContainer />

      <main>
        <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div class="px-4 sm:px-0">
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
}
