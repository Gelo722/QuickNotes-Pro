import { generateId } from "./utils.js";
import { closeNoteDialog } from "./ui.js";
import { saveNotes, saveTrash } from "./storage.js";
import { renderNotes, renderTrash, showToast, animateTransition, updateTrashButtons } from "./ui.js"


// ========== Глобальные переменные ==========

export const state = {
    notes: [], // Пустой массив (все будущие заметки будут в нем)
    editingNoteId: null, // Для модального окна при создании и редактировании заметок
    deletedNotes: [], // пустой массив для удаленных заметок (корзина)
    searchResult: [] // массив для результатов поиска
};

function validateNoteFields() {
    const title = document.getElementById('noteTitle');
    const content = document.getElementById('noteContent');



    // Сбрасываем стили
    title.style.border = '';
    content.style.border = '';

    const hasTitle = title.value.trim() !== '';
    const hasContent = content.value.trim() !== '';
    const isValid = hasTitle || hasContent; // Хотя бы одно поле заполнено

    if (!isValid) {
        // Подсвечиваем оба поля если оба пустые
        title.style.border = '2px solid #ff4757';
        content.style.border = '2px solid #ff4757';
    }

    return isValid;
}

// Сохранение заметок
function saveNote() {

    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    const date = new Date();

    const currentDate = date.toDateString();
    const currentTime = date.toTimeString();

    if (!validateNoteFields()) {
        return false; // Не сохраняем если не валидно
    }

    if (title != '' || content != '') {

        if (state.editingNoteId) {
            // Update existing Note
            const noteIndex = state.notes.findIndex(note => note.id === state.editingNoteId)
            state.notes[noteIndex] = {
                ...state.notes[noteIndex],
                title: title,
                content: content
                // date
                // time
            }
        } else {

            // Add new note       
            state.notes.unshift({
                id: generateId(),
                title: title,
                content: content,
                date: currentDate,
                time: currentTime,
            })

        }

        closeNoteDialog()
        saveNotes()
        renderNotes()
    }
}


// удаление заметок
function deleteNote(noteId) {

    const removedFile = state.notes.find(note => note.id === noteId) // та заметка, которая нам нужна

    state.notes = state.notes.filter(note => note.id != noteId) // Все заметки, кроме удаленной
    state.deletedNotes.push(removedFile) // Добавляем удаленную заметку в корзину.

    saveNotes()
    saveTrash()
    renderNotes()

}

// Восстановление заметок
function restoreNote(noteId) {
    const noteToRestore = state.deletedNotes.find(note => note.id == noteId);
    state.deletedNotes = state.deletedNotes.filter(note => note.id != noteId)
    state.notes.push(noteToRestore)

    saveNotes()
    saveTrash()
    renderTrash()
    renderNotes()
}



//диалог удаления заметки окончательно из корзины
function showDeleteDialog(noteId) {
    const deleteDialog = document.getElementById('deleteDialog');
    deleteDialog.showModal()
    const deleteBtn = document.getElementById('deleteCompletelyBtn');
    const cancelBtn = document.getElementById('cancelDelete');

    // Создаем новые обработчики
    const confirmHandler = () => {
        deleteTrash(noteId);
        closeDeleteDialog();
        // Удаляем обработчики после использования
        deleteBtn.removeEventListener('click', confirmHandler);
        cancelBtn.removeEventListener('click', cancelHandler);
    };

    const cancelHandler = () => {
        closeDeleteDialog();
        deleteBtn.removeEventListener('click', confirmHandler);
        cancelBtn.removeEventListener('click', cancelHandler);
    };

    // Добавляем обработчики
    deleteBtn.addEventListener('click', confirmHandler);
    cancelBtn.addEventListener('click', cancelHandler);
}

// Закрытие диалога
function closeDeleteDialog() {
    document.getElementById('deleteDialog').close();
}

// Удаление заметки из корзины (сделать обработку для обычной функции?)
function deleteTrash(noteId) {

    state.deletedNotes = state.deletedNotes.filter(note => note.id !== noteId);

    saveTrash()
    renderTrash()
}



// Выгрузка заметок.
function exportNotes() {

    if (state.notes.length === 0) {
        showToast('You need to add more notes to export.')
        return   // prevent export an empty array
    }

    const savedNotes = localStorage.getItem('quickNotes')
    const blob = new Blob([savedNotes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notes.json';
    a.click();

    setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Импортирование заметок
async function importNotes() {

    const fileInput = document.getElementById('fileInput');

    const selectedFile = await new Promise((resolve) => {
        fileInput.onchange = (e) => {
            resolve(e.target.files[0]); // Возвращаем выбранный файл
        };
        fileInput.click(); // Запускаем окно выбора файла
    });

    const reader = new FileReader();
    reader.onerror = () => {
        alert("Error reading the file. Please try again.", "error");
    };
    reader.readAsText(selectedFile);



    reader.onload = () => {
        const importedNotes = JSON.parse(reader.result);
        const existingIds = state.notes.map(note => note.id);

        for (const importedNote of importedNotes) {
            // Проверка существующих id
            if (existingIds.includes(importedNote.id)) {
                importedNote.id = generateId(); // Генерируем новый id
            }
            state.notes.push(importedNote)
        }

        saveNotes()
        renderNotes()


    }

    showToast('Import finished!')
}



// Открытие корзины
function openTrashBin() {
    const notesContainer = document.getElementById('notesContainer');
    const trashContainer = document.getElementById('trashContainer');
    const pageTitle = document.getElementById('pageTitle');
    // const trashBtn = document.querySelector('.trash-btn');


    const isTrashOpen = trashContainer.hidden === false;

    if (!isTrashOpen) {
        // Показываем корзину
        notesContainer.hidden = true;
        trashContainer.hidden = false;
        pageTitle.textContent = 'Trash';
        renderTrash();
    } else {
        // Показываем заметки
        notesContainer.hidden = false;
        trashContainer.hidden = true;
        pageTitle.textContent = 'My Notes';
        renderNotes(); // Возможно нужно перерисовать заметки
    }

    animateTransition();
    updateTrashButtons();
}



// Поиск по заметкам
function searchNotes() {

    let inputValue = document.getElementById('searchField').value.trim();
    let tempNotes = JSON.parse(localStorage.getItem('quickNotes')) || [];

    if (inputValue === '') {
        // Если поиск пустой, показываем все заметки
        state.notes = [...tempNotes];
    } else {


        // Ищем совпадения (регистронезависимый поиск)
        state.searchResult = tempNotes.filter(note => {
            const title = note.title || '';
            const content = note.content || '';
            const searchTerm = inputValue.toLowerCase();

            return title.toLowerCase().includes(searchTerm) ||
                content.toLowerCase().includes(searchTerm);
        });

        state.notes = state.searchResult;

    }
    renderNotes();
}

function clearSearch() {

    document.getElementById('searchField').value = '';

    searchNotes();

}



// export
export { saveNote, deleteNote, restoreNote, showDeleteDialog, deleteTrash, exportNotes, importNotes, openTrashBin, searchNotes, clearSearch }