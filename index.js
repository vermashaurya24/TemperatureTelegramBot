const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();
let apiKEY = process.env.apiKEY;
const token = process.env.token;

const my_fun = async (city) => {
  let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKEY}`;
  try {
    let res = await axios.get(api);
    return `Temperature in ${city} is : ${
      Math.round(res.data.main.temp) - 273
    }°C`;
  } catch (err) {
    return "City does not exist. Pleas enter a valid city.";
  }
};

const mainFunc = () => {
  let timer = null;
  let flag = false;
  const bot = new TelegramBot(token, { polling: true });

  bot.onText(/\/start/, (msg, match) => {
    let text =
      "Welcome to the Weather bot.\nThese are the commands supported:\n/weather <cityName>: returns the temperature of that city every hour\n/stop: stops this service";
    bot.sendMessage(msg.chat.id, text);
  });

  bot.onText(/\/weather (.+)/, (msg, match) => {
    if (flag) return;
    flag = true;
    const chatId = msg.chat.id;
    const city = match[1];
    const resp = my_fun(city);
    timer = setInterval(() => {
      resp.then((data) => {
        bot.sendMessage(chatId, data);
        if (data === "City does not exist. Pleas enter a valid city.") {
          clearInterval(timer);
          flag = false;
        }
      });
    }, 2000);
  });

  bot.onText(/\/stop/, (message) => {
    clearInterval(timer);
    flag = false;
  });
};
mainFunc();
