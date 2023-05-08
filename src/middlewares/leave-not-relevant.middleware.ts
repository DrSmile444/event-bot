import type { GrammyMiddleware } from '../context';

export const leaveNotRelevantMiddleware: GrammyMiddleware = async (context, next) => {
  if (context.chat?.type === 'group' || context.chat?.type === 'supergroup') {
    await context.leaveChat();
  }

  return next();
};
