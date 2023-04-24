import { environmentConfig } from './config';
import { userChannelId } from './const';

/**
 * Command messages
 * */
export const startMessage = `
<b>Привіт, я ВолікЧеБот 🇺🇦🏐!</b>

Я допомагаю Черкаському чату "Волік" робити автоматичні анонси про події де ми збираємось і коли.

Приєднуйся до нас ❤️
${environmentConfig.CHANNEL_URL}
`.trim();

export const noAccessMessage = '😝 Бот працює тільки в чаті та каналі <b>Воліка</b>, вибачте';

/**
 * Auto-forward messages
 * */

export const getAutoForwardedMessage = (messageId: number) =>
  `
😝 Я переслав це в <a href="${environmentConfig.CHANNEL_URL}">Анонси.</a>
👉 <a href="https://t.me/c/${userChannelId}/${messageId}">Ось</a> повідомлення.
`.trim();

export const approveMessage = '👌 Норм';
export const rejectMessage = '⛔️ Видали';

export const cancelAutoForwardedMessage = '🫡 Зрозумів-зрозумів. Видалив.';
