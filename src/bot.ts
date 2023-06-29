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
import { getBotStartMessage, startMessage } from './messages';
import { confirmMenu, webhookOptimizationMiddleware } from './middlewares';
import { selfDestructedReply } from './plugins';
import { cancelMenu, forwardChatReplyTransformer } from './transformers';
import { globalErrorHandler } from './utils';

export const setupBot = async (bot: Bot<GrammyContext>, version: string) => {
  await commandSetter(bot, version);

  let sessionStorage: ReturnType<typeof freeStorage> = {
    read: () => Promise.resolve(null),
    write: () => Promise.resolve(),
    delete: () => Promise.resolve(),
    getToken: () => Promise.resolve('token'),
  };

  if (environmentConfig.NODE_ENV === 'local') {
    bot.use((context, next) => {
      context.session = {};
      return next();
    });
  } else {
    sessionStorage = freeStorage<SessionData>(bot.token);
    bot.use(
      session({
        initial: () => ({}),
        storage: sessionStorage,
      }),
    );
  }

  bot.use(cancelMenu);
  bot.use(confirmMenu);
  bot.use(selfDestructedReply());
  bot.use(webhookOptimizationMiddleware);
  bot.use((context, next) => {
    context.api.config.use(forwardChatReplyTransformer(context));
    return next();
  });

  bot.command('start', (context) => context.reply(startMessage, { parse_mode: 'HTML' }));
  bot.command('version', (context) => context.reply(version, { parse_mode: 'HTML' }));
  bot.command('debug', (context) =>
    context.reply(`ChatID: <code>${context.chat.id}</code>\nMessageId: <code>${context.msg?.message_id}</code>`, { parse_mode: 'HTML' }),
  );

  bot.use(activeRegisterComposer);
  bot.use(notActiveRegisterComposer);

  bot.catch(globalErrorHandler);

  const logNewVersion = async () => {
    const lastVersion = await sessionStorage.read('version');

    if (!lastVersion || lastVersion !== version) {
      await bot.api.sendMessage(environmentConfig.CHAT_ID, getBotStartMessage(version), { parse_mode: 'HTML' });
      await sessionStorage.write('version', version);
    }
  };

  const runLongPooling = async () => {
    await bot.start({
      onStart: () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const botInfo = bot.me as UserFromGetMe;
        console.info(`Bot @${botInfo.username} started on long-polling!`, new Date().toString());

        logNewVersion().catch(() => {
          console.error('Cannot log new version');
        });
      },
    });
  };

  return { runLongPooling, logNewVersion };
};
