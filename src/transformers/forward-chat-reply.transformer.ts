import { Menu } from '@grammyjs/menu';
import type { RawApi, Transformer } from 'grammy';
import type { Payload } from 'grammy/out/core/client';
import type { MessageEntity } from 'typegram/message';

import { environmentConfig } from '../config';
import { userChannelId } from '../const';
import type { GrammyContext } from '../context';
import { approveMessage, cancelAutoForwardedMessage, getAutoForwardedMessage, rejectMessage } from '../messages';

export const cancelMenu = new Menu('cancel-menu')
  .text(approveMessage, (context) => context.deleteMessage())
  .text(rejectMessage, async (context) => {
    const urlRegex = new RegExp(`https://t.me/c/${userChannelId}/(\\d+)`);
    const urlEntity = context.msg?.entities?.find((entity) => entity.type === 'text_link' && urlRegex.test(entity.url)) as
      | MessageEntity.TextLinkMessageEntity
      | undefined;

    if (!urlEntity) {
      return context.reply('Cannot merge message id 😢');
    }

    const { url } = urlEntity;
    const messageIdMatch = urlRegex.exec(url) || [];
    const messageId = +(messageIdMatch[1] || 0);

    await context.api.deleteMessage(environmentConfig.CHANNEL_ID, messageId);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    await context.editMessageText(cancelAutoForwardedMessage, { reply_markup: undefined as any });

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
        const messageId = (response as any)?.result?.message_id as number;

        await context.replyWithSelfDestructed(getAutoForwardedMessage(messageId), {
          reply_to_message_id: context.msg?.message_id || 0,
          reply_markup: cancelMenu,
          parse_mode: 'HTML',
        });
      }
    }

    return response;
  };
