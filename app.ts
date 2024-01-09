import axios from 'axios';
import TelegramBot from 'node-telegram-bot-api';
const token = '6673606499:AAHviZM4lCGYb7x25Cw0CXjLkGoqCZ2P5GE';
const bot = new TelegramBot(token, { polling: true });

async function fetchJokes() {
  try {
    const { data } = await axios.get(
      'https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,racist,sexist,explicit&lang=pt' // restric results with flags
    );
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
  bot.sendMessage(msg.chat.id, 'Hello!');
});

bot.onText(/\/joke/, async (msg) => {
  const joke = await fetchJokes();
  const response = `${joke.setup} ${joke.punchline}`;
  bot.sendMessage(msg.chat.id, response);
  //fetch joke
});
