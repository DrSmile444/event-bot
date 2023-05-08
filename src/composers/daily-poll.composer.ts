import { Composer } from 'grammy';

import { environmentConfig } from '../config';
import type { GrammyContext } from '../context';
import { getPollOptionMessages, getPollQuestionMessage } from '../messages';

export const dailyPollComposer = new Composer<GrammyContext>();

dailyPollComposer.command('poll', async (context, next) => {
  const date = new Date().toLocaleString('uk-UA', { day: 'numeric', month: 'long', weekday: 'long' });

  const pollMessage = await context.replyWithPoll(getPollQuestionMessage(date), getPollOptionMessages(), {
    allows_multiple_answers: true,
    is_anonymous: false,
  });

  await context.api.forwardMessage(environmentConfig.CHANNEL_ID, pollMessage.chat.id, pollMessage.message_id);

  return next();
});
