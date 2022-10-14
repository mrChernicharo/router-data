import { createMemo, createSignal, For } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
import { fetchCustomerRequestAvailability } from "../../lib/fetchFuncs";

import AvailabilityMatch from "./AvailabilityMatch";
import { dateToWeekday } from "../../lib/helpers";
import Button from "../../shared/Button";
import Icon from "../../shared/Icon";

const weekdays = ["0", "1", "2", "3", "4", "5", "6"];

export default function CustomerRequestAvailability(props) {
  const query = createQuery(
    () => ["customer_request_availability", props.customerId],
    () => fetchCustomerRequestAvailability(props.customerId)
    // we need customer's offers here, they'll determine isChecked
  );

  const [filter, setFilter] = createSignal("day");

  const filteredMatches = createMemo(() => {
    if (!query.data?.matches) return [];

    const matchesObj = {};

    if (filter() === "day") {
      query.data?.matches.forEach(m => {
        if (!(m.day in matchesObj)) matchesObj[m.day] = [];
        matchesObj[m.day].push(m);
      });
    }
    if (filter() === "professional") {
      query.data?.matches.forEach(m => {
        if (!(m.professional in matchesObj)) matchesObj[m.professional] = [];
        matchesObj[m.professional].push(m);
      });
    }
    return matchesObj;
  });

  function handleSubmitOffers(e) {
    e.preventDefault();
    console.log(e);

    const selectedCheckboxes = [...e.currentTarget].filter(d => d.checked);

    const selectedTimeBlocks = selectedCheckboxes.map(d => ({
      ...d.dataset,
    }));

    console.log({ selectedTimeBlocks, selectedCheckboxes });

    // const staff = {
    //   name: inputRef.value.split("@")[0],
    //   email: inputRef.value,
    // };

    // insertMutation.mutate(staff, {
    //   onSuccess: (data, variables, context) => {
    //     query.refetch();
    //   },
    // });
  }

  return (
    <form onSubmit={handleSubmitOffers}>
      <div>
        <div>
          <Icon filter />
          <Button type="button" kind="light" text="day" onClick={e => setFilter("day")} />
          <Button type="button" kind="light" text="professional" onClick={e => setFilter("professional")} />
        </div>
      </div>
      <For each={Object.keys(filteredMatches())}>
        {k => (
          <div>
            <div class="fw-bold">{weekdays.includes(k) ? dateToWeekday(k) : k}</div>

            <ul class="list-group">
              <For each={filteredMatches()[k]}>
                {match => <AvailabilityMatch match={match} offers={query.data.offers} />}
              </For>
            </ul>
          </div>
        )}
      </For>

      <div class="mt-3">
        <Button kind="CTA" text={<Icon plus />} />
      </div>

      <pre>{JSON.stringify(query, null, 1)}</pre>
      {/* <pre>{JSON.stringify(filteredMatches(), null, 1)}</pre> */}
    </form>
  );
}
