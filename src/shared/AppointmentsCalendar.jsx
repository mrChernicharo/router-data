import { createSignal, createMemo, Show } from "solid-js";
import CollapseBox from "./CollapseBox";
import ListItem from "./ListItem";
import Calendar from "./Calendar";
import { isSameDay, format } from "date-fns";
import { dateToWeekday } from "../lib/helpers";

export default function AppointmentsCalendar(props) {
  const [selectedDate, setSelectedDate] = createSignal(null);
  const appointmentsInDay = createMemo(() =>
    props.person.appointments.filter(app => isSameDay(new Date(app.datetime), selectedDate()))
  );
  const person = createMemo(() => (props.role === "customer" ? "professional" : "customer"));

  const dayAppointmentsText = () =>
    selectedDate() ? `${dateToWeekday(selectedDate().getDay())} dia ${format(selectedDate(), "d")}` : "";

  return (
    <div data-component="AppointmentsCalendar">
      <ListItem classes="p-4">
        <h4 class="font-bold text-xl">Consultas</h4>

        <div class="sm:grid grid-cols-2">
          {/* Calendar */}
          <div class="">
            <Calendar onDateSelected={setSelectedDate} appointments={props.person.appointments} />
          </div>

          <div class="">
            <Show when={selectedDate()}>
              <h3 class="pt-6 pb-2 font-semibold text-lg">{dayAppointmentsText()}</h3>

              <div>
                {!appointmentsInDay().length && <div class="text-info">Sem consultas nesse dia</div>}
                <For each={appointmentsInDay()}>
                  {appointment => (
                    <ListItem>
                      <div class="p-2">
                        <div>
                          <p class="text-lg">
                            {appointment[person()].first_name} {appointment[person()].last_name}
                          </p>
                        </div>
                        <div>{appointment.time}</div>
                      </div>
                    </ListItem>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </div>
      </ListItem>
      {/* <pre class="text-xs">{JSON.stringify(props.appointments, null, 2)}</pre> */}
    </div>
  );
}
