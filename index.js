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

// pupuk page
app.get('/pupuk', isAuthenticated, (req, res) => {
    const sql = 'select * from pupuk'
    db.query(sql, (err, resultPupuk) => {
    res.render('pupuk', {resultPupuk})
    })
})

//logout method
app.post('/logout', (req, res) => {
    if(req.session.user) {
        req.session.destroy((err) => {
            if(err) {
                res.status(500).redirect('/dashboard')
            } else {
                res.redirect('/')
            }
        })
    } else {
        res.redirect('/dashboard')
    }
})

//add page
app.get('/add', isAuthenticated, (req, res) => {
    res.render('insert')
})

//add method
app.post('/insert', (req, res) => {
    const {tabel} = req.body
    console.log(tabel)
    if(tabel == 'bibit') {
        const {nama_bibit, jumlah} = req.body
        console.log(req.body)
        const sql = 'insert into bibit(nama_bibit, jumlah_bks) values (?, ?)'
        db.query(sql, [nama_bibit, jumlah[0]], (err, result) => {
            console.log(result)
            res.redirect('/dashboard')
        })
    } else if(tabel == 'pupuk') {
        const {jenis, merk, jumlah} = req.body
        console.log(req.body.jumlah)
        const sql = 'insert into pupuk(jenis, merk, jumlah) values (?, ?, ?)'
        db.query(sql, [jenis, merk, jumlah[1]], (err, result) => {
            res.redirect('/dashboard')
        })
    } else {
        res.status(404).redirect('/dashboard')
    }
})

// edit page bibit
app.get('/bibit/edit/:id', isAuthenticated, (req, res) => {
    const id = req.params.id
    const sql = 'select * from bibit where id = ?'
    db.query(sql, id, (err, result) => {
        res.render('edit/edit-bibit', {result})
    })
})


// edit method bibit
app.post('/bibit/update', isAuthenticated, (req, res) => {
    const { id, nama_bibit, jumlah } = req.body
    const sql = 'update bibit set nama_bibit = ?, jumlah_bks = ? where id = ?'
    db.query(sql, [nama_bibit, jumlah, id], (err, result) => {

        res.redirect('/dashboard')
    })
})

// edit page pupuk
app.get('/pupuk/edit/:id', isAuthenticated, (req, res) => {
    const id = req.params.id
    const sql = 'select * from pupuk where id = ?'
    db.query(sql, id, (err, result) => {
        console.log(result)
        res.render('edit/edit-pupuk', {result})
    })
})

// edit method pupuk
app.post('/pupuk/update', isAuthenticated, (req, res) => {
    const {id, jenis, merk, jumlah} = req.body
    const sql = 'update pupuk set jenis = ?, merk = ?, jumlah = ? where id = ?'
    db.query(sql, [jenis, merk, jumlah, id] , (err, result) => {
        console.log(result)
        res.redirect('/dashboard')
    })
})

app.listen(port, () => {
    console.log(`app listen on link : http://localhost:${port}`)
})