import { environmentConfig } from './config';
import { userChannelId } from './const';
import { getRandomItem } from './utils';

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

export const manualForwardMessage = `🤔 Переслати це в <a href="${environmentConfig.CHANNEL_URL}">Анонси</a>?`;

export const forwardApproveMessage = '👌 Перешли';
export const forwardRejectMessage = '⛔️ Не треба';

export const approveMessage = '👌 Норм';
export const rejectMessage = '⛔️ Видали';
export const unCorrectUseForwardCommand = `
<b>😢 Ви не виділили повідомлення або я не можу його переслати.</b>

Для того, щоб переслати повідомлення в інший чат через мене, вам потрібно вибрати повідомлення, яке ви б хотіли переслати та викликати команду /forward
`.trim();

export const cannotPinMessage = '😢 Я чомусь не можу закріпити повідомлення в каналі. Я або не адмін там, або не маю прав на закріплення.';

export const confirmManualForwardMessage = '💅 Чудово, я переслав';
export const rejectManualForwardMessage = '😉 Ок, це залишиться між нами';
export const cancelAutoForwardedMessage = '🫡 Зрозумів-зрозумів. Видалив.';

export const ignoredOldMessage = '😢 Я тільки прокинувся і вже занадто пізно пересилати це повідомлення. Тому не буду це вже робити';

/**
 * Daily-poll
 * */

const pollQuestionMessages = [
  '😎 Відпочиваємо сьогодні, {date}?',
  "🏐 Хто бажає приєднатись до нашої команди у волейболі сьогодні, {date}? Ловіть м'ячі та гайда грати! 🤩",
  '🌅 Який час краще підходить для гри сьогодні, {date} - ранок, день чи вечір? Давайте зберемось та зіграємо у зручний для всіх час! 😊',
  '🌇 Хто готовий прийти на гру в волейбол сьогодні, {date} - вранці, день чи вечір? Нехай кожен обере час, коли йому зручно та зберемось грати! 🤗',
  '🌞 Хто готовий пограти у волейболі сьогодні, {date}? Граємо там, де більше подобається! 🏖️🏢',
  '🤝 Хто хоче провести час з друзями сьогодні, {date}, граючи у настільні ігри чи волейбол?',
  '🚶‍♀️ Хто бажає з нами прогулятись сьогодні, {date}? Гайда на свіже повітря! 🌳🌤️',
  '🎲 Хто бажає зіграти в настільні ігри сьогодні (або волейбол), {date}? Беріть гри та гайда розважатись разом! 🃏🎲',
  '🏐 Хто бажає грати у волейбол сьогодні, {date}? Оберіть час та гайда грати на прекрасному майданчику! 🌹🌹🌹',
  '🌃 Хто готовий зустріти захід сонця, граючи у волейбол сьогодні, {date}? Оберіть годину та гайда грати за яскравих барвистих заходів сонця! 🌅🏐',
  '🤾‍♀️ Хто бажає зіграти у волейбол з нашою командою сьогодні, {date}? Оберіть час та гайда долучатись до гри та зважати нашу перемогу! 🤩🏐',
  '🏞️ Хто бажає зіграти у волейбол на природі сьогодні, {date}? Оберіть час та гайда насолоджуватись чудовим краєвидом на мальовничій природі! 🌳🏐',
  '🏖️ Хто бажає зіграти у волейбол на природі сьогодні, {date}? Оберіть час та гайда насолоджуватись грою! 🌊🏐',
  '🏐 Хто бажає зіграти у волейбол з новими людьми сьогодні, {date}? Оберіть час та гайда зустрічатись з новими друзями на грі! 🤝🏐',
  '🏞️ Хто бажає зіграти у волейбол та піти на прогулянку сьогодні, {date}? Оберіть час та гайда насолоджуватись природою та грою! 🌹🏐',
  '🤼‍♂️ Хто бажає зіграти у волейбол та пограти з нашою командою сьогодні, {date}? Оберіть час та гайда показати свою спритність та силу! 💪🏐',
  '🌇 Хто бажає зіграти у волейбол та помандрувати разом з нами сьогодні, {date}? Оберіть час та гайда насолоджуватись грою та мальовничим краєвидом! 🌄🏐',
  '🏊‍♂️ Хто бажає зіграти у волейбол сьогодні, {date}? Оберіть час та гайда насолоджуватись грою та свіжістю води! 🏊‍♀️🏐',
];

const poll1500Emojis = ['☀️', '🌤️', '🌳', '☀️🕒', '🎯🏹', '🧘‍♀️🌅', '📚📝'];
const poll1600Emojis = ['🏐', '👯‍♀️', '💼', '🎲', '🏄‍♀️', '🚶‍♂️🏞️'];
const poll1700Emojis = ['🌴', '🐸', '🏃‍♀️'];
const poll1800Emojis = ['✨', '🌙', '😴', '👨‍💻'];
const pollDunnoEmojis = ['🤷‍♂️', '🤔', '😢', '🤔🤞', '🤔👀', '🤔🔮'];
const pollSkipEmojis = ['😢', '😰', '🫣', '😔🚫', '🚶‍♂️🚫', '🥺👨‍💻', '💔🚷'];

export const getPollQuestionMessage = (date: string) => getRandomItem(pollQuestionMessages).replace('{date}', date);

export const getPollOptionMessages = () => [
  `15:00 ${getRandomItem(poll1500Emojis)}`,
  `16:00 ${getRandomItem(poll1600Emojis)}`,
  `17:00 ${getRandomItem(poll1700Emojis)}`,
  `18:00 ${getRandomItem(poll1800Emojis)}`,
  `19:00 ${getRandomItem(poll1800Emojis)}`,
  `Долина Троянд - Коло 🥀`,
  `Пушкінський пляж - Сітка 🏖️`,
  `Вагаюсь ${getRandomItem(pollDunnoEmojis)}`,
  `Не буду ${getRandomItem(pollSkipEmojis)}`,
];

export const somethingWentWrongMessage = '😢 Щось пішло не так, у мене виникла помилка';
export const cannotFindForwardedMessage = '🤯 Не можу знайти повідомлення, яке я переслав. Щось пішло не так.';
export const cannotSendPollTodayAgainMessage = '✋ Я вже відправляв сьогодні голосувалку, тому чекайте завтра.';
