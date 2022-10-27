import { createSignal, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { userStore } from "../lib/userStore";
import { FiChevronLeft, FiChevronRight, FiCheck } from "solid-icons/fi";
import { useQueryClient } from "@tanstack/solid-query";

import AvailabilityTable from "../shared/AvailabilityTable";
import { useParams, useRouteData } from "solid-app-router";

export default function CustomerRegisterForm(props) {
  // const availability = useRouteData()
  const [currStep, setCurrStep] = createSignal(1);
  const [formStore, setFormStore] = createStore({});

  const queryClient = useQueryClient();
  const params = useParams();

  const { customer } = queryClient.getQueryData(["customer", params.id]) ?? {};

  onMount(() => {
    console.log({ customer, av: customer?.availability });
  });

  function handleSubmit() {
    console.log({ formStore, customer });
  }

  const WizardShell = props => {
    return (
      <div class="border">
        {props.children}
        <div class="border flex justify-end">
          <Show when={!isFirstStep()}>
            <button class="btn btn-ghost" onClick={back}>
              <FiChevronLeft /> Back
            </button>
          </Show>

          <Show
            when={!isLastStep()}
            fallback={
              <button class="btn btn-accent" onClick={handleSubmit}>
                <FiCheck /> Finish
              </button>
            }
          >
            <button class="btn btn-ghost" onClick={next}>
              Next <FiChevronRight />
            </button>
          </Show>
        </div>
      </div>
    );
  };

  const FirstForm = props => {
    return (
      <div>
        <label class="label">
          <span class="label-text">Nome</span>
        </label>
        <input
          type="text"
          class="input w-full max-w-xs"
          value={formStore.firstName ?? ""}
          onChange={e => setFormStore("firstName", e.currentTarget.value)}
        />

        <label class="label">
          <span class="label-text">Sobrenome</span>
        </label>
        <input
          type="text"
          class="input w-full max-w-xs"
          value={formStore.lastName ?? ""}
          onChange={e => setFormStore("lastName", e.currentTarget.value)}
        />
      </div>
    );
  };

  const SecondForm = props => {
    return (
      <div>
        <label class="label">
          <span class="label-text">Data de nascimento</span>
        </label>
        <input
          type="text"
          class="input w-full max-w-xs"
          value={formStore.dateOfBirth ?? ""}
          onChange={e => setFormStore("dateOfBirth", e.currentTarget.value)}
        />

        <label class="label">
          <span class="label-text">Telefone</span>
        </label>
        <input
          type="text"
          class="input w-full max-w-xs"
          value={formStore.phone ?? ""}
          onChange={e => setFormStore("phone", e.currentTarget.value)}
        />
      </div>
    );
  };

  const Confirmation = props => {
    return (
      <div>
        <h2>Confirmação</h2>

        <p>Confirme se seus dados estão corretos</p>

        <For each={Object.entries(formStore)}>
          {([key, value]) => (
            <div>
              <div>
                {key}:{value}
              </div>
            </div>
          )}
        </For>

        <For each={customer?.availability ?? []}>
          {av => (
            <div>
              <div>{av.day}</div>
              <div>{av.time}</div>
            </div>
          )}
        </For>
      </div>
    );
  };

  const FormComponents = [
    <FirstForm />,
    <SecondForm />,
    <AvailabilityTable
      role="customer"
      canEdit
      person={userStore.user}
      availability={customer?.availability ?? []}
      open
    />,
    <Confirmation />,
  ];

  const next = () => currStep() < FormComponents.length && setCurrStep(prev => prev + 1);
  const back = () => currStep() > 1 && setCurrStep(prev => prev - 1);
  const isLastStep = () => currStep() === FormComponents.length;
  const isFirstStep = () => currStep() === 1;
  const goTo = step => setCurrStep(step);
  const currComponentIdx = () => currStep() - 1;

  return (
    <div>
      <h1>Register Form</h1>
      <div>{`0${currStep()}`}</div>

      <WizardShell>{FormComponents[currComponentIdx()]}</WizardShell>

      <pre>{JSON.stringify(formStore, null, 2)}</pre>
    </div>
  );
}
