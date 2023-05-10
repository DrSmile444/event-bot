import { Composer } from 'grammy';

import { environmentConfig } from '../config';
import type { GrammyContext } from '../context';

export const forwardPinComposer = new Composer<GrammyContext>();

forwardPinComposer.on(':pinned_message', async (context) => {
  await context.api.forwardMessage(environmentConfig.CHANNEL_ID, context.chat.id || 0, context.msg.pinned_message.message_id);
});
