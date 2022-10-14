import { For } from "solid-js";
import { useRouteData, Link } from "solid-app-router";
import { s } from "../../lib/styles";
import Button from "../../shared/Button";
import { createQuery } from "@tanstack/solid-query";
import { fetchProfessionalsData } from "../../lib/fetchFuncs";

export default function Professionals() {
  const query = createQuery(() => ["professionals"], fetchProfessionalsData);

  return (
    <div>
      <h1>Professionals</h1>
      <Link href="/admin">
        <Button kind="light" type="button" text="👈🏽" />
      </Link>

      {/* {data.loading && <div>Loading...</div>} */}

      <ul class="list-group">
        <For each={query.data?.professionals}>
          {person => (
            <Link class="text-decoration-none" href={`/admin/professionals/${person.id}`}>
              <li className="list-group-item">
                <div>{person.id}</div>
                <div>{person.name}</div>
                <div>{person.email}</div>
              </li>
            </Link>
          )}
        </For>
      </ul>

      <AvailabilityTable />
      {/* <pre>{JSON.stringify(query, null, 2)}</pre> */}
    </div>
  );
}
