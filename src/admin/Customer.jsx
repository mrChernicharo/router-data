import { useNavigate, useRouteData, Link } from "solid-app-router";

import { onMount, createEffect } from "solid-js";
import { userStore, setUserStore } from "../userStore";

import Button from "../Button";
import CustomerAvailability from "../CustomerAvailability";

export default function Customer() {
  const navigate = useNavigate();
  const data = useRouteData();

  return (
    <div>
      <Button kind="light" type="button" text="👈🏽" onClick={() => navigate("/admin/customers")} />
      <h1>Customer</h1>

      {/* <pre>{JSON.stringify(data(), null, 2)}</pre> */}
      <div>
        <Show when={data()?.customer}>
          <div>{data().customer.id}</div>
          <div>{data().customer.name}</div>
          <div>{data().customer.email}</div>

          <CustomerAvailability availability={data().customer.availability} />
        </Show>
      </div>
    </div>
  );
}
