const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.set("view engine", "ejs")

require('dotenv').config()
const port = process.env.PORT

app.use(bodyParser.json())
app.use(express.urlencoded({extended:true}))

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(port, () => {
    console.log(`app listen on link : http://localhost:${port}`)
})