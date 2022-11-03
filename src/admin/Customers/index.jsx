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
import CollapseBox from "../../shared/CollapseBox";

export default function Customers() {
  let inputRef;
  const query = createQuery(() => ["customers"], fetchCustomersData);
  const insertMutation = createMutation(["customers"], newCustomer => insertCustomer(newCustomer));
  const removeMutation = createMutation(["customers"], customer => removeCustomer(customer));

  const [filter, setFilter] = createSignal("");
  const [newCustomerEmail, setNewCustomerEmail] = createSignal("");
  const [deletingCustomerId, setDeletingCustomerId] = createSignal("");

  function handleInsert(e) {
    e.preventDefault();
    if (!inputRef.value || !inputRef.validity.valid) return console.log("invalid email!");

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
    setDeletingCustomerId(customer.id);

    removeMutation.mutate(customer, {
      onSuccess: (data, variables, context) => {
        addToast({
          message: `${customer.first_name} foi deletado(a) com sucesso`,
          status: "success",
        });
        query.refetch();
      },
      onSettled: () => {
        setTimeout(() => setDeletingCustomerId(""), 1000);
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
      <div class="grid md:grid-cols-2 mb-3">
        {/* FILTER CUSTOMERS */}
        <fieldset>
          <div>
            <div class="">
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
          <div class="mt-3">
            <ListItem>
              <div class="p-4 min-w-[300px]">
                <h3 class="text-xl font-bold">Registrar Cliente</h3>
                <CollapseBox>
                  <label class="label-text font-bold">
                    <div class="flex items-center gap-1">
                      Email
                      <FiMail />
                    </div>
                    <input
                      ref={inputRef}
                      value={newCustomerEmail()}
                      type="email"
                      class="input input-primary input-bordered input-md w-full max-w-xs bg-white"
                      placeholder="Email do cliente"
                      onInput={e => setNewCustomerEmail(e.currentTarget.value)}
                    />
                  </label>

                  <div class="mt-4">
                    <button class="btn btn-accent" disabled={!newCustomerEmail()}>
                      <div class="w-8 h-5"></div>
                      <h3>Registrar</h3>
                      {insertMutation.isLoading ? (
                        <Loading classes="ml-2" color="#fff" />
                      ) : (
                        <div class="w-10 h-8"></div>
                      )}
                    </button>
                  </div>
                </CollapseBox>
              </div>
            </ListItem>
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
                    {deletingCustomerId() === customer.id ? <Loading /> : <FiTrash size={22} />}
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
