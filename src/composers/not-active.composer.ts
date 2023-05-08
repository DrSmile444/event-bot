import { Composer } from 'grammy';

import { environmentConfig } from '../config';
import type { GrammyContext } from '../context';
import { forbiddenInviteMessage } from '../messages';
import { leaveNotRelevantMiddleware } from '../middlewares';
import { botInviteQuery } from '../queries';

export const notActiveRegisterComposer = new Composer<GrammyContext>();
const notActiveComposer = notActiveRegisterComposer.filter(
  (context) => context.chat?.id !== +environmentConfig.CHAT_ID && context.chat?.id !== +environmentConfig.CHANNEL_ID,
);

notActiveComposer.on('my_chat_member', botInviteQuery(forbiddenInviteMessage), leaveNotRelevantMiddleware);
