import { ALL_TIMES } from "./constants";

export const dateToWeekday = n => {
  const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return weekdays[n];
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
  return allTimesInMinutes
    .filter(t => t >= timeStrToMinutes(min) && t <= timeStrToMinutes(max))
    .map(timeMinutesToStr);
};

export const WORKING_HOURS = getWorkingHours({ min: "08:00", max: "20:00" });

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
    new Date(dateStr).getTime() +
      timeStrToMinutes(time) * 60 * 1000 -
      new Date(dateStr).getTimezoneOffset() * 60 * 1000
  ).toISOString();
};

export const classss = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export const translateError = message => {
  const translations = {
    "Invalid login credentials": "Credenciais inválidas. Verifique se Email e Senha estão corretos",
  };

  return translations[message] ? translations[message] : message;
};
