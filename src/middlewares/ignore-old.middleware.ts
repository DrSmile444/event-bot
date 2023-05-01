import type { RawApi } from 'grammy';
import type { Other } from 'grammy/out/core/api';

import type { GrammyMiddleware } from '../context';

export const ignoreOld =
  (message: string, threshold = 5 * 60): GrammyMiddleware =>
  (context, next) => {
    if (context.msg?.date && Date.now() / 1000 - context.msg.date > threshold) {
      const other: Other<RawApi, 'sendMessage', 'chat_id' | 'text'> = { parse_mode: 'HTML' };

      if (context.msg.reply_to_message) {
        other.reply_to_message_id = context.msg.reply_to_message.message_id;
      }

      if (context.msg.pinned_message) {
        other.reply_to_message_id = context.msg.pinned_message.message_id;
      }

      return context.reply(message, other);
    }

    return next();
  };
