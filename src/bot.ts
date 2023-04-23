import dotenv from 'dotenv';
import { Bot, Composer } from 'grammy';
import type { UserFromGetMe } from 'grammy/out/types';

import { forwardCommandComposer, forwardPinComposer } from './composers';
import { environmentConfig } from './config';
import type { GrammyContext } from './context';
import { selfDestructedReply } from './plugins';
import { forwardChatReplyTransformer } from './transformers';

dotenv.config();

(async () => {
  // Create an instance of the `Bot` class and pass your authentication token to it.
  const bot = new Bot<GrammyContext>(environmentConfig.BOT_TOKEN); // <

  bot.use(selfDestructedReply());
  bot.use((context, next) => {
    context.api.config.use(forwardChatReplyTransformer(context));
    return next();
  });

  // -- put your authentication token between the ""

  // You can now register listeners on your bot object `bot`.
  // grammY will call the listeners when users send messages to your bot.

  // Handle the /start command.
  bot.command('start', (context) => context.reply(`Welcome! Up and running. Chat id: ${context.chat?.id}`));

  const activeRegisterComposer = new Composer();
  const activeComposer = activeRegisterComposer.filter((context) => context.chat?.id === +environmentConfig.CHAT_ID);

  activeComposer.use(forwardCommandComposer);
  activeComposer.use(forwardPinComposer);

  const notActiveRegisterComposer = new Composer();
  const notActiveComposer = notActiveRegisterComposer.filter((context) => context.chat?.id !== +environmentConfig.CHAT_ID);

  notActiveComposer.use((context) => context.reply('You cant use this bot in this chat. Sorry'));

  bot.use(activeRegisterComposer);
  bot.use(notActiveRegisterComposer);

  // Start the bot.
  await bot.start({
    onStart: () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const botInfo = bot.me as UserFromGetMe;
      console.info(`Bot @${botInfo.username} started!`, new Date().toString());
    },
  });
})().catch((error) => {
  console.error('Bot cannot start due to:', error);
});
