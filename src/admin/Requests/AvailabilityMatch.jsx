import { dateToWeekday } from "../../lib/helpers";
import ListItem from "../../shared/ListItem";
export default function AvailabilityMatch(props) {
  const isChecked = (match, offers) =>
    offers?.find(
      o => o.professional_id === match.professional_id && o.day === match.day && o.time === match.time
    );

  return (
    <div data-component="AvailabilityMatch" class="list-group-item">
      <ListItem classes="w-36">
        <label>
          <div class="flex gap-1 p-2">
            <div>
              <span>
                {props.filter === "professional" ? dateToWeekday(props.match.day) : props.match.professional}{" "}
                {props.match.time}
              </span>
            </div>

            <input
              id={`${props.match.professional}:d${props.match.day}:${props.match.time}`}
              class="ms-2"
              type="checkbox"
              checked={isChecked(props.match, props.offers)}
              data-day={props.match.day}
              data-time={props.match.time}
              data-professional_id={props.match.professional_id}
              data-customer_availability_slot_id={props.match.customer_availability_slot_id}
              data-professional_availability_slot_id={props.match.professional_availability_slot_id}
            />
          </div>
        </label>
      </ListItem>
    </div>
  );
}
