import { For } from "solid-js";
import { useRouteData, Link } from "solid-app-router";
import { s } from "../../lib/styles";
import Button from "../../shared/Button";
import { createQuery } from "@tanstack/solid-query";
import { fetchProfessionalsData } from "../../lib/fetchFuncs";

import PersonList from "../../shared/PersonList";
import { removeProfessional } from "../../lib/mutationFuncs";

export default function Professionals() {
  const query = createQuery(() => ["professionals"], fetchProfessionalsData);

  const removeMutation = createMutation(["professionals"], id => removeProfessional(id));

  function handleRemove(id) {
    console.log("handleRemove", id);
  }

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
