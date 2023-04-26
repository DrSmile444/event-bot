import type { ErrorHandler } from 'grammy';
import { GrammyError, HttpError } from 'grammy';

import type { GrammyContext } from '../context';

/**
 * Global error handler for the bot
 * */
export const globalErrorHandler: ErrorHandler<GrammyContext> = (botError) => {
  const { ctx, error } = botError;
  console.error(`Error while handling update ${ctx.update.update_id}:`);

  if (error instanceof GrammyError) {
    console.error('**** GLOBAL-HANDLED ERROR **** Error in request:', error.description);
  } else if (error instanceof HttpError) {
    console.error('**** GLOBAL-HANDLED ERROR **** Could not contact Telegram:', error);
  } else {
    console.error('**** GLOBAL-HANDLED ERROR **** Unknown error:', error);
  }

  console.error('*** GLOBAL-HANDLED ERROR CTX ***', ctx);
};
