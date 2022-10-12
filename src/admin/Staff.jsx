import { useRouteData, Link } from "solid-app-router";
import { createSignal } from "solid-js";
import { s } from "../styles";
import Button from "../shared/Button";

export default function Staff() {
  const [id, setId] = createSignal(null);
  const data = useRouteData();

  return (
    <div>
      <Link href="/admin">
        <Button kind="light" type="button" text="👈🏽" />
      </Link>

      <h1>Staff</h1>

      {!data()?.staff && <div>Loading...</div>}

      <ul class="list-group">
        <For each={data()?.staff}>
          {person => (
            <div style={s.clickable} onClick={e => setId(person.id)}>
              <li className="list-group-item">
                <div>{person.id}</div>
                <div>{person.name}</div>
                <div>{person.email}</div>
              </li>
            </div>
          )}
        </For>
      </ul>

      {/* <pre>{JSON.stringify(id(), null, 2)}</pre>
      <pre>{JSON.stringify(data(), null, 2)}</pre> */}
    </div>
  );
}
