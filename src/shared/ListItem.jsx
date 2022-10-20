import { classss } from "../lib/helpers";

export default function ListItem(props) {
  return (
    <div
      class={classss(
        props.classes,
        props.divide && "divide-y divide-slate-400/20",
        "rounded-lg bg-white text-[0.8125rem] leading-5 text-slate-900 shadow-xl shadow-black/5 ring-1 ring-slate-700/10"
      )}
    >
      {props.children}
    </div>
  );
}
