import { createQuery } from "@tanstack/solid-query";
import { useRouteData, Link, useParams } from "solid-app-router";
import CustomerAppointments from "./CustomerAppointments";
import { fetchCustomerData } from "../lib/fetchFuncs";
import Button from "../shared/Button";
import Loading from "../shared/Loading";
import AvailabilityTable from "../shared/AvailabilityTable";

export default function Customer() {
  const params = useParams();
  const query = createQuery(
    () => ["customer", params.id],
    () => fetchCustomerData(params.id)
  );

  return (
    <div data-component="Customer">
      {/* <Link href="/login">  IF NOT ADMIN */}
      <Link href="/admin/customers">
        <Button kind="light" type="button" text="👈🏽" />
      </Link>
      <div>Customer</div>

      <Show when={query.data?.customer} fallback={<Loading />}>
        <h1>{query.data.customer.name}</h1>
        <div class="mb-5">{query.data.customer.email}</div>

        <Show when={query.data.customer.appointments.length}>
          <div class="mb-5">
            <CustomerAppointments role="customer" appointments={query.data.customer.appointments} />
          </div>
        </Show>

        <AvailabilityTable
          role="customer"
          person={query.data.customer}
          availability={query.data.customer.availability}
        />

        {/* <pre>{JSON.stringify(query, null, 1)}</pre> */}
      </Show>
    </div>
  );
}
