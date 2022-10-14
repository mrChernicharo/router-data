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

// import { useNavigate, useRouteData, Link } from "solid-app-router";
// import { dateToWeekday } from "../lib/helpers";
// import { createAppointmentOffers } from "../lib/mutationFuncs";
// import AppointmentPossibilities from "./AppointmentPossibilities";
// import CollapseBox from "../shared/CollapseBox";
// import Button from "../shared/Button";
// import Badge from "../shared/Badge";
// import Icon from "../shared/Icon";

// export default function CustomerRequest(props) {
//   const [_, { refetchRequests }] = useRouteData();

//   const getProfessional = (profs, matches) => profs.find(p => p.id === matches[0].professional_id);

//   async function handleSubmit(e, customerId) {
//     e.preventDefault();

//     const selectedCheckboxes = [...e.currentTarget].filter(d => d.checked);
//     const selectedTimeBlocks = selectedCheckboxes.map(d => ({
//       ...d.dataset,
//       customer_id: customerId,
//     }));
//     console.log(e, selectedTimeBlocks, selectedCheckboxes);

//     await createAppointmentOffers(customerId, selectedTimeBlocks);

//     refetchRequests();
//   }

//   return (
//     <form onSubmit={e => handleSubmit(e, props.customer.id)}>
//       <CollapseBox>
//         <For each={props.possibilities}>
//           {customerPossibilities => {
//             console.log({ customerPossibilities });

//             const professional = getProfessional(props.professionals, customerPossibilities);

//             return (
//               <div>
//                 <div class="fw-bold">{professional.name}</div>

//                 <AppointmentPossibilities
//                   offers={props.customer.offers}
//                   possibilities={customerPossibilities}
//                   profAvailability={professional.availability}
//                 />
//               </div>
//             );
//           }}
//         </For>
//         <div class="d-flex justify-content-end">
//           <Button style={{ width: "160px" }} text={<Icon check />} kind="CTA" />
//         </div>
//       </CollapseBox>
//     </form>
//   );
// }
