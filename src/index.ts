import { Bot, webhookCallback } from 'grammy';
import type { UserFromGetMe } from 'grammy/out/types';

import { setupBot } from './bot';
import { runBotExpressServer } from './bot.server';
import { environmentConfig } from './config';
import type { GrammyContext } from './context';

(async () => {
  const bot = new Bot<GrammyContext>(environmentConfig.BOT_TOKEN);
  const expressApp = runBotExpressServer();

  await setupBot(bot);

  if (environmentConfig.BOT_TYPE === 'long-polling' || !environmentConfig.BOT_TYPE) {
    await bot.start({
      onStart: () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const botInfo = bot.me as UserFromGetMe;
        console.info(`Bot @${botInfo.username} started on long-polling!`, new Date().toString());
      },
    });
  } else {
    expressApp.use(webhookCallback(bot, 'express'));
    console.info(`Bot ??? started on webhooks!`, new Date().toString());
  }

  expressApp.listen(environmentConfig.PORT, () => {
    console.info(`Bot-server started on http://localhost:${environmentConfig.PORT}`);
  });
})().catch((error) => {
  console.error('Bot cannot start due to:', error);
});