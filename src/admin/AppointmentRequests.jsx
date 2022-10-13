import { useNavigate, useRouteData, Link } from "solid-app-router";
import Badge from "../shared/Badge";
import Button from "../shared/Button";
import Icon from "../shared/Icon";
import { For } from "solid-js";

import { createEffect } from "solid-js";
import { Suspense } from "solid-js";
import CustomerRequest from "./CustomerRequest";

export default function AppointmentRequests(props) {
  const [data, { mutateRequests, refetchRequests }] = useRouteData();

  const LoadingIndicator = isLoading => (isLoading ? <div>Loading...</div> : <></>);

  return (
    <div>
      <Link href="/admin">
        <Button kind="light" text="👈🏽" type="button" />
      </Link>

      <Suspense fallback={LoadingIndicator(data.loading)}>
        <ul class="list-group">
          <For each={data()?.customers_with_offers.concat(data()?.unattended_customers)}>
            {customer => (
              <li class="list-group-item">
                <Badge danger={!customer.offers.length} />
                <h2>{customer.name}</h2>
                <p>{customer.id}</p>

                <CustomerRequest
                  customer={customer}
                  possibilities={data()?.possibilities[customer.id]}
                  professionals={data()?.professionals}
                />
              </li>
            )}
          </For>
        </ul>
      </Suspense>
      {/* <pre>{JSON.stringify(data(), null, 2)}</pre> */}
    </div>
  );
}
