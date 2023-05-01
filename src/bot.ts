import dotenv from 'dotenv';
import type { Bot } from 'grammy';
import { Composer } from 'grammy';

import { commandSetter } from './command-setter';
import { forwardCommandComposer, forwardPinComposer } from './composers';
import { environmentConfig } from './config';
import type { GrammyContext } from './context';
import { forbiddenInviteMessage, startMessage } from './messages';
import { selfDestructedReply } from './plugins';
import { botInviteQuery } from './queries';
import { cancelMenu, forwardChatReplyTransformer } from './transformers';
import { globalErrorHandler } from './utils';

dotenv.config();

export const setupBot = async (bot: Bot<GrammyContext>) => {
  await commandSetter(bot);

  bot.use(cancelMenu);
  bot.use(selfDestructedReply());
  bot.use((context, next) => {
    context.api.config.use(forwardChatReplyTransformer(context));
    return next();
  });

  bot.command('start', (context) => context.reply(startMessage, { parse_mode: 'HTML' }));
  bot.command('debug', (context) =>
    context.reply(`ChatID: <code>${context.chat.id}</code><br>MessageId: <code>${context.msg?.message_id}</code>`, { parse_mode: 'HTML' }),
  );

  const activeRegisterComposer = new Composer<GrammyContext>();
  const activeComposer = activeRegisterComposer.filter((context) => context.chat?.id === +environmentConfig.CHAT_ID);

  activeComposer.on('my_chat_member', botInviteQuery(startMessage));
  activeComposer.use(forwardCommandComposer);
  activeComposer.use(forwardPinComposer);

  const notActiveRegisterComposer = new Composer<GrammyContext>();
  const notActiveComposer = notActiveRegisterComposer.filter(
    (context) => context.chat?.id !== +environmentConfig.CHAT_ID && context.chat?.id !== +environmentConfig.CHANNEL_ID,
  );

  notActiveComposer.on('my_chat_member', botInviteQuery(forbiddenInviteMessage));

  bot.use(activeRegisterComposer);
  bot.use(notActiveRegisterComposer);

  bot.catch(globalErrorHandler);
};
