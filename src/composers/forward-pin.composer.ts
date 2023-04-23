import { Composer } from 'grammy';

import { environmentConfig } from '../config';

export const forwardPinComposer = new Composer();

forwardPinComposer.on(':pinned_message', async (context) => {
  await context.api.forwardMessage(environmentConfig.CHANNEL_ID, context.chat.id || 0, context.msg.pinned_message.message_id);
});
