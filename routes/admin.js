const express = require('express');
const path = require('path');
const router = express.Router();
const productsController = require('../controllers/products')


// /admin/add-product => get
router.get('/add-product', productsController.getAddProduct)

// /admin/add-product => post
router.post('/add-product', productsController.postAddProduct)

module.exports = router
