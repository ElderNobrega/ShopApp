const express = require('express')
const path = require('path')
const router = express.Router();
const rootDir = require('../utils/path')

router.get('/', (req, res, next) => {
    console.log('get here')
    res.sendFile(path.join(rootDir, 'views', 'shop.html'))
})

module.exports = router;