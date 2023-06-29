import { Composer } from 'grammy';

import { environmentConfig } from '../config';
import type { GrammyContext } from '../context';
import { getPollOptionMessages, getPollQuestionMessage, ignoredOldMessage } from '../messages';
import { ignoreOld, ignoreToday } from '../middlewares';

export const dailyPollComposer = new Composer<GrammyContext>();

dailyPollComposer.command('poll', ignoreOld(ignoredOldMessage), ignoreToday, async (context, next) => {
  const date = new Date().toLocaleString('uk-UA', { day: 'numeric', month: 'long', weekday: 'long' });

  const pollMessage = await context.replyWithPoll(getPollQuestionMessage(date), getPollOptionMessages(), {
    allows_multiple_answers: true,
    is_anonymous: false,
  });

  await context.api.pinChatMessage(context.chat.id, pollMessage.message_id);
  await context.api.forwardMessage(environmentConfig.CHANNEL_ID, pollMessage.chat.id, pollMessage.message_id);

  context.session.lastPollDate = new Date().toISOString();

  return next();
});
