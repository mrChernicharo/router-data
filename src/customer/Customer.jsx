import { createQuery } from "@tanstack/solid-query";
import { useRouteData, Link, useParams, useLocation } from "solid-app-router";
import CustomerAppointments from "./CustomerAppointments";
import { fetchCustomerData } from "../lib/fetchFuncs";
import AppointmentOffers from "./AppointmentOffers";
import Button from "../shared/Button";
import Loading from "../shared/Loading";
import AvailabilityTable from "../shared/AvailabilityTable";
import { createEffect } from "solid-js";
import AppointmentHistory from "../shared/AppointmentHistory";
import AppointmentsCalendar from "../shared/AppointmentsCalendar";

export default function Customer() {
  const params = useParams();
  const query = createQuery(
    () => ["customer", params.id],
    () => fetchCustomerData(params.id)
  );

  const location = useLocation();
  const isAdmin = () => location.pathname.split("/").filter(Boolean)[0] === "admin";

  createEffect(() => {
    console.log({ data: query.data, isAdmin: isAdmin() }, location.pathname.split("/").filter(Boolean)[0]);
  });

  return (
    <div data-component="Customer">
      <Link href={isAdmin() ? "/admin/customers" : "/login"}>
        <Button kind="light" type="button" text="👈🏽" />
      </Link>
      <div>Customer</div>

      <Show when={query.data?.customer} fallback={<Loading />}>
        <h1>{query.data.customer.name}</h1>
        <div class="mb-5">{query.data.customer.email}</div>

        <AvailabilityTable
          role="customer"
          person={query.data.customer}
          availability={query.data.customer.availability}
          canEdit={!isAdmin()}
        />

        <Show when={!isAdmin() && query.data?.customer.offers.length}>
          <AppointmentOffers customer={query.data?.customer} offers={query.data?.customer.offers} />
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

        <Show when={query.data?.customer.appointments.length}>
          <div class="mb-5">
            <AppointmentHistory role="customer" appointments={query.data.customer.appointments} />
          </div>
          {/* 
              Next Appointment
              Appointments History
              Appointments Calendar
          */}
        </Show>

        {/* <pre>{JSON.stringify(query, null, 1)}</pre> */}
      </Show>
    </div>
  );
}
