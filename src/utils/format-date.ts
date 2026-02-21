export const formatDate = (timestamp: number | string): string => {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

//   console.log(formatDate(1739462400000)); // Example timestamp
