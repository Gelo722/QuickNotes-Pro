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
        return res.status(500).json({ message: error.message })
    }
})

// сохранение заметки
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
        return res.status(500).json({ message: error.message });
    }
    
})


// УДАЛЕНИЕ ЗАМЕТКИ
// router.delete('/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         // console.log(id)
//         const deleteNote = await db.result(
//             'DELETE FROM quicknotes WHERE id = $1', [id]
//         )
//         console.log('✅ Заметка удалена из БД:', deleteNote);
//         res.json(deleteNote);
        
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }

// })


// УДАЛЕНИЕ В КОРЗИНУ
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // 1. Удаляем и сразу получаем данные
        const deletedNote = await db.one(
            'DELETE FROM quicknotes WHERE id = $1 RETURNING *', 
            [id]
        );
        
        // 2. Вставляем в корзину
        await db.none(
            'INSERT INTO quicknotes_trash(id, title, content) VALUES($1, $2, $3)', 
            [deletedNote.id, deletedNote.title, deletedNote.content]
        );

        console.log('✅ Заметка удалена из БД:', deletedNote);
        res.json(deletedNote);
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

})


// УДАЛЕНИЕ ЗАМЕТКИ ИЗ КОРЗИНЫ
router.delete('/trash/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id)
        const deleteNote = await db.result(
            'DELETE FROM quicknotes_trash WHERE id = $1', [id]
        )
        console.log('✅ Заметка удалена из БД:', deleteNote);
        res.json(deleteNote);
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

})


// ВОССТАНОВЛЕНИЕ ЗАМЕТКИ ИЗ КОРЗИНЫ
router.put('/trash/:id', async (req,res) => {
    try {
        const { id } = req.params;
        // удаляем из корзины
        const restoredNote = await db.one(
            'DELETE FROM quicknotes_trash WHERE id = $1 RETURNING *', 
            [id]
        );
        // восстанавливаем в заметки
        await db.none(
            'INSERT INTO quicknotes(id, title, content) VALUES($1, $2, $3)', 
            [restoredNote.id, restoredNote.title, restoredNote.content]
        );

        res.json({
            success: true,
            message: 'Заметка восстановлена успешно',
            restoredNote: restoredNote
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})

// ИЗМЕНЕНИЕ ЗАМЕТКИ
router.put('/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const updatedNote = await db.one(
            'UPDATE quicknotes SET (title, content) = ($2, $3) WHERE id = $1 RETURNING *', [id, title, content]
        )
        res.json(updatedNote)
        console.log('✅ Заметка изменена:', updatedNote);
    } catch (error) {
        console.log('Что то пошло не так... :', updatedNote);
        return res.status(500).json({ message: error.message });
    }
})


module.exports = router;