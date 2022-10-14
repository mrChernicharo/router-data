import { For, createSignal } from "solid-js";
import { useRouteData, Link } from "solid-app-router";
import { createQuery, createMutation } from "@tanstack/solid-query";

import PersonList from "../../shared/PersonList";
import Button from "../../shared/Button";
import Loading from "../../shared/Loading";
import { s } from "../../lib/styles";
import { fetchCustomersData } from "../../lib/fetchFuncs";
import { insertCustomer, removeCustomer } from "../../lib/mutationFuncs";

export default function Customers() {
  let inputRef;
  const query = createQuery(() => ["customers"], fetchCustomersData);
  const insertMutation = createMutation(["customers"], newCustomer => insertCustomer(newCustomer));
  const removeMutation = createMutation(["customers"], person => removeCustomer(person));

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

  return (
    <div data-component="Customers">
      <Link href="/admin">
        <Button kind="light" type="button" text="👈🏽" />
      </Link>

      <h1>Customers</h1>

      <div class="container">
        <h3>Register new Customer</h3>

        <form onSubmit={handleInsert}>
          <div class="d-grid input-group mb-3">
            <label class="form-label">
              Email
              <input ref={inputRef} type="email" class="form-control" placeholder="Employee Email" />
            </label>
          </div>
          <div class="d-grid mb-5">
            <Button kind="CTA" text={<h3 style={{ margin: 0 }}>Register</h3>} />
          </div>
        </form>
      </div>

      <div>{query.isLoading && <Loading />}</div>

      <PersonList persons={query.data?.customers} url={`/admin/customers`} />

      {/* <pre>{JSON.stringify(query, null, 2)}</pre> */}
    </div>
  );
}
