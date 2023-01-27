const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();
let apiKEY = process.env.apiKEY;
const token = process.env.token;
// let apiKEY = "8cca9e3b6164034830268229558768d7";
// const token = "5839134388:AAF3uRnD3jJBDmjwrwl4RJ2A2dy4oat2R8U";
// console.log(apiKEY + " " + token);

const my_fun = async (city) => {
  let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKEY}`;
  try {
    let res = await axios.get(api);
    // console.log(res.data);
    return `Temperature in ${city} is : ${
      Math.round(res.data.main.temp) - 273
    }°C`;
  } catch (err) {
    return "City does not exist. Try again. . .";
  }
};

const mainFunc = () => {
  let timer = null;
  let flag = false;
  const bot = new TelegramBot(token, { polling: true });

  bot.onText(/\/start (.+)/, (msg, match) => {
    if (flag) return;
    flag = true;
    const chatId = msg.chat.id;
    const city = match[1];
    const resp = my_fun(city);
    timer = setInterval(() => {
      resp.then((data) => {
        bot.sendMessage(chatId, data);
        if (data === "City does not exist. Try again. . .") {
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
