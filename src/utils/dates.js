import moment from 'moment';

export const dateToISOLocal = (utc_date) => {
  const offsetMs = utc_date.getTimezoneOffset() * 60 * 1000;
  const msLocal = utc_date.getTime() - offsetMs;
  const dateLocal = new Date(msLocal);
  const iso = dateLocal.toISOString();
  const isoLocal = iso.slice(0, 16);
  return isoLocal;
};

export const localDateStringToUTC = (date_string) => {
  return new Date(date_string).toISOString().slice(0, 16);
};

export const dateToLocalDateTime = (utc_date) => {
  const [date, time] = dateToISOLocal(utc_date).split('T');
  return { date, time };
};

//Date
export const isValidDateInterval = (
  start_date,
  start_time,
  end_date,
  end_time
) => {
  const startDate = new Date(new Date(start_date + 'T' + start_time));
  if (!isValidDate(startDate)) return false;
  const endDate = new Date(new Date(end_date + 'T' + end_time));
  if (!isValidDate(endDate)) return false;

  const now = new Date();

  return startDate <= now && endDate <= now && startDate <= endDate;
};

const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

export const formatDateString = (dateString) =>
  new Date(dateString.slice(0, dateString.length - 3) + 'Z').toLocaleString();

export const previousMonth = (n = 1) => {
  const date = new Date();
  date.setMonth(date.getMonth() - n);
  return date;
};

export const previousWeek = (n = 1) => {
  const date = new Date();
  date.setHours(date.getHours() - n * 7 * 24);
  return date;
};

export const previousDay = (n = 1) => {
  const date = new Date();
  date.setHours(date.getHours() - n * 24);
  return date;
};

export const previousHour = (n = 1) => {
  const date = new Date();
  date.setHours(date.getHours() - n);
  return date;
};

export const splitDate = (date) => {
  const md = moment(date);
  return { date: md.format('YYYY-MM-DD'), time: md.format('HH:mm') };
};
