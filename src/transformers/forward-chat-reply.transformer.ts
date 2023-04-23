import type { RawApi, Transformer } from 'grammy';
import type { Payload } from 'grammy/out/core/client';

import { environmentConfig } from '../config';
import type { GrammyContext } from '../context';

export const forwardChatReplyTransformer =
  (context: GrammyContext): Transformer =>
  async (previous, method, payload, signal) => {
    if (method === 'forwardMessage') {
      const chatId = payload && typeof payload === 'object' && (payload as Payload<'forwardMessage', RawApi>).chat_id;
      const isChannelChatMessage = +chatId === +environmentConfig.CHANNEL_ID;

      if (isChannelChatMessage) {
        await context.replyWithSelfDestructed('Sent message. Cancel?', { reply_to_message_id: context.msg?.message_id || 0 });
      }
    }

    return previous(method, payload, signal);
  };
