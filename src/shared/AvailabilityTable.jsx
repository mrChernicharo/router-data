import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { STR_NUM_WEEKDAYS } from "../lib/constants";
import { WORKING_HOURS, dateToWeekday, classss, timeStrToMinutes } from "../lib/helpers";
import { updatePersonAvailability } from "../lib/mutationFuncs";
import CollapseBox from "../shared/CollapseBox";
import { s } from "../lib/styles";
import { addToast } from "./ToastContainer";
import ListItem from "./ListItem";
import Loading from "./Loading";

export default function AvailabilityTable(props) {
  const queryClient = useQueryClient();
  const updateMutation = createMutation(["customer", props.person.id], availability =>
    updatePersonAvailability(props.person, props.role, availability)
  );

  const isChecked = (day, hour) => props.availability.find(av => av.time === hour && av.day === day);
  const isBusy = (day, hour) =>
    props.availability.find(av => av.time === hour && av.day === day)?.status === "0";
  const isBlocked = (day, hour) => day == 0 || (day == 6 && timeStrToMinutes(hour) > 900);
  const hasAppointment = () => props.availability?.filter(av => av.status === "0").length > 0;

  function handleAvailabilityUpdate(e) {
    e.preventDefault();

    const selectedCheckboxes = [...e.currentTarget].filter(d => d.checked);

    const selectedTimeBlocks = selectedCheckboxes.map(d => ({
      ...d.dataset,
      [`${props.role}_id`]: props.person.id,
      status: "1",
    }));

    updateMutation.mutate(selectedTimeBlocks, {
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries([props.role, props.person.id]);
        addToast({ message: "disponibilidade atualizada!", status: "success", duration: 4000 });
        // query.refetch();
      },
    });
  }

  return (
    <div data-component="AvailabilityTable">
      <ListItem classes="p-4">
        <h4 class="font-bold text-xl">Disponibilidade</h4>

        <CollapseBox open>
          <p class="">Clique nas caixinhas dos horários em que você tem disponibilidade</p>

          <div class="pointer-events-none pr-5">
            <h4 class="font-bold text-right">Legenda</h4>
            <div class="flex justify-end gap-1 mt-1">
              <p>Horário disponível</p>
              <input type="checkbox" class="checkbox checkbox-secondary checkbox-sm rounded-[4px]" />
            </div>

            <div class="flex justify-end gap-1 mt-1">
              <p>Horário indisponível</p>
              <input type="checkbox" class="checkbox checkbox-secondary checkbox-sm rounded-[4px]" disabled />
            </div>

            <div class="flex justify-end gap-1 mt-1">
              <p>Posso nesse horário</p>
              <input type="checkbox" class="checkbox checkbox-secondary checkbox-sm rounded-[4px]" checked />
            </div>

            {hasAppointment() && (
              <div class="flex justify-end gap-1 mt-1 items-center">
                <p>Tenho consulta</p>
                <div class="w-8 h-4 bg-warning" />
              </div>
            )}
          </div>

          <form onSubmit={handleAvailabilityUpdate}>
            <div class="max-w-[800px] mx-auto  mt-6">
              {/* THEAD */}
              <div class="sticky top-0 grid grid-cols-8  border-b-[1px] border-t-[1px]">
                <For each={["", ...STR_NUM_WEEKDAYS]}>
                  {(day, i) =>
                    i() === 0 ? (
                      <div class=""></div>
                    ) : (
                      <div class="text-center">{dateToWeekday(day).slice(0, 3)}</div>
                    )
                  }
                </For>
              </div>
              <div>
                {/* TBODY */}
                <For each={WORKING_HOURS}>
                  {time => (
                    <div class="grid grid-cols-8 border-b-[1px]">
                      <div class="text-xs font-bold flex items-center">{time}</div>
                      <For each={STR_NUM_WEEKDAYS}>
                        {weekday => (
                          <div
                            class={classss(
                              "p-[0.125rem] hover:bg-slate-200",
                              isBusy(weekday, time) ? "bg-warning" : ""
                            )}
                          >
                            <label class="w-full flex justify-center items-center">
                              <input
                                type="checkbox"
                                class="checkbox checkbox-secondary checkbox-sm rounded-[4px]"
                                checked={isChecked(weekday, time)}
                                disabled={isBlocked(weekday, time)}
                                data-day={weekday}
                                data-time={time}
                              />
                            </label>
                          </div>
                        )}
                      </For>
                    </div>
                  )}
                </For>
              </div>
            </div>

            <div class="mt-5 mb-5 flex justify-center">
              <button class="btn btn-accent w-full sm:w-[30rem]">
                <span>Confirmar Disponibilidade</span>
                <Show when={updateMutation.isLoading}>
                  <Loading classes="ml-1" />
                </Show>
              </button>
            </div>
          </form>
        </CollapseBox>
      </ListItem>
    </div>
  );
}
