require('dotenv').config();
// Import thư viện node-telegram-bot-api
const TelegramBot = require('node-telegram-bot-api');

// Thay bằng API token bạn nhận được từ BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
// Khởi tạo bot với polling
const bot = new TelegramBot(token, { polling: true });

// Hàm gửi tin nhắn
function sendTelegramMessage(chatId, message) {
    bot.sendMessage(chatId, message)
        .then(response => {
            console.log('Message sent: ', response);
        })
        .catch(error => {
            console.error('Error sending message: ', error);
        });
}

const message = 'Hello from your Node.js app!';

// Gửi tin nhắn
sendTelegramMessage(chatId, message);
