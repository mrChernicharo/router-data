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
  parse,
  parseISO,
  startOfToday,
} from "date-fns";
import { createSignal } from "solid-js";
import { classss } from "../lib/helpers";

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

export default function Example() {
  let today = startOfToday();
  let [selectedDay, setSelectedDay] = createSignal(today);
  let [currentMonth, setCurrentMonth] = createSignal(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth(), "MMM-yyyy", new Date());

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  //   let selectedDayMeetings = meetings.filter(meeting =>
  //     isSameDay(parseISO(meeting.startDatetime), selectedDay())
  //   );

  return (
    <div class="pt-16">
      <div class="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
        <div class="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
          <div class="md:pr-14">
            <div class="flex items-center">
              <h2 class="flex-auto font-semibold text-gray-900">
                {format(firstDayCurrentMonth, "MMMM yyyy")}
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
              <For each={days}>
                {(day, dayIdx) => (
                  <div class={classss(dayIdx() === 0 && colStartClasses[getDay(day)], "py-1.5")}>
                    <button
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      class={classss(
                        isEqual(day, selectedDay()) && "text-white",
                        !isEqual(day, selectedDay()) && isToday(day) && "text-red-500",
                        !isEqual(day, selectedDay()) &&
                          !isToday(day) &&
                          isSameMonth(day, firstDayCurrentMonth) &&
                          "text-gray-900",
                        !isEqual(day, selectedDay()) &&
                          !isToday(day) &&
                          !isSameMonth(day, firstDayCurrentMonth) &&
                          "text-gray-400",
                        isEqual(day, selectedDay()) && isToday(day) && "bg-red-500",
                        isEqual(day, selectedDay()) && !isToday(day) && "bg-gray-900",
                        !isEqual(day, selectedDay()) && "hover:bg-gray-200",
                        (isEqual(day, selectedDay()) || isToday(day)) && "font-semibold",
                        "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                      )}
                    >
                      <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
                    </button>

                    <div class="w-1 h-1 mx-auto mt-1">
                      {/* {meetings.some(meeting => isSameDay(parseISO(meeting.startDatetime), day)) && (
                      <div class="w-1 h-1 rounded-full bg-sky-500"></div>
                    )} */}
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
          <section class="mt-12 md:mt-0 md:pl-14">
            <h2 class="font-semibold text-gray-900">
              Schedule for{" "}
              <time dateTime={format(selectedDay(), "yyyy-MM-dd")}>
                {format(selectedDay(), "MMM dd, yyy")}
              </time>
            </h2>
            <ol class="mt-4 space-y-1 text-sm leading-6 text-gray-500">
              {/* {selectedDayMeetings.length > 0 ? (
                selectedDayMeetings.map(meeting => <Meeting meeting={meeting} key={meeting.id} />)
              ) : (
                <p>No meetings for today.</p>
              )} */}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}

// const meetings = [
//   {
//     id: 1,
//     name: "Leslie Alexander",
//     imageUrl:
//       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//     startDatetime: "2022-05-11T13:00",
//     endDatetime: "2022-05-11T14:30",
//   },
//   {
//     id: 2,
//     name: "Michael Foster",
//     imageUrl:
//       "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//     startDatetime: "2022-05-20T09:00",
//     endDatetime: "2022-05-20T11:30",
//   },
//   {
//     id: 3,
//     name: "Dries Vincent",
//     imageUrl:
//       "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//     startDatetime: "2022-05-20T17:00",
//     endDatetime: "2022-05-20T18:30",
//   },
//   {
//     id: 4,
//     name: "Leslie Alexander",
//     imageUrl:
//       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//     startDatetime: "2022-06-09T13:00",
//     endDatetime: "2022-06-09T14:30",
//   },
//   {
//     id: 5,
//     name: "Michael Foster",
//     imageUrl:
//       "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//     startDatetime: "2022-05-13T14:00",
//     endDatetime: "2022-05-13T14:30",
//   },
// ];
