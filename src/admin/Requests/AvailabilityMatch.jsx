import { dateToWeekday } from "../../lib/helpers";

export default function AvailabilityMatch(props) {
  const isChecked = (match, offers) => {
    console.log("isCheck", {
      match,
      offers,
    });
    return offers?.find(
      o => o.professional_id === match.professional_id && o.day === match.day && o.time === match.time
    );
  };

  return (
    <li class="list-group-item">
      <label>
        <div>{props.match.professional}</div>
        {dateToWeekday(props.match.day)} {props.match.time}
        <input
          id={`${props.match.professional}:d${props.match.day}:${props.match.time}`}
          class="ms-2"
          type="checkbox"
          checked={isChecked(props.match, props.offers)}
          data-day={props.match.day}
          data-time={props.match.time}
          data-professional_id={props.match.professional_id}
        />
      </label>
    </li>
  );
}
