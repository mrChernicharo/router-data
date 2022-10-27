import { createQuery, useQueryClient } from "@tanstack/solid-query";
import { useRouteData, Link, useParams, useLocation } from "solid-app-router";
import { fetchCustomerData } from "../lib/fetchFuncs";
import AppointmentOffers from "./AppointmentOffers";

import Loading from "../shared/Loading";
import AvailabilityTable from "../shared/AvailabilityTable";
import { createEffect } from "solid-js";
import AppointmentList from "../shared/AppointmentList";
import AppointmentsCalendar from "../shared/AppointmentsCalendar";
import { channel } from "../lib/supabaseClient";
import { setUserStore, userStore } from "../lib/userStore";

export default function Customer() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const params = useParams();
  const query = createQuery(
    () => ["customer", params.id],
    () => fetchCustomerData(params.id)
  );

  channel.on("broadcast", { event: `${userStore.user.id}::appointment_offers_updated` }, () => {
    // console.log({ event: `${userId()}::appointment_offers_updated` });
    // queryClient.invalidateQueries(["customer"]);
    query.refetch();
  });
  channel.on("broadcast", { event: "person_availability_updated" }, payload => {
    // console.log("[AppointmentRequests]", "PERSON_availability_updated", { queryClient });
    // queryClient.invalidateQueries(["customer"]);
    query.refetch();
  });
  channel.on("broadcast", { event: "new_appointment_created" }, payload => {
    // console.log("new_appointment_created!!!");
    query.refetch();
  });

  const hasOffers = () => query.data?.customer.offers.length;
  const hasAppointment = () => query.data?.customer.appointments.length;
  const hasFilledBasicInfo = () => true;
  const hasAvailability = () => query.data.customer.availability.length;

  createEffect(() => {
    console.log(query.data);
    // setUserStore()
  });

  return (
    <div data-component="Customer">
      <Show when={query.data} fallback={<Loading />}>
        <h1 class="font-bold text-5xl">{query.data.customer.name}</h1>
        <div class="mb-5 text-info">{query.data.customer.email}</div>

        <div class="main-panel">
          {/* A */}
          <div class="border m-2 p-2">
            <h3>Boas vindas! 🎉</h3>

            <p>É muito simples marcar uma consulta na aqui na laços!</p>

            <p class="">
              Basta responder algumas perguntas pra gente te conhecer melhor que rapidinho a gente acha o
              profissional ideal para você!
            </p>

            <p>Vamos começar?</p>

            <Link href={`/customer/${query.data.customer.id}/form`}>
              <button class="btn btn-accent" type="button">
                Aperte o botão para começar
              </button>
            </Link>
          </div>

          {/* B */}
          <div class="border m-2 p-2">
            <h1>Quase lá!</h1>

            <p class="">Faltam apenas alguns clicks para começar o seu tratamento</p>

            <button class="btn btn-accent" type="button">
              Finalizar Cadastro
            </button>
          </div>

          {/* C */}
          <div class="border m-2 p-2">
            <h1>Cadastro Realizado!</h1>
            <h3>Muito bem! 🎉</h3>

            <p>Entraremos em contato com você logo logo!</p>

            <p>
              Vamos te enviar opções de profissionais que combinam com você em até 24h! Fique de olho no app.
            </p>

            <p>Obrigado por confiar na Laços!</p>
          </div>
          {/* D*/}

          <div class="border m-2 p-2">
            <p>Temos o prazer de oferecer essas opções de consultas para você</p>

            <p>
              Agora é só escolher e o melhor horário e apertar o botão para confirmar seu primeiro atendimento
              e iniciar seu tratamento na Clínica Laços!
            </p>
          </div>
        </div>

        <Show when={hasOffers()}>
          <AppointmentOffers
            customer={query.data?.customer}
            offers={query.data?.customer.offers}
            onAccepted={val => {
              console.log("appointment created");
              query.refetch();
            }}
          />
        </Show>

        <Show when={hasAppointment()}>
          <h4 class="text-lg">Próxima consulta</h4>
          <div class="mb-5">
            <AppointmentList role="customer" appointments={query.data.customer.appointments} />
          </div>
        </Show>

        <AppointmentsCalendar
          role="customer"
          canEdit
          person={query.data.customer}
          availability={query.data.customer.availability}
          appointments={query.data.customer.appointments}
        />

        <AvailabilityTable
          role="customer"
          canEdit
          collapsable
          person={query.data.customer}
          availability={query.data.customer.availability}
        />

        {/* <pre>{JSON.stringify(query, null, 1)}</pre> */}
      </Show>
    </div>
  );
}
