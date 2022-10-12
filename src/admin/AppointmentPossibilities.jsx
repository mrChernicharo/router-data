import { For } from "solid-js";
import { dateToWeekday } from "../lib/helpers";
import Button from "../shared/Button";
import Icon from "../shared/Icon";

export default function AppointmentPossibilities(props) {
  const getProfessionalSlotId = (blockId, profAvailability) =>
    profAvailability.find(av => av.id === blockId).id;

  const isChecked = (block, customerOffers) => {
    console.log({ block, customerOffers });
    return customerOffers?.find(o => o.professional_availability_slot_id === block.id);
  };

  return (
    <div>
      <ul class="list-group">
        <For each={props.profMatches}>
          {match => (
            <li class="list-group-item mb-2">
              <label style={{ width: "100%", cursor: "pointer" }}>
                <span class="me-2">
                  {dateToWeekday(match.day)} {match.time}
                </span>
                <input
                  type="checkbox"
                  checked={isChecked(match, props.offers)}
                  data-day={match.day}
                  data-time={match.time}
                  data-professional_id={match.professional_id}
                  data-professional_availability_slot_id={getProfessionalSlotId(
                    match.id,
                    props.profAvailability
                  )}
                />
              </label>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}
