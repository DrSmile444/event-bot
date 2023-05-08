import { Composer } from 'grammy';

import { environmentConfig } from '../config';
import type { GrammyContext } from '../context';
import { startMessage } from '../messages';
import { botInviteQuery } from '../queries';

import { dailyPollComposer } from './daily-poll.composer';
import { forwardCommandComposer } from './forward-command.composer';
import { forwardPinComposer } from './forward-pin.composer';

export const activeRegisterComposer = new Composer<GrammyContext>();
const activeComposer = activeRegisterComposer.filter((context) => context.chat?.id === +environmentConfig.CHAT_ID);

activeComposer.on('my_chat_member', botInviteQuery(startMessage));
activeComposer.use(forwardCommandComposer);
activeComposer.use(forwardPinComposer);
activeComposer.use(dailyPollComposer);
