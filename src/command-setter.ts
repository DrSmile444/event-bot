import type { Bot } from 'grammy';

import type { GrammyContext } from './context';

export const commandSetter = (bot: Bot<GrammyContext>) =>
  bot.api.setMyCommands([
    {
      command: '/start',
      description: '🏐 Почати роботу',
    },
    {
      command: '/forward',
      description: 'Переслати повідомлення',
    },
  ]);
