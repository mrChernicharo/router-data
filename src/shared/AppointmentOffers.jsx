import { dateToWeekday, getClosestDate } from "../lib/helpers";
import PersonList from "./PersonList";
import CollapseBox from "./CollapseBox";
import Button from "./Button";
import { createSignal } from "solid-js";
import { s } from "../lib/styles";

export default function AppointmentOffers(props) {
  const [offerId, setOfferId] = createSignal("");

  function handleConfirmAppointment(e) {
    console.log({ e, offerId: offerId() });
  }

  const bg = id => (offerId() === id ? "#efe" : "");

  return (
    <div>
      <h3>AppointmentOffers</h3>

      {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}

      <CollapseBox open>
        <p>Escolha o horário ideal pra você</p>

        <ul class="list-group">
          <For each={props.offers}>
            {offer => (
              <li
                class="list-group-item"
                style={{ ...s.clickable, background: bg(offer.id) }}
                onClick={e => (offer.id === offerId() ? setOfferId("") : setOfferId(offer.id))}
              >
                <div>
                  <div>{offer.professional.name}</div>
                  <div>{offer.professional.email}</div>
                  <div>{dateToWeekday(offer.day)}</div>
                  <div>
                    {new Date(getClosestDate(offer.day)).toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    às {offer.time}
                  </div>
                </div>
              </li>
            )}
          </For>
        </ul>

        <div class="container">
          <div class="d-grid mt-5 mb-5">
            <Button
              disabled={!offerId()}
              kind="CTA"
              text={<h3 style={{ margin: 0 }}>Confirm Appointment</h3>}
              onClick={e => handleConfirmAppointment(e)}
            />
          </div>
        </div>
      </CollapseBox>
    </div>
  );
}
