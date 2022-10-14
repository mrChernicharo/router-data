import { createQuery } from "@tanstack/solid-query";
import { useRouteData, Link, useParams } from "solid-app-router";
import CustomerAppointments from "../admin/Customers/CustomerAppointments";
import CustomerAvailability from "../admin/Customers/CustomerAvailability";
import { fetchCustomerData } from "../lib/fetchFuncs";
import Button from "../shared/Button";
import Loading from "../shared/Loading";

export default function Customers() {
  const params = useParams();
  const query = createQuery(
    () => ["customer", params.id],
    () => fetchCustomerData(params.id)
  );

  return (
    <div>
      <Link href="/login">
        <Button kind="light" type="button" text="👈🏽" />
      </Link>
      <div>Customer</div>

      <Show when={query.data?.customer} fallback={<Loading />}>
        <h1>{query.data.customer.name}</h1>
        <div class="mb-5">{query.data.customer.email}</div>

        <Show when={query.data.customer.appointments.length}>
          <div class="mb-5">
            <CustomerAppointments appointments={query.data.customer.appointments} />
          </div>
        </Show>

        <CustomerAvailability availability={query.data.customer.availability} />
        {/* <pre>{JSON.stringify(query, null, 1)}</pre> */}
      </Show>
    </div>
  );
}
