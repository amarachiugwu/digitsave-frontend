import { formatDistanceToNow, fromUnixTime, format, differenceInDays } from 'date-fns';

/**
 * Converts a Unix timestamp to a relative time description like "2 days ago".
 * @param timestamp - The Unix timestamp to convert.
 * @returns A relative time description.
 */
export function toRelativeTime(timestamp: number): string {
  const date = fromUnixTime(timestamp);
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Converts a Unix timestamp to a formatted date string like "24-04-2024".
 * @param timestamp - The Unix timestamp to convert.
 * @returns A formatted date string.
 */
export function toFormattedDate(timestamp: number): string {
  const date = fromUnixTime(timestamp);
  return format(date, 'dd-MM-yyyy');
}


export function calculatePercentageDaysGone(accountCreatedTimestamp: number, futureDateTimestamp: number): number {
  const accountCreatedDate = fromUnixTime(accountCreatedTimestamp);
  const futureDate = fromUnixTime(futureDateTimestamp);
  const currentDate = new Date(); // Current date in milliseconds
  // console.log(futureDate, currentDate);

  // Calculate the total number of days between account creation and the future date
  const totalDays = differenceInDays(futureDate, accountCreatedDate);

  // Calculate the number of days passed from account creation to today
  const daysPassed = differenceInDays(currentDate, accountCreatedDate);

  // Calculate the percentage of days gone
  const percentageDaysGone = (daysPassed / totalDays) * 100;

  // Ensure the percentage doesn't go above 100% or below 0%
  return Math.min(Math.max(percentageDaysGone, 0), 100);
}
