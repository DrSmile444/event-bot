import express from 'express';

import { environmentConfig } from './config';

export const runBotExpressServer = () => {
  const app = express();

  app.get('/health-check', (_request, response) => response.json({ status: 'ok' }));

  const runExpressApp = () => {
    app.listen(environmentConfig.PORT, () => {
      console.info(`Bot-server started on http://localhost:${environmentConfig.PORT}`);
    });
  };

  return { expressApp: app, runExpressApp };
};
