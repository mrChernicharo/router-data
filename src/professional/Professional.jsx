import { createQuery } from "@tanstack/solid-query";
import { useRouteData, Link, useParams, useLocation } from "solid-app-router";
import ProfessionalAppointments from "./ProfessionalAppointments";
import AppointmentHistory from "../shared/AppointmentHistory";
// import ProfessionalAvailability from "./ProfessionalAvailability";
import AvailabilityTable from "../shared/AvailabilityTable";
import Button from "../shared/Button";
import Loading from "../shared/Loading";
import { fetchProfessionalData } from "../lib/fetchFuncs";
import { createEffect } from "solid-js";
import AppointmentsCalendar from "../shared/AppointmentsCalendar";

export default function Professional() {
  const params = useParams();
  const query = createQuery(
    () => ["professional", params.id],
    () => fetchProfessionalData(params.id)
  );

  const location = useLocation();
  const isAdmin = () => location.pathname.split("/").filter(Boolean)[0] === "admin";

  createEffect(() => {
    console.log(query.data);
  });

  return (
    <div data-component="Professional">
      <Link href={isAdmin() ? "/admin/professionals" : "/login"}>
        <Button kind="light" type="button" text="👈🏽" />
      </Link>
      <div> Professional</div>

      <Show when={query.data?.professional} fallback={<Loading />}>
        <h1>{query.data.professional.name}</h1>
        <div class="mb-5">{query.data.professional.email}</div>

        <AvailabilityTable
          role="professional"
          person={query.data.professional}
          availability={query.data.professional.availability}
          canEdit={!isAdmin()}
        />

        <AppointmentsCalendar
          role="professional"
          canEdit={!isAdmin()}
          person={query.data.professional}
          availability={query.data.professional.availability}
          appointments={query.data.professional.appointments}
        />

        <div class="mb-5">
          <AppointmentHistory role="professional" appointments={query.data.professional.appointments} />
        </div>
        {/* <pre>{JSON.stringify(data(), null, 1)}</pre> */}
      </Show>
    </div>
  );
}
