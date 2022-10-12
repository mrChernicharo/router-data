import { useNavigate, useRouteData, Link } from "solid-app-router";
import Badge from "../shared/Badge";
import Button from "../shared/Button";
import Icon from "../shared/Icon";
import { For } from "solid-js";
import { dateToWeekday } from "../lib/helpers";
import { createAppointmentOffers } from "../lib/mutationFuncs";
import AppointmentPossibilities from "./AppointmentPossibilities";
import CollapseBox from "../shared/CollapseBox";
import { createEffect } from "solid-js";

export default function AppointmentRequests(props) {
  const [data, { mutateRequests, refetchRequests }] = useRouteData();

  const getProfessional = (profs, matches) => profs.find(p => p.id === matches[0].professional_id);

  const LoadingIndicator = isLoading => (isLoading ? <div>Loading...</div> : <></>);

  async function handleSubmit(e, customerId) {
    e.preventDefault();

    const selectedCheckboxes = [...e.currentTarget].filter(d => d.checked);
    const selectedTimeBlocks = selectedCheckboxes.map(d => ({
      ...d.dataset,
      customer_id: customerId,
    }));
    console.log(e, selectedTimeBlocks, selectedCheckboxes);

    await createAppointmentOffers(customerId, selectedTimeBlocks);

    refetchRequests();
  }

  createEffect(() => {
    console.log(data());
  });

  return (
    <div>
      <Link href="/admin">
        <Button kind="light" text="👈🏽" type="button" />
      </Link>

      {LoadingIndicator(data.loading)}

      <ul class="list-group">
        <For each={data()?.customers_with_offers.concat(data()?.unattended_customers)}>
          {customer => (
            <li class="list-group-item">
              <Badge danger={!customer.offers.length} />
              <div>
                <h2>{customer.name}</h2>
                <p>{customer.id}</p>

                <form onSubmit={e => handleSubmit(e, customer.id)}>
                  <CollapseBox>
                    <For each={data()?.possibilities[customer.id]}>
                      {profMatches => {
                        const professional = getProfessional(data()?.professionals, profMatches);

                        return (
                          <div>
                            <div class="fw-bold">{professional.name}</div>

                            <AppointmentPossibilities
                              profMatches={profMatches}
                              offers={customer.offers}
                              profAvailability={professional.availability}
                            />
                          </div>
                        );
                      }}
                    </For>
                    <div class="d-flex justify-content-end">
                      <Button style={{ width: "160px" }} text={<Icon check />} kind="CTA" />
                    </div>
                  </CollapseBox>
                </form>
              </div>
            </li>
          )}
        </For>
      </ul>
      {/* <pre>{JSON.stringify(data(), null, 2)}</pre> */}
    </div>
  );
}
