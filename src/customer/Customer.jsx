import { createQuery, useQueryClient } from "@tanstack/solid-query";
import { useRouteData, Link, useParams, useLocation } from "solid-app-router";
import CustomerAppointments from "./CustomerAppointments";
import { fetchCustomerData } from "../lib/fetchFuncs";
import AppointmentOffers from "./AppointmentOffers";
import Button from "../shared/Button";
import Loading from "../shared/Loading";
import AvailabilityTable from "../shared/AvailabilityTable";
import { createEffect } from "solid-js";
import AppointmentList from "../shared/AppointmentList";
import AppointmentsCalendar from "../shared/AppointmentsCalendar";
import { channel } from "../lib/supabaseClient";

export default function Customer() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const params = useParams();
  const query = createQuery(
    () => ["customer", params.id],
    () => fetchCustomerData(params.id)
  );

  const isAdmin = () => location.pathname.split("/").filter(Boolean)[0] === "admin";
  const userId = () => location.pathname.split("/")[2];

  channel.on("broadcast", { event: `${userId()}::appointment_offers_updated` }, () => {
    // console.log({ event: `${userId()}::appointment_offers_updated` });
    // queryClient.invalidateQueries(["customer"]);
    query.refetch();
  });
  channel.on("broadcast", { event: "person_availability_updated" }, payload => {
    // console.log("[AppointmentRequests]", "PERSON_availability_updated", { queryClient });
    // queryClient.invalidateQueries(["customer"]);
    query.refetch();
  });
  channel.on("broadcast", { event: "new_appointment_created" }, payload => {
    // console.log("new_appointment_created!!!");
    query.refetch();
  });

  return (
    <div data-component="Customer">
      <Show when={query.data?.customer} fallback={<Loading />}>
        <h1 class="font-bold text-5xl">{query.data.customer.name}</h1>
        <div class="mb-5">{query.data.customer.email}</div>

        <Show when={query.data?.customer.appointments.length}>
          <h4>Next Appointment</h4>
          <div class="mb-5">
            <AppointmentList role="customer" appointments={query.data.customer.appointments} />
          </div>
        </Show>

        <Show when={!isAdmin() && query.data?.customer.offers.length}>
          <AppointmentOffers
            customer={query.data?.customer}
            offers={query.data?.customer.offers}
            onAccepted={val => {
              console.log("appointment created");
              query.refetch();
            }}
          />
        </Show>

        <Show when={query.data?.customer}>
          <AppointmentsCalendar
            role="customer"
            canEdit={!isAdmin()}
            person={query.data.customer}
            availability={query.data.customer.availability}
            appointments={query.data.customer.appointments}
          />
        </Show>

        <AvailabilityTable
          role="customer"
          person={query.data.customer}
          availability={query.data.customer.availability}
          canEdit={!isAdmin()}
        />

        {/* <pre>{JSON.stringify(query, null, 1)}</pre> */}
      </Show>
    </div>
  );
}
