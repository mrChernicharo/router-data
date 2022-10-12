import { useNavigate, useRouteData, Link } from "solid-app-router";

import { onMount, createEffect } from "solid-js";
import { userStore, setUserStore } from "../userStore";

import Button from "../Button";

export default function Admin() {
  const data = useRouteData();

  console.log(data());

  return (
    <div>
      <Link href="/login">
        <Button kind="light" text="👈🏽" type="button" />
      </Link>
      <h1>Admin</h1>
      <a href="/admin/customers">Customers</a> | <a href="/admin/professionals">Professionals</a> |{" "}
      <a href="/admin/staff">Staff</a>
      <pre>{JSON.stringify(data(), null, 2)}</pre>
    </div>
  );
}
