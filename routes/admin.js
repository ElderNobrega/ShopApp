const express = require('express');
const path = require('path');
const router = express.Router();

// /admin/add-product => get
router.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'))
})

// /admin/add-product => post
router.post('/add-product', (req, res, next) => {
    console.lot(req.body)
    res.redirect('/')
})

module.exports = router;