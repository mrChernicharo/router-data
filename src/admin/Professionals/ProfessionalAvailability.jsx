import { dateToWeekday } from "../../lib/helpers";

export default function ProfessionalAvailability(props) {
  console.log(props.availability);
  return (
    <div>
      <h3>Availability</h3>

      <ul class="list-group">
        <For each={props.availability}>
          {block => (
            <li class="list-group-item">
              <div>{dateToWeekday(block.day)}</div>
              <div>{block.time}</div>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}
