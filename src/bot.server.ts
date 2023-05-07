import express from 'express';
import type { Bot } from 'grammy';
import { webhookCallback } from 'grammy';

import { environmentConfig } from './config';
import type { GrammyContext } from './context';

const { PORT, RENDER_EXTERNAL_URL, BOT_TYPE, BOT_TOKEN } = environmentConfig;
const HOST = RENDER_EXTERNAL_URL || 'http://localhost';

export const runBotExpressServer = (bot: Bot<GrammyContext>) => {
  const app = express();

  app.use(express.json());

  app.get('/health-check', (_request, response) => response.json({ status: 'ok' }));

  const setBotWebhooks = () => {
    app.use(`/${BOT_TOKEN}`, webhookCallback(bot, 'express'));
  };

  const runExpressApp = () => {
    app.listen(PORT, () => {
      console.info(`Bot-server started on ${RENDER_EXTERNAL_URL ? HOST : `${HOST}:${PORT}`}`);

      if (BOT_TYPE === 'webhooks') {
        console.info(`Bot ??? started on webhooks!`, new Date().toString());

        const webhookUrl = `${HOST}/${BOT_TOKEN}`;
        bot.api
          .setWebhook(webhookUrl)
          .then((result) => {
            if (result) {
              console.info(`Webhook is set to ${webhookUrl}`);
            } else {
              console.info('Webhook is not set :(');
            }
          })
          .catch((error) => {
            console.info(`Cannot set webhook to ${webhookUrl}`);
            console.error(error);
          });
      }
    });
  };

  return { expressApp: app, runExpressApp, setBotWebhooks };
};
