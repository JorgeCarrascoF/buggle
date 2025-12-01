const splitDate = (dateString) => {
  const date = new Date(dateString);

  const day =
    String(date.getUTCDate()).padStart(2, "0") +
    "/" +
    String(date.getUTCMonth() + 1).padStart(2, "0") +
    "/" +
    date.getUTCFullYear();

  const hour =
    String(date.getUTCHours()).padStart(2, "0") +
    ":" +
    String(date.getUTCMinutes()).padStart(2, "0");

  return { day, hour };
};

export default splitDate;
