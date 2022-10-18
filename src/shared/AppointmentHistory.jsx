import { dateToWeekday } from "../lib/helpers";
import CollapseBox from "./CollapseBox";

export default function AppointmentHistory(props) {
  return (
    <div>
      <h4>Appointment History</h4>
      <CollapseBox>
        <ul class="list-group">
          <For each={props.appointments.sort((a, b) => new Date(b.datetime) - new Date(a.datetime))}>
            {appointment => (
              <li class="list-group-item">
                <h3>{appointment[props.role === "customer" ? "professional" : "customer"].name}</h3>
                <div>
                  <small>{appointment[props.role === "customer" ? "professional" : "customer"].email}</small>
                  :::
                  <small>{appointment[props.role === "customer" ? "professional" : "customer"].id}</small>
                </div>
                <div>
                  {new Date(appointment.datetime).toLocaleDateString("pt-BR")},{" "}
                  {dateToWeekday(appointment.day)} {appointment.time}h
                </div>
              </li>
            )}
          </For>
        </ul>
      </CollapseBox>

      {/* <pre>{JSON.stringify(props.appointments, null, 2)}</pre> */}
    </div>
  );
}
