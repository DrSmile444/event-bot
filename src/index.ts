import * as fs from 'node:fs';
import * as path from 'node:path';
import { Bot } from 'grammy';
import type { PackageJson } from 'type-fest';

import { setupBot } from './bot';
import { runBotExpressServer } from './bot.server';
import { environmentConfig } from './config';
import type { GrammyContext } from './context';

(async () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')).toString()) as PackageJson;
  const bot = new Bot<GrammyContext>(environmentConfig.BOT_TOKEN);
  const { runLongPooling, logNewVersion } = await setupBot(bot, packageJson.version || 'unknown');

  const { runExpressApp, setBotWebhooks } = runBotExpressServer(bot);

  if (environmentConfig.BOT_TYPE === 'long-polling' || !environmentConfig.BOT_TYPE) {
    runExpressApp();
    await runLongPooling();
  } else {
    setBotWebhooks();
    runExpressApp();
    await logNewVersion();
  }
})().catch((error) => {
  console.error('Bot cannot start due to:', error);
});
