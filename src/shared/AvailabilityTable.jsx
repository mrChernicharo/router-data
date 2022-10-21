import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { STR_NUM_WEEKDAYS } from "../lib/constants";
import { WORKING_HOURS, dateToWeekday } from "../lib/helpers";
import { updatePersonAvailability } from "../lib/mutationFuncs";
import Button from "../shared/Button";
import CollapseBox from "../shared/CollapseBox";
import { s } from "../lib/styles";
import { addToast } from "./ToastContainer";
import ListItem from "./ListItem";

export default function AvailabilityTable(props) {
  const queryClient = useQueryClient();
  const updateMutation = createMutation(["customer", props.person.id], availability =>
    updatePersonAvailability(props.person, props.role, availability)
  );

  const isChecked = (day, hour) => props.availability.find(av => av.time === hour && av.day === day);
  const isBusy = (day, hour) =>
    props.availability.find(av => av.time === hour && av.day === day)?.status === "0";

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
        addToast({ message: "availability updated!", status: "success", duration: 4000 });
        // query.refetch();
      },
    });
  }

  return (
    <div data-component="AvailabilityTable">
      <ListItem classes="p-4">
        <h4 class="font-bold text-xl">Availability</h4>

        <CollapseBox open>
          <p>Ajuste sua disponibilidade</p>

          <form onSubmit={handleAvailabilityUpdate}>
            <div class="overflow-x-auto">
              <table class="table table-compact mx-auto mt-6">
                <thead class="sticky top-0">
                  <tr>
                    <For each={["", ...STR_NUM_WEEKDAYS]}>
                      {(day, i) =>
                        i() === 0 ? <th class=""></th> : <th>{dateToWeekday(day).slice(0, 3)}</th>
                      }
                    </For>
                  </tr>
                </thead>
                <tbody>
                  <For each={WORKING_HOURS}>
                    {time => (
                      <tr>
                        <th class="text-sm">{time}</th>
                        <For each={STR_NUM_WEEKDAYS}>
                          {weekday => (
                            <td
                              class="p-0 hover:bg-slate-200"
                              style={{ background: isBusy(weekday, time) ? "orange" : "" }}
                            >
                              <label class="crazy-checkbox">
                                <input
                                  type="checkbox"
                                  checked={isChecked(weekday, time)}
                                  data-day={weekday}
                                  data-time={time}
                                />
                                <span class={`checkmark ${isChecked(weekday, time) ? "checked" : ""}`}></span>
                              </label>
                            </td>
                          )}
                        </For>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>

            <div class="d-grid mt-5 mb-5 flex justify-center border">
              <button class="btn btn-accent w-full sm:w-[30rem]">
                <span>Update Availability</span>
              </button>
            </div>
          </form>
        </CollapseBox>
      </ListItem>
    </div>
  );
}
