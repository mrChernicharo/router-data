import { useNavigate, useRouteData } from "solid-app-router";

import { onMount, createEffect } from "solid-js";
import { userStore, setUserStore } from "./userStore";

export default function Admin() {
  const data = useRouteData();

  console.log(data());

  return (
    <div>
      <h1>Admin</h1>
      <a href="/admin/customers">Customers</a> | <a href="/admin/professionals">Professionals</a>
      <pre>{JSON.stringify(data(), null, 2)}</pre>
    </div>
  );
}
