import { environmentConfig } from './config';
import { userChannelId } from './const';

/**
 * Command messages
 * */
export const startAtomMessage = `
<b>Привіт, я ВолікЧеБот 🇺🇦🏐!</b>

Я допомагаю Черкаському чату "Волік" робити автоматичні анонси про події де ми збираємось і коли.
`.trim();

export const startMessage = `
${startAtomMessage}

Приєднуйся до нас ❤️
${environmentConfig.CHANNEL_URL}
`.trim();

export const noAccessMessage = '😝 Бот працює тільки в чаті та каналі <b>Воліка</b>, вибачте';

export const forbiddenInviteMessage = `
${startAtomMessage}

${noAccessMessage}
`;

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
export const unCorrectUseForwardCommand = `
❌ Ви не виділили повідомлення.
Для цього, вам потрібно вибрати повідомлення, яке ви б хотіли переслати та вибрати команду /forward
`.trim();

export const cancelAutoForwardedMessage = '🫡 Зрозумів-зрозумів. Видалив.';
