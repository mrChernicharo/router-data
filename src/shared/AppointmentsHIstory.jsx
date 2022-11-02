import { useQueryClient } from "@tanstack/solid-query";
import { onMount } from "solid-js";
import { userStore } from "../lib/userStore";
import ListItem from "./ListItem";
import AppointmentList from "./AppointmentList";
import { isPast, addMinutes } from "date-fns";

export default function AppointmentsHistory(props) {
  const queryClient = useQueryClient();

  const appointments = () =>
    queryClient.getQueryData([userStore.user.category, userStore.user.id])[userStore.user.category].appointments;

  const getHistoryAppointments = appointments =>
    (appointments || []).filter(app => isPast(addMinutes(new Date(app.datetime), 30)));

  const total = () => getHistoryAppointments(appointments()).length;
  const totalText = () => (total() === 1 ? `${total()} atendimento` : `${total()} atendimentos`);

  onMount(() => {
    console.log(queryClient.getQueryData([userStore.user.category, userStore.user.id]));
  });

  return (
    <ListItem classes="p-4">
      <h4 class="font-bold text-xl">Histórico de Atendimentos</h4>
      <p class="mt-2 mb-4">Total: {totalText()}</p>
      <ul>
        <AppointmentList role={userStore.user.category} appointments={getHistoryAppointments(appointments())} />
      </ul>
    </ListItem>
  );
}
