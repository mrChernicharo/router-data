import { useNavigate, useRouteData, Link } from "solid-app-router";

import { onMount, createEffect } from "solid-js";
import { userStore, setUserStore } from "../userStore";

import CollapseBox from "../shared/CollapseBox";
import Button from "../shared/Button";
import AppointmentRequest from "./AppointmentRequest";
import Badge from "../shared/Badge";

export default function Admin() {
  const data = useRouteData();

  const LoadingIndicator = isLoading => (isLoading ? <div>Loading...</div> : <></>);
  // console.log(data());

  return (
    <div>
      <Link href="/login">
        <Button kind="light" text="👈🏽" type="button" />
      </Link>

      {/* Page Title + Nav */}
      <div>
        <h1>Admin</h1>

        <nav>
          <a href="/admin/customers">Customers</a> | <a href="/admin/professionals">Professionals</a> |{" "}
          <a href="/admin/staff">Staff</a>
        </nav>
      </div>

      {/* Requests Title + Badge */}
      <h3 class="mt-4">
        <Badge danger={data()?.unattended_customers.length} />
        <div>Appointment Requests</div>
      </h3>

      {/* requests list */}
      <CollapseBox>
        {LoadingIndicator(data.loading)}

        <h4>unattended</h4>
        <For each={data()?.unattended_customers}>
          {customer => <AppointmentRequest customer={customer} offers={customer.appointmentOffers} />}
        </For>

        <h4>attended</h4>
        <For each={data()?.customers_with_offers_with_profs}>
          {customer => <AppointmentRequest customer={customer} offers={customer.appointmentOffers} />}
        </For>
      </CollapseBox>

      {/* <pre>{JSON.stringify(data(), null, 2)}</pre> */}
    </div>
  );
}
