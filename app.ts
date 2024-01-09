import dotenv from 'dotenv';
import axios from 'axios';
import TelegramBot from 'node-telegram-bot-api';

dotenv.config();
const telegramToken = process.env.TELEGRAM_TOKEN;
const jokeApiLanguage = '&lang=pt';
const jokeApiBlacklistFlags = `blacklistFlags=nsfw,racist,sexist,explicit${jokeApiLanguage}`;
const jokeApiURL = `https://v2.jokeapi.dev/joke/Any?${jokeApiBlacklistFlags}`;

if (!telegramToken) throw new Error('telegramToken in env not found.');

const bot = new TelegramBot(telegramToken, { polling: true });

async function fetchJokes() {
  try {
    const { data } = await axios.get(jokeApiURL); // restric results with flags
    const joke = {
      setup: data.setup,
      punchline: data.delivery,
    };
    return joke;
  } catch (e) {
    console.error(e);
    throw new Error();
  }
}

bot.onText(/\/start/, (msg, match) => {
  const chatID = msg.chat.id;
  bot.sendMessage(
    chatID,
    '[TeTa] Olá! Seja bem-vindo ao melhor bot do telegram: o TeTa bot!\n\nAqui temos piadas com /piada\nrepetição com /repetir   [msg] '
  );
});

bot.onText(/\/piada/, async (msg) => {
  const chatID = msg.chat.id;
  const joke = await fetchJokes();
  const response = `${joke.setup} ${joke.punchline}`;
  bot.sendMessage(chatID, response);
  //fetch joke
});

bot.onText(/\/repetir (.+)/, (msg, match) => {
  const chatID = msg.chat.id;
  if (match) {
    const res = match[1];
    bot.sendMessage(chatID, `[TeTa] ${res}`);
  } else {
    bot.sendMessage(chatID, '[TeTa] Conteúdo não encontrado.');
  }
});

bot.onText(/\/gatos/, async (msg) => {
  const chatID = msg.chat.id;
  /* const { data } = axios.get(); */
});
