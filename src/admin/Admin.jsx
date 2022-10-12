import { useNavigate, useRouteData, Link } from "solid-app-router";

import { onMount, createEffect } from "solid-js";
import { userStore, setUserStore } from "../userStore";

import CollapseBox from "../shared/CollapseBox";
import Button from "../shared/Button";
import AppointmentRequests from "./AppointmentRequests";
import Badge from "../shared/Badge";

export default function Admin() {
  const data = useRouteData();

  console.log(data());

  return (
    <div>
      <Link href="/login">
        <Button kind="light" text="👈🏽" type="button" />
      </Link>

      <h1>Admin</h1>

      <nav>
        <a href="/admin/customers">Customers</a> | <a href="/admin/professionals">Professionals</a> |{" "}
        <a href="/admin/staff">Staff</a>
      </nav>

      <h3 class="mt-4">
        <Badge danger={data()?.unattended_customers.length} />
        <div>Appointment Requests</div>
      </h3>
      <CollapseBox>
        <AppointmentRequests
          customersWithOffers={data().customers_with_offers}
          unattendedCustomers={data().unattended_customers}
        />
      </CollapseBox>
      {/* <pre>{JSON.stringify(data(), null, 2)}</pre> */}
    </div>
  );
}
