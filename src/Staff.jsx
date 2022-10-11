import { useRouteData } from "solid-app-router";

export default function Staff() {
  const data = useRouteData();

  return (
    <div>
      <h1>Staff</h1>

      {!data()?.staff && <div>Loading...</div>}

      <For each={data()?.staff}>{staff => <div>{staff.name}</div>}</For>

      <pre>{JSON.stringify(data(), null, 2)}</pre>
    </div>
  );
}
