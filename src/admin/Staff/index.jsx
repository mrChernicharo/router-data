import { createEffect, createSignal } from "solid-js";
import { useRouteData, Link } from "solid-app-router";
import { createMutation, createQuery, useQueryClient } from "@tanstack/solid-query";
import { channel } from "../../lib/supabaseClient";

import { fetchStaffData } from "../../lib/fetchFuncs";
import { insertStaff, insertProfessional, removeStaff } from "../../lib/mutationFuncs";

import { s } from "../../lib/styles";

import Loading from "../../shared/Loading";
import ListItem from "../../shared/ListItem";
import { FiPlus, FiTrash } from "solid-icons/fi";
import { addToast } from "../../shared/ToastContainer";

export default function Staff() {
  let inputRef;
  // const [isSubmitting, setIsSubmitting] = createSignal(false);

  const query = createQuery(() => ["staff"], fetchStaffData);
  const queryClient = useQueryClient();
  const insertMutation = createMutation(["staff"], newStaff => insertStaff(newStaff));
  const removeMutation = createMutation(["staff"], person => removeStaff(person));
  const registerMutation = createMutation(["staff"], person => insertProfessional(person));

  const handleInsert = async e => {
    e.preventDefault();

    if (!inputRef.validity.valid) return console.log("invalid email!");

    const staff = {
      name: inputRef.value.split("@")[0],
      email: inputRef.value,
    };

    insertMutation.mutate(staff, {
      onSuccess: (data, variables, context) => {
        query.refetch();
      },
    });
  };

  const handleProfessionalRegister = async person => {
    registerMutation.mutate(person, {
      onSuccess: () => {
        queryClient.invalidateQueries(["professionals"]);
        addToast({
          message: "Profissional registrado com sucesso",
          status: "success",
        });
        query.refetch();
      },
    });
  };

  const handleStaffRemove = async person => {
    if (!confirm(`certeza que você quer deletar ${person.name}?`)) return;

    removeMutation.mutate(person, {
      onSuccess: (data, variables, context) => {
        addToast({
          message: "Staff deletado com sucesso",
          status: "danger",
        });
        query.refetch();
      },
    });
  };

  channel.on("broadcast", { event: "staff_created" }, () => {
    console.log({ event: "staff_created" });
    if (!query.isFetching) query.refetch();
  });
  channel.on("broadcast", { event: "staff_removed" }, () => {
    console.log({ event: "staff_removed" });
    query.refetch();
  });
  channel.on("broadcast", { event: "professional_added" }, () => {
    console.log({ event: "professional_added" });
    if (!query.isFetching) query.refetch();
  });
  channel.on("broadcast", { event: "professional_removed" }, () => {
    console.log({ event: "professional_removed" });
    query.refetch();
  });

  return (
    <div data-component="Staff">
      <div class="container">
        <h3>Register new Staff</h3>

        <form onSubmit={handleInsert}>
          <div class="d-grid input-group mb-3">
            <label class="label-text font-bold">
              Email
              <input
                ref={inputRef}
                type="email"
                class="input input-primary input-bordered input-md w-full max-w-xs bg-white"
                placeholder="Employee Email"
              />
            </label>
          </div>
          <div class="d-grid mb-5">
            <button type="button" class="btn btn-accent">
              <h3 style={{ margin: 0 }}>Register</h3>
            </button>
          </div>
        </form>
      </div>

      <div>{query.isLoading && <Loading />}</div>

      <ul class="list-group">
        <For each={query.data?.staff}>
          {person => (
            <div>
              <ListItem>
                <div class="flex hover:bg-base-100">
                  <div
                    style={{ ...s.listHighlight, background: person.isRegistered ? "#18e697" : "#bbb" }}
                  ></div>

                  {/* <Link class="w-[100%] href={`/admin/professionals/${person.id}`}> */}
                  <div class="w-[100%] p-2">
                    <div class="text-lg font-bold">{person.name}</div>
                    <div>{person.email}</div>
                    {person.isRegistered && (
                      <div class="text-base-300">professional id: {person.professional.id}</div>
                    )}
                  </div>
                  {/* </Link> */}

                  <div class="flex items-center">
                    <Show when={!person.isRegistered}>
                      <button
                        class="btn btn-ghost text-success"
                        type="button"
                        title="registrar profissional"
                        onClick={e => handleProfessionalRegister(person)}
                      >
                        <FiPlus size={20} />
                      </button>
                    </Show>

                    <button
                      class="btn btn-ghost text-error mr-2"
                      type="button"
                      title="remover profissional"
                      onClick={e => handleStaffRemove(person)}
                    >
                      <FiTrash size={20} />
                    </button>
                  </div>
                </div>
              </ListItem>
            </div>
          )}
        </For>

        <div>{(insertMutation.isLoading || removeMutation.isLoading) && <Loading />}</div>
      </ul>
      {/* <pre>{JSON.stringify(query, null, 2)}</pre> */}
    </div>
  );
}
