import { formatDistanceToNow, fromUnixTime, format } from 'date-fns';

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
