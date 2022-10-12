import { useNavigate, useRouteData, Link } from "solid-app-router";
import Badge from "../shared/Badge";
import Button from "../shared/Button";
import Icon from "../shared/Icon";
import { For } from "solid-js";
import { dateToWeekday } from "../lib/helpers";
import AppointmentPossibilities from "./AppointmentPossibilities";
import { createEffect } from "solid-js";

export default function AppointmentRequests(props) {
  const data = useRouteData();

  // const getProfessionalSlotId = (block, profId) =>
  //   getProfessionalById(profId, store.professionals).availability.find((av) => av.id === block.id)
  //     .id;

  const isChecked = (block, customerOffers) => {
    return customerOffers?.find(o => o.professional_availability_slot_id === block.id);
  };

  const LoadingIndicator = isLoading => (isLoading ? <div>Loading...</div> : <></>);

  createEffect(() => {
    console.log(data());
  });

  return (
    <div>
      <Link href="/admin">
        <Button kind="light" text="👈🏽" type="button" />
      </Link>
      {/* <p>{props.customer.name}</p> */}
      {LoadingIndicator(data.loading)}

      <ul class="list-group">
        <For each={data()?.customers_with_offers.concat(data()?.unattended_customers)}>
          {customer => (
            <li class="list-group-item">
              <div>
                <h2>{customer.name}</h2>
                <p>{customer.id}</p>

                {/* <pre>{JSON.stringify(data()?.possibilities[customer.id], null, 2)}</pre> */}

                <For each={data()?.possibilities[customer.id]}>
                  {profMatches => (
                    <div>
                      <div class="fw-bold">
                        {data()?.professionals.find(p => p.id === profMatches[0].professional_id).name}
                      </div>

                      <For each={profMatches}>
                        {match => (
                          <div>
                            <div>
                              {dateToWeekday(match.day)} {match.time}
                              <input type="checkbox" checked={isChecked(match, customer.offers)} />
                            </div>
                          </div>
                        )}
                      </For>
                    </div>
                  )}
                </For>
              </div>
            </li>
          )}
        </For>
      </ul>
      {/* <pre>{JSON.stringify(data(), null, 2)}</pre> */}
    </div>
  );
}
{
  /* {offer => (
            <div>
              {dateToWeekday(offer.day)} {offer.time}
              <h5> {offer.professional}</h5>
            </div>
          )} */
}
