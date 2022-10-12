import { useNavigate, useRouteData } from "solid-app-router";

import { onMount, createEffect } from "solid-js";
import { userStore, setUserStore } from "../userStore";

import Button from "../Button";
import ProfessionalAvailability from "./ProfessionalAvailability";

export default function Professional() {
  const navigate = useNavigate();
  const data = useRouteData();

  return (
    <div>
      <Button kind="light" type="button" text="👈🏽" onClick={() => navigate("/admin/professionals")} />
      <h1>professional</h1>

      {/* <pre>{JSON.stringify(data(), null, 2)}</pre> */}
      <div>
        <Show when={data()?.professional}>
          <div>{data().professional.id}</div>
          <div>{data().professional.name}</div>
          <div>{data().professional.email}</div>

          <ProfessionalAvailability availability={data().professional.availability} />
        </Show>
      </div>
    </div>
  );
}
