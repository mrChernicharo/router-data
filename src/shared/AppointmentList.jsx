import { dateToWeekday } from "../lib/helpers";
import CollapseBox from "./CollapseBox";
import { imageUrl } from "../lib/constants";

export default function AppointmentList(props) {
  return (
    <div data-component="AppointmentList">
      <ul>
        <For each={props.appointments.sort((a, b) => new Date(b.datetime) - new Date(a.datetime))}>
          {appointment => (
            <li>
              <div class="w-[24.5rem] divide-y divide-slate-400/20 rounded-lg bg-white text-[0.8125rem] leading-5 text-slate-900 shadow-xl shadow-black/5 ring-1 ring-slate-700/10">
                <div class="flex items-center p-4">
                  <img src={imageUrl} alt="" class="h-10 w-10 flex-none rounded-full" />
                  <div class="ml-4 flex-auto">
                    <div class="font-medium">
                      {appointment[props.role === "customer" ? "professional" : "customer"].name}
                    </div>
                    <div class="mt-1 text-slate-700">
                      {appointment[props.role === "customer" ? "professional" : "customer"].email}
                    </div>
                  </div>
                  <div class="pointer-events-auto ml-4 flex-none rounded-md py-[0.3125rem] px-2 font-medium text-slate-700 shadow-sm ring-1 ring-slate-700/10 hover:bg-slate-50">
                    {new Date(appointment.datetime).toLocaleDateString("pt-BR", {
                      weekday: "short",
                    })}{" "}
                    {appointment.time}h
                  </div>
                </div>
              </div>
            </li>
          )}
        </For>
      </ul>
      {/* <pre>{JSON.stringify(props.appointments, null, 2)}</pre> */}
    </div>
  );
}
