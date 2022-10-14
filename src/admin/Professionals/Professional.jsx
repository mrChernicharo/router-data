import { useNavigate, useParams, useRouteData } from "solid-app-router";

import { onMount, createEffect } from "solid-js";
import { userStore, setUserStore } from "../../lib/userStore";

import Button from "../../shared/Button";
import ProfessionalAvailability from "./ProfessionalAvailability";
import ProfessionalAppointments from "./ProfessionalAppointments";

import { Link } from "solid-app-router";
import { fetchProfessionalData } from "../../lib/fetchFuncs";
import { createQuery } from "@tanstack/solid-query";
import Loading from "../../shared/Loading";

export default function Professional() {
  const params = useParams();
  const query = createQuery(
    () => ["professional", params.id],
    () => fetchProfessionalData(params.id)
  );

  return (
    <div>
      <Link href="/admin/professionals">
        <Button kind="light" type="button" text="👈🏽" />
      </Link>

      <h1>professional</h1>

      <hr />

      <div>
        <Show when={query.data?.professional} fallback={<Loading />}>
          <h1>{query.data.professional.name}</h1>
          <div class="mb-5">{query.data.professional.email}</div>

          <Show when={query.data?.professional.appointments}>
            <div class="mb-5">
              <ProfessionalAppointments appointments={query.data.professional.appointments} />
            </div>
          </Show>

          <ProfessionalAvailability availability={query.data?.professional.availability} />
        </Show>
      </div>
    </div>
  );
}
