import express from 'express';

import { environmentConfig } from './config';

const port = 3000;

export const runBotExpressServer = () => {
  const app = express();

  app.get('/health-check', (_request, response) => response.json({ status: 'ok' }));

  app.listen(environmentConfig.PORT, () => {
    console.info(`Bot-server started on http://localhost:${environmentConfig.PORT}`);
  });

  return app;
};
