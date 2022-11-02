import { ALL_TIMES, STR_NUM_WEEKDAYS, SATURDAY_MAX_HOUR } from "./constants";
import { t } from "./translations";

export const dateToWeekday = n => {
  const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return t(weekdays[n]);
};
export const weekdayToDate = weekday => {
  return ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].findIndex(
    day => day === weekday
  );
};

export const timeStrToMinutes = timeStr => {
  const [hours, mins] = timeStr.split(":");

  const totalMinutes = +hours * 60 + +mins;
  // console.log({ timeStr, hours, mins, totalMinutes });
  return totalMinutes;
};
export const timeMinutesToStr = minutes =>
  `${parseInt(minutes / 60) < 10 ? `0${parseInt(minutes / 60)}` : parseInt(minutes / 60)}:${
    minutes % 60 > 0 ? minutes % 60 : `${minutes % 60}0`
  }`;

export const getWorkingHours = ({ min, max }) => {
  const allTimesInMinutes = ALL_TIMES.map(timeStrToMinutes);
  return allTimesInMinutes.filter(t => t >= timeStrToMinutes(min) && t <= timeStrToMinutes(max)).map(timeMinutesToStr);
};

export const WORKING_HOURS = getWorkingHours({ min: "08:00", max: "20:00" });

export const FULL_WEEK_AVAILABILITY = STR_NUM_WEEKDAYS.map(weekday => (weekday === "0" ? null : weekday))
  .filter(Boolean)
  .map(weekday =>
    weekday === "6"
      ? getWorkingHours({ min: "08:00", max: SATURDAY_MAX_HOUR }).map(hour => ({ day: weekday, time: hour }))
      : getWorkingHours({ min: "08:00", max: "20:00" }).map(hour => ({ day: weekday, time: hour }))
  )
  .flat(2);

export const getClosestDate = day => {
  const getDiffFromNextSameWeekday = weekday => {
    const futureWeekday = Number(weekday);
    const todayWeekday = new Date().getDay();
    let dayDiff;
    // same week
    if (futureWeekday > todayWeekday) dayDiff = futureWeekday - todayWeekday;
    // next week
    else dayDiff = futureWeekday + 7 - todayWeekday;
    return dayDiff;
  };

  const diff = getDiffFromNextSameWeekday(day);
  const daysFromFirstAppointment = diff < 2 ? diff + 7 : diff;
  const today = new Date().setHours(0, 0, 0);
  const closestPossibleDateTimestamp = today + daysFromFirstAppointment * 24 * 60 * 60 * 1000;
  // const closestPossibleDates = Array(4)
  //   .fill("")
  //   // 1005 gambiarra javascript enquanto não escolhemos uma lib para datas
  //   .map((_, i) => new Date(closestPossibleDateTimestamp + (i + 1) * 7 * 24 * 60 * 60 * 1005));
  return closestPossibleDateTimestamp;
};

export const ISODateStrFromDateAndTime = (dateStr, time) => {
  return new Date(
    new Date(dateStr).getTime() + timeStrToMinutes(time) * 60 * 1000 - new Date(dateStr).getTimezoneOffset() * 60 * 1000
  ).toISOString();
};

export const dateStrToDBDate = dateStr => {
  const [d, m, y] = dateStr.split("/");
  return `${y}-${m}-${d}`;
};

export const DBDateToDateStr = dbDate => {
  const [y, m, d] = dbDate.split("-");
  return `${d}/${m}/${y}`;
};

export const classss = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export const getStorageData = key => JSON.parse(localStorage.getItem(key));

export const setStorageData = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const organizeAvailabilities = availabilities => {
  if (!availabilities?.length) return;
  const avObj = {};

  availabilities.forEach(av => {
    if (!avObj[av.day]) avObj[av.day] = [];

    avObj[av.day].push(av);
  });

  // console.log("organizeAvailabilities", [...availabilities], avObj);

  return avObj;
};

export const parseActiveLink = path => {
  switch (true) {
    case /\/professional\/.+\/patients/.test(path):
      return "Pacientes";
    case /\/customer\/.+\/history/.test(path):
    case /\/professional\/.+\/history/.test(path):
      return "Histórico";
    case /\/customer\/.+\/calendar/.test(path):
    case /\/professional\/.+\/calendar/.test(path):
      return "Calendário";
    case /\/admin\/professionals/.test(path):
      return "Profissionais";
    case /\/admin\/customers/.test(path):
      return "Clientes";
    case /\/admin\/staff/.test(path):
      return "Membros";
    case /\/admin\/requests/.test(path):
      return "Requisições";
    case "/admin":
    case /\/customer\/.+/.test(path):
    case /\/professional\/.+/.test(path):
    default:
      return "Home";
  }
};
