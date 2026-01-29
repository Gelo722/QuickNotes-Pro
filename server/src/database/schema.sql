

-- таблица для заметок
CREATE TABLE IF NOT EXISTS quicknotes (
    id UUID PRIMARY KEY, 
    title VARCHAR(255), 
    content VARCHAR(255), 
    date DATE, time TIMETZ
);

CREATE TABLE IF NOT EXISTS quicknotes_trash (
    id UUID PRIMARY KEY,
    title VARCAR(255),
    content VARCHAR(255),
    date DATE, time TIMETZ
)



