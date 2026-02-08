const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const appRoot = path.resolve(__dirname, '../..');
const notesRouter = require('./routes/notes.js');

// Middleware (static files)
app.use(express.static(path.join(appRoot, 'client')));

app.get('/', (req, res) => {
//   res.send('Hello World!')
    res.sendFile(path.join(appRoot, 'client', 'index.html'));
})

app.listen(port, 'localhost', () => {
  console.log(`\x1b[32m[ONLINE]\x1b[0m Example app listening at http://localhost:${port}`)
})

app.use(express.json()); // для парсинга JSON
app.use('/api/notes', notesRouter);