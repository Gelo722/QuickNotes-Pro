// imports

import { loadNotes, saveNotes, loadTrash, saveTrash, toggleTheme, applyStoredTheme } from '/js/storage.js';
import { renderNotes, openNoteDialog, closeNoteDialog, closeDeleteDialog, renderTrash, toggleDropdown, handleSearchFocus, handleSearchBlur } from '/js/ui.js';
import { generateId } from '/js/utils.js';
import { state, saveNote, deleteNote, restoreNote, showDeleteDialog, deleteTrash, exportNotes, importNotes, openTrashBin, searchNotes, clearSearch } from '/js/notes-manager.js';

// ========== Инициализация ==========
// После загрузки страницы
document.addEventListener('DOMContentLoaded', function () {


  applyStoredTheme()
  state.notes = loadNotes() //загрузка заметок
  state.deletedNotes = loadTrash() //загрузка корзины
  renderNotes()

  document.getElementById('addBtn').addEventListener('click', openNoteDialog)
  document.getElementById('noteForm').addEventListener('submit', saveNote)


  // пустые заметки - добавить
  if (state.notes.length === 0) {
    document.getElementById('addFirstBtn').addEventListener('click', openNoteDialog)
  }

  // открытие заметки
  document.getElementById('notesContainer').addEventListener('click', (event) => {

    // Обработка кнопки "Add First Note"
    if (event.target.id === 'addFirstBtn' || event.target.closest('#addFirstBtn')) {
      openNoteDialog();
      event.preventDefault();
      return;
    }

    const noteCard = event.target.closest('.note-card');
    const deleteButton = event.target.closest('.delete-btn');
    if (noteCard) {
      const noteId = noteCard.dataset.noteId;
      // удаление заметки
      if (deleteButton) {
        event.stopPropagation(); // останавливаем всплытие
        deleteNote(noteId); // вызываем функцию удаления
        return; // выходим, чтобы не открывать редактирование
      }
      openNoteDialog(noteId);
    }


  });





  // Удаление из корзины
  document.getElementById('trashContainer').addEventListener('click', (event) => {
    const noteCard = event.target.closest('.note-card');
    const deleteButton = event.target.closest('.delete-btn');

    if (noteCard && deleteButton) {
      const noteId = noteCard.dataset.noteId;
      event.stopPropagation();

      // Показываем диалог подтверждения
      showDeleteDialog(noteId);
    }
  })

  // Восстановление из корзины
  document.getElementById('trashContainer').addEventListener('click', (event) => {
    const noteCard = event.target.closest('.note-card');
    const restoreButton = event.target.closest('.undo-btn');

    if (noteCard) {
      const noteId = noteCard.dataset.noteId;
      // удаление заметки
      if (restoreButton) {
        event.stopPropagation(); // останавливаем всплытие
        restoreNote(noteId); // вызываем функцию удаления
        return; // выходим, чтобы не открывать редактирование
      }

    }

  })


  // Для закрытия элементов
  document.getElementById('closeBtn').addEventListener('click', closeNoteDialog)
  document.getElementById('cancelBtn').addEventListener('click', closeNoteDialog)

  // Export Notes
  document.getElementById('exportNotesBtn').addEventListener('click', exportNotes)


  // Import Notes
  document.getElementById('importNotesBtn').addEventListener('click', importNotes)

  // Trash
  document.addEventListener('click', function (event) {
    if (event.target.closest('.trash-btn')) {
      openTrashBin();
      event.preventDefault();
    }

    if (event.target.closest('.theme-toggle-btn')) {
      toggleTheme();
      event.preventDefault
    }
  });



  // Prevent form submit
  document.getElementById('noteForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Блокируем отправку формы
    saveNote(); // Вызываем сохранение вручную
  });


  document.getElementById('saveBtn').addEventListener('click', function (event) {
    event.preventDefault(); // Только здесь
    saveNote();
  });

  // ====== Dialog handler ======
  let isSelectingText = false;

  // Отслеживаем начало выделения текста
  document.getElementById('noteDialog').addEventListener('mousedown', (event) => {
    isSelectingText = event.target.tagName === 'TEXTAREA' ||
      event.target.tagName === 'INPUT';
  });

  document.getElementById('noteDialog').addEventListener('click', function (event) {
    if (event.target === this && !isSelectingText) {
      const title = document.getElementById('noteTitle').value.trim();
      const content = document.getElementById('noteContent').value.trim();

      // Если есть данные - сохраняем, если нет - просто закрываем
      if (title !== '' || content !== '') {
        saveNote(); // Сохраняем заметку
      }
      closeNoteDialog(); // Всегда закрываем диалог
    }
    isSelectingText = false; // Сбрасываем флаг
  });

  // Notes Search
  document.getElementById('searchField').addEventListener('input', searchNotes)


  // Prevent from submitting the from
  document.querySelector('.search-container').addEventListener('submit', (event) => {
    event.preventDefault(); // Блокируем отправку формы
    event.stopPropagation(); // Останавливаем всплытие
    return false; // Дополнительная защита
  });

  // Также для кнопки внутри формы

  document.getElementById('clearSearchBtn').addEventListener('mousedown', (event) => {
    event.preventDefault(); // Предотвращаем снятие фокуса
  });
  document.getElementById('clearSearchBtn').addEventListener('click', (event) => {
    event.preventDefault(); // Блокируем действие по умолчанию
    event.stopPropagation(); // Останавливаем всплытие
    clearSearch(); // Вызываем свою функцию
    return false;
  });


  // dropdown
  document.getElementById('settingsBtn').addEventListener('click', toggleDropdown);

  // Закрытие при клике вне меню
  document.addEventListener('click', function (event) {
    if (!event.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-menu.open').forEach(menu => {
        menu.classList.remove('open');
      });
    }
  });



  // Скрытие тайтла на мобилке
  const searchContainer = document.querySelector('.search-container');
  searchContainer.addEventListener('focusin', handleSearchFocus);
  searchContainer.addEventListener('focusout', handleSearchBlur);

})
