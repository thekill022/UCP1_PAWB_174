const express = require('express')
const session = require('express-session')
const app = express()
const bodyParser = require('body-parser')


require('dotenv').config()
const port = process.env.PORT

app.use(bodyParser.json())
app.use(express.urlencoded({extended:true}))

// menambahkan user session
app.use(session({
    secret : 'Admin#123', //kyk kominfo hehe
    resave : false,
    saveUninitialized : false,
    cookie : {
        maxAge : 600000 * 10
    }
}))

// membuat middleware untuk validasi login berdasarkan session
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next()
    } else {
        res.redirect('/')
    }
}

app.set("view engine", "ejs")

app.get('/', (req, res) => {
    res.render('index')
})


app.listen(port, () => {
    console.log(`app listen on link : http://localhost:${port}`)
})