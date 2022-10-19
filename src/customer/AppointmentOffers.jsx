import { createSignal, Match, Show, Switch } from "solid-js";
import { createMutation } from "@tanstack/solid-query";

import { confirmOffer } from "../lib/mutationFuncs";
import { dateToWeekday, getClosestDate, ISODateStrFromDateAndTime } from "../lib/helpers";

import PersonList from "../shared/PersonList";
import CollapseBox from "../shared/CollapseBox";
import Button from "../shared/Button";
import { s } from "../lib/styles";
import Badge from "../shared/Badge";
import { channel } from "../lib/supabaseClient";
import { addToast } from "../shared/ToastContainer";

export default function AppointmentOffers(props) {
  const [offerId, setOfferId] = createSignal("");

  const insertMutation = createMutation(["appointment_created"], offer => confirmOffer(offer));

  function handleConfirmAppointment(e) {
    const offer = props.offers.find(o => o.id === offerId());
    const datetime = getClosestDate(offer.day);
    offer.ISODate = ISODateStrFromDateAndTime(datetime, offer.time);

    offer.professional_id = offer.professional.id;

    // console.log({ offer });

    insertMutation.mutate(offer, {
      onSuccess: res => {
        // console.log("offer confirmed, appointment created", res);

        props.onAccepted(res);

        addToast({ message: "appointment confirmed!", status: "success", duration: 3000 });

        channel.send({
          type: "broadcast",
          event: "new_appointment_created",
        });
      },
      onError: err => {
        console.log("error creating appointment", { err });
        addToast({ message: "error creating appointment", status: "danger", duration: 4000 });
      },
    });
  }

  const bg = id => (offerId() === id ? "#efe" : "");
  return (
    <div>
      <Show when={props.offers.length}>
        <Badge danger />
      </Show>
      <h3>AppointmentOffers</h3>

      <CollapseBox open>
        <Switch>
          <Match when={props.offers.length}>
            <p>Escolha o horário ideal pra você</p>
          </Match>
          <Match when={!props.offers.length}>
            <p>Aguardando oferta</p>
          </Match>
        </Switch>

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

        {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}
      </CollapseBox>
    </div>
  );
}
