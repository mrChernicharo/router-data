import { useNavigate, useRouteData, Link } from "solid-app-router";

import { onMount, createEffect } from "solid-js";
import { userStore, setUserStore } from "../lib/userStore";

import Button from "../shared/Button";
import CustomerAvailability from "./CustomerAvailability";
import CustomerAppointments from "./CustomerAppointments";

export default function Customer() {
  const navigate = useNavigate();
  const data = useRouteData();

  return (
    <div>
      <Link href="/admin/customers">
        <Button kind="light" type="button" text="👈🏽" />
      </Link>

      <div>Customer</div>

      {/* <pre>{JSON.stringify(data(), null, 2)}</pre> */}
      <div>
        <Show when={data()?.customer}>
          {/* <div>{data().customer.id}</div> */}
          <h1>{data().customer.name}</h1>
          <div>{data().customer.email}</div>

          <Show when={data()?.customer.appointments}>
            <CustomerAppointments appointments={data().customer.appointments} />
          </Show>

          <CustomerAvailability availability={data().customer.availability} />
        </Show>
      </div>
    </div>
  );
}
