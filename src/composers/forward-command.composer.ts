import { Composer } from 'grammy';
import { environmentConfig } from '../config';

export const forwardCommandComposer = new Composer();

forwardCommandComposer.command('forward',  async (context)=> {
    if(context.message?.reply_to_message?.text === undefined){
       return context.reply('Ви не виділили повідомлення');
    } else {
        return await context.api.forwardMessage(environmentConfig.CHANNEL_ID, context.chat.id, context.msg.reply_to_message?.message_id || 0);
    }
})