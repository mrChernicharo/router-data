import { createSignal, createMemo, Show } from "solid-js";
import CollapseBox from "./CollapseBox";
import ListItem from "./ListItem";
import Calendar from "./Calendar";
import { isSameDay, format } from "date-fns";

export default function AppointmentsCalendar(props) {
  const [selectedDate, setSelectedDate] = createSignal(null);
  const appointmentsInDay = createMemo(() =>
    props.person.appointments.filter(app => isSameDay(new Date(app.datetime), selectedDate()))
  );

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

            <div class="border">
              <Show when={true}>
                <h3>Consultas do dia</h3>

                <div>
                  <For each={appointmentsInDay()}>
                    {appointment => (
                      <ListItem>
                        <div class="p-2">
                          <div>{appointment.customer.name}</div>
                          <div>
                            {appointment.time}
                            {/* {format(new Date(appointment.datetime), "eee dd")}  */}
                          </div>
                        </div>
                      </ListItem>
                    )}
                  </For>
                </div>
              </Show>
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
