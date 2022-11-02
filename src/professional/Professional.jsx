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
import { imageUrl } from "../lib/constants";
import ListItem from "../shared/ListItem";

export default function Professional() {
  const location = useLocation();
  const params = useParams();
  const query = createQuery(
    () => ["professional", params.id],
    () => fetchProfessionalData(params.id)
  );

  const isAdmin = () => location.pathname.split("/").filter(Boolean)[0] === "admin";
  const userId = () => location.pathname.split("/")[2];

  const getHistoryAppointments = appointments =>
    appointments.filter(app => isPast(addMinutes(new Date(app.datetime), 30)));

  const getPatients = appointments =>
    [...new Set(appointments.map(app => `${app.customer.id}::${app.customer.first_name}::${app.customer.email}`))].map(
      p => {
        const info = p.split("::");
        const [id, first_name, email] = [info[0], info[1], info[2]];
        return { id, first_name, email };
      }
    );

  channel.on("broadcast", { event: `${userId()}::appointments` }, () => {
    console.log({ event: `${userId()}::appointments` });
    query.refetch();
  });

  return (
    <div data-component="Professional">
      <Show when={query.data?.professional} fallback={<Loading />}>
        <h1 class="font-bold text-5xl">{query.data.professional.first_name}</h1>
        <div class="mb-5">{query.data.professional.email}</div>

        <AvailabilityTable
          role="professional"
          canEdit={!isAdmin()}
          collapsable
          onChange={val => {}}
          person={query.data.professional}
          availability={query.data.professional.availability}
        />

        <AppointmentsCalendar
          role="professional"
          canEdit={!isAdmin()}
          person={query.data.professional}
          availability={query.data.professional.availability}
          appointments={query.data.professional.appointments}
        />

        <ListItem classes="p-4">
          <h4 class="font-bold text-xl">Pacientes</h4>
          <div>{getPatients(query.data.professional.appointments).length} patients</div>
          <CollapseBox>
            <ul>
              <For each={getPatients(query.data.professional.appointments)}>
                {patient => (
                  <ListItem classes="w-[80%]">
                    <div class="flex items-center p-4">
                      <img src={imageUrl} alt="" class="h-10 w-10 flex-none rounded-full" />
                      <div class="ml-4 flex-auto">
                        <div class="font-medium">{patient.first_name}</div>
                        <div class="mt-1 text-slate-700">{patient.email}</div>
                      </div>
                    </div>
                  </ListItem>
                )}
              </For>
            </ul>
          </CollapseBox>
        </ListItem>

        <ListItem classes="p-4">
          <h4 class="font-bold text-xl">Appointment History</h4>
          <div>total: {getHistoryAppointments(query.data.professional.appointments).length} appointments</div>
          <CollapseBox>
            <ul>
              <AppointmentList
                role="professional"
                appointments={getHistoryAppointments(query.data.professional.appointments)}
              />
            </ul>
          </CollapseBox>
        </ListItem>

        {/* <pre>{JSON.stringify(data(), null, 1)}</pre> */}
      </Show>
    </div>
  );
}
