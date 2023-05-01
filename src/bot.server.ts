import express from 'express';

export const runBotExpressServer = () => {
  const app = express();

  app.get('/health-check', (_request, response) => response.json({ status: 'ok' }));

  return app;
};
