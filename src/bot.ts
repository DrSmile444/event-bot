import dotenv from 'dotenv';
import type { Bot } from 'grammy';
import type { UserFromGetMe } from 'grammy/out/types';

import { activeRegisterComposer } from './composers/active.composer';
import { notActiveRegisterComposer } from './composers/not-active.composer';
import { commandSetter } from './command-setter';
import type { GrammyContext } from './context';
import { startMessage } from './messages';
import { webhookOptimizationMiddleware } from './middlewares';
import { selfDestructedReply } from './plugins';
import { cancelMenu, forwardChatReplyTransformer } from './transformers';
import { globalErrorHandler } from './utils';

dotenv.config();

export const setupBot = async (bot: Bot<GrammyContext>) => {
  await commandSetter(bot);

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
