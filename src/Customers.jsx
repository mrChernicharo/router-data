import { For } from "solid-js";
import { useRouteData } from "solid-app-router";

export default function Customers() {
  const data = useRouteData();

  return (
    <div>
      <h1>Customers</h1>

      {!data()?.customers && <div>Loading...</div>}

      <For each={data()?.customers}>{customer => <div>{customer.name}</div>}</For>

      <pre>{JSON.stringify(data(), null, 2)}</pre>
    </div>
  );
}
