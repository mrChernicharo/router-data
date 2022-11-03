import { useNavigate, useRouteData, Link } from "solid-app-router";
import CollapseBox from "../../shared/CollapseBox";

import Badge from "../../shared/Badge";

import CustomerRequestAvailability from "./CustomerRequestAvailability";

export default function CustomerRequest(props) {
  return (
    <div data-component="CustomerRequest">
      <h2 class="font-bold capitalize">{props.customer.first_name}</h2>
      <div>{props.customer.email}</div>

      <Show when={!props.customer.has_appointment} fallback={<div>Tudo certo por aqui 👍🏼</div>}>
        <CollapseBox>
          {/* <pre>{JSON.stringify(props.customer.has_appointment, null, 3)}</pre> */}

          <CustomerRequestAvailability customerId={props.customer.id} onOffersSent={props.onOffersSent} />
        </CollapseBox>
      </Show>
    </div>
  );
}
