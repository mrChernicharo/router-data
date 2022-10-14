import { dateToWeekday } from "../lib/helpers";

export default function CustomerAppointments(props) {
  return (
    <div>
      <h4>Customer Appointments</h4>

      <ul class="list-group">
        <For each={props.appointments}>
          {appointment => (
            <li class="list-group-item">
              <h3>{appointment.professional.name}</h3>
              {/* <div>{appointment.professional.email}</div> */}
              <div>
                {new Date(appointment.datetime).toLocaleDateString("pt-BR")}, {dateToWeekday(appointment.day)}{" "}
                {appointment.time}h
              </div>
            </li>
          )}
        </For>
      </ul>

      {/* <pre>{JSON.stringify(props.appointments, null, 2)}</pre> */}
    </div>
  );
}
