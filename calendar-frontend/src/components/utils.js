export const convertToLocalDate = (dateString) => {
  if (!dateString) return "";
  const utcDate = new Date(dateString);
  const localDate = new Date(
    utcDate.getTime() - utcDate.getTimezoneOffset() * 60000
  );
  return localDate.toISOString().split("T")[0]; // YYYY-MM-DD
};

export const formatDateForSprint = (date) => {
  if (!date) return "";
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().split("T")[0]; // YYYY-MM-DD
};

export const formatDateTimeForTask = (date) => {
  if (!date) return "";
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().replace("T", " ").split(".")[0]; // YYYY-MM-DD HH:MM:SS
};
