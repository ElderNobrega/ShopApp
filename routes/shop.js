const express = require('express')

const path = require('path')

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('get here')
    res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'))
})

module.exports = router;