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
        <For each={props.possibilities}>
          {block => (
            <li class="list-group-item mb-2">
              <label style={{ width: "100%", cursor: "pointer" }}>
                <span class="me-2">
                  {dateToWeekday(block.day)} {block.time}
                </span>
                <input
                  type="checkbox"
                  checked={isChecked(block, props.offers)}
                  data-day={block.day}
                  data-time={block.time}
                  data-professional_id={block.professional_id}
                  data-professional_availability_slot_id={getProfessionalSlotId(
                    block.id,
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
