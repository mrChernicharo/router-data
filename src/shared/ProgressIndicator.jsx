import { Index } from "solid-js";
import { classss } from "../lib/helpers";

export default function ProgressIndicator(props) {
  return (
    <div data-component="ProgressIndicator">
      <div class="relative h-12 flex justify-center items-center">
        <Index each={Array(props.steps)}>
          {(_, idx) => {
            const step = idx + 1;
            return (
              <>
                <div
                  class={classss(["w-6 h-6 rounded-full ", step <= props.currStep ? " bg-primary " : " bg-base-300 "])}
                >
                  <div class="font-bold text-white text-center">{step}</div>
                </div>
                {step === props.steps ? null : (
                  <div class={classss(["w-4 h-1.5 ", step < props.currStep ? " bg-primary " : " bg-base-300 "])}></div>
                )}
              </>
            );
          }}
        </Index>
        <div class="absolute right-6">
          {props.currStep}/{props.steps}
        </div>
      </div>
    </div>
  );
}
// <div class="w-full border">
//   <ProgressIndicator steps={FormComponents.length} currStep={currStep()} />
// </div>
// <div class="">
//   {`0${currStep()}`}/{`0${FormComponents.length}`}
// </div>
