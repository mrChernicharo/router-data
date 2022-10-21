import { Show } from "solid-js";
import { classss } from "../lib/helpers";
import { s } from "../lib/styles";

export default function Badge(props) {
  return (
    <div class={classss([props.classes, " relative"])}>
      <Show when={props.success}>
        <div style={{ ...s.badge, right: props.alignRight ? "-6px" : "unset", background: "#1eecb5" }}></div>
      </Show>
      <Show when={props.warn}>
        <div style={{ ...s.badge, right: props.alignRight ? "-6px" : "unset", background: "#ffc506" }}></div>
      </Show>
      <Show when={props.danger}>
        <div style={{ ...s.badge, right: props.alignRight ? "-6px" : "unset", background: "#ea2020" }}></div>
      </Show>
    </div>
  );
}
