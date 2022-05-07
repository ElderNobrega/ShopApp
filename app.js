const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))

app.use('/add-product', (req, res, next) => {
    console.log('get another place')
    res.send('<form action="/product" method="POST"><input type="text" name="title"/><button>Add Book</button></form>')
})

app.use('/product', (req, res, next) => {
    console.log(req.body)
    res.redirect('/')
})

app.use('/', (req, res, next) => {
    console.log('get here')
    res.send('<h1>Hello Word from /</h1>')
})


app.listen(3000)