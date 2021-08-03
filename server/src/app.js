const express = require('express')
const app = express()
const port = 8000

app.get('/', (req, res) => {
  res.send('Knowzone Back-End')
})

app.listen(port, () => {
  console.log(`Knowzone back-end listening at http://localhost:${port}`)
})