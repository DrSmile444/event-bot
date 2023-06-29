import type { Bot } from 'grammy';

import type { GrammyContext } from './context';

export const commandSetter = (bot: Bot<GrammyContext>, version: string) =>
  bot.api.setMyCommands([
    {
      command: '/start',
      description: '🏐 Почати роботу',
    },
    {
      command: '/poll',
      description: '📊 Створити голосування',
    },
    {
      command: '/forward',
      description: '📤 Переслати повідомлення',
    },
    {
      command: '/version',
      description: `🏷️ Версія бота - ${version}`,
    },
  ]);
