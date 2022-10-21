import { For } from "solid-js";
import { createQuery, createMutation } from "@tanstack/solid-query";
import { useRouteData, Link } from "solid-app-router";
import { channel } from "../../lib/supabaseClient";

import { fetchProfessionalsData } from "../../lib/fetchFuncs";
import { removeProfessional } from "../../lib/mutationFuncs";
import { s } from "../../lib/styles";

import PersonList from "../../shared/PersonList";
import ListItem from "../../shared/ListItem";

import { FiTrash } from "solid-icons/fi";

export default function Professionals() {
  const query = createQuery(() => ["professionals"], fetchProfessionalsData);

  const removeMutation = createMutation(["professionals"], id => removeProfessional(id));

  function handleRemove(person) {
    console.log("handleRemove", person);
    if (!confirm(`certeza que você quer deletar ${person.name}?`)) return;

    removeMutation.mutate(person.id, {
      onSuccess: (data, variables, context) => {
        query.refetch();
      },
    });
  }

  channel.on("broadcast", { event: "professional_added" }, () => {
    query.refetch();
  });
  channel.on("broadcast", { event: "professional_removed" }, () => {
    query.refetch();
  });

  return (
    <div data-component="Professionals">
      {query.isLoading && <div>Loading...</div>}

      <ul>
        {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}
        <For each={query.data?.professionals}>
          {professional => (
            <ListItem>
              <div class="flex justify-between p-4 hover:bg-base-100">
                <Link
                  class="w-[100%] text-decoration-none"
                  style={{ color: "#000" }}
                  href={`${`/admin/professionals`}/${professional.id}`}
                >
                  <p class="text-xl font-bold">{professional.name}</p>
                  <p class="text-sm text-base-300">{professional.id}</p>
                  <p>{professional.email}</p>
                </Link>
                <div class="flex items-center pr-2">
                  <button class="btn btn-ghost text-error" onClick={e => handleRemove(professional)}>
                    <FiTrash size={22} />
                  </button>
                </div>
              </div>
            </ListItem>
          )}
        </For>
      </ul>

      {/* <pre>{JSON.stringify(query, null, 2)}</pre> */}
    </div>
  );
}
