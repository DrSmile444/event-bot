import { freeStorage } from '@grammyjs/storage-free';
import type { Bot } from 'grammy';
import { session } from 'grammy';
import type { UserFromGetMe } from 'grammy/out/types';

import { activeRegisterComposer } from './composers/active.composer';
import { notActiveRegisterComposer } from './composers/not-active.composer';
import { commandSetter } from './command-setter';
import { environmentConfig } from './config';
import type { GrammyContext } from './context';
import type { SessionData } from './interfaces';
import { startMessage } from './messages';
import { webhookOptimizationMiddleware } from './middlewares';
import { selfDestructedReply } from './plugins';
import { cancelMenu, forwardChatReplyTransformer } from './transformers';
import { globalErrorHandler } from './utils';

export const setupBot = async (bot: Bot<GrammyContext>) => {
  await commandSetter(bot);

  if (environmentConfig.NODE_ENV === 'local') {
    bot.use((context, next) => {
      context.session = {};
      return next();
    });
  } else {
    bot.use(
      session({
        initial: () => ({}),
        storage: freeStorage<SessionData>(bot.token),
      }),
    );
  }

  bot.use(cancelMenu);
  bot.use(selfDestructedReply());
  bot.use(webhookOptimizationMiddleware);
  bot.use((context, next) => {
    context.api.config.use(forwardChatReplyTransformer(context));
    return next();
  });

  bot.command('start', (context) => context.reply(startMessage, { parse_mode: 'HTML' }));
  bot.command('debug', (context) =>
    context.reply(`ChatID: <code>${context.chat.id}</code>\nMessageId: <code>${context.msg?.message_id}</code>`, { parse_mode: 'HTML' }),
  );

  bot.use(activeRegisterComposer);
  bot.use(notActiveRegisterComposer);

  bot.catch(globalErrorHandler);

  const runLongPooling = async () => {
    await bot.start({
      onStart: () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const botInfo = bot.me as UserFromGetMe;
        console.info(`Bot @${botInfo.username} started on long-polling!`, new Date().toString());
      },
    });
  };

  return { runLongPooling };
};
