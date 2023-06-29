import { Composer } from 'grammy';

import type { GrammyContext } from '../context';
import { ignoredOldMessage } from '../messages';
import { forwardInChannelMiddleware, ignoreOld } from '../middlewares';

export const forwardPinComposer = new Composer<GrammyContext>();

forwardPinComposer.on(
  ':pinned_message',
  ignoreOld(ignoredOldMessage),
  async (context, next) => {
    if (context.from?.is_bot) {
      return;
    }

    return next();
  },
  forwardInChannelMiddleware,
);
