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
