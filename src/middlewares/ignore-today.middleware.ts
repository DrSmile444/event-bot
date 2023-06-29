import type { GrammyMiddleware } from '../context';
import { cannotSendPollTodayAgainMessage } from '../messages';

/**
 * Formats a date object into a string in the format "yyyy-mm-dd".
 *
 * @param {Date} date - The date object to be formatted.
 * @returns {string} The formatted date string.
 * @example
 * const date = new Date();
 * const formattedDate = formatDate(date);
 * console.log(formattedDate); // Output: "2023-06-29"
 */
function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Middleware function that ignores requests made on the same day.
 */
export const ignoreToday: GrammyMiddleware = (context, next) => {
  if (!context.session.lastPollDate) {
    context.session.lastPollDate = new Date().toISOString();
    return next();
  }

  if (formatDate(new Date(context.session.lastPollDate)) === formatDate(new Date())) {
    return context.reply(cannotSendPollTodayAgainMessage);
  }

  return next();
};
