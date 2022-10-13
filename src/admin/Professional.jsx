import { useNavigate, useRouteData } from "solid-app-router";

import { onMount, createEffect } from "solid-js";
import { userStore, setUserStore } from "../lib/userStore";

import Button from "../shared/Button";
import ProfessionalAvailability from "./ProfessionalAvailability";
import ProfessionalAppointments from "./ProfessionalAppointments";

import { Link } from "solid-app-router";

export default function Professional() {
  const data = useRouteData();

  return (
    <div>
      <Link href="/admin/professionals">
        <Button kind="light" type="button" text="👈🏽" />
      </Link>

      <h1>professional</h1>

      <div>
        <Show when={data()?.professional}>
          {/* <div>{data().professional.id}</div> */}
          <h3>{data().professional.name}</h3>
          <h5>{data().professional.email}</h5>

          <Show when={data()?.professional.appointments}>
            <ProfessionalAppointments appointments={data().professional.appointments} />
          </Show>

          <ProfessionalAvailability availability={data()?.professional.availability} />
        </Show>
      </div>

      {/* <pre>{JSON.stringify(data(), null, 2)}</pre> */}
    </div>
  );
}
