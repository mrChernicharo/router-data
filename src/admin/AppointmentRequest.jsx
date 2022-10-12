import { For } from "solid-js";
import { dateToWeekday } from "../lib/helpers";

export default function AppointmentRequest(props) {
  // const customers

  // if (props.isLoading) return <div>Loading...</div>;

  return (
    <div>
      {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}

      <p>{props.customer.name}</p>

      <ul class="group-list">
        <For each={props.customer.offers}>
          {offer => (
            <div>
              {dateToWeekday(offer.day)} {offer.time}
              <h5> {offer.professional}</h5>
            </div>
          )}
        </For>
      </ul>
    </div>
  );
}
