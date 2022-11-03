import { useNavigate, useRouteData, Link } from "solid-app-router";
import Badge from "../../shared/Badge";

import { For, Show } from "solid-js";
import { createQuery, useQueryClient } from "@tanstack/solid-query";

import { createEffect } from "solid-js";
import { Suspense } from "solid-js";
import Loading from "../../shared/Loading";

import CustomerRequest from "./CustomerRequest";
import { fetchAdminRequestsData } from "../../lib/fetchFuncs";
import { channel } from "../../lib/supabaseClient";
import ListItem from "../../shared/ListItem";

const svgUrl = "/assets/done.svg";

export default function Requests(props) {
  const queryClient = useQueryClient();
  const query = createQuery(
    () => ["appointment_requests"],
    () => fetchAdminRequestsData(),
    { refetchOnMount: true }
  );

  async function handleOffersUpdated(args) {
    // UPDATE BADGE!
    query.refetch();
  }

  const idleCustomers = () => query.data.customers.filter(c => !c.has_appointment) ?? [];

  return (
    <div data-component="AppointmentRequests">
      {query.isLoading && <Loading large />}

      <Show when={!query.isLoading && idleCustomers().length === 0}>
        <div class="flex flex-col items-center justify-center">
          <h1 class="font-semibold text-2xl">Tudo certo!</h1>
          <p class="my-4">Nenhum cliente novo até o momento...</p>
          <img class="max-w-24" src={svgUrl} />
          <p class="mt-6">Fique atento que novos clientes aparecerão aqui</p>
        </div>
      </Show>
      <ul class="list-group">
        <Index each={idleCustomers()}>
          {(customer, idx) => (
            <ListItem>
              <div class="p-4">
                <Badge danger={customer().is_unattended} warn={customer().has_offer} />
                <CustomerRequest customer={customer()} onOffersSent={handleOffersUpdated} />
              </div>
            </ListItem>
          )}
        </Index>
      </ul>
      {/* <pre>{JSON.stringify(query, null, 2)}</pre> */}
    </div>
  );
}
