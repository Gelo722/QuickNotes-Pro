// server/src/config/database.js
const pgp = require('pg-promise')();
require('dotenv').config();

const db = pgp({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Проверка подключения
db.connect()
    .then(obj => {
        console.log('✅ PostgreSQL подключена успешно');
        obj.done(); // закрываем соединение для проверки
    })
    .catch(error => {
        console.log('❌ Ошибка подключения к PostgreSQL:', error.message);
    });

module.exports = db;