import { For } from "solid-js";
import { createQuery, createMutation } from "@tanstack/solid-query";
import { useRouteData, Link } from "solid-app-router";
import { channel } from "../../lib/supabaseClient";

import { fetchProfessionalsData } from "../../lib/fetchFuncs";
import { removeProfessional } from "../../lib/mutationFuncs";
import { s } from "../../lib/styles";

import PersonList from "../../shared/PersonList";
import Button from "../../shared/Button";

export default function Professionals() {
  const query = createQuery(() => ["professionals"], fetchProfessionalsData);

  const removeMutation = createMutation(["professionals"], id => removeProfessional(id));

  function handleRemove(id) {
    console.log("handleRemove", id);

    removeMutation.mutate(id, {
      onSuccess: (data, variables, context) => {
        query.refetch();
      },
    });
  }

  channel.on("broadcast", { event: "professional_added" }, () => {
    query.refetch();
  });
  channel.on("broadcast", { event: "professional_removed" }, () => {
    query.refetch();
  });

  return (
    <div data-component="Professionals">
      <h1>Professionals</h1>
      <Link href="/admin">
        <Button kind="light" type="button" text="👈🏽" />
      </Link>

      {/* {data.loading && <div>Loading...</div>} */}

      <PersonList
        personList={query.data?.professionals}
        url={`/admin/professionals`}
        onDelete={handleRemove}
      />

      {/* <pre>{JSON.stringify(query, null, 2)}</pre> */}
    </div>
  );
}
