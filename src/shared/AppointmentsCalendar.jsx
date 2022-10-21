import { createSignal } from "solid-js";
import CollapseBox from "./CollapseBox";
import ListItem from "./ListItem";
import Calendar from "./Calendar";
import { isSameDay } from "date-fns";

export default function AppointmentsCalendar(props) {
  const [selectedDate, setSelectedDate] = createSignal(null);

  return (
    <div data-component="AppointmentsCalendar">
      <ListItem classes="p-4">
        <h4 class="font-bold text-xl">Appointments Calendar</h4>
        <CollapseBox open>
          <div>{JSON.stringify(selectedDate())}</div>
          <div class="sm:grid grid-cols-2">
            {/* Calendar */}
            <div class="border">
              <h3>Calendário</h3>

              <div>
                <Calendar onDateSelected={setSelectedDate} />
              </div>
            </div>

            {/* Appointments in day */}
            <div class="border">
              <h3>Consultas</h3>

              <div>
                <For
                  each={props.person.appointments.filter(app =>
                    isSameDay(new Date(app.datetime), selectedDate())
                  )}
                >
                  {appointment => (
                    <ListItem>
                      <div class="p-2">
                        <div>{appointment.customer.name}</div>
                        <div>{appointment.datetime}</div>
                      </div>
                    </ListItem>
                  )}
                </For>
              </div>
            </div>
          </div>
        </CollapseBox>
      </ListItem>
      <pre class="text-xs">{JSON.stringify(props.appointments, null, 2)}</pre> */
    </div>
  );
}

{
  /* <button class="btn btn-ghost">day</button>
      <button class="btn btn-ghost">week</button>
      <button class="btn btn-ghost">month</button>

      <div>{props.person.id}</div>
      <div>{props.person.name}</div>
      <div>{props.person.email}</div>
      <pre>{JSON.stringify(props.appointments, null, 2)}</pre> */
}
