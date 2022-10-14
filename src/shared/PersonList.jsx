import { Link } from "solid-app-router";
import Button from "./Button";

/* Customers || Professionals */
export default function PersonList(props) {
  return (
    <ul class="list-group">
      <For each={props.persons}>
        {person => (
          <li class="list-group-item">
            <div class="d-flex">
              <Link
                class="w-100 text-decoration-none"
                style={{ color: "#000" }}
                href={`${props.url}/${person.id}`}
              >
                <div>{person.id}</div>
                <div>{person.name}</div>
                <div>{person.email}</div>
              </Link>
              <div class="d-flex align-items-center">
                <Button kind="delete" />
              </div>
            </div>
          </li>
        )}
      </For>
    </ul>
  );
}
