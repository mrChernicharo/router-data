import { createEffect, createMemo, createSignal, onMount } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import { classss } from "../lib/helpers";

const [toastContext, setToastContext] = createStore([]);

const root = document.documentElement;

const COLORS = {
  success: " bg-success ",
  warn: " bg-warning ",
  danger: " bg-error ",
  default: " bg-base-300 ",
};

/**
 * @function addToast
 *
 * @param {Object} info
 * @param {string} info.title
 * @param {string} info.message
 * @param {string} info.status
 * @param {number} info.duration
 */

function ToastContainer(props) {
  return (
    <div
      data-component="ToastContainer"
      class="fixed top-8 right-0 pr-8 select-none pointer-events-none z-[10000]"
    >
      <For each={toastContext}>{toast => <Toast {...toast} />}</For>
    </div>
  );
}

function Toast(props) {
  let toastRef;

  onMount(() => {
    root.style.setProperty("--toast-duration", props.duration ?? 2000);
  });

  return (
    <div
      ref={toastRef}
      class={classss(
        "bottom-[100px] p-4 left-1/2 rounded-[10px] z-[10000]",
        COLORS[props.status] ? COLORS[props.status] : COLORS.default
      )}
      style={{
        width: "fit-content",
        transform: "translateX(-50%)",
        animation: "render-toaster",
        "animation-duration": props.duration / 1000 + "s",
        "animation-timing-function": "ease",
        "animation-fill-mode": "forwards",
      }}
    >
      {props.title && <div class="text-lg font-bold">{props.title}</div>}
      <div>{props.message}</div>
    </div>
  );
}

const addToast = info => {
  const id = Math.random();
  const toast = { id, duration: 2000, status: "default", ...info };

  setToastContext(prev => [...prev, toast]);

  // console.log("called addToast", unwrap(toastContext));

  setTimeout(() => setToastContext(prev => prev.filter(t => t.id !== id)), toast.duration);
};

export { ToastContainer, addToast };
