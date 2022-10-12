import { For } from "solid-js";
import { useRouteData, Link } from "solid-app-router";
import { s } from "../styles";
import Button from "../shared/Button";

export default function Professionals() {
  const data = useRouteData();

  return (
    <div>
      <h1>Professionals</h1>
      <Link href="/admin">
        <Button kind="light" type="button" text="👈🏽" />
      </Link>

      {data.loading && <div>Loading...</div>}

      <ul class="list-group">
        <For each={data()?.professionals}>
          {person => (
            <Link href={`/admin/professionals/${person.id}`}>
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
