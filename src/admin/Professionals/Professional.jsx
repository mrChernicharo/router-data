import { useNavigate, useParams, useRouteData } from "solid-app-router";

import { onMount, createEffect } from "solid-js";
import { userStore, setUserStore } from "../../lib/userStore";

import Button from "../../shared/Button";
import ProfessionalAvailability from "../ProfessionalAvailability";
import ProfessionalAppointments from "../ProfessionalAppointments";

import { Link } from "solid-app-router";
import { fetchProfessionalData } from "../../lib/fetchFuncs";
import { createQuery } from "@tanstack/solid-query";

export default function Professional() {
  const params = useParams();
  const query = createQuery(
    () => ["professional"],
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
        <Show when={query.data?.professional}>
          <h3>{query.data.professional.name}</h3>
          <h5>{query.data.professional.email}</h5>

          <Show when={query.data?.professional.appointments}>
            <ProfessionalAppointments appointments={query.data.professional.appointments} />
          </Show>

          <ProfessionalAvailability availability={query.data?.professional.availability} />
        </Show>
      </div>
    </div>
  );
}
