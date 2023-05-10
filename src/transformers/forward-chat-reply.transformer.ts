import { Menu } from '@grammyjs/menu';
import type { ApiResponse } from '@grammyjs/types/api';
import type { RawApi, Transformer } from 'grammy';
import type { Payload } from 'grammy/out/core/client';
import type { MessageEntity } from 'typegram/message';

import { environmentConfig } from '../config';
import { userChannelId } from '../const';
import type { GrammyContext } from '../context';
import {
  approveMessage,
  cancelAutoForwardedMessage,
  cannotFindForwardedMessage,
  cannotPinMessage,
  getAutoForwardedMessage,
  rejectMessage,
} from '../messages';

export const cancelMenu = new Menu('cancel-menu')
  .text(approveMessage, (context) => context.deleteMessage())
  .text(rejectMessage, async (context) => {
    const urlRegex = new RegExp(`https://t.me/c/${userChannelId}/(\\d+)`);
    const urlEntity = context.msg?.entities?.find((entity) => entity.type === 'text_link' && urlRegex.test(entity.url)) as
      | MessageEntity.TextLinkMessageEntity
      | undefined;

    if (!urlEntity) {
      return context.reply('Cannot parse message id 😢');
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
      const forwardPayload = payload && typeof payload === 'object' && (payload as Payload<'forwardMessage', RawApi>);
      const forwardResponse = response as unknown as ApiResponse<Awaited<ReturnType<RawApi['forwardMessage']>>>;

      if (!forwardPayload || !forwardResponse || !forwardResponse.ok) {
        return response;
      }

      const chatId = forwardPayload.chat_id;
      const isChannelChatMessage = +chatId === +environmentConfig.CHANNEL_ID;

      if (isChannelChatMessage) {
        const messageId = forwardResponse.result.message_id;

        await context
          .replyWithSelfDestructed(getAutoForwardedMessage(messageId), {
            reply_to_message_id: forwardPayload.message_id || 0,
            reply_markup: cancelMenu,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          })
          .catch(() => context.reply(cannotFindForwardedMessage));

        /**
         * Pin the polls in channel chat
         * */
        if (forwardResponse.result.poll) {
          await context.api.pinChatMessage(chatId, messageId).catch(async () => {
            await context.reply(cannotPinMessage);
          });
        }
      }
    }

    return response;
  };
