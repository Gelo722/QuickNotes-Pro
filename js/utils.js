
// Генерация id заметки
function generateId() {
    return crypto.randomUUID()
}

// export
export { generateId }