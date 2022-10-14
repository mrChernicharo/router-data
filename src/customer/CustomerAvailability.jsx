import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { STR_NUM_WEEKDAYS } from "../lib/constants";
import { WORKING_HOURS, dateToWeekday } from "../lib/helpers";
import { updateCustomerAvailability } from "../lib/mutationFuncs";
import Button from "../shared/Button";
import CollapseBox from "../shared/CollapseBox";

export default function CustomerAvailability(props) {
  const isChecked = (day, hour) => props.availability.find(av => av.time === hour && av.day === day);
  const customerId = () => props.availability[0].customer_id;

  const queryClient = useQueryClient();
  const updateMutation = createMutation(["customer", customerId()], availability =>
    updateCustomerAvailability(customerId(), availability)
  );

  function handleAvailabilityUpdate(e) {
    e.preventDefault();

    const selectedCheckboxes = [...e.currentTarget].filter(d => d.checked);

    const selectedTimeBlocks = selectedCheckboxes.map(d => ({
      ...d.dataset,
      customer_id: customerId(),
    }));

    console.log("handleAvailabilityUpdate", { e, props, selectedCheckboxes, selectedTimeBlocks });

    updateMutation.mutate(selectedTimeBlocks, {
      onSuccess: (data, variables, context) => {
        // invalidate parent page query so we can fetch fresh data
        // about what customers have/haven't offers/appointments now
        queryClient.invalidateQueries(["customer", customerId()]);
        // query.refetch();
      },
    });
  }

  return (
    <div>
      <h3>Availability</h3>

      <CollapseBox>
        <form onSubmit={handleAvailabilityUpdate}>
          <table class="table table-striped-columns">
            <thead
              style={{
                position: "sticky",
                top: "0",
              }}
            >
              <tr style={{ "text-align": "center" }}>
                <For each={["", ...STR_NUM_WEEKDAYS]}>
                  {day => <th scope="col">{day ? dateToWeekday(day) : ""}</th>}
                </For>
              </tr>
            </thead>
            <tbody>
              <For each={WORKING_HOURS}>
                {time => (
                  <tr>
                    <th scope="row">{time}</th>
                    <For each={STR_NUM_WEEKDAYS}>
                      {weekday => (
                        <td style={{ padding: 0 }}>
                          <label
                            style={{
                              width: "100%",
                              "min-height": "30px",
                              "line-height": "40px",
                              "text-align": "center",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked(weekday, time)}
                              data-day={weekday}
                              data-time={time}
                            />
                          </label>
                        </td>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </tbody>
          </table>

          <div class="container">
            <div class="d-grid mt-5 mb-5">
              <Button kind="CTA" text={<h3 style={{ margin: 0 }}>Update Availability</h3>} />
            </div>
          </div>
        </form>
      </CollapseBox>
    </div>
  );
}
