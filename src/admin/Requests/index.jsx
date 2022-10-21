import { useNavigate, useRouteData, Link } from "solid-app-router";
import Badge from "../../shared/Badge";

import { For } from "solid-js";
import { createQuery, useQueryClient } from "@tanstack/solid-query";

import { createEffect } from "solid-js";
import { Suspense } from "solid-js";
import Loading from "../../shared/Loading";

import CustomerRequest from "./CustomerRequest";
import { fetchAdminRequestsData } from "../../lib/fetchFuncs";
import { channel } from "../../lib/supabaseClient";
import ListItem from "../../shared/ListItem";

export default function AppointmentRequests(props) {
  const query = createQuery(() => ["appointment_requests"], fetchAdminRequestsData, {
    refetchOnMount: true,
  });
  const queryClient = useQueryClient();

  channel.on("broadcast", { event: "new_appointment_created" }, payload => {
    console.log("new_appointment_created!!!");
    // queryClient.invalidateQueries(["customer_request_availability"]);
    queryClient.refetchQueries(["customer_request_availability"]);
    query.refetch();
  });

  return (
    <div data-component="AppointmentRequests">
      {query.isLoading && <Loading large />}
      <ul class="list-group">
        <For each={query.data?.customers.filter(c => !c.has_appointment)}>
          {customer => (
            <ListItem>
              <div class="p-4">
                <Badge
                  danger={customer.is_unattended}
                  warn={customer.has_offer}
                  // success={customer.has_appointment}
                />
                <CustomerRequest customer={customer} />
              </div>
            </ListItem>
          )}
        </For>
      </ul>
      {/* <pre>{JSON.stringify(query, null, 2)}</pre> */}
    </div>
  );
}

{
  // channel.on("broadcast", { event: `person_availability_updated` }, payload => {
  //   console.log("[AppointmentRequests]", "person_availability_updated, pião");
  // });
  // channel.on("broadcast", { event: `customers_availability_updated` }, payload => {
  //   console.log("[AppointmentRequests]", "customers_availability_updated");
  // });
  // channel.on("broadcast", { event: `professionals_availability_updated` }, payload => {
  //   console.log("[AppointmentRequests]", "professionals_availability_updated");
  // });
}
