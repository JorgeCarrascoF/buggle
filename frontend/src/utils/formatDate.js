export const formatDate = (dateString) => {
  if (!dateString) return "Invalid Date";

  const date = new Date(dateString);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  
  return `${day}/${month}/${year}`;
};
