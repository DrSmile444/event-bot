import { Menu } from '@grammyjs/menu';
import type { RawApi } from 'grammy';
import type { Other } from 'grammy/out/core/api';

import { environmentConfig } from '../config';
import type { GrammyMiddleware } from '../context';
import {
  confirmManualForwardMessage,
  forwardApproveMessage,
  forwardRejectMessage,
  manualForwardMessage,
  rejectManualForwardMessage,
  somethingWentWrongMessage,
} from '../messages';

export const confirmMenu = new Menu('confirm-menu')
  .text(forwardApproveMessage, async (context, next) => {
    const messageId = context.msg?.reply_to_message?.message_id;
    if (messageId) {
      await context.api.forwardMessage(environmentConfig.CHANNEL_ID, environmentConfig.CHAT_ID, messageId);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      await context.editMessageText(confirmManualForwardMessage, { reply_markup: undefined as any });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      await context.editMessageText(somethingWentWrongMessage, { reply_markup: undefined as any });
    }

    return next();
  })
  .text(forwardRejectMessage, async (context) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    await context.editMessageText(rejectManualForwardMessage, { reply_markup: undefined as any });

    return null;
  });

export const forwardInChannelMiddleware: GrammyMiddleware = async (context, next) => {
  const other: Other<RawApi, 'sendMessage', 'chat_id' | 'text'> = {
    parse_mode: 'HTML',
    reply_markup: confirmMenu,
    disable_web_page_preview: true,
  };

  if (context.msg?.reply_to_message) {
    other.reply_to_message_id = context.msg.reply_to_message.message_id;
  }

  if (context.msg?.pinned_message) {
    other.reply_to_message_id = context.msg.pinned_message.message_id;
  }

  await context.replyWithSelfDestructed(manualForwardMessage, other);
  return next();
};
