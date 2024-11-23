const express = require('express')
const app = express()

require('dotenv').config()
const port = process.env.PORT

app.get('/', (req, res) => {
    res.send('hello World')
})

app.listen(port, () => {
    console.log(`app listen on link : http://localhost:${port}`)
})