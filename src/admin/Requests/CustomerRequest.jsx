import { useNavigate, useRouteData, Link } from "solid-app-router";
import { dateToWeekday } from "../../lib/helpers";
import { createAppointmentOffers } from "../../lib/mutationFuncs";
import AppointmentPossibilities from "../AppointmentPossibilities";
import CollapseBox from "../../shared/CollapseBox";
import Button from "../../shared/Button";
import Badge from "../../shared/Badge";
import Icon from "../../shared/Icon";
import CustomerRequestAvailability from "./CustomerRequestAvailability";

export default function CustomerRequest(props) {
  return (
    <div>
      <h2>{props.customer.name}</h2>
      <div>{props.customer.email}</div>

      <Show when={!props.customer.has_appointment} fallback={<div style={{ height: "36px" }}></div>}>
        <CollapseBox>
          {/* <pre>{JSON.stringify(props.customer.has_appointment, null, 3)}</pre> */}

          <CustomerRequestAvailability customerId={props.customer.id} />
        </CollapseBox>
      </Show>
    </div>
  );
}
