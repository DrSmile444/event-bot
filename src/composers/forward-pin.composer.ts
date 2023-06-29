import { Composer } from 'grammy';

import { environmentConfig } from '../config';
import type { GrammyContext } from '../context';
import { ignoredOldMessage } from '../messages';
import { ignoreOld } from '../middlewares';

export const forwardPinComposer = new Composer<GrammyContext>();

forwardPinComposer.on(':pinned_message', ignoreOld(ignoredOldMessage), async (context) => {
  if (context.from?.is_bot) {
    return;
  }

  await context.api.forwardMessage(environmentConfig.CHANNEL_ID, context.chat.id || 0, context.msg.pinned_message.message_id);
});
