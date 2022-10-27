import { createSignal, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { userStore } from "../lib/userStore";
import { FiChevronLeft, FiChevronRight, FiCheck } from "solid-icons/fi";
import { useQueryClient } from "@tanstack/solid-query";

import AvailabilityTable from "../shared/AvailabilityTable";
import { useParams, useRouteData } from "solid-app-router";
import { t } from "../lib/tranlations";
import { dateToWeekday } from "../lib/helpers";

export default function CustomerRegisterForm(props) {
  const queryClient = useQueryClient();
  const params = useParams();
  const { customer } = queryClient.getQueryData(["customer", params.id]) ?? {};

  const [currStep, setCurrStep] = createSignal(1);
  const [formStore, setFormStore] = createStore({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phone: "",
    availability: customer.availability,
  });

  const next = () => currStep() < FormComponents.length && setCurrStep(prev => prev + 1);
  const back = () => currStep() > 1 && setCurrStep(prev => prev - 1);
  const isLastStep = () => currStep() === FormComponents.length;
  const isFirstStep = () => currStep() === 1;
  const currComponentIdx = () => currStep() - 1;
  // const goTo = step => setCurrStep(step);

  const isNextStepDisabled = () => {
    const disablingRequirements = {
      1: !formStore.firstName || !formStore.lastName,
      2: !formStore.dateOfBirth || !formStore.phone,
      3: formStore.availability.length < 3,
    };

    return disablingRequirements[currStep()];
  };

  function handleSubmit() {
    console.log("handleSubmit", { formStore, customer });
  }

  const WizardShell = props => {
    return (
      <div class="border">
        {props.children}
        <div class="border flex justify-end">
          <Show when={!isFirstStep()}>
            <button class="btn btn-ghost" onClick={back}>
              <FiChevronLeft /> Voltar
            </button>
          </Show>

          <Show
            when={!isLastStep()}
            fallback={
              <button class="btn btn-accent" onClick={handleSubmit}>
                <FiCheck class="mr-2 text-lg" /> Confirmar!
              </button>
            }
          >
            <button class="btn btn-ghost text-accent" onClick={next} disabled={isNextStepDisabled()}>
              Próximo <FiChevronRight />
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
        <h2 class="text-2xl font-bold">Confirmação</h2>

        <p>Confirme se seus dados estão corretos</p>

        <For each={Object.entries(formStore).filter(([k, v]) => k !== "availability")}>
          {([key, value]) => (
            <div>
              <div>
                {t(key)}:{value}
              </div>
            </div>
          )}
        </For>

        <div class="divider"></div>

        <div>Disponibilidade</div>
        <For each={formStore.availability ?? []}>
          {av => (
            <div>
              <div>{dateToWeekday(av.day)}</div>
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
      canEdit
      embedded
      open
      role="customer"
      person={userStore.user}
      availability={customer?.availability ?? []}
      onChange={values => setFormStore("availability", values)}
    />,
    <Confirmation />,
  ];

  return (
    <div>
      <h1>Register Form</h1>
      <div>{`0${currStep()}`}</div>

      <WizardShell>{FormComponents[currComponentIdx()]}</WizardShell>

      <pre>{JSON.stringify(formStore, null, 2)}</pre>
    </div>
  );
}
