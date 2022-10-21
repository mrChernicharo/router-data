import { createSignal, Match, Show, Switch } from "solid-js";
import { createMutation } from "@tanstack/solid-query";

import { confirmOffer } from "../lib/mutationFuncs";
import { dateToWeekday, getClosestDate, ISODateStrFromDateAndTime } from "../lib/helpers";

import PersonList from "../shared/PersonList";
import CollapseBox from "../shared/CollapseBox";

import { s } from "../lib/styles";
import Badge from "../shared/Badge";
import { channel } from "../lib/supabaseClient";
import { addToast } from "../shared/ToastContainer";
import ListItem from "../shared/ListItem";
import { FiCheck } from "solid-icons/fi";

export default function AppointmentOffers(props) {
  const [offerId, setOfferId] = createSignal("");

  const insertMutation = createMutation(["appointment_created"], offer => confirmOffer(offer));

  function handleConfirmAppointment(e) {
    const offer = props.offers.find(o => o.id === offerId());
    const datetime = getClosestDate(offer.day);

    offer.ISODate = ISODateStrFromDateAndTime(datetime, offer.time);
    offer.professional_id = offer.professional.id;

    insertMutation.mutate(offer, {
      onSuccess: res => {
        props.onAccepted(res);

        addToast({ message: "appointment confirmed!", status: "success", duration: 3000 });

        channel.send({
          type: "broadcast",
          event: "new_appointment_created",
        });
      },
      onError: err => {
        addToast({ message: "error creating appointment", status: "danger", duration: 4000 });
      },
    });
  }

  const bg = id => (offerId() === id ? " font-bold text-[#fff] bg-primary" : "");
  return (
    <ListItem classes="p-4">
      <div>
        <Show when={props.offers.length}>
          <Badge danger />
        </Show>
        <h4 class="font-bold text-xl">Appointment Offers</h4>
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
                <ListItem
                  classes={["p-4 w-80 cursor-pointer hover:bg-base-100", bg(offer.id)]}
                  onClick={e => (offer.id === offerId() ? setOfferId("") : setOfferId(offer.id))}
                >
                  <div class="relative">
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

                    <Show when={offerId() === offer.id}>
                      <div class="absolute right-0 top-[50%] -translate-y-[50%]">
                        <FiCheck size={28} />
                      </div>
                    </Show>
                  </div>
                </ListItem>
              )}
            </For>
          </ul>

          <div class="container">
            <div class="d-grid mt-5 mb-5">
              <button disabled={!offerId()} class="btn btn-accent" onClick={e => handleConfirmAppointment(e)}>
                <h3 style={{ margin: 0 }}>Confirm Appointment</h3>
              </button>
            </div>
          </div>

          {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}
        </CollapseBox>
      </div>
    </ListItem>
  );
}
