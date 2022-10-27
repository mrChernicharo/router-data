import { createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { userStore } from "../lib/userStore";

export default function CustomerRegisterForm(props) {
  const [currStep, setCurrStep] = createSignal(1);
  const [formStore, setFormStore] = createStore({});

  const FormComps = [
    <div>
      01
      <input
        type="text"
        value={formStore.firstName ?? ""}
        onChange={e => setFormStore("firstName", e.currentTarget.value)}
      />
    </div>,
    <div>
      02
      <input
        type="text"
        value={formStore.date_of_birth ?? ""}
        onChange={e => setFormStore("date_of_birth", e.currentTarget.value)}
      />
    </div>,
    <div>03</div>,
    <div>04</div>,
  ];

  const next = () => currStep() < FormComps.length && setCurrStep(prev => prev + 1);
  const back = () => currStep() > 1 && setCurrStep(prev => prev - 1);
  const isLastStep = () => currStep() === FormComps.length;
  const isFirstStep = () => currStep() === 1;
  const goTo = step => setCurrStep(step);

  return (
    <div>
      <h1>Register Form</h1>
      <div>{currStep()}</div>

      {FormComps[currStep() - 1]}

      <Show when={!isFirstStep()}>
        <button class="btn btn-ghost" onClick={back}>
          Back
        </button>
      </Show>

      <Show
        when={!isLastStep()}
        fallback={
          <button class="btn btn-ghost" onClick={next}>
            Finish
          </button>
        }
      >
        <button class="btn btn-ghost" onClick={next}>
          Next
        </button>
      </Show>

      <pre>{JSON.stringify(formStore, null, 2)}</pre>
    </div>
  );
}
