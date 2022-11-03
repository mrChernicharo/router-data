import { For, createSignal, createMemo, createEffect } from "solid-js";
import { useRouteData, Link } from "solid-app-router";
import { createQuery, createMutation } from "@tanstack/solid-query";

import PersonList from "../../shared/PersonList";
import ListItem from "../../shared/ListItem";
import Loading from "../../shared/Loading";
import { fetchCustomersData } from "../../lib/fetchFuncs";
import { insertCustomer, removeCustomer } from "../../lib/mutationFuncs";
import { channel } from "../../lib/supabaseClient";
import { FiMail, FiSearch, FiTrash } from "solid-icons/fi";
import { addToast } from "../../shared/Toast";

export default function Customers() {
  let inputRef;
  const query = createQuery(() => ["customers"], fetchCustomersData);
  const insertMutation = createMutation(["customers"], newCustomer => insertCustomer(newCustomer));
  const removeMutation = createMutation(["customers"], customer => removeCustomer(customer));

  const [filter, setFilter] = createSignal("");

  function handleInsert(e) {
    e.preventDefault();
    if (!inputRef.validity.valid) return console.log("invalid email!");

    const customer = {
      first_name: inputRef.value.split("@")[0],
      email: inputRef.value,
    };

    insertMutation.mutate(customer, {
      onSuccess: (data, variables, context) => {
        addToast({
          message: `${customer.first_name} cadastrado com sucesso!`,
          status: "success",
        });
        query.refetch();
      },
      onError: err => {
        addToast({
          message: err.message,
          status: "danger",
        });
      },
    });
  }

  function handleRemove(customer) {
    console.log("handleRemove", customer);
    if (!confirm(`certeza que você quer deletar ${customer.first_name}?`)) return;

    removeMutation.mutate(customer, {
      onSuccess: (data, variables, context) => {
        addToast({
          message: `${customer.first_name} deletado com sucesso`,
          status: "success",
        });
        query.refetch();
      },
    });
  }

  const filteredCustomers = () =>
    query.data?.customers
      .filter(c => c.first_name)
      .filter(d => (filter() ? d.first_name.toLowerCase().includes(filter().toLowerCase()) : d));

  channel.on("broadcast", { event: "customer_added" }, () => {
    query.refetch();
  });
  channel.on("broadcast", { event: "customer_removed" }, () => {
    query.refetch();
  });
  channel.on("broadcast", { event: "new_appointment_created" }, () => {
    query.refetch();
  });

  return (
    <div data-component="Customers">
      <div class="grid md:grid-cols-2">
        {/* FILTER CUSTOMERS */}
        <fieldset>
          <div>
            <h3 class="text-xl font-bold">Filtrar Clientes</h3>
            <div class="d-grid input-group mb-3">
              <label class="label-text font-bold">
                <div class="flex items-center gap-1">
                  Procurar
                  <FiSearch />
                </div>
                <input
                  type="text"
                  class="input input-primary input-bordered input-md w-full max-w-xs bg-white"
                  placeholder="digite o nome"
                  onInput={e => setFilter(e.currentTarget.value)}
                />
              </label>
            </div>
            <div class="d-grid mb-5"></div>
          </div>
        </fieldset>

        {/* REGISTER NEW CUSTOMER */}
        <form onSubmit={handleInsert}>
          <div class="d-grid input-group mb-3">
            <div>
              <h3 class="text-xl font-bold">Registrar Cliente</h3>

              <label class="label-text font-bold">
                <div class="flex items-center gap-1">
                  Email
                  <FiMail />
                </div>
                <input
                  ref={inputRef}
                  type="email"
                  class="input input-primary input-bordered input-md w-full max-w-xs bg-white"
                  placeholder="Email do cliente"
                />
              </label>
            </div>
          </div>
          <div class="d-grid mb-5">
            <button class="btn btn-accent">
              <h3>Registrar</h3>
            </button>
          </div>
        </form>
      </div>

      <div>{query.isLoading && <Loading />}</div>

      {/* <PersonList personList={query.data?.customers} url={`/admin/customers`} onDelete={handleRemove} /> */}

      {/* CUSTOMERS LIST */}
      <ul>
        <For each={filteredCustomers()}>
          {customer => (
            <ListItem>
              <div class="flex justify-between p-4 hover:bg-base-100">
                <Link class="w-[100%] text-decoration-none" href={`${`/admin/customers`}/${customer.id}`}>
                  <p class="text-xl font-bold">{customer.first_name}</p>
                  <p class="text-sm text-base-300">{customer.id}</p>
                  <p>{customer.email}</p>
                </Link>
                <div class="flex items-center pr-2">
                  <button class="btn btn-ghost text-error" onClick={e => handleRemove(customer)}>
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
