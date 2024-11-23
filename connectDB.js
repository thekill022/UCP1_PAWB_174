const mysql = require('mysql')

require('dotenv').config()

const db = mysql.createConnection({
    host : process.env.HOST,
    user : process.env.USER,
    password : process.env.PASS,
    database : process.env.DB
})

module.exports = db