import dotenv from 'dotenv';
import { Bot, Composer } from 'grammy';
import type { UserFromGetMe } from 'grammy/out/types';

import { forwardCommandComposer, forwardPinComposer } from './composers';
import { environmentConfig } from './config';
import type { GrammyContext } from './context';
import { noAccessMessage, startMessage } from './messages';
import { selfDestructedReply } from './plugins';
import { cancelMenu, forwardChatReplyTransformer } from './transformers';

dotenv.config();

(async () => {
  const bot = new Bot<GrammyContext>(environmentConfig.BOT_TOKEN);

  bot.use(cancelMenu);
  bot.use(selfDestructedReply());
  bot.use((context, next) => {
    context.api.config.use(forwardChatReplyTransformer(context));
    return next();
  });

  bot.command('start', (context) => context.reply(startMessage, { parse_mode: 'HTML' }));

  const activeRegisterComposer = new Composer();
  const activeComposer = activeRegisterComposer.filter((context) => context.chat?.id === +environmentConfig.CHAT_ID);

  activeComposer.use(forwardCommandComposer);
  activeComposer.use(forwardPinComposer);

  const notActiveRegisterComposer = new Composer();
  const notActiveComposer = notActiveRegisterComposer.filter(
    (context) => context.chat?.id !== +environmentConfig.CHAT_ID && context.chat?.id !== +environmentConfig.CHANNEL_ID,
  );

  notActiveComposer.use((context) => context.reply(noAccessMessage, { parse_mode: 'HTML' }));

  bot.use(activeRegisterComposer);
  bot.use(notActiveRegisterComposer);

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
