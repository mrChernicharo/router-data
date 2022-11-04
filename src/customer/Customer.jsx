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
import { differenceInMinutes } from "date-fns";
import { getNextAppointment } from "../lib/helpers";

export default function Customer() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const params = useParams();
  const query = createQuery(
    () => ["customer", params.id],
    () => fetchCustomerData(params.id),
    { refetchOnMount: true }
  );

  channel.on("broadcast", { event: `${userStore.user.id}::appointment_offers_updated` }, () => {
    console.log(`just heard ${userStore.user.id}::appointment_offers_updated`);
    query.refetch();
  });
  channel.on("broadcast", { event: "person_availability_updated" }, payload => {
    console.log("just heard person_availability_updated");
    query.refetch();
  });
  channel.on("broadcast", { event: "new_appointment_created" }, payload => {
    console.log("just heard new_appointment_created");

    query.refetch();
  });

  const isNewCustomer = () => !query.data.customer.first_name;
  const hasStartedRegister = () => query.data.customer.first_name && !query.data.customer.availability.length;
  const isRegistered = () => query.data.customer.first_name && query.data.customer.availability.length;
  const hasOffers = () => query.data?.customer.offers.length;
  const hasAppointment = () => query.data?.customer.appointments.length;

  const nextAppointment = () => getNextAppointment(query.data?.customer.appointments || []);

  return (
    <div data-component="Customer">
      <Show when={query.data} fallback={<Loading />}>
        <h1 class="font-bold text-5xl">{query.data.customer.first_name}</h1>
        <div class="mb-5 text-info">{query.data.customer.email}</div>

        <div class="main-panel">
          {/* A */}
          <Show when={isNewCustomer()}>
            <NewCustomer customerId={query.data.customer.id} />
          </Show>

          {/* B */}
          <Show when={hasStartedRegister()}>
            <RegisteringCustomer customerId={query.data.customer.id} />
          </Show>

          {/* C */}
          <Show when={isRegistered() && !hasOffers() && !hasAppointment()}>
            <RegisteredCustomer customerId={query.data.customer.id} />
          </Show>

          {/* D */}
          <Show when={hasOffers()}>
            <CustomerOffers
              customer={query.data.customer}
              onAccepted={val => {
                query.refetch();
              }}
            />
          </Show>

          {/* E */}
          <Show when={hasAppointment()}>
            <h4 class="text-lg">Próxima consulta</h4>
            <div class="mb-5">
              <AppointmentList role="customer" appointments={[nextAppointment()]} />
            </div>
          </Show>
        </div>

        {/* <AppointmentsCalendar
          role="customer"
          canEdit
          person={query.data.customer}
          availability={query.data.customer.availability}
          appointments={query.data.customer.appointments}
        />

        <AvailabilityTable
          role="customer"
          canEdit
          onChange={val => {}}
          collapsable
          person={query.data.customer}
          availability={query.data.customer.availability}
        /> */}

        {/* <pre>{JSON.stringify(query, null, 1)}</pre> */}
      </Show>
    </div>
  );
}

function NewCustomer(props) {
  return (
    <div data-component="NewCustomer" class="border m-2 p-2">
      <h3 class="font-bold text-4xl">Boas vindas! 🎉</h3>

      <p class="my-2">É muito simples marcar uma consulta na aqui na laços!</p>

      <p class="my-2">
        Basta nos dizer algumas informações pra gente te conhecer melhor que rapidinho a gente acha o profissional ideal
        para você!
      </p>

      <p class="my-2">Vamos começar?</p>

      <Link href={`/customer/${props.customerId}/form`}>
        <button class="btn btn-accent" type="button">
          Aperte o botão para começar
        </button>
      </Link>
    </div>
  );
}

function RegisteringCustomer(props) {
  return (
    <div data-component="RegisteringCustomer" class="border m-2 p-2">
      <h1>Quase lá!</h1>

      <p class="my-2">Faltam apenas alguns clicks para começar o seu tratamento</p>

      <Link href={`/customer/${props.customerId}/form`}>
        <button class="btn btn-accent" type="button">
          Finalizar Cadastro
        </button>
      </Link>
    </div>
  );
}

function RegisteredCustomer(props) {
  return (
    <div data-component="RegisteredCustomer" class="border m-2 p-2">
      <h1 class="font-bold text-2xl">Cadastro Realizado! 🎉</h1>

      <p class="my-2">Entraremos em contato com você logo logo!</p>

      <p class="my-2">
        Vamos te enviar opções de profissionais que combinam com você em até 24h! Fique de olho no app.
      </p>

      <p class="my-2">Obrigado por confiar na Laços!</p>

      <Link href={`/customer/${props.customerId}/form`}>
        <button class="btn btn-accent" type="button">
          Alterar dados
        </button>
      </Link>
    </div>
  );
}

function CustomerOffers(props) {
  return (
    <div data-component="CustomerOffers" class="border m-2">
      <AppointmentOffers customer={props.customer} offers={props.customer.offers} onAccepted={props.onAccepted} />
    </div>
  );
}
