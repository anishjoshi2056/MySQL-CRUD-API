const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { urlencoded } = require('body-parser');
const PORT = process.env.PORT || 5000;
//enable bodyParser
app.use(urlencoded({extended:false}));
app.use(bodyParser.json())

//MySQL
const pool = mysql.createPool({
    connectionLimit:10,
    host:'localhost',
    user:'root',
    password:'password',
    database:'nodejs'
})
//get all the laptops from the database
app.get('/', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from nodejs.laptops', (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            // if(err) throw err
            console.log('The data from beer table are: \n', rows)
        })
    })
})
//select a particular laptop by id
app.get('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from nodejs.laptops WHERE id = ?',[req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            // if(err) throw err
            console.log('The data from beer table are: \n', rows)
        })
    })
})
//delete a particular laptop by id
app.delete('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('DELETE from nodejs.laptops WHERE id = ?',[req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(`Laptop with the id ${req.params.id} was deleted.`)
            } else {
                console.log(err)
            }
            // if(err) throw err
            console.log('The data from beer table are: \n', rows)
        })
    })
})
//add a laptop
app.post('', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        const params = req.body;
        connection.query('INSERT INTO nodejs.laptops SET ?',params, (err, rows) => {

            connection.release() // return the connection to pool
            if (!err) {
                res.send(`Laptop of ${params.brand_name} has been added`)
            } else {
                console.log(err)
            }
            // if(err) throw err
            console.log('The data from beer table are: \n', rows)
        })
    })
})
//update a laptop by id
app.put('', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        const {id,brand_name,price} = req.body;
        connection.query('UPDATE nodejs.laptops SET brand_name = ?,price = ? WHERE id = ?',[brand_name,price,id], (err, rows) => {

            connection.release() // return the connection to pool
            if (!err) {
                res.send(`Laptop of ${brand_name} has been updated`)
            } else {
                console.log(err)
            }
            // if(err) throw err
            console.log('The data from beer table are: \n', rows)
        })
    })
})

app.listen(PORT,()=> {
    console.log('server started');
})