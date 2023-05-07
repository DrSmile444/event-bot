import { Bot } from 'grammy';

import { setupBot } from './bot';
import { runBotExpressServer } from './bot.server';
import { environmentConfig } from './config';
import type { GrammyContext } from './context';

(async () => {
  const bot = new Bot<GrammyContext>(environmentConfig.BOT_TOKEN);
  const { runLongPooling } = await setupBot(bot);

  const { runExpressApp, setBotWebhooks } = runBotExpressServer(bot);

  if (environmentConfig.BOT_TYPE === 'long-polling' || !environmentConfig.BOT_TYPE) {
    runExpressApp();
    await runLongPooling();
  } else {
    setBotWebhooks();
    runExpressApp();
  }
})().catch((error) => {
  console.error('Bot cannot start due to:', error);
});
