import moment from "moment-timezone";

// Get local time and format to show only time
export const getLocalizedTime = (timestamp: string | number) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Get device timezone
  return moment(timestamp).tz(timeZone).format("HH:mm"); // Show only time (12-hour format)
};
