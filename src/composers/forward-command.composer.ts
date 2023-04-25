import { Composer } from 'grammy';
import { environmentConfig } from '../config';

export const forwardCommandComposer = new Composer();

forwardCommandComposer.command('forward',  async (context)=> {
    if(context.msg?.reply_to_message !== undefined) {
        return context.api.forwardMessage(environmentConfig.CHANNEL_ID, environmentConfig.CHAT_ID, context.msg.reply_to_message?.message_id || 0);
    } 
    return await context.reply('Ви не виділили повідомлення');
})
