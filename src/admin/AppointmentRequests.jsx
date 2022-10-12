import { useNavigate, useRouteData, Link } from "solid-app-router";
import Badge from "../shared/Badge";
import Button from "../shared/Button";
import Icon from "../shared/Icon";
import { For } from "solid-js";
import { dateToWeekday } from "../lib/helpers";
import AppointmentPossibilities from "./AppointmentPossibilities";

export default function AppointmentRequests(props) {
  const data = useRouteData();
  const LoadingIndicator = isLoading => (isLoading ? <div>Loading...</div> : <></>);

  return (
    <div>
      <Link href="/admin">
        <Button kind="light" text="👈🏽" type="button" />
      </Link>

      {/* <p>{props.customer.name}</p> */}

      {LoadingIndicator(data.loading)}

      <ul class="list-group">
        <For each={data()?.customers}>
          {customer => (
            <li class="list-group-item">
              <div>
                <h2>{customer.name}</h2>
              </div>

              <For each={Object.keys(data()?.possibilities[customer.id])}>
                {day => (
                  <div>
                    <div class="fw-bold">{dateToWeekday(day)}</div>

                    <For each={data()?.possibilities[customer.id][day]}>
                      {av => (
                        <div>
                          <div>
                            {av.professional} {av.time}
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                )}
              </For>
            </li>
          )}
        </For>
      </ul>

      <pre>{JSON.stringify(data(), null, 2)}</pre>
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
