import ListItem from "../shared/ListItem";
import CollapseBox from "../shared/CollapseBox";
import { useQueryClient } from "@tanstack/solid-query";
import { imageUrl } from "../lib/constants";
import { userStore } from "../lib/userStore";

export default function Patients(props) {
  const queryClient = useQueryClient();

  const appointments = () =>
    queryClient.getQueryData([userStore.user.category, userStore.user.id])[userStore.user.category].appointments;

  const getPatients = appointments =>
    [...new Set(appointments.map(app => `${app.customer.id}::${app.customer.first_name}::${app.customer.email}`))].map(
      p => {
        const info = p.split("::");
        const [id, first_name, email] = [info[0], info[1], info[2]];
        return { id, first_name, email };
      }
    );
  return (
    <ListItem classes="p-4">
      <h4 class="font-bold text-xl">Pacientes</h4>
      <div>{getPatients(appointments()).length} patients</div>
      <CollapseBox>
        <ul>
          <For each={getPatients(appointments())}>
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
  );
}
