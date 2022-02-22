export const dateFormater = (dateToFormat) => {
  const timestamp = new Date(dateToFormat);
  const formatedDate = `${timestamp.getUTCDate()}-${
    timestamp.getUTCMonth() + 1
  }-${timestamp.getUTCFullYear()} ${timestamp.getUTCHours()}:${
    timestamp.getUTCMinutes() < 10
      ? "0" + timestamp.getUTCMinutes()
      : timestamp.getUTCMinutes()
  }`;

  return formatedDate;
};
