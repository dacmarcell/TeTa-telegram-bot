import dotenv from 'dotenv';
import axios from 'axios';
import TelegramBot from 'node-telegram-bot-api';
import { catApiInstance } from './utils/api-instances';

dotenv.config();

const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
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
  const { id } = msg.chat;
  bot.sendMessage(
    id,
    '[TeTa] Olá! Seja bem-vindo ao melhor bot do telegram: o TeTa bot!\n\nAqui temos piadas com /piada\nrepetição com /repetir   [msg] '
  );
});

bot.onText(/\/piada/, async (msg) => {
  const { id } = msg.chat;
  const joke = await fetchJokes();
  const response = `${joke.setup} ${joke.punchline}`;
  bot.sendMessage(id, response);
});

bot.onText(/\/repetir (.+)/, (msg, match) => {
  const { id } = msg.chat;
  if (match) {
    bot.sendMessage(id, `[TeTa] ${match[1]}`);
  } else {
    bot.sendMessage(id, '[TeTa] Conteúdo não encontrado.');
  }
});

bot.onText(/\/gatos/, async (msg) => {
  const { id } = msg.chat;
  const api = catApiInstance();
  const { data } = await api.get('/images/search');
  data.map((cat: any) => {
    bot.sendMessage(id, cat.url);
  });
});
