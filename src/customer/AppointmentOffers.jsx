import { createEffect, createSignal, Match, Show, Switch } from "solid-js";
import { createMutation } from "@tanstack/solid-query";

import { confirmOffer } from "../lib/mutationFuncs";
import { dateToWeekday, getClosestDate } from "../lib/helpers";

import Badge from "../shared/Badge";
import { channel } from "../lib/supabaseClient";
import { addToast } from "../shared/Toast";
import ListItem from "../shared/ListItem";
import { FiCheck } from "solid-icons/fi";
import Loading from "../shared/Loading";

export default function AppointmentOffers(props) {
  const [offerId, setOfferId] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);

  const insertMutation = createMutation(["appointment_created"], offer => confirmOffer(offer));

  function handleConfirmAppointment(e) {
    setIsLoading(true);

    const offer = props.offers.find(o => o.id === offerId());

    const timestamp = getClosestDate(offer.day, offer.time);

    const datetime = new Date(timestamp);

    offer.ISODate = datetime.toISOString();
    offer.professional_id = offer.professional.id;

    console.log("created datetime!!!", { timestamp, datetime, iso: datetime.toISOString(), offer });
    insertMutation.mutate(offer, {
      onSuccess: res => {
        props.onAccepted(res);

        addToast({ message: "Consulta confirmada!", status: "success", duration: 3000 });
      },
      onError: err => {
        addToast({ message: "erro ao criar nova consulta", status: "danger", duration: 4000 });
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  }

  createEffect(() => {
    console.log(props.offers);
  });

  const isSelected = id => id === offerId();
  const bg = id => (offerId() === id ? " font-bold bg-primary text-base-200 " : " hover:bg-base-200 ");
  return (
    <ListItem classes="p-4">
      <div class="flex flex-col items-center">
        <h2 class="font-bold text-3xl">Ofertas de Atendimento</h2>
        <h4 class="text-lg my-2">Temos o prazer de oferecer essas opções de consultas para você! 🎉</h4>
        <p class="mb-4 text-center md:max-w-[50%] ">
          Agora é só escolher e o melhor horário e apertar o botão para confirmar seu primeiro atendimento e iniciar seu
          tratamento na Clínica Laços!
        </p>
      </div>

      <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        <For each={props.offers}>
          {offer => (
            <ListItem
              classes={["p-4 cursor-pointer ", bg(offer.id)]}
              onClick={e => (isSelected(offer.id) ? setOfferId("") : setOfferId(offer.id))}
            >
              <div class="relative">
                <div>{offer.professional.first_name}</div>
                <div>{offer.professional.email}</div>
                <div>{dateToWeekday(offer.day)}</div>
                <div>
                  {new Date(getClosestDate(offer.day, offer.time)).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
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

      <div class="">
        <div class="flex justify-center mt-5 mb-5">
          <button
            disabled={!offerId()}
            class="btn btn-accent w-full max-w-xl"
            onClick={e => handleConfirmAppointment(e)}
          >
            <h3 class="m-0">
              Confirmar Minha Primeira Consulta!
              {isLoading() ? <Loading color="#fff" /> : <></>}
            </h3>
          </button>
        </div>
      </div>

      {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}
    </ListItem>
  );
}
