import { Match, Switch } from "solid-js";
import { classss } from "../lib/helpers";

const [accent] = ["#f472b6"];

// console.log({ accent });

export default function Loading(props) {
  const spinnerStyles = {
    "border-bottom-color": "transparent",
    "border-top-color": props.color || "#f472b6",
    "border-left-color": props.color || "#f472b6",
    "border-right-color": props.color || "#f472b6",
  };

  return (
    // <div class={classss(props.classes, "w-full h-full flex justify-center items-center")}>
    <Switch>
      <Match when={props.large}>
        <div class={classss(props.classes, "w-full h-full flex justify-center items-center")}>
          <div style={spinnerStyles} class="w-16 h-16 border-4 border-double rounded-full animate-spin"></div>
        </div>
      </Match>
      <Match when={props.medium}>
        <div class={classss(props.classes, "flex justify-center items-center")}>
          <div style={spinnerStyles} class="w-12 h-12 border-4 border-double rounded-full animate-spin"></div>
        </div>
      </Match>
      <Match when={props.small ?? true}>
        <div class={classss(props.classes, "flex justify-center items-center")}>
          <div style={spinnerStyles} class="w-8 h-8 border-4 border-double rounded-full animate-spin"></div>
        </div>
      </Match>
    </Switch>
    // </div>
  );
}
