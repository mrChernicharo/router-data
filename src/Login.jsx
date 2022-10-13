import { createSignal } from "solid-js";
import { useRouteData, Link } from "solid-app-router";

import Button from "./shared/Button";

export default function Login() {
  const [cId, setCId] = createSignal("");
  const [pId, setPId] = createSignal("");
  const data = useRouteData();

  return (
    <div>
      <h1>Login</h1>
      <div>
        <Link href="/">
          <Button kind="light" type="button" text="👈🏽" />
        </Link>
      </div>

      <nav>
        <Link href="/admin">admin </Link>
        {cId() && (
          <>
            | <Link href={`/customer/${cId()}`}>customer </Link>
          </>
        )}
        {pId() && (
          <>
            | <Link href={`/professional/${pId()}`}>professional </Link>
          </>
        )}
      </nav>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <select onChange={e => setCId(e.currentTarget.value)}>
            <For each={data()?.customers}>
              {customer => <option value={customer.id}>{customer.name}</option>}
            </For>
          </select>
          <select onChange={e => setPId(e.currentTarget.value)}>
            <For each={data()?.professionals}>
              {professional => <option value={professional.id}>{professional.name}</option>}
            </For>
          </select>
        </Suspense>
      </div>
    </div>
  );
}
