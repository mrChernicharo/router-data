import { useQueryClient } from "@tanstack/solid-query";
import { useParams } from "solid-app-router";
import AppointmentsCalendar from "../shared/AppointmentsCalendar";
import { userStore } from "../lib/userStore";

export default function CustomerCalendar(props) {
  const params = useParams();
  const queryClient = useQueryClient(["customer", params.id]);

  const queryData = () =>
    queryClient.getQueryData([userStore.user.category, userStore.user.id])[userStore.user.category];

  return (
    <AppointmentsCalendar
      role="customer"
      canEdit
      person={queryData()}
      availability={queryData().availability}
      appointments={queryData().appointments}
    />
  );
}
