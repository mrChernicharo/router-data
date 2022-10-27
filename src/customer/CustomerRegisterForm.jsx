import { createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { userStore } from "../lib/userStore";
import { FiChevronLeft, FiChevronRight, FiCheck } from "solid-icons/fi";

import AvailabilityTable from "../shared/AvailabilityTable";

export default function CustomerRegisterForm(props) {
  const [currStep, setCurrStep] = createSignal(1);
  const [formStore, setFormStore] = createStore({});

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
      </div>
    );
  };

  const Confirmation = props => {
    return <div>Confirmation</div>;
  };

  const FormComps = [
    <FirstForm />,
    <SecondForm />,
    <AvailabilityTable role="customer" canEdit person={userStore.user} availability={[]} />,
    <Confirmation />,
  ];

  const next = () => currStep() < FormComps.length && setCurrStep(prev => prev + 1);
  const back = () => currStep() > 1 && setCurrStep(prev => prev - 1);
  const isLastStep = () => currStep() === FormComps.length;
  const isFirstStep = () => currStep() === 1;
  const goTo = step => setCurrStep(step);
  const currComponentIdx = () => currStep() - 1;

  return (
    <div>
      <h1>Register Form</h1>
      <div>{`0${currStep()}`}</div>

      {FormComps[currComponentIdx()]}

      <div class="border flex justify-end">
        <Show when={!isFirstStep()}>
          <button class="btn btn-ghost" onClick={back}>
            <FiChevronLeft /> Back
          </button>
        </Show>

        <Show
          when={!isLastStep()}
          fallback={
            <button class="btn btn-ghost" onClick={next}>
              <FiCheck /> Finish
            </button>
          }
        >
          <button class="btn btn-ghost" onClick={next}>
            Next <FiChevronRight />
          </button>
        </Show>
      </div>

      <pre>{JSON.stringify(formStore, null, 2)}</pre>
    </div>
  );
}
