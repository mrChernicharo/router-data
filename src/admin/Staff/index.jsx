import { createEffect, createSignal } from "solid-js";
import { useRouteData, Link } from "solid-app-router";
import { createMutation, createQuery } from "@tanstack/solid-query";
import { channel } from "../../lib/supabaseClient";

import { fetchStaffData } from "../../lib/fetchFuncs";
import { insertStaff, insertProfessional, removeStaff } from "../../lib/mutationFuncs";

import { s } from "../../lib/styles";
import Button from "../../shared/Button";
import Icon from "../../shared/Icon";
import Loading from "../../shared/Loading";

export default function Staff() {
  let inputRef;
  // const [isSubmitting, setIsSubmitting] = createSignal(false);

  const query = createQuery(() => ["staff"], fetchStaffData);
  const insertMutation = createMutation(["staff"], newStaff => insertStaff(newStaff));
  const removeMutation = createMutation(["staff"], person => removeStaff(person));
  const registerMutation = createMutation(["staff"], person => insertProfessional(person));

  const handleInsert = async e => {
    e.preventDefault();

    if (!inputRef.validity.valid) {
      return console.log("invalid email!");
    }

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
      onSuccess: () => query.refetch(),
    });
  };

  const handleStaffRemove = async person => {
    removeMutation.mutate(person, {
      onSuccess: (data, variables, context) => {
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
      <Link href="/admin">
        <Button kind="light" type="button" text="👈🏽" />
      </Link>
      <h1>Staff</h1>

      <div class="container">
        <h3>Register new Staff</h3>

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

      <ul class="list-group">
        <For each={query.data?.staff}>
          {person => (
            <div>
              <li class="list-group-item flex justify-content-between">
                <div class="flex">
                  <div
                    style={{ ...s.listHighlight, background: person.isRegistered ? "#18e697" : "#bbb" }}
                  ></div>
                  <div>
                    <div class="fw-bold">{person.name}</div>
                    <div>{person.email}</div>
                    {person.isRegistered && <div>professional id: {person.professional.id}</div>}
                  </div>
                </div>
                <div class="flex">
                  <Show when={!person.isRegistered}>
                    <Button
                      kind="light"
                      type="button"
                      text={<Icon plus />}
                      onClick={e => handleProfessionalRegister(person)}
                    />
                  </Show>
                  <Button kind="delete" type="button" onClick={e => handleStaffRemove(person)} />
                </div>
              </li>
            </div>
          )}
        </For>
      </ul>
      {/* <pre>{JSON.stringify(query, null, 2)}</pre> */}
    </div>
  );
}
