import { state } from '/js/notes-manager.js';


// рендер заметок
function renderNotes() {
    const notesContainer = document.getElementById('notesContainer');

    if (state.notes.length === 0) {

        const searchValue = document.getElementById('searchField').value.trim();
        // Обработка отрицательных результатов поиска
        if (searchValue) {
            notesContainer.innerHTML = `
            <div class="empty-state">
                <h2>Nothing found.</h2>
            </div>
            `
        } else {
            notesContainer.innerHTML = `
            <div class="empty-state">
                <h2>No notes yet</h2>
                <p>Create your first note to get started!</p>
                <button id="addFirstBtn" class="add-note-btn">+ Add Your First Note</button>
            </div>

            `
        }

        return
    }

    notesContainer.innerHTML = state.notes.map(note =>
        // Добавляем открытие по клику карточки.
        `<div class="note-card" draggable="true" data-note-id="${note.id}"> 
            <h3 class="note-title">${note.title}</h3>
            <p class="note-content">${note.content}</p>
            <div class="note-actions">
                <button class="delete-btn" title="Delete Note">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#191b23"><path d="M291-267.69 267.69-291l189-189-189-189L291-692.31l189 189 189-189L692.31-669l-189 189 189 189L669-267.69l-189-189-189 189Z"/></svg>
                </button>
            </div>
        </div>
        `
    ).join('')



}




// окно создания заметок
function openNoteDialog(noteId = null) {
    const dialog = document.getElementById('noteDialog');
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');

    // Сбрасываем стили валидации при открытии (поменять на css классы?)
    titleInput.style.border = '';
    contentInput.style.border = '';

    if (noteId) {
        //Edit Mode
        const noteToEdit = state.notes.find(note => note.id === noteId)
        if (noteToEdit) {
            state.editingNoteId = noteId;
            document.getElementById('dialogTitle').textContent = 'Edit Note';
            titleInput.value = noteToEdit.title;
            contentInput.value = noteToEdit.content;
        } else {
            state.editingNoteId = null
            document.getElementById('dialogTitle').textContent = 'Add New Note'
            titleInput.value = ''
            contentInput.value = ''
        }
    } else {
        // Add mode - ЯВНО прописываем случай когда noteId = null
        state.editingNoteId = null;
        document.getElementById('dialogTitle').textContent = 'Add New Note';
        titleInput.value = '';
        contentInput.value = '';
    }

    dialog.showModal()
    titleInput.focus()
}

// закрытие модального окна
function closeNoteDialog() {
    document.getElementById('noteDialog').close()
}

function closeDeleteDialog() {
    document.getElementById('deleteDialog').close()
}




// рендер корзины
function renderTrash() {
    const trashContainer = document.getElementById('trashContainer');

    if (state.deletedNotes.length === 0) {
        trashContainer.innerHTML = `
            <div class="empty-state">
                <h2>No notes yet</h2>
                <p>Trash bin is empty! You need to delete more notes to fill it!</p>
            </div>
        `
        return
    }

    trashContainer.innerHTML = state.deletedNotes.map(deletedNote => ` 
        <div class="note-card" data-note-id="${deletedNote.id}"> 
            <h3 class="note-title">${deletedNote.title}</h3>
            <p class="note-content">${deletedNote.content}</p>
            <div class="note-actions">
                <button class="undo-btn" title="Move to notes">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#1f1f1f"><path d="M744-262v-92q0-60-43-103t-103-43H235l149 149-14 15-174-174 174-174 14 15-149 149h363q69 0 117.5 48.5T764-354v92h-20Z"/></svg>
                </button>
                <button class="delete-btn"   title="Delete Note">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#191b23"><path d="M291-267.69 267.69-291l189-189-189-189L291-692.31l189 189 189-189L692.31-669l-189 189 189 189L669-267.69l-189-189-189 189Z"/></svg>
                </button>
            </div>
        </div>
        `).join('')

}



// Toast уведомление

function showToast(message, type = 'info', duration = 3000) {
    const toast = document.getElementById('toast');

    // Устанавливаем сообщение и тип
    toast.textContent = message;
    toast.className = 'toast'; // Сбрасываем классы
    toast.classList.add('show', type);

    // Автоскрытие
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}



// dropdown menu
function toggleDropdown() {
    const menu = this.nextElementSibling;
    const isOpen = menu.classList.contains('open');

    // Закрываем все другие меню
    document.querySelectorAll('.dropdown-menu.open').forEach(otherMenu => {
        if (otherMenu !== menu) {
            otherMenu.classList.remove('open');
        }
    });

    // Переключаем текущее
    menu.classList.toggle('open');
}

// Анимация переключения
function animateTransition() {
    document.body.classList.add('transitioning');
    setTimeout(() => document.body.classList.remove('transitioning'), 100);
}


function handleSearchFocus() {
    if (window.innerWidth <= 479) { // только на мобильных
        document.getElementById('pageTitle').classList.add('page-title-hidden');
        document.getElementById('addBtn').classList.add('add-note-btn-hidden');
    }
}

function handleSearchBlur() {
    if (window.innerWidth <= 479) {
        document.getElementById('pageTitle').classList.remove('page-title-hidden');
        document.getElementById('addBtn').classList.remove('add-note-btn-hidden');
    }
}


function updateTrashButtons() {
    const isTrashOpen = !document.getElementById('trashContainer').hidden;

    const trashIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
            <path
                d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
        </svg>
    `
    const notesIcon = ` 
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M120-240v-80h480v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
    `

    document.querySelectorAll('.trash-btn').forEach(btn => {


        const text = isTrashOpen ? ' Notes' : ' Trash';
        const icon = isTrashOpen ? notesIcon : trashIcon;

        if (window.innerWidth <= 1095) {
            btn.innerHTML = icon + text;
        } else {
            btn.innerHTML = icon;
        }

    });
}

export { renderNotes, openNoteDialog, closeNoteDialog, closeDeleteDialog, renderTrash, showToast, toggleDropdown, animateTransition, handleSearchFocus, handleSearchBlur, updateTrashButtons }