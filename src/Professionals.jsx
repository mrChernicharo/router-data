import { For } from "solid-js";
import { useRouteData } from "solid-app-router";

export default function Professionals() {
  const data = useRouteData();

  // if (!data()) return <div>Loading...</div>;

  return (
    <div>
      <h1>Professionals</h1>

      <For each={data()?.professionals}>
        {professional => (
          <div>
            <p>{professional.name}</p>
          </div>
        )}
      </For>

      <pre>{JSON.stringify(data(), null, 2)}</pre>
    </div>
  );
}
