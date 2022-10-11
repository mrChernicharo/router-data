import { For } from "solid-js";
import { useRouteData } from "solid-app-router";

export default function Customers() {
  const data = useRouteData();

  // if (!data()) return <div>Loading...</div>;

  return (
    <div>
      <h1>Customers</h1>

      <For each={data()?.customers}>{customer => <div>{customer.name}</div>}</For>

      <pre>{JSON.stringify(data(), null, 2)}</pre>
    </div>
  );
}
