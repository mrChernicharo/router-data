import { createQuery } from "@tanstack/solid-query";
import { useRouteData, Link, useParams, useLocation } from "solid-app-router";

import { channel } from "../lib/supabaseClient";
import { addMinutes, isPast, subDays } from "date-fns";
import AppointmentList from "../shared/AppointmentList";
import CollapseBox from "../shared/CollapseBox";
// import ProfessionalAvailability from "./ProfessionalAvailability";
import AvailabilityTable from "../shared/AvailabilityTable";

import Loading from "../shared/Loading";
import { fetchProfessionalData } from "../lib/fetchFuncs";
import AppointmentsCalendar from "../shared/AppointmentsCalendar";
import ListItem from "../shared/ListItem";
import { userStore } from "../lib/userStore";
import { createEffect } from "solid-js";
import { getNextAppointment } from "../lib/helpers";
import { FiEdit3 } from "solid-icons/fi";

export default function Professional() {
  const params = useParams();
  const query = createQuery(
    () => ["professional", params.id],
    () => fetchProfessionalData(params.id),
    { refetchOnMount: true }
  );

  const isNewProfessional = () => !query.data.professional.first_name;
  const hasStartedRegister = () => query.data.professional.first_name && !query.data.professional.availability.length;
  const isRegistered = () => query.data.professional.first_name && query.data.professional.availability.length;
  const hasAppointment = () => query.data?.professional.appointments.length;

  const nextAppointment = () => getNextAppointment(query.data?.professional.appointments || []);

  channel.on("broadcast", { event: `${userStore.user.id}::appointments` }, () => {
    console.log({ event: `${userStore.user.id}::appointments` });
    query.refetch();
  });

  createEffect(() => {
    console.log(query.data);
  });

  return (
    <div data-component="Professional">
      <Show when={query.data} fallback={<Loading />}>
        <h1 class="font-bold text-5xl">{query.data.professional.first_name}</h1>
        <div class="mb-5">{query.data.professional.email}</div>

        <div class="main-panel">
          {/* A */}
          <Show when={isNewProfessional()}>
            <NewProfessional professionalId={query.data.professional.id} />
          </Show>

          {/* B */}
          <Show when={hasStartedRegister()}>
            <RegisteringProfessional professionalId={query.data.professional.id} />
          </Show>

          {/* C */}
          <Show when={isRegistered() && !hasAppointment()}>
            <RegisteredProfessional professionalId={query.data.professional.id} />
          </Show>

          {/* D */}
          <Show when={hasAppointment()}>
            <h4 class="text-lg">Próxima consulta</h4>
            <div class="mb-5">
              <AppointmentList role="professional" appointments={[nextAppointment()]} />
            </div>
          </Show>
        </div>

        {/* <AvailabilityTable
          role="professional"
          canEdit={!isAdmin()}
          collapsable
          onChange={val => {}}
          person={query.data.professional}
          availability={query.data.professional.availability}
        /> */}

        {/* <AppointmentsCalendar
          role="professional"
          canEdit={!isAdmin()}
          person={query.data.professional}
          availability={query.data.professional.availability}
          appointments={query.data.professional.appointments}
        /> */}

        {/* <pre>{JSON.stringify(data(), null, 1)}</pre> */}
      </Show>
    </div>
  );
}

function NewProfessional(props) {
  return (
    <div data-component="NewProfessional" class="border m-2 p-2">
      <h3 class="font-bold text-4xl">Boas vindas! 🎉</h3>

      <p class="my-2">Estamos muito contentes de ter você no nosso time!</p>

      <p class="my-2">
        Precisamos agora que você informe alguns dados seus e em poucos minutos você já estará apto(a) a começar a
        atender!
      </p>

      <p class="my-2">Vamos Lá?</p>

      <Link href={`/professional/${props.professionalId}/form`}>
        <button class="btn btn-accent" type="button">
          Aperte o botão para começar
        </button>
      </Link>
    </div>
  );
}

function RegisteringProfessional(props) {
  return (
    <div data-component="RegisteringProfessional" class="border m-2 p-2">
      <h1>Quase lá!</h1>

      <p class="my-2">Faltam apenas alguns clicks para finalizar seu cadastro</p>

      <p class="my-2">Aperte o botão para continuar</p>

      <Link href={`/professional/${props.professionalId}/form`}>
        <button class="btn btn-accent" type="button">
          Finalizar Cadastro
        </button>
      </Link>
    </div>
  );
}

function RegisteredProfessional(props) {
  return (
    <div data-component="RegisteredProfessional" class="m-2 p-2 flex flex-col justify-center items-center">
      <h1 class="font-bold text-2xl">Cadastro Finalizado! 🎉</h1>

      <p class="my-6 text-center max-w-[320px]">
        Suas informações foram devidamente cadastradas no nosso sistema.Agora você é oficialmente parte da Clínica
        Laços!
      </p>

      <h2 class="font-bold text-2xl">Parabéns!</h2>

      <img class="my-8" src="/assets/appreciation.svg" />

      <p class="mb-8">Agora é só ficar de olho no app que os seus novos pacientes vão aparecer!</p>

      <Link href={`/professional/${props.professionalId}/form`}>
        <button class="btn btn-secondary btn-ghost flex items-center" type="button">
          Alterar dados <FiEdit3 class="ml-2" size={18} />
        </button>
      </Link>
    </div>
  );
}
