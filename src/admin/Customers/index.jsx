import { For, createSignal, createMemo } from "solid-js";
import { useRouteData, Link } from "solid-app-router";
import { createQuery, createMutation } from "@tanstack/solid-query";

import PersonList from "../../shared/PersonList";
import ListItem from "../../shared/ListItem";
import Loading from "../../shared/Loading";
import { fetchCustomersData } from "../../lib/fetchFuncs";
import { insertCustomer, removeCustomer } from "../../lib/mutationFuncs";
import { channel } from "../../lib/supabaseClient";
import { FiMail, FiSearch, FiTrash } from "solid-icons/fi";
import { addToast } from "../../shared/ToastContainer";

export default function Customers() {
  let inputRef;
  const query = createQuery(() => ["customers"], fetchCustomersData);
  const insertMutation = createMutation(["customers"], newCustomer => insertCustomer(newCustomer));
  const removeMutation = createMutation(["customers"], id => removeCustomer(id));

  const [filter, setFilter] = createSignal("");

  function handleInsert(e) {
    e.preventDefault();
    if (!inputRef.validity.valid) {
      return console.log("invalid email!");
    }

    const customer = {
      name: inputRef.value.split("@")[0],
      email: inputRef.value,
    };

    insertMutation.mutate(customer, {
      onSuccess: (data, variables, context) => {
        console.log("inserted customer!", { data, variables, context });
        query.refetch();
      },
    });
  }

  function handleRemove(customer) {
    console.log("handleRemove", customer);
    if (!confirm(`certeza que você quer deletar ${customer.name}?`)) return;

    removeMutation.mutate(customer.id, {
      onSuccess: (data, variables, context) => {
        addToast({
          message: `${customer.name} deletado com sucesso`,
          status: "danger",
        });
        query.refetch();
      },
    });
  }

  const filteredCustomers = createMemo(() =>
    query.data?.customers.filter(d => (filter() ? d.name.toLowerCase().includes(filter().toLowerCase()) : d))
  );

  channel.on("broadcast", { event: "customer_added" }, () => {
    query.refetch();
  });
  channel.on("broadcast", { event: "customer_removed" }, () => {
    query.refetch();
  });

  return (
    <div data-component="Customers">
      <div class="flex justify-around mt-6">
        {/* FILTER CUSTOMERS */}
        <fieldset>
          <div>
            <h3 class="text-xl font-bold">Filter Customers</h3>
            <div class="d-grid input-group mb-3">
              <label class="form-label">
                <div class="flex items-center gap-1">
                  Filter <FiSearch />
                </div>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search"
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
              <h3 class="text-xl font-bold">Register new Customer</h3>

              <label class="form-label">
                <div class="flex items-center gap-1">
                  Email <FiMail />
                </div>
                <input ref={inputRef} type="email" class="form-control" placeholder="Customer Email" />
              </label>
            </div>
          </div>
          <div class="d-grid mb-5">
            <button class="btn btn-accent">
              <h3 style={{ margin: 0 }}>Register</h3>
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
                  <p class="text-xl font-bold">{customer.name}</p>
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
