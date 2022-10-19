import { createEffect, createMemo, createSignal, onMount } from "solid-js";
import { createStore, unwrap } from "solid-js/store";

const [toastContext, setToastContext] = createStore([
  // { id: 1, message: "heloooooo", status: "success", duration: 2000 },
  // { id: 2, message: "heloooooo2", status: "default", duration: 3000 },
  // { id: 3, message: "heloooooo2", status: "warn", duration: 4000 },
]);

const addToast = info => {
  const id = Math.random();
  const toast = { id, duration: 2000, status: "default", ...info };

  setToastContext(prev => [...prev, toast]);

  console.log("called addToast", unwrap(toastContext));

  setTimeout(() => setToastContext(prev => prev.filter(t => t.id !== id)), toast.duration);
};

function ToastContainer(props) {
  // setTimeout(() => {
  //   addToast({ message: "heloooooo", status: "success", duration: 4000 });
  // }, 1000);

  // setTimeout(() => {
  //   addToast({ message: "heloooooo2", status: "warn", duration: 3000 });
  // }, 2000);

  // setTimeout(() => {
  //   addToast({ message: "heloooooo3", status: "default", duration: 5000 });
  // }, 3000);

  // setTimeout(() => {
  //   addToast({ message: "heloooooo4", status: "danger", duration: 2000 });
  // }, 4000);

  // setTimeout(() => {
  //   console.log(unwrap(toastContext));
  // }, 5000);

  return (
    <div
      style={{
        // border: "1px solid red",
        position: "fixed",
        top: "50px",
        right: "20px",
      }}
    >
      <For each={toastContext}>{toast => <Toast {...toast} />}</For>
    </div>
  );
}

function Toast(props) {
  let toastRef;
  const root = document.documentElement;

  const colors = {
    success: "green",
    warn: "goldenrod",
    danger: "red",
    default: "#eee",
  };

  onMount(() => {
    root.style.setProperty("--toast-duration", props.duration ?? 2000);
  });

  return (
    <div
      ref={toastRef}
      style={{
        border: "1px solid",
        width: "fit-content",
        bottom: "100px",
        left: "50%",
        transform: "translateX(-50%)",
        background: colors[props.status] ? colors[props.status] : colors.default,
        animation: "render-toaster",
        "animation-duration": props.duration / 1000 + "s",
        "animation-timing-function": "ease",
        "animation-fill-mode": "forwards",
      }}
    >
      <div>{props.message}</div>
    </div>
  );
}

// addToast({ message: "heelo" });
export { ToastContainer, addToast };

{
  /* <Toast message="default" status="haaa" duration={3_000} />
      <Toast message="oh crap" status="danger" duration={9_000} />
      <Toast message="warning" status="warn" duration={6_000} />
      <Toast message="hello" status="success" duration={12_000} /> */
}
