const express = require('express')
const session = require('express-session')
const app = express()
const bodyParser = require('body-parser')
const db = require('./connectDB')
const petani = require('./db')


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

app.post('/login', (req, res) => {
    const {email, password} = req.body

    if(email == petani[0].email && password == petani[0].password) {
        req.session.user = {
            id : petani[0].id,
            email : petani[0].email,
        }
        res.redirect('/dashboard')
    }
    else{
        res.redirect('/')
    }
})

app.get('/dashboard', isAuthenticated, (req, res) => {

    const sql = 'select * from bibit'
    db.query(sql, (err, resultBibit) => {

        if(err) throw err  
            
        if(err) throw err
            res.render('dashboard', {resultBibit})
    })
})

app.listen(port, () => {
    console.log(`app listen on link : http://localhost:${port}`)
})