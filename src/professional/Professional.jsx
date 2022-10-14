import { createQuery } from "@tanstack/solid-query";
import { useRouteData, Link, useParams } from "solid-app-router";
import ProfessionalAppointments from "../admin/Professionals/ProfessionalAppointments";
import ProfessionalAvailability from "../admin/Professionals/ProfessionalAvailability";
import Button from "../shared/Button";
import Loading from "../shared/Loading";
import { fetchProfessionalData } from "../lib/fetchFuncs";

export default function Professional() {
  const params = useParams();
  const query = createQuery(
    () => ["professional", params.id],
    () => fetchProfessionalData(params.id)
  );

  return (
    <div>
      <Link href="/login">
        <Button kind="light" type="button" text="👈🏽" />
      </Link>
      <div> Professional</div>

      <Show when={query.data?.professional} fallback={<Loading />}>
        <h1>{query.data.professional.name}</h1>
        <div class="mb-5">{query.data.professional.email}</div>

        <div class="mb-5">
          <ProfessionalAppointments appointments={query.data.professional.appointments} />
        </div>

        <ProfessionalAvailability availability={query.data.professional.availability} />
        {/* <pre>{JSON.stringify(data(), null, 1)}</pre> */}
      </Show>
    </div>
  );
}
