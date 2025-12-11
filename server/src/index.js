const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const appRoot = path.resolve(__dirname, '../..');


// Middleware (static files)
app.use(express.static(path.join(appRoot, 'client')));

app.get('/', (req, res) => {
//   res.send('Hello World!')
    res.sendFile(path.join(appRoot, 'client', 'index.html'));
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
