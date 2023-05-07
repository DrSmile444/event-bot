import { Composer } from 'grammy';

import { environmentConfig } from '../config';
import type { GrammyContext } from '../context';
import { ignoredOldMessage, unCorrectUseForwardCommand } from '../messages';
import { ignoreOld } from '../middlewares';

export const forwardCommandComposer = new Composer<GrammyContext>();

forwardCommandComposer.command('forward', ignoreOld(ignoredOldMessage), async (context) => {
  if (context.msg?.reply_to_message) {
    return context.api.forwardMessage(
      environmentConfig.CHANNEL_ID,
      environmentConfig.CHAT_ID,
      context.msg.reply_to_message?.message_id || 0,
    );
  }

  return context.reply(unCorrectUseForwardCommand, { parse_mode: 'HTML', reply_to_message_id: context.msg.message_id || 0 });
});
