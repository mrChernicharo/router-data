import { createQuery } from "@tanstack/solid-query";
import { useRouteData, Link, useParams } from "solid-app-router";
import ProfessionalAppointments from "./ProfessionalAppointments";
// import ProfessionalAvailability from "./ProfessionalAvailability";
import AvailabilityTable from "../shared/AvailabilityTable";
import Button from "../shared/Button";
import Loading from "../shared/Loading";
import { fetchProfessionalData } from "../lib/fetchFuncs";

export default function Professional() {
  const params = useParams();
  const query = createQuery(
    () => ["professional", params.id],
    () => fetchProfessionalData(params.id)
  );

  console.log({ ...params });

  return (
    <div>
      {/* id !isAdmin && <Link href="/login"> */}
      <Link href="/admin/professionals">
        <Button kind="light" type="button" text="👈🏽" />
      </Link>
      <div> Professional</div>

      <Show when={query.data?.professional} fallback={<Loading />}>
        <h1>{query.data.professional.name}</h1>
        <div class="mb-5">{query.data.professional.email}</div>

        <div class="mb-5">
          <ProfessionalAppointments
            professional={query.data.professional}
            appointments={query.data.professional.appointments}
          />
        </div>

        <AvailabilityTable
          role="professional"
          person={query.data.professional}
          availability={query.data.professional.availability}
        />
        {/* <pre>{JSON.stringify(data(), null, 1)}</pre> */}
      </Show>
    </div>
  );
}
