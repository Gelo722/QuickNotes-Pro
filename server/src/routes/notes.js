// demo CRUD API

const express = require('express');
const router = express.Router();

const db = require('../config/database.js')

// GET все заметки
router.get('/', async (req, res) => {
    try {
        console.log('📨 Получен GET запрос на /api/notes');
        console.log('🔍 Выполняю SQL:', 'SELECT * FROM notes');
        const notes = await db.any('SELECT * FROM quicknotes')
        res.json(notes)
        console.log('✅ Получено заметок:', notes.length);
        console.log('📤 Отправляю JSON ответ');
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


module.exports = router;