import { useNavigate, useRouteData, Link } from "solid-app-router";

import { onMount, createEffect } from "solid-js";
import { userStore, setUserStore } from "../userStore";

import CollapseBox from "../shared/CollapseBox";
import AppointmentRequests from "./AppointmentRequests";
import AppointmentPossibilities from "./AppointmentPossibilities";
import Button from "../shared/Button";
import Badge from "../shared/Badge";
import Icon from "../shared/Icon";

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
        <Link class="d-flex nav-link align-items-center" href="/admin/requests">
          <div>Appointment Requests</div>
          <Icon chevronRight />
          {/* <Button kind="light" text={} type="button" /> */}
        </Link>
      </h3>

      {LoadingIndicator(data.loading)}

      {/* requests list */}
      {/* <CollapseBox>

        <h4>unattended</h4>
        <CollapseBox>
        <For each={data()?.unattended_customers}>
          {customer => <AppointmentRequests customer={customer} offers={customer.appointmentOffers} />}
        </For>
        </CollapseBox>

        <h4>attended</h4>
        <CollapseBox>
        <For each={data()?.customers_with_offers_with_profs}>
          {customer => <AppointmentRequests customer={customer} offers={customer.appointmentOffers} />}
        </For>
        </CollapseBox>
        <pre>{JSON.stringify(data(), null, 2)}</pre>
      </CollapseBox> */}
    </div>
  );
}
