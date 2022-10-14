import { useNavigate, useRouteData, Link } from "solid-app-router";
import Badge from "../../shared/Badge";
import Button from "../../shared/Button";
import Icon from "../../shared/Icon";
import { For } from "solid-js";
import { createQuery } from "@tanstack/solid-query";

import { createEffect } from "solid-js";
import { Suspense } from "solid-js";
import CustomerRequest from "./CustomerRequest";
import Loading from "../../shared/Loading";
import { fetchAdminRequestsData } from "../../lib/fetchFuncs";

export default function AppointmentRequests(props) {
  // const [data, { mutateRequests, refetchRequests }] = useRouteData();

  const query = createQuery(() => ["appointment_requests"], fetchAdminRequestsData);

  // const LoadingIndicator = isLoading => (isLoading ? <div>Loading...</div> : <></>);

  return (
    <div>
      <Link href="/admin">
        <Button kind="light" text="👈🏽" type="button" />
      </Link>

      <Suspense fallback={<Loading />}>
        <ul class="list-group">
          <For each={query.data?.customers}>
            {customer => (
              <li class="list-group-item">
                <Badge
                  danger={customer.is_unattended}
                  warn={customer.has_offer}
                  success={customer.has_appointment}
                />

                <CustomerRequest customer={customer} />
              </li>
            )}
          </For>
        </ul>
      </Suspense>
      <pre>{JSON.stringify(query, null, 2)}</pre>
    </div>
  );
}

{
  /* 
  <CustomerRequest
    customer={customer}
    possibilities={data()?.possibilities[customer.id]}
    professionals={data()?.professionals}
  /> */
}
