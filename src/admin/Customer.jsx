import { useNavigate, useRouteData, Link, useParams } from "solid-app-router";

import { onMount, createEffect } from "solid-js";
import { userStore, setUserStore } from "../lib/userStore";

import Button from "../shared/Button";
import CustomerAvailability from "./CustomerAvailability";
import CustomerAppointments from "./CustomerAppointments";
import { createQuery } from "@tanstack/solid-query";

export default function Customer() {
  const params = useParams();
  // const query = createQuery(['customer'], () => )

  return (
    <div>
      <Link href="/admin/customers">
        <Button kind="light" type="button" text="👈🏽" />
      </Link>

      <div>Customer</div>

      <pre>{JSON.stringify(params, null, 2)}</pre>
      <div>
        {/* <Show when={data()?.customer}>
          <h1>{data().customer.name}</h1>
          <div>{data().customer.email}</div>

          <Show when={data()?.customer.appointments}>
            <CustomerAppointments appointments={data().customer.appointments} />
          </Show>

          <CustomerAvailability availability={data().customer.availability} /> 
        </Show>*/}
      </div>
    </div>
  );
}
