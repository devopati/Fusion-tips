import moment from "moment-timezone";

// const utcDateString = "2025-02-25T15:30:00.000Z";

// Convert to timestamp (milliseconds)
// const timestamp = new Date(utcDateString).getTime();

// Get local date in YYYY-MM-DD format
export const getLocalizedDate = (timestamp: string | number) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Get device timezone
  return moment(timestamp).tz(timeZone).format("DD/MM/YYYY"); // Format as date only
};
