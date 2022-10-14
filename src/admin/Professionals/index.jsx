import { For } from "solid-js";
import { useRouteData, Link } from "solid-app-router";
import { s } from "../../lib/styles";
import Button from "../../shared/Button";
import { createQuery } from "@tanstack/solid-query";
import { fetchProfessionalsData } from "../../lib/fetchFuncs";

import PersonList from "../../shared/PersonList";

export default function Professionals() {
  const query = createQuery(() => ["professionals"], fetchProfessionalsData);

  return (
    <div data-component="Professionals">
      <h1>Professionals</h1>
      <Link href="/admin">
        <Button kind="light" type="button" text="👈🏽" />
      </Link>

      {/* {data.loading && <div>Loading...</div>} */}

      <PersonList persons={query.data?.professionals} url={`/admin/professionals`} />

      {/* <pre>{JSON.stringify(query, null, 2)}</pre> */}
    </div>
  );
}
