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


router.post('/', async (req, res) => {

    

    try {
    console.log('POST /api/notes вызван');
    console.log('Тело запроса:', req.body);
    const { id, title, content } = req.body;


    // СОХРАНЕНИЕ В БД
    const note = await db.one(
      'INSERT INTO quicknotes(id, title, content) VALUES($1, $2, $3) RETURNING *',
      [ id, title, content]
    );
    
    console.log('✅ Заметка сохранена в БД:', note);
    
    // Отправляем ответ клиенту
    res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
})

// УДАЛЕНИЕ ЗАМЕТКИ
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        const deleteNote = await db.result(
            'DELETE FROM quicknotes WHERE id = $1', [id]
        )
        console.log('✅ Заметка удалена из БД:', deleteNote);
        res.json(deleteNote);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

})


module.exports = router;