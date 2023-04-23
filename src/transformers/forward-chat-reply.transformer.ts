import { Menu } from '@grammyjs/menu';
import type { RawApi, Transformer } from 'grammy';
import type { Payload } from 'grammy/out/core/client';

import { environmentConfig } from '../config';
import type { GrammyContext } from '../context';

export const cancelMenu = new Menu('cancel-menu').text('⛔️ Cancel', async (context) => {
  const messageRegex = /ID:(\d+)/g;
  const messageIdMatch = messageRegex.exec(context.msg?.text || '') || [];
  const messageId = +(messageIdMatch[1] || 0);

  if (!messageId) {
    return context.reply('Cannot merge message id 😢');
  }

  await context.api.deleteMessage(environmentConfig.CHANNEL_ID, messageId);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  await context.editMessageText('Message has been deleted!', { reply_markup: undefined as any });

  return null;
});

export const forwardChatReplyTransformer =
  (context: GrammyContext): Transformer =>
  async (previous, method, payload, signal) => {
    const response = await previous(method, payload, signal);

    if (method === 'forwardMessage') {
      const chatId = payload && typeof payload === 'object' && (payload as Payload<'forwardMessage', RawApi>).chat_id;
      const isChannelChatMessage = +chatId === +environmentConfig.CHANNEL_ID;

      if (isChannelChatMessage) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const result = (response as any)?.result?.message_id as number;

        await context.replyWithSelfDestructed(`Sent message. ID:${result} Cancel?`, {
          reply_to_message_id: context.msg?.message_id || 0,
          reply_markup: cancelMenu,
        });
      }
    }

    return response;
  };
