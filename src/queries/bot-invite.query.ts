import type { ChatMember } from '@grammyjs/types/manage';

import type { GrammyQueryMiddleware } from '../context';

export const botInviteQuery =
  (message: string): GrammyQueryMiddleware<'my_chat_member'> =>
  async (context, next) => {
    const newStatuses = new Set<ChatMember['status']>(['member', 'administrator']);
    const oldStatuses = new Set<ChatMember['status']>(['left', 'kicked']);

    // Invite as a normal member or admin
    if (oldStatuses.has(context.myChatMember.old_chat_member.status) && newStatuses.has(context.myChatMember.new_chat_member.status)) {
      await context.reply(message, { parse_mode: 'HTML' });
    }

    return next();
  };
