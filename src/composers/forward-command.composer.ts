import { Composer } from 'grammy';
import { environmentConfig } from '../config';
import { unCorrectUseForwardCommand } from "../messages";

export const forwardCommandComposer = new Composer();

forwardCommandComposer.command('forward',  async (context)=> {
    if(context.msg?.reply_to_message) {
        return context.api.forwardMessage(environmentConfig.CHANNEL_ID, environmentConfig.CHAT_ID, context.msg.reply_to_message?.message_id || 0);
    }
    return await context.reply(unCorrectUseForwardCommand);
})
