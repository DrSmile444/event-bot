import { Composer } from 'grammy';

import { environmentConfig } from '../config';
import type { GrammyContext } from '../context';
import { pollOptionMessages, pollQuestionMessage } from '../messages';

export const dailyPollComposer = new Composer<GrammyContext>();

dailyPollComposer.command('poll', async (context, next) => {
  const pollMessage = await context.replyWithPoll(pollQuestionMessage, pollOptionMessages, {
    allows_multiple_answers: true,
  });

  await context.api.forwardMessage(environmentConfig.CHANNEL_ID, pollMessage.chat.id, pollMessage.message_id);

  return next();
});
