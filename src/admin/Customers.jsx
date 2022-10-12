import { For, createSignal } from "solid-js";
import { useRouteData, Link } from "solid-app-router";

import Button from "../Button";
import { s } from "../styles";

export default function Customers() {
  const data = useRouteData();

  return (
    <div>
      <Link href="/admin">
        <Button kind="light" type="button" text="👈🏽" />
      </Link>

      <h1>Customers</h1>

      {!data()?.customers && <div>Loading...</div>}

      <ul class="list-group">
        <For each={data()?.customers}>
          {person => (
            <Link href={`/admin/customers/${person.id}`}>
              <li className="list-group-item">
                <div>{person.id}</div>
                <div>{person.name}</div>
                <div>{person.email}</div>
              </li>
            </Link>
          )}
        </For>
      </ul>
      {/* <pre>{JSON.stringify(data(), null, 2)}</pre> */}
    </div>
  );
}
