import { createMemo, createSignal, For, Suspense } from "solid-js";
import { createMutation, createQuery, useQueryClient } from "@tanstack/solid-query";

import { fetchCustomerRequestAvailability } from "../../lib/fetchFuncs";
import { createAppointmentOffers } from "../../lib/mutationFuncs";
import { STR_NUM_WEEKDAYS } from "../../lib/constants";
import { dateToWeekday } from "../../lib/helpers";

import AvailabilityMatch from "./AvailabilityMatch";
import Loading from "../../shared/Loading";
import { channel } from "../../lib/supabaseClient";
import { addToast } from "../../shared/ToastContainer";
import { FiSend, FiFilter } from "solid-icons/fi";

export default function CustomerRequestAvailability(props) {
  const queryClient = useQueryClient();
  const query = createQuery(
    () => ["customer_request_availability", props.customerId],
    () => fetchCustomerRequestAvailability(props.customerId)
  );
  const sendOffers = createMutation(["customer_request_availability", props.customerId], offers =>
    createAppointmentOffers(props.customerId, offers)
  );

  const [filter, setFilter] = createSignal("day"); /* day | professional */

  const matchesObj = createMemo(() => {
    if (!query.data?.matches) return [];

    const mObj = {};
    query.data?.matches.forEach(match => {
      if (!(match[filter()] in mObj)) mObj[match[filter()]] = [];
      mObj[match[filter()]].push(match);
    });

    console.log({ q: query.data?.matches, mObj });

    return mObj;
  });

  function handleSubmitOffers(e) {
    e.preventDefault();

    const selectedCheckboxes = [...e.currentTarget].filter(d => d.checked);
    const selectedTimeBlocks = selectedCheckboxes.map(d => ({
      ...d.dataset,
      customer_id: props.customerId,
    }));

    sendOffers.mutate(selectedTimeBlocks, {
      onSuccess: (data, variables, context) => {
        // UPDATE BADGE AT THE PARENT
        queryClient.invalidateQueries(["appointment_requests"]);
        query.refetch();

        addToast({ message: "offers sent successfully", status: "success" });
      },
    });
  }

  channel.on("broadcast", { event: "person_availability_updated" }, payload => {
    queryClient.invalidateQueries(["appointment_requests"]);
    query.refetch();
  });
  channel.on("broadcast", { event: `${props.customerId}::customer_availability_updated` }, payload => {
    // UPDATE BADGE AT THE PARENT
    queryClient.invalidateQueries(["appointment_requests"]);
    query.refetch();
  });

  return (
    <div data-component="CustomerRequestAvailability">
      <form onSubmit={handleSubmitOffers}>
        <Show when={query.data} fallback={<Loading />}>
          <div class="my-6">
            <div class="flex items-center gap-1">
              <FiFilter size={24} />
              <button type="button" class="btn" onClick={e => setFilter("day")}>
                Day
              </button>
              <button type="button" class="btn" onClick={e => setFilter("professional")}>
                professional
              </button>
            </div>
          </div>
          <For each={Object.keys(matchesObj())}>
            {k => (
              <div>
                <div class="font-bold">{STR_NUM_WEEKDAYS.includes(k) ? dateToWeekday(k) : k}</div>

                <ul class="flex gap-4 py-2">
                  <For each={matchesObj()[k]}>
                    {match => (
                      <AvailabilityMatch match={match} offers={query.data.offers} filter={filter()} />
                    )}
                  </For>
                </ul>
              </div>
            )}
          </For>

          <div class="mt-3">
            <button class="btn btn-accent">
              <FiSend size={20} /> <span class="ml-2">Send Offers</span>
            </button>
          </div>
        </Show>

        {/* <pre>{JSON.stringify(query, null, 1)}</pre> */}
        {/* <pre>{JSON.stringify(matchesObj(), null, 1)}</pre> */}
      </form>
    </div>
  );
}
