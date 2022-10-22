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
  const person = createMemo(() => (props.role === "customer" ? "professional" : "customer"));

  return (
    <div data-component="AppointmentsCalendar">
      <ListItem classes="p-4">
        <h4 class="font-bold text-xl">Consultas</h4>

        <CollapseBox>
          <div class="sm:grid grid-cols-2">
            {/* Calendar */}
            <div class="">
              <Calendar onDateSelected={setSelectedDate} appointments={props.person.appointments} />
            </div>

            <div class="">
              <Show when={selectedDate()}>
                <h3 class="pt-6 pb-2 font-semibold text-lg">
                  {`Consultas do dia ${format(selectedDate(), "d")}`}
                </h3>

                <div>
                  {!appointmentsInDay().length && <div class="text-info">Sem consultas nesse dia</div>}
                  <For each={appointmentsInDay()}>
                    {appointment => (
                      <ListItem>
                        <div class="p-2">
                          <div>{appointment[person()].name}</div>
                          <div>{appointment.time}</div>
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
      {/* <pre class="text-xs">{JSON.stringify(props.appointments, null, 2)}</pre> */}
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
     
    */
}
