import { FaSolidChevronRight, FaSolidChevronDown, FaSolidX } from "solid-icons/fa";
import { FiX } from "solid-icons/fi";
import { Show, createSignal } from "solid-js";
import Button from "./Button";

export default function CollapseBox(props) {
  const [isOpen, setIsOpen] = createSignal(!!props.open);

  return (
    <div data-component="CollapseBox" class="relative">
      <Show
        when={isOpen()}
        fallback={
          <button class="btn btn-ghost absolute right-0 -bottom-2" onClick={e => setIsOpen(true)}>
            <FaSolidChevronDown />
          </button>
        }
      >
        <button class="btn btn-ghost absolute right-0 bottom-auto" onClick={e => setIsOpen(false)}>
          <FiX size={20} />
        </button>
        {props.children}
      </Show>
    </div>
  );
}
