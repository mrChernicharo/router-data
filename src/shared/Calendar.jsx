import { FiChevronLeft, FiChevronRight } from "solid-icons/fi";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  lastDayOfMonth,
  parse,
  parseISO,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { createEffect, createSignal } from "solid-js";
import { classss } from "../lib/helpers";
import { addDays } from "date-fns/esm";

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

export default function Calendar(props) {
  let today = startOfToday();
  let [selectedDay, setSelectedDay] = createSignal(null);
  let [currentMonth, setCurrentMonth] = createSignal(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = () => parse(currentMonth(), "MMM-yyyy", new Date());

  let days = () =>
    eachDayOfInterval({
      start: firstDayCurrentMonth(),
      end: endOfMonth(firstDayCurrentMonth()),
    });

  const prevMonthLastDays = () => {
    const weekStart = startOfWeek(firstDayCurrentMonth());

    return firstDayCurrentMonth().getDay() === 0
      ? []
      : eachDayOfInterval({
          start: weekStart,
          end: lastDayOfMonth(weekStart),
        });
  };

  const nextMonthInitialDays = () => {
    const monthLastDay = lastDayOfMonth(firstDayCurrentMonth());
    const daysTilSaturday = 6 - monthLastDay.getDay();
    const start = addDays(monthLastDay, 1);
    const end = addDays(monthLastDay, daysTilSaturday);

    return eachDayOfInterval({ start, end });
  };

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth(), { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth(), { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  createEffect(() => {
    props.onDateSelected(selectedDay());

    console.log({
      firstDayCurrentMonth: firstDayCurrentMonth(),
      prevMonthLastDays: prevMonthLastDays(),
      nextMonthInitialDays: nextMonthInitialDays(),
    });
  });

  return (
    <div class="pt-2 pb-6">
      <div class={`px-4 mx-auto`} style={{ width: `min(100vw, ${props.width ?? "600px"})` }}>
        <div class="">
          <div class="flex items-center">
            <h2 class="flex-auto font-semibold text-gray-900">
              {format(firstDayCurrentMonth(), "MMMM yyyy")}
            </h2>
            <button
              type="button"
              onClick={previousMonth}
              class="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span class="sr-only">Previous month</span>
              <FiChevronLeft class="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              onClick={nextMonth}
              type="button"
              class="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span class="sr-only">Next month</span>
              <FiChevronRight class="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
          <div class="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
            <div>S</div>
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
          </div>
          <div class="grid grid-cols-7 mt-2 text-sm">
            <For each={[...prevMonthLastDays(), ...days(), ...nextMonthInitialDays()]}>
              {(day, dayIdx) => {
                return (
                  <div class={"py-1.5"}>
                    {/* <div class={classss(dayIdx() === 0 && colStartClasses[getDay(day)], "py-1.5")}> */}
                    <button
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      class={classss(
                        isEqual(day, selectedDay()) && "text-white",
                        !isEqual(day, selectedDay()) && isToday(day) && "text-accent",
                        !isEqual(day, selectedDay()) &&
                          !isToday(day) &&
                          isSameMonth(day, firstDayCurrentMonth()) &&
                          "text-base-content",
                        !isEqual(day, selectedDay()) &&
                          !isToday(day) &&
                          !isSameMonth(day, firstDayCurrentMonth()) &&
                          "text-base-300",
                        isEqual(day, selectedDay()) && isToday(day) && "bg-secondary",
                        isEqual(day, selectedDay()) && !isToday(day) && "bg-accent",
                        !isEqual(day, selectedDay()) && "hover:bg-base-200",
                        (isEqual(day, selectedDay()) || isToday(day)) && "font-semibold",
                        "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                      )}
                    >
                      <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
                    </button>
                  </div>
                );
              }}
            </For>
          </div>
        </div>
      </div>
    </div>
  );
}
