import { useNavigate, useRouteData, Link, useParams } from "solid-app-router";

import { onMount, createEffect } from "solid-js";
import { userStore, setUserStore } from "../../lib/userStore";

import Button from "../../shared/Button";
import CustomerAvailability from "./CustomerAvailability";
import CustomerAppointments from "./CustomerAppointments";
import { createQuery } from "@tanstack/solid-query";
import { fetchCustomerData } from "../../lib/fetchFuncs";
import Loading from "../../shared/Loading";

export default function Customer() {
  const params = useParams();
  const query = createQuery(
    () => ["customer", params.id],
    () => fetchCustomerData(params.id)
  );

  return (
    <div>
      <Link href="/admin/customers">
        <Button kind="light" type="button" text="👈🏽" />
      </Link>

      <h1>Customer</h1>

      <hr />

      <div>
        <Show when={query.data?.customer} fallback={<Loading />}>
          <h1>{query.data.customer.name}</h1>
          <div class="mb-5">{query.data.customer.email}</div>

          <Show when={query.data?.customer.appointments}>
            <div class="mb-5">
              <CustomerAppointments appointments={query.data.customer.appointments} />
            </div>
          </Show>

          <CustomerAvailability availability={query.data.customer.availability} />
        </Show>
      </div>

      {/* <pre>{JSON.stringify(query, null, 2)}</pre> */}
    </div>
  );
}
