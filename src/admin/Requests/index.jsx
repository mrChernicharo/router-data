import { useNavigate, useRouteData, Link } from "solid-app-router";
import Badge from "../../shared/Badge";
import Button from "../../shared/Button";
import { For } from "solid-js";
import { createQuery } from "@tanstack/solid-query";

import { createEffect } from "solid-js";
import { Suspense } from "solid-js";
import Loading from "../../shared/Loading";
import Icon from "../../shared/Icon";
import CustomerRequest from "./CustomerRequest";
import { fetchAdminRequestsData } from "../../lib/fetchFuncs";

export default function AppointmentRequests(props) {
  const query = createQuery(() => ["appointment_requests"], fetchAdminRequestsData, {
    refetchOnMount: true,
  });

  return (
    <div data-component="AppointmentRequests">
      <Link href="/admin">
        <Button kind="light" text="👈🏽" type="button" />
      </Link>

      <h1>Appointment Requests</h1>

      <ul class="list-group">
        <For each={query.data?.customers.filter(c => !c.has_appointment)}>
          {customer => (
            <li class="list-group-item">
              <Badge
                danger={customer.is_unattended}
                warn={customer.has_offer}
                // success={customer.has_appointment}
              />
              <CustomerRequest customer={customer} />
            </li>
          )}
        </For>
      </ul>
      {/* <pre>{JSON.stringify(query, null, 2)}</pre> */}
    </div>
  );
}
