const db = require('../config/database.js');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
    try {
        const sql = fs.readFileSync(
            path.join(__dirname, 'schema.sql'),
            'utf8'
        );
        await db.none(sql);
        console.log('✅ Таблицы созданы успешно');
    } catch (error) {
        console.log('❌ Ошибка создания таблиц:', error.message);
    }


    const tables = await db.any(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        `);
        console.log('✅ Созданные таблицы:', tables.map(t => t.table_name));
}

// Запуск при прямом вызове файла
if (require.main === module) {
    initDatabase();
}



module.exports = initDatabase;