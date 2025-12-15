


-- таблица для заметок
CREATE TABLE IF NOT EXISTS quicknotes (
    id UUID PRIMARY KEY, 
    title VARCHAR(255), 
    content VARCHAR(255), 
    date DATE, time TIMETZ
);



