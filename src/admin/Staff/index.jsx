import { createEffect, createSignal } from "solid-js";
import { useRouteData, Link } from "solid-app-router";
import { createMutation, createQuery, useQueryClient } from "@tanstack/solid-query";
import { channel } from "../../lib/supabaseClient";

import { fetchCustomersData, fetchStaffData } from "../../lib/fetchFuncs";
import { insertStaff, insertProfessional, removeStaff } from "../../lib/mutationFuncs";

import { s } from "../../lib/styles";

import Loading from "../../shared/Loading";
import CollapseBox from "../../shared/CollapseBox";
import ListItem from "../../shared/ListItem";
import { FiPlus, FiTrash } from "solid-icons/fi";
import { addToast } from "../../shared/Toast";

const CATEGORIES = [
  { name: "Profissional", value: "professional" },
  { name: "Gerente", value: "manager" },
  { name: "Administrador", value: "admin" },
];

export default function Staff() {
  let inputRef, selectRef;

  const query = createQuery(() => ["staff"], fetchStaffData);
  const customersQuery = createQuery(() => ["customers"], fetchCustomersData);
  const queryClient = useQueryClient();
  const insertMutation = createMutation(["staff"], newStaff => insertStaff(newStaff));
  const removeMutation = createMutation(["staff"], person => removeStaff(person));
  // const registerMutation = createMutation(["staff"], person => insertProfessional(person));

  const handleInsert = async e => {
    e.preventDefault();

    if (!selectRef.value)
      return addToast({
        status: "danger",
        duration: 2000,
        message: `O campo 'Categoria' não pode ficar vazio`,
      });
    if (!inputRef.value || !inputRef.validity.valid)
      return addToast({
        status: "danger",
        duration: 2000,
        message: `Email inválido. Por favor verifique se não há erros`,
      });

    const staff = {
      email: inputRef.value,
      category: selectRef.value,
    };
    const customers = customersQuery.data.customers;

    if (customers.some(c => c.email === staff.email))
      return addToast({
        status: "danger",
        duration: 10_000,
        title: "Já Existe um cliente cadastrado para esse email!",
        message: `Para liberar a criação de um novo membro com esse endereço de email, o Admin precisa deletar antes o paciente ${staff.email}.`,
      });

    insertMutation.mutate(staff, {
      onSuccess: (data, variables, context) => {
        addToast({
          message: "Membro cadastrado com sucesso!",
          status: "success",
          duration: 3000,
        });
        query.refetch();
      },
    });
  };

  const handleStaffRemove = async person => {
    if (!confirm(`certeza que você quer deletar membro com email ${person.email}?`)) return;

    removeMutation.mutate(person, {
      onSuccess: (data, variables, context) => {
        addToast({
          message: "Staff deletado com sucesso",
          status: "success",
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
      {/* REGISTER NEW STAFF */}
      <ListItem classes="p-4 mb-4">
        <h3 class="text-xl font-bold">Cadastrar Novo Membro</h3>

        <CollapseBox>
          <form onSubmit={handleInsert}>
            <div class="my-2">
              <label class="block w-full label-text ">Categoria</label>
              <select ref={selectRef} class="select select-bordered">
                <option value=""></option>
                <For each={CATEGORIES}>{category => <option value={category.value}>{category.name}</option>}</For>
              </select>
            </div>
            <div class="input-group mb-3">
              <label class="label-text ">
                Email
                <input
                  ref={inputRef}
                  type="email"
                  class="input input-primary input-bordered input-md w-full max-w-xs bg-white "
                  placeholder="Employee Email"
                />
              </label>
            </div>

            <div class="d-grid mb-5">
              <button class="btn btn-accent">
                Cadastrar
                <div>{insertMutation.isLoading && <Loading />}</div>
              </button>
            </div>
          </form>
        </CollapseBox>
      </ListItem>

      <div>{query.isLoading && <Loading />}</div>
      <div>{removeMutation.isLoading && <Loading />}</div>

      {/* STAFF LIST */}
      <ul class="list-group">
        <For each={query.data?.staff}>
          {person => (
            <div>
              <ListItem>
                <div class="flex hover:bg-base-100">
                  <div class="w-2" style={{ background: person?.isRegistered ? "#18e697" : "#bbb" }}></div>

                  <div class="w-[100%] p-2">
                    <div>{person.email}</div>
                    <div>{person.category}</div>
                    {person?.professional && person.isRegistered && (
                      <div class="text-base-300">professional id: {person?.professional?.id}</div>
                    )}
                  </div>
                  {/* </Link> */}

                  <Show when={person.category === "professional"} fallback={<div class="w-16"></div>}>
                    <div class="flex items-center">
                      <button
                        class="btn btn-ghost text-error mr-2"
                        type="button"
                        title="remover profissional"
                        onClick={e => handleStaffRemove(person)}
                      >
                        <FiTrash size={20} />
                      </button>
                    </div>
                  </Show>
                </div>
              </ListItem>
            </div>
          )}
        </For>
      </ul>
      {/* <pre>{JSON.stringify(query, null, 2)}</pre> */}
    </div>
  );
}
