import { useRouteData, Link } from "solid-app-router";
import { createSignal } from "solid-js";
import { insertStaff } from "../lib/mutationFuncs";
import { s } from "../styles";
import Button from "../shared/Button";
import Icon from "../shared/Icon";

export default function Staff() {
  let inputRef;
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  const [data, { mutateStaff, refetchStaff }] = useRouteData();

  const handleSubmit = async e => {
    console.log(e.preventDefault());
    if (!inputRef.validity.valid) {
      console.log("invalid email!");
      return;
    }
    setIsSubmitting(true);

    const newStaff = {
      name: inputRef.value.split("@")[0],
      email: inputRef.value,
    };

    const entry = await insertStaff(newStaff);
    // mutateStaff(entry);

    await refetchStaff();
    setIsSubmitting(false);

    return { entry };
  };

  const handleRegisterProfessional = async person => {
    console.log("register", person);
  };

  const handleUnregisterProfessional = async person => {
    console.log("unregister", person);
  };
  return (
    <div>
      <Link href="/admin">
        <Button kind="light" type="button" text="👈🏽" />
      </Link>
      <h1>Staff</h1>

      <div class="container">
        <form onSubmit={handleSubmit}>
          <div class="d-grid input-group mb-3">
            <label class="form-label">
              Email
              <input ref={inputRef} type="email" class="form-control" placeholder="Employee Email" />
            </label>
          </div>
          <div class="d-grid mb-5">
            <Button kind="CTA" text="Register Staff" />
          </div>
        </form>
      </div>

      <div>{(data.isLoading || isSubmitting()) && <div>Loading...</div>}</div>

      <ul class="list-group">
        <For each={data()?.staff}>
          {person => (
            <div>
              <li class="list-group-item d-flex justify-content-between">
                <div class="d-flex">
                  <div
                    style={{ ...s.listHighlight, background: person.isRegistered ? "#18e697" : "grey" }}
                  ></div>
                  <div>
                    {/* <div>{person.id}</div> */}
                    <div>{person.name}</div>
                    <div>{person.email}</div>
                    {person.isRegistered && <div>professional id: {person.professional.id}</div>}
                  </div>
                </div>
                <div class="d-flex">
                  <Show when={person.isRegistered}>
                    <Button kind="delete" type="button" onClick={e => handleUnregisterProfessional(person)} />
                  </Show>
                  <Show when={!person.isRegistered}>
                    <Button
                      kind="light"
                      type="button"
                      text={<Icon plus />}
                      onClick={e => handleRegisterProfessional(person)}
                    />
                  </Show>
                </div>
              </li>
            </div>
          )}
        </For>
      </ul>
      {/* <pre>{JSON.stringify(data(), null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(id(), null, 2)}</pre>
       */}
    </div>
  );
}
