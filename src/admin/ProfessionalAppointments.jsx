import { dateToWeekday } from "../lib/helpers";

export default function ProfessionalAppointments(props) {
  return (
    <div>
      <h4>Professional Appointments</h4>

      <ul class="list-group">
        <For each={props.appointments}>
          {appointment => (
            <li class="list-group-item">
              <h3>{appointment.customer.name}</h3>
              <div>{appointment.customer.email}</div>
              <div>{dateToWeekday(appointment.day)}</div>
              <div>{appointment.time}</div>
              <div>{new Date(appointment.datetime).toLocaleDateString("pt-BR")}</div>
              <div>{new Date(appointment.datetime).toLocaleTimeString("pt-BR")}</div>
              {/* <div>{appointment.status}</div> */}
            </li>
          )}
        </For>
      </ul>

      {/* <pre>{JSON.stringify(props.appointments, null, 2)}</pre> */}
    </div>
  );
}
